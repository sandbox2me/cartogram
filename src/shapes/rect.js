define(function(require) {
    'use strict';

    var three = require('three'),
        SpriteFactory = require('../sprite_factory'),
        Shape = require('./shape'),
        RectShader = require('./shaders/rect_shader'),
        Rect;

    Rect = Shape.extend({
        initialize: function() {
            this.attributes._type = 'rect';

            this.useTexture = false;
        },

        isPointInside: function(x, y) {
            var bbox = this.getBBox();

            return (x > bbox.x && x < bbox.x2 && y > bbox.y && y < bbox.y2);
        },

        getTexture: function() {
            var texture = Shape.prototype.getTexture.apply(this, arguments);

            // Default filter is MipMapLinearFilter, which looks ugly
            // when scaling as a rectangle. Nearest keeps edges crisper.
            texture.magFilter = three.NearestMipMapNearestFilter;
            texture.minFilter = three.NearestMipMapNearestFilter;

            return texture;
        },

        _createMaterial: function(texture) {
            if (this.useTexture) {
                return this._createTextureMaterial(texture);
            }

            return this._createFillMaterial();
        },

        _createFillMaterial: function() {
            return new three.MeshBasicMaterial({
                transparent: true,
                emissive: 0xffffff,
                color: new three.Color(this.attributes.fill).getHex()
            });
        },

        _createTextureMaterial: function(texture) {
            var material;

            if (this.options.paper.picasso.isGL) {
                material = new three.ShaderMaterial({
                    uniforms: RectShader.uniforms(),
                    vertexShader: RectShader.shaders.vertex,
                    fragmentShader: RectShader.shaders.fragment
                });
                material.uniforms.strokeWidth.value = this.attributes.strokeWidth * 0.005;
                if (this.attributes.strokeWidth) {
                    material.uniforms.stroke.value = this.options.paper.picasso.color.colorToVector(this.attributes.stroke);
                } else {
                    material.uniforms.stroke.value = this.options.paper.picasso.color.colorToVector(this.attributes.fill);
                }
                material.uniforms.fill.value = this.options.paper.picasso.color.colorToVector(this.attributes.fill);

            } else {
                material = new three.MeshBasicMaterial({
                    map: texture
                });
            }

            return material;
        },

        generateSprite: function(attrs) {
            var spriteWidth = 1024,
                spriteHeight = 1024,
                width = this.attributes.width,
                height = this.attributes.height;

            // Make the sprite fit within the texture bounds at the same
            // aspect ratio of the mesh scale
            if (width > height) {
                height = (height / width) * spriteHeight;
                width = spriteWidth;
            } else {
                width = (width / height) * spriteWidth;
                height = spriteHeight;
            }

            attrs = _.extend({
                fill: 'white',
                stroke: 'black',
                strokeWidth: 30
            }, attrs);

            return SpriteFactory.create(function(ctx) {

                ctx.fillStyle = attrs.fill;
                ctx.strokeStyle = attrs.stroke;

                ctx.beginPath();
                ctx.rect(0, 0, width, height);
                ctx.closePath();
                ctx.fill();

                if (attrs.strokeWidth) {
                    ctx.lineWidth = attrs.strokeWidth;
                    ctx.stroke();
                }
            }, { width: width, height: height });
        }
    });

    return Rect;
});
