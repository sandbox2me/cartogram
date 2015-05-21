define(function(require) {
    'use strict';

    var three = require('three'),
        pnltri = require('pnltri'),
        _ = require('underscore'),

        Color = require('../color'),
        settingsStore = require('../stores/settings'),
        SpriteFactory = require('../sprite_factory'),
        Shape = require('./shape'),
        PolygonShader = require('./shaders/polygon_shader'),
        originMatrix = new three.Matrix4().setPosition(
            new three.Vector3(-0.5, -0.5, 0)
        ),
        Polygon;

    // Shim in PNLTRI (Polygon near-linear time triangulation) for faster edge triangulation.
    // three.Shape.Utils.triangulateShape = function (contour, holes) {
    //     var triangulator = new pnltri.Triangulator();
    //     return triangulator['triangulate_polygon']([contour].concat(holes));
    // };

    /**
     * @class Polygon
     */
    Polygon = Shape.extend({
        initialize: function(options) {
            if (settingsStore.isGL) {
                this.useTexture = false;
            }

            this.attributes._type = 'polygon';
            this.attributes._unique = _.uniqueId('pg_');

            this.attributes.vertices = options.vertices;
            this.attributes.x = options.x;
            this.attributes.y = options.y;
            this.attributes.width = options.width;
            this.attributes.height = options.height;
        },

        getVertices: function() {
            return this.attributes.vertices;
        },

        getShape: function() {
            var subShapes = [],
                i,
                vertices = this.getVertices();

            if (_.isArray(vertices[0])) {
                for (i = 0; i < vertices.length; i++) {
                    subShapes.push(new three.Shape(vertices[i]));
                }
            } else {
                subShapes.push(new three.Shape(vertices));
            }

            return subShapes;
        },

        getGeometry: function() {
            if (!this.geometry) {
                this.geometry = new three.ShapeGeometry(this.getShape());

                // Adjust geometry pivot, since we generate it at 0,0,0.
                // Pivot is expected to be at 0.5,0.5,0
                this.geometry.applyMatrix(originMatrix);

                this.geometry.computeBoundingBox();
            }
            return this.geometry;
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
                x = 0,
                y = 0,
                self = this;

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
                fill: 'white',
                stroke: 'black',
                strokeWidth: 5
            }, attrs);

            attrs.strokeWidth *= scale;

            widthF = widthR,
            heightF = heightR;

            if (attrs.strokeWidth) {
                widthR -= attrs.strokeWidth * 4;
                heightR -= attrs.strokeWidth * 4;
                x += attrs.strokeWidth * 2;
                y += attrs.strokeWidth * 2;
            } else {
                widthR -= 20;
                heightR -= 20;
                x += 10;
                y += 10;
            }

            return SpriteFactory.create(function(ctx){
                var i, length, vertex, vx, vy;
                ctx.fillStyle = attrs.fill;

                ctx.beginPath();

                for (i = 0, length = self.attributes.vertices.length; i < length; i++) {
                    vertex = self.attributes.vertices[i];
                    vx = x + vertex.x * widthR;
                    vy = y + (1 - vertex.y) * heightR;

                    vx = Math.min(widthR, vx);
                    vy = Math.min(heightR, vy);

                    if (i === 0) {
                        ctx.moveTo(vx, vy);
                    } else {
                        ctx.lineTo(vx, vy);
                    }
                }

                ctx.closePath();

                ctx.fill();

                if (attrs.strokeWidth) {
                    ctx.lineWidth = attrs.strokeWidth;
                    ctx.strokeStyle = attrs.stroke;
                    ctx.stroke();
                }
            }, { width: widthF, height: heightF });
        },

        _createMaterial: function(texture) {
            var material;
            if (settingsStore.isGL) {
                material = new three.ShaderMaterial({
                    uniforms: PolygonShader.uniforms(),
                    vertexShader: PolygonShader.shaders.vertex,
                    fragmentShader: PolygonShader.shaders.fragment,
                    transparent: true
                });
                material.uniforms.fill.value = Color.colorToVector(this.attributes.fill);
            } else {
                material = new three.MeshBasicMaterial({
                    transparent: true,
                    color: this.attributes.fill
                });
            }
            return material;
        },

        //_updateScale: function() {
            ////this.shape.scale.set(0.1, 0.1, 1);
            ////this.shape.scale.set(1.0, 1.0, 1);
        //}
    });

    return Polygon;
});
