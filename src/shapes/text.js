define(function(require) {
    'use strict';

    var three = require('three'),

        Fontre = require('../fontre'),
        Shape = require('./shape'),

        superSampleRate = 3,
        textSpacer = 10,
        // Every device has a differnt max
        // The max on iOS is 2048
        MAX_TEXTURE_SIZE = 2048,
        textMaterials = 0,
        TextShape;


    TextShape = Shape.extend({

        initialize: function() {
            this.attributes._type = 'text';

            this._cache.textAtlas = this._cache.textAtlas || {};
            this._cache.textTextureCache = this._cache.textTextureCache || [];
            this._cache.textTextureWritePointer = this._cache.textTextureWritePointer || {};

            this.geometry = new three.PlaneGeometry(1, 1, 1, 1);
            this.geometry.dynamic = true;
        },

        createTextMaterial: function() {
            var canvas = document.createElement('canvas'),
                material,
                texture,
                textureInfo;

            // Maximum sprite size
            canvas.width = MAX_TEXTURE_SIZE;
            canvas.height = MAX_TEXTURE_SIZE;

            this._cache.textTextureWritePointer.x = textSpacer;
            this._cache.textTextureWritePointer.y = 0;

            this._cache.textTextureWritePointer.currentTexture = this._cache.textTextureCache.length;
            this._cache.textTextureWritePointer.tallestThisLine = 0;

            texture = this._textureFromCanvas(canvas);
            texture.generateMipmaps = false;
            texture.magFilter = three.LinearFilter;
            // texture.minFilter = three.NearestFilter;
            texture.format = three.RGBAFormat;

            if (this.options.paper.picasso.isGL) {
                material = new three.MeshBasicMaterial({
                    transparent: true,
                    emissive: 0xffffff,
                    map: texture
                });
            } else {
                material = new three.MeshBasicMaterial({
                    transparent: false,
                    map: texture
                });
            }

            this.options.paper.picasso.materialCache.push(material);
            this._materialCache()['text' + textMaterials++] = material;
            material.materialCacheIndex = this.options.paper.picasso.materialCache.length - 1;

            textureInfo = {
                canvas: canvas,
                context: canvas.getContext('2d'),
                material: material,
                texture: texture,
                materialCacheIndex: material.materialCacheIndex
            };

            textureInfo.context.clearRect(0, 0, MAX_TEXTURE_SIZE, MAX_TEXTURE_SIZE);
            textureInfo.context.textBaseline = 'top';

            // textureInfo.context.fillStyle = 'black';
            // textureInfo.context.rect(0, 0, MAX_TEXTURE_SIZE, MAX_TEXTURE_SIZE);
            // textureInfo.context.fill();

            this._cache.textTextureCache.push(textureInfo);

            return textureInfo;
        },

        getGeometry: function() {
            return this.geometry;
        },

        getAtlasKey: function() {
            return JSON.stringify({
                font: this.attributes.font,
                color: this.attributes.color,
                size: this.attributes.size,
                text: this.attributes.text,
                heightTest: this.attributes.heightTest
            });
        },

        getMaterial: function() {
            var font, fontSize, textWidth, textHeight, left, top, metrics, currentTexture,
                atlas = this._cache.textAtlas[this.getAtlasKey()];

            if (this._cache.textTextureCache.length === 0) {
                this.createTextMaterial();
            }

            // XXX: Is there a smart packing solution that would account for progressively loading text?
            // We may need to repack :(. Ugh just make all your text the same height geez.
            if (!atlas) {
                fontSize = this.attributes.size * superSampleRate;
                metrics = (new Fontre(this.attributes.font, { testText: this.attributes.heightTest })).getMetricsForFontSize(fontSize);
                currentTexture = this._cache.textTextureCache[this._cache.textTextureWritePointer.currentTexture];

                // calculate text size first
                font = fontSize + 'px ' + this.attributes.font;
                currentTexture.context.font = font;

                textWidth = currentTexture.context.measureText(this.attributes.text).width + (this.attributes.strokeWidth || 0);
                textHeight = metrics.lineHeight + (this.attributes.strokeWidth || 0);

                // out of x space, go down a line
                if (this._cache.textTextureWritePointer.x + textWidth + textSpacer > MAX_TEXTURE_SIZE) {
                    this._cache.textTextureWritePointer.y += this._cache.textTextureWritePointer.tallestThisLine + textSpacer;
                    this._cache.textTextureWritePointer.x = textSpacer;
                }

                // out of y space go to a new texture
                // XXX: This sucks because 1 tall word will push you to the next texture
                if (this._cache.textTextureWritePointer.y + textHeight + textSpacer > MAX_TEXTURE_SIZE) {
                    this.createTextMaterial();
                }

                if (this.attributes.strokeWidth && this.attributes.stroke) {
                    currentTexture.context.lineWidth = this.attributes.strokeWidth;
                    currentTexture.context.strokeStyle = this.attributes.stroke;
                    currentTexture.context.strokeText(this.attributes.text, this._cache.textTextureWritePointer.x, this._cache.textTextureWritePointer.y);

                    // reset
                    currentTexture.context.lineWidth = 0;
                    currentTexture.context.strokeStyle  = undefined;
                }

                // lets write to the texture
                if (this.attributes.backgroundColor) {
                    currentTexture.context.fillStyle = this.attributes.backgroundColor;
                    currentTexture.context.fillRect(
                        this._cache.textTextureWritePointer.x - 1,
                        this._cache.textTextureWritePointer.y - 1,
                        textWidth + 2,
                        textHeight + 2
                    );
                }
                // currentTexture.context.fillStyle = 'white';
                currentTexture.context.fillStyle = this.attributes.color;
                currentTexture.context.fillText(this.attributes.text, this._cache.textTextureWritePointer.x, this._cache.textTextureWritePointer.y);

                // make sure the material updates on the next render
                currentTexture.material.needsUpdate = true;
                currentTexture.texture.needsUpdate = true;

                left = (this._cache.textTextureWritePointer.x) / MAX_TEXTURE_SIZE;
                top = (1 - this._cache.textTextureWritePointer.y / MAX_TEXTURE_SIZE);

                atlas = this._cache.textAtlas[this.getAtlasKey()] = {
                    x: this._cache.textTextureWritePointer.x,
                    y: this._cache.textTextureWritePointer.y,
                    textureIndex: this._cache.textTextureCache.length - 1,
                    width: textWidth,
                    height: textHeight,
                    uv: [
                        new three.Vector2(
                            Math.min(left, 1),
                            Math.min(top - (textHeight / MAX_TEXTURE_SIZE), 1)
                        ),
                        new three.Vector2(
                            Math.min(left + (textWidth / MAX_TEXTURE_SIZE), 1),
                            Math.min(top - (textHeight / MAX_TEXTURE_SIZE), 1)
                        ),
                        new three.Vector2(
                            Math.min(left + (textWidth / MAX_TEXTURE_SIZE), 1),
                            Math.min(top, 1)
                        ),
                        new three.Vector2(
                            Math.min(left, 1),
                            Math.min(top, 1)
                        )
                    ]
                };

                this._cache.textTextureWritePointer.x += textWidth + textSpacer;
                this._cache.textTextureWritePointer.tallestThisLine = Math.max(this._cache.textTextureWritePointer.tallestThisLine, textHeight);
            }

            this.geometry.faceVertexUvs[0][0] = [
                atlas.uv[3],
                atlas.uv[0],
                atlas.uv[2]
            ];
            this.geometry.faceVertexUvs[0][1] = [
                atlas.uv[0],
                atlas.uv[1],
                atlas.uv[2]
            ];

            this.geometry.faces[0].faceVertexUvs = this.geometry.faceVertexUvs;

            this.attributes.width = atlas.width / superSampleRate;
            this.attributes.height = atlas.height / superSampleRate;

            this.geometry.uvsNeedUpdate = true;
            this.geometry.groupsNeedUpdate = true;
            this.geometry.verticesNeedUpdate = true;
            this.geometry.buffersNeedUpdate = true;

            this.materialCacheIndex = this._cache.textTextureCache[this._cache.textTextureWritePointer.currentTexture].materialCacheIndex;

            return this._cache.textTextureCache[this._cache.textTextureWritePointer.currentTexture].material;
        },

        _updatePosition: function() {
            Shape.prototype._updatePosition.call(this);
        }
    });

    return TextShape;
});
