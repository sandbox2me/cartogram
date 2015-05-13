define(function(require) {
    'use strict';

    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        fontSizeCache = {};

    canvas.width = 500;
    canvas.height = 500;

    function calculateMaxFontHeight(font) {
        var data,
            first = false,
            last = false,
            height = canvas.height,
            c;

        if (fontSizeCache[font]) {
            return fontSizeCache[font];
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = font;
        context.fillText('gÖÂ(]{', 200, 100);

        data = context.getImageData(0, 0, canvas.width, canvas.height).data;

        // credit: http://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
        while (!last && height) {
            height--;
            for(c = 0; c < canvas.width; c++) {
                if(data[height * canvas.width * 4 + c * 4 + 3]) {
                    last = height;
                    break;
                }
            }
        }

        // Find the first line with a non-white pixel
        while (height) {
            height--;
            for(c = 0; c < canvas.width; c++) {
                if(data[height * canvas.width * 4 + c * 4 + 3]) {
                    first = height;
                    break;
                }
            }

            // If we've got it then return the height
            if (first != height) {
                fontSizeCache[font] = last - first;
            }
        }

        return fontSizeCache[font];
    }

    // function calculateStringWidth() {}

    return {
        calculateMaxFontHeight: calculateMaxFontHeight
    };

});
