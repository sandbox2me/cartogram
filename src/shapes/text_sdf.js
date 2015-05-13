define(function(require) {
    'use strict';

    var _ = require('underscore'),
        three = require('three'),

        Shape = require('./shape'),
        TextShader = require('./shaders/text_shader'),
        TextSDF;

    TextSDF = Shape.extend({
        initialize: function(options) {
            this.attributes._type = 'text_sdf';
            this.attributes.texture = options.texture;
            this._cache.textSDFMaterials = this._cache.textSDFMaterials || {};
            this.SDFFont = this.paper.picasso.SDFFonts[this.attributes.font];

        },

        isPointInside: function(x, y) {
            var bbox = this.getBBox();

            return (x > bbox.x && x < bbox.x2 && y > bbox.y && y < bbox.y2);
        },

        getAtlasKey: function() {
            return JSON.stringify({
                font: this.attributes.font,
                color: this.attributes.color
            });
        },

        getTexture: function() {
            return this.SDFFont.texture;
        },

        _createMaterial: function() {
            var material;

            material = new three.ShaderMaterial({
                uniforms: TextShader.uniforms(
                    this.getTexture(),
                    this.SDFFont.metrics.info.size,
                    this.paper.picasso.camera.options.maxZoom,
                    new three.Color(this.attributes.color),
                    this.attributes.maxSmoothing,
                    this.attributes.minSmoothing
                ),
                vertexShader: TextShader.shaders.vertex,
                fragmentShader: TextShader.shaders.fragment
            });
            material.transparent = true;
            // material.wireframe = true;

            this.materialCacheIndex = material.materialCacheIndex = this.paper.picasso.materialCache.push(material) - 1;
            this._cache.textSDFMaterials['textSDF' + this.getAtlasKey()] = material;

            return material;
        },

        _getUVs: function() {
            var textureWidth = this.SDFFont.metrics.common.scaleW,
                textureHeight = this.SDFFont.metrics.common.scaleH,
                UVs = [];

            _.each(this.attributes.text, function(character) {
                var characterMetrics = this.SDFFont.metrics.chars[character],
                    left = characterMetrics.x / textureWidth,
                    top = 1 - characterMetrics.y / textureHeight;

                UVs.push([
                    new three.Vector2(
                        Math.min(left, 1),
                        Math.min(top - (characterMetrics.height / textureHeight), 1)
                    ),
                    new three.Vector2(
                        Math.min(left + (characterMetrics.width / textureWidth), 1),
                        Math.min(top - (characterMetrics.height / textureHeight), 1)
                    ),
                    new three.Vector2(
                        Math.min(left + (characterMetrics.width / textureWidth), 1),
                        Math.min(top, 1)
                    ),
                    new three.Vector2(
                        Math.min(left, 1),
                        Math.min(top, 1)
                    )
                ]);
            }, this);

            return UVs;
        },

        _applyUVsToGeometry: function(geometry, UVs) {
            for (var i = 0; i < this.attributes.text.length; i++) {
                geometry.faceVertexUvs[0][i * 2] = [UVs[i][3], UVs[i][0], UVs[i][2]];
                geometry.faceVertexUvs[0][i * 2 + 1] = [UVs[i][0], UVs[i][1], UVs[i][2]];
            }
        },

        getGeometry: function() {
            if (this.geometry) {
                return this.geometry;
            }

            var geometry = new three.Geometry(),
                x = 0;

            _.each(this.attributes.text, function(character, index) {
                var characterSize = this.SDFFont.getDimensionsForSize(character, this.attributes.size),
                    characterGeometry = new three.PlaneGeometry(characterSize.width, characterSize.height, 1, 1),
                    // minX ends up being negative half the width
                    minX = characterGeometry.vertices[0].x,
                    minY = characterSize.height/2,
                    translation = new three.Matrix4();

                if (index > 0) {
                    translation.makeTranslation(x - minX, -minY - characterSize.yOffset, 0);
                } else {
                    translation.makeTranslation(-minX, -minY - characterSize.yOffset, 0);
                }
                x += characterSize.xAdvance - characterSize.xOffset;

                characterGeometry.applyMatrix(translation);
                characterGeometry.verticesNeedUpdate = true;

                geometry.merge(characterGeometry);
                geometry.verticesNeedUpdate = true;
            }, this);

            geometry.computeBoundingBox();
            this.attributes.width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
            this.attributes.height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;

            geometry.applyMatrix(new three.Matrix4().makeTranslation(-this.attributes.width/2, this.attributes.height/2, 0));

            return geometry;
        },

        getMaterial: function() {
            var cachedMaterial = this._cache.textSDFMaterials['textSDF' + this.getAtlasKey()],
                material;

            if (cachedMaterial) {
                material = cachedMaterial;
                this.materialCacheIndex = material.materialCacheIndex;
            } else {
                material = this._createMaterial();
            }

            this._applyUVsToGeometry(
                this.geometry,
                this._getUVs()
            );

            return material;
        },

        // update size breaks things here
        _updateSize: function() {}
    });

    return TextSDF;
});
