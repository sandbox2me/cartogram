define(function(require) {
    'use strict';

    var three = require('three'),
        _ = require('underscore'),
        SpriteFactory = require('../sprite_factory'),
        Polygon = require('./polygon'),

        RoundRect;

    /**
     * @class RoundRect
     */
    RoundRect = Polygon.extend({
        initialize: function() {
            this.attributes._type = 'round_rect';
            this.attributes._unique = _.uniqueId('rr_');

            this.useTexture = false;
        },

        _createMaterial: function() {
            return new three.MeshBasicMaterial({
                transparent: true,
                emissive: 0xffffff,
                color: new three.Color(this.attributes.fill).getHex()
            });
        },

        getShape: function() {
            var width = this.attributes.width,
                height = this.attributes.height,
                longestEdge = (width > height) ? width : height,
                radius = (this.attributes.cornerRadius || 5) / longestEdge,
                path = new three.Shape();

            path.moveTo (
                0 + radius,
                0
            );
            path.lineTo (
                1 - radius,
                0
            );
            path.quadraticCurveTo (
                1,
                0,
                1,
                0 + radius
            );
            path.lineTo (
                1,
                1 - radius
            );
            path.quadraticCurveTo (
                1,
                1,
                1 - radius,
                1
            );
            path.lineTo (
                0 + radius,
                1
            );
            path.quadraticCurveTo (
                0,
                1,
                0,
                1 - radius
            );
            path.lineTo (
                0,
                0 + radius
            );
            path.quadraticCurveTo (
                0,
                0,
                0 + radius,
                0
            );

            return path;
        },

        generateSprite: function(attrs) {
            var width = 1024,
                height = 1024,
                shapeWidth = this.attributes.width,
                shapeHeight = this.attributes.height,
                aspect = shapeWidth / shapeHeight,
                widthR = shapeWidth / width,
                heightR = shapeHeight / height,
                widthF,
                heightF,
                scale,
                longestEdge = (shapeWidth > shapeHeight) ? widthR : heightR,
                radius = (this.attributes.cornerRadius || 5) / longestEdge,
                x = 0,
                y = 0;

            if (shapeWidth > shapeHeight) {
                widthR = width;
                heightR = height / aspect;
                scale = widthR / shapeWidth;
            } else {
                heightR = height;
                widthR = width * aspect;
                scale = heightR / shapeHeight;
            }

            attrs = _.extend({
                fill: '#ffffff',
                stroke: '#000000',
                strokeWidth: 5
            }, attrs);

            attrs.strokeWidth *= scale;

            widthF = widthR;
            heightF = heightR;
            widthR -= attrs.strokeWidth * 2;
            heightR -= attrs.strokeWidth * 2;
            x += attrs.strokeWidth;
            y += attrs.strokeWidth;

            return SpriteFactory.create(function(ctx){
                ctx.fillStyle = attrs.fill;

                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + widthR - radius, y);
                ctx.quadraticCurveTo(x + widthR, y, x + widthR, y + radius);
                ctx.lineTo(x + widthR, y + heightR - radius);
                ctx.quadraticCurveTo(x + widthR, y + heightR, x + widthR - radius, y + heightR);
                ctx.lineTo(x + radius, y + heightR);
                ctx.quadraticCurveTo(x, y + heightR, x, y + heightR - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();

                ctx.fill();

                if (attrs.strokeWidth) {
                    ctx.lineWidth = attrs.strokeWidth;
                    ctx.strokeStyle = attrs.stroke;
                    ctx.stroke();
                }
            }, { width: widthF, height: heightF });
        }
    });

    return RoundRect;
});

