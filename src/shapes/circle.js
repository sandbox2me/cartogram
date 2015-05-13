define(function(require) {
    'use strict';

    var three = require('three'),
        _ = require('underscore'),

        SpriteFactory = require('../sprite_factory'),
        Shape = require('./shape'),

        CircleShader = require('./shaders/circle_shader'),

        Circle;

    /**
     * @class circle
     */
    Circle = Shape.extend({
        /**
         * Initialize circle
         *
         * @alias circle
         * @params {object} options - Initialization options
         * @params {float} options.cx - Center X
         * @params {float} options.cy - Center Y
         * @params {float} options.radius - Radius
         */
        initialize: function(options) {
            this.attributes._type = 'circle';

            if (this.options.paper.picasso.isGL) {
                this.useTexture = false;
            }

            this.attributes.x = options.cx;
            this.attributes.y = options.cy;
            this.attributes.width = options.xRadius * 2;
            this.attributes.height = options.yRadius * 2;
        },

        isPointInside: function(x, y) {
            var bbox = this.getBBox(),
                r = bbox.width / 2,
                r2 = r * r,
                ox = bbox.x + r,
                oy = bbox.y + r,
                dx = x - ox,
                dy = y - oy,
                d2 = (dx * dx) + (dy * dy);

            return d2 <= r2;
        },

        _createMaterial: function(texture) {
            var material;

            if (this.options.paper.picasso.isGL) {
                material = new three.ShaderMaterial({
                    uniforms: CircleShader.uniforms(),
                    vertexShader: CircleShader.shaders.vertex,
                    fragmentShader: CircleShader.shaders.fragment,
                    //blending: three.NormalBlending,
                    transparent: true
                    // side: three.DoubleSide,
                    // depthTest: false
                    //alphaTest: 0.5
                    //depthTest: false,
                    // depthWrite: false
                });
                material.uniforms.strokeWidth.value = this.attributes.strokeWidth * 0.005;
                if (this.attributes.strokeWidth) {
                    material.uniforms.stroke.value = this.options.paper.picasso.color.colorToVector(this.attributes.stroke);
                } else {
                    material.uniforms.stroke.value = this.options.paper.picasso.color.colorToVector(this.attributes.fill);
                    material.uniforms.strokeWidth.value = 0.005;
                }
                material.uniforms.fill.value = this.options.paper.picasso.color.colorToVector(this.attributes.fill);
                //material.needsUpdate = true;
            } else {
                material = new three.MeshBasicMaterial({
                    transparent: true,
                    map: texture
                });
            }

            return material;
        },

        generateSprite: function(attrs) {
            // XXX Different resolutions for different devices
            // iOS looks great at 256x256 (20px base stroke)
            // Desktop looks better at 512x512 (30px base stroke)
            var width = 512,
                height = 512,
                centerX = width / 2,
                centerY = height / 2,
                radius = width / 2;

            attrs = _.extend({
                fill: 'white',
                stroke: 'black'
            }, attrs);

            radius -= attrs.strokeWidth;

            return SpriteFactory.create(function(ctx) {
                ctx.fillStyle = attrs.fill;

                // ctx.beginPath();
                // ctx.rect(0, 0, width, height);
                // ctx.closePath();
                // ctx.fill();
                // ctx.stroke();
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
                ctx.fill();

                if (attrs.strokeWidth) {
                    ctx.lineWidth = attrs.strokeWidth;
                    ctx.strokeStyle = attrs.stroke;
                    ctx.stroke();
                }
            }, { width: width, height: height });
        }
    });

    return Circle;
});
