define(function(require) {
    'use strict';

    var _ = require('underscore'),
        three = require('three'),
        Paper,

        createSDFFont = require('./sdf_font'),
        Set = require('./set'),
        Shape = require('./shapes/shape'),
        Circle = require('./shapes/circle'),
        Rect = require('./shapes/rect'),
        RoundRect = require('./shapes/round_rect'),
        Polygon = require('./shapes/polygon'),
        sdfFontStore = require('./stores/sdf_fonts'),
        settingsStore = require('./stores/settings'),
        SmoothPolygon = require('./shapes/smooth_polygon'),
        TextSDFShape = require('./shapes/text_sdf'),
        TextShape = require('./shapes/text'),
        EventBusMixin = require('./event_bus');

    /**
     * Public interface for creating and adding shapes to the scene.
     * @constructor
     * @alias paper
     * @param {Picasso} picasso - The instance of Picasso to use.
     */
    Paper = function(picasso) {
        /** The {Picasso} instance */
        this.picasso = picasso;

        /** The THREE Scene instance for this paper. */
        this.scene = new three.Scene();
    };

    _.extend(Paper.prototype, EventBusMixin, {

        /**
         * Gets the THREE Camera instance.
         *
         * @returns {THREE.Camera} THREE Camera object.
         */
        getCamera: function() {
            return this.picasso.camera.camera;
        },

        getPicassoCamera: function() {
            return this.picasso.camera;
        },

        /**
         * Adds an object to the scene.
         *
         * @param {object} obj - The function accepts any of the following types:
         * * A `Shape` instance
         * * A `Set` instance
         * * A `THREE.Mesh`
         */
        add: function(obj) {
            obj.scene = this;
            if (obj instanceof Shape) {
                this.scene.add(obj.shape);
                this.picasso.sceneTree.insert(obj);
            } else if (obj instanceof Set) {
                obj.forEachMeshLayer(function(layer) {
                    this.scene.add(layer);
                }, this);

                this.picasso.sceneTree.insertSet(obj);
            } else {
                this.scene.add(obj);
            }

            return this;
        },

        /**
         * Removes an object to the scene.
         *
         * @param {object} obj - The function accepts any of the following types:
         * * A `Shape` instance
         * * A `Set` instance
         * * A `THREE.Mesh`
         */
        remove: function(obj) {
            if (obj instanceof Shape) {
                this.scene.remove(obj.shape);
                // this.picasso.sceneTree.remove(obj);
            } else if (obj instanceof Set) {
                obj.forEachMeshLayer(function(layer) {
                    this.scene.remove(layer);
                }, this);

                // this.scene.remove(obj.mesh);
                // this.picasso.sceneTree.remove(obj);
            } else {
                this.scene.remove(obj);
            }

            return this;
        },

        /**
         * Clears the scene of all objects.
         */
        clear: function() {
            _.each(this.scene.children, _.bind(function(sceneObject) {
                sceneObject.parent = undefined;
            }, this));
            this.scene.children = [];
            this.picasso.sceneTree.clear();
        },

        /**
         * Creates a set.
         *
         * @returns {Set}
         */
        set: function(layer) {
            var set = new Set(this.picasso, layer);

            if (this.picasso.options.immediate) {
                this.add(set.sceneSet);
            }
            return set;
        },

        /**
         * Creates a circle.
         *
         * Automatically adds it to the screen in immediate mode.
         *
         * @param {float} cx - Center X position
         * @param {float} cy - Center Y position
         * @param {float} xRadius - X radius
         * @param {float} yRadius - Y radius
         * @param {object} attrs - Style attributes
         * @param {float} attrs.radius - Radius of the circle
         * @param {string} attrs.fill - Fill color
         * @param {string} attrs.stroke - Stroke color
         * @param {string} attrs.strokeWidth - Stroke width. Use `0` for no stroke.
         *
         * @returns {Circle}
         */
        circle: function(cx, cy, xRadius, yRadius, attrs) {
            var circle = new Circle(_.extend({
                paper: this,
                cx: cx,
                cy: cy,
                xRadius: xRadius,
                yRadius: yRadius
            }, attrs));

            if (this.picasso.options.immediate) {
                this.add(circle);
            }

            return circle;
        },

        /**
         * Creates a rectangle.
         *
         * Automatically adds it to the screen in immediate mode.
         *
         * @param {float} x - X position
         * @param {float} y - Y position
         * @param {float} width - Width of rectangle
         * @param {float} height - Height of rectangle
         * @param {object} attrs - Style attributes
         * @param {string} attrs.fill - Fill color
         * @param {string} attrs.stroke - Stroke color
         * @param {string} attrs.strokeWidth - Stroke width. Use `0` for no stroke.
         *
         * @returns {Rect}
         */
        rect: function(x, y, width, height, attrs) {
            var rect = new Rect(_.extend({
                paper: this,
                x: x,
                y: y,
                width: width,
                height: height
            }, attrs));

            if (this.picasso.options.immediate) {
                this.add(rect);
            }

            return rect;
        },

        /**
         * Creates a rounded rectangle.
         *
         * Automatically adds it to the screen in immediate mode.
         *
         * @param {float} x - X position
         * @param {float} y - Y position
         * @param {float} width - Width of rectangle
         * @param {float} height - Height of rectangle
         * @param {float} radius - Corner radius of rectangle
         * @param {object} attrs - Style attributes
         * @param {string} attrs.fill - Fill color
         * @param {string} attrs.stroke - Stroke color
         * @param {string} attrs.strokeWidth - Stroke width. Use `0` for no stroke.
         *
         * @returns {Rect}
         */
        roundRect: function(x, y, width, height, radius, attrs) {
            var roundRect = new RoundRect(_.extend({
                paper: this,
                x: x,
                y: y,
                width: width,
                height: height,
                cornerRadius: radius
            }, attrs));

            if (this.picasso.options.immediate) {
                this.add(roundRect);
            }

            return roundRect;
        },

        /**
         * Define an SDF font
         * @param {String} font.name The name of your font, which you can use later as you define text in your scene
         * @param {RegExp} font.test A regular expression defining valid characters from this SDF Image
         * @param {Image} font.image Image loaded as text
         * @param {Object} font.metrics Metrics about the font that come from Heiro + Picasso fnt_to_json
         */
        addSDFFont: function(font) {
            sdfFontStore[font.name] = createSDFFont(font);
        },

        _createSDFText: function(options) {
            return new TextSDFShape(options);
        },

        _createSafeText: function(options) {
            return new TextShape(options);
        },

        /**
         * Creates a text object.
         *
         * @param {float} x - X position
         * @param {float} y - Y position
         * @param {string} str - The text to display.
         * @param {object} attrs - Style attributes
         * @param {string} attrs.font - Font face definition, eg: `Helvetica`
         * @param {number} attrs.size - Font size in pixels, eg: `13`
         * @param {string} attrs.color - Font color
         * @param {string=} attrs.heightTest - String for testing the height of the font, eg: `gxÁ`
         *
         * @returns {Text}
         */
        text: function(x, y, str, attrs) {
            var options = _.extend({
                    paper: this,
                    text: str,
                    x: x,
                    y: y,
                    size: 13,
                    font: '"Benton Sans", "Helvetica Neue", "Helvetica", "Arial"',
                    color: 'black'
                }, attrs),
                // XXX(parris): we don't yet support a font stack for SDF
                SDFFontFace = options.font.split(',')[0].replace(/"/g, ''),
                text;

            if (settingsStore.isGL &&
                sdfFontStore[SDFFontFace] &&
                sdfFontStore[SDFFontFace].canUseFor(str)
            ) {
                options.font = SDFFontFace;
                text = this._createSDFText(options);
            } else {
                text = this._createSafeText(options);
            }

            if (this.picasso.options.immediate) {
                this.add(text);
            }

            return text;
        },

        /**
         * Creates a polygon object.
         *
         * @param {float} x - X position
         * @param {float} y - Y position
         * @param {Vector2[]} vertices - Polygon vertices
         * @param {object} attrs - Style attributes
         * @param {string} attrs.fill - Fill color
         *
         * @returns {Polygon}
         */
        polygon: function(x, y, vertices, attrs) {
            var polygon = new Polygon(_.extend({
                paper: this,
                x: x,
                y: y,
                vertices: vertices
            }, attrs));

            if (this.picasso.options.immediate) {
                this.add(polygon);
            }

            return polygon;
        },

        /**
         * Creates a smoothed polygon object.
         *
         * @param {float} x - X position
         * @param {float} y - Y position
         * @param {Vector2[]} vertices - Polygon vertices
         * @param {object} attrs - Style attributes
         * @param {string} attrs.fill - Fill color
         * @param {integer} attrs.radius - Requested radius for smoothed corners
         *
         * @returns {SmoothPolygon}
         */
        smoothPolygon: function(x, y, vertices, attrs) {
            var polygon = new SmoothPolygon(_.extend({
                paper: this,
                x: x,
                y: y,
                vertices: vertices
            }, attrs));

            if (this.picasso.options.immediate) {
                this.add(polygon);
            }

            return polygon;
        }
    });

    return Paper;
});
