define(function(require) {
    'use strict';

    var three = require('three'),
        tinycolor = require('tinycolor');

    return {
        /**
         * Convert any color input to a Vector4.
         *
         * Uses TinyColor for input conversion.
         *
         * @param {String|Object} input Any parsable color format.
         * @returns {Vector4}
         */
        colorToVector: function(input) {
            var vec = new three.Vector4(),
                color = tinycolor(input).toRgb();

            vec.x = color.r / 255;
            vec.y = color.g / 255;
            vec.z = color.b / 255;
            vec.w = color.a;

            return vec;
        }
    };
});

