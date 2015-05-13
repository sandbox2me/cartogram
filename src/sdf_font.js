define(function(require) {
    'use strict';

    var _ = require('underscore'),
        three = require('three');


    /**
     * @class SDFFont
     *
     * Creates a texture from a DOMImage
     */
    function SDFFont(font) {
        this.name = font.name;
        this.test = font.test;
        this.metrics = font.metrics;

        this.image = font.image;
        this.texture = new three.Texture(font.image);
        this.image.onload = _.bind(function() {
            // for good measure
            this.texture.needsUpdate = true;
        }, this);
    }

    SDFFont.prototype = {
        /**
         * Checks if a specific string can be renderer using this SDFFont
         * @param {String} str A string to test
         * @return {Boolean} If the string can be rendered using this font
         */
        canUseFor: function(str) {
            return this.test.test(str);
        },

        getDimensionsForSize: function(character, size) {
            var heightRatio = this.metrics.chars[character].height / this.metrics.info.size,
                widthRatio = this.metrics.chars[character].width / this.metrics.info.size,
                xAdvanceRatio = this.metrics.chars[character].xadvance / this.metrics.info.size,
                xOffsetRatio = this.metrics.chars[character].xoffset / this.metrics.info.size,
                yOffsetRatio = this.metrics.chars[character].yoffset / this.metrics.info.size;

            return {
                height: heightRatio * size,
                width: widthRatio * size,
                xAdvance: xAdvanceRatio * size,
                xOffset: xOffsetRatio * size,
                yOffset: yOffsetRatio * size
            };
        }
    };

    /**
     * SDFFont Factory method
     * @param {String} font.name The name of your font, which you can use later as you define text in your scene
     * @param {RegExp} font.test A regular expression defining valid characters from this SDF Image
     * @param {Image} font.image Image loaded as text
     * @param {Object} font.metrics Metrics about the font that come from Heiro + Picasso fnt_to_json
     */
    return function(font) {
        return new SDFFont(font);
    };

});
