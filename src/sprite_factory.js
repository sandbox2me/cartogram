define(function(require) {
    'use strict';

    var _ = require('underscore');

    return {
        create: function(program, options) {
            var canvas = document.createElement('canvas'),
                ctx;

            options = _.extend({
                width: 1024,
                height: 1024
            }, options);

            // Maximum sprite size
            canvas.width = options.width;
            canvas.height = options.height;

            ctx = canvas.getContext('2d');


            ctx.clearRect(0, 0, options.width, options.height);

            program(ctx);

            return canvas;
        }
    };
});
