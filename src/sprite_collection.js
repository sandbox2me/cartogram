define(function(require) {
    'use strict';

    var SpriteCollection;

    SpriteCollection = function() {
        this.sprites = {};
    };

    SpriteCollection.prototype = {
        get: function(attrs) {
            return this.sprites[JSON.stringify(attrs)];
        },

        add: function(attrs, sprite) {
            this.sprites[JSON.stringify(attrs)] = sprite;
        },

        remove: function(attrs) {
            var attrString = JSON.stringify(attrs);
            delete this.sprites[attrString];
        }
    };

    return SpriteCollection;
});
