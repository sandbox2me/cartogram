// Fontre
//
// Font metrics inspection library.
define(function() {
    'use strict';

    var Fontre,
        _cache = {},
        _canvas,
        _context,
        _width = 1000,
        _height = 500,
        _testText = 'gPMx';

    _canvas = document.createElement('canvas');
    _canvas.width = _width;
    _canvas.height = _height;
    _context = _canvas.getContext('2d');

    function getCanvasData(font, size, testText) {
        _context.clearRect(0, 0, _width, _height);
        _context.font = size + 'px ' + font;
        _context.textBaseline = 'top';
        _context.fillText(testText, 0, 0);

        // console.log(_canvas.toDataURL());

        return _context.getImageData(0, 0, _width, _height).data;
    }

    function calculateHeight(data) {
        var first, last, x, y, rowHasPixel, rowsWithoutPixels;

        rowHasPixel = false;
        for (y = 0; y < _canvas.height; y++) {
            rowHasPixel = false;
            for (x = 0; x < _canvas.width; x++) {
                if (data[y * _canvas.width * 4 + x * 4 + 3]) {
                    rowHasPixel = true;
                    if (!first) {
                        first = y;
                    } else {
                        last = y;
                    }
                    break;
                }
            }

            if (!rowHasPixel) {
                rowsWithoutPixels++;
            } else {
                rowsWithoutPixels = 0;
            }

            if (first && rowsWithoutPixels > 10) {
                break;
            }
        }

        return {
            first: first,
            last: last,
            height: last - first
        };
    }

    function calculateBaseline(data) {
        var first, last, x, y, rowHasPixel, rowsWithoutPixels;

        rowHasPixel = false;
        for (y = 0; y < _canvas.height; y++) {
            rowHasPixel = false;
            for (x = _canvas.width; x > _canvas.width / 2; x--) {
                if (data[y * _canvas.width * 4 + x * 4 + 3]) {
                    rowHasPixel = true;
                    if (!first) {
                        first = y;
                    } else {
                        last = y;
                    }
                    break;
                }
            }

            if (!rowHasPixel) {
                rowsWithoutPixels++;
            } else {
                rowsWithoutPixels = 0;
            }

            if (first && rowsWithoutPixels > 10) {
                break;
            }
        }

        return last - first;
    }

    /**
     * Fontre class constructor.
     *
     * @param {string} font Font name to generate metrics from. Can be a system font or loaded via css `@font-face`.
     * @param {object=} options
     * @param {boolean=} options.isIconfont Enables special considerations for iconfonts.
     * @param {string=} options.testText Text to use for testing metrics. Required when testing an iconfont.
     */
    Fontre = function(font, options) {
        this.font = font;
        this.options = options || {};

        // May be undefined, that's totally fine!
        this._metrics = _cache[font];
    };

    Fontre.prototype = {
        /**
         * Get the percentage based metrics for this font.
         * @return {object}
         */
        getMetrics: function() {
            if (!this._metrics) {
                this.calculateMetrics();
            }

            return this._metrics;
        },

        /**
         * Get the absolute metrics for this font at a given font size.
         * @return {object}
         */
        getMetricsForFontSize: function(size) {
            if (!this._metrics) {
                this.calculateMetrics();
            }

            return {
                'height': this._metrics['height'] * size,
                'lineHeight': this._metrics['lineHeight'] * size,
                'baseline': this._metrics['baseline'] * size,
                'xheight': this._metrics['xheight'] * size,
                'ascender': this._metrics['ascender'] * size,
                'descender': this._metrics['descender'] * size
            };
        },

        calculateMetrics: function() {
            var data,
                testSize = 200,
                maxHeight,
                height,
                baseline;

            if (this._metrics) {
                return this._metrics;
            }

            data = getCanvasData(this.font, testSize, this.options.testText || _testText);
            height = calculateHeight(data);
            baseline = calculateBaseline(data, maxHeight);

            if (this._debug) {
                _context.beginPath();
                _context.moveTo(0, height.first);
                _context.lineTo(_width, height.first);
                _context.stroke();

                _context.beginPath();
                _context.moveTo(0, height.last);
                _context.lineTo(_width, height.last);
                _context.stroke();

                _context.beginPath();
                _context.moveTo(0, height.first + baseline);
                _context.lineTo(_width, height.first + baseline);
                _context.stroke();
                console.log(_canvas.toDataURL());
            }

            _cache[this.font] = {
                'height': height.height / testSize,
                'lineHeight': height.last / testSize,
                'baseline': baseline / testSize,
                'xheight': 0,
                'ascender': 0,
                'descender': height.last - baseline / testSize
            };
            this._metrics = _cache[this.font];

            return this._metrics;
        }
    };

    return Fontre;
});
