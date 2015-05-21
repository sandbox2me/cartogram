define(function(require) {
    'use strict';

    var three = require('three'),
        _ = require('underscore'),

        SpriteFactory = require('../sprite_factory'),
        Polygon = require('./polygon'),
        // PolygonShader = requ/ire('./shaders/polygon_shader'),
        //
        SmoothPolygon,

        corners = [45, -45, 135, -135],
        straight = [0, 90, -90, 180],
        validAngles = [45, -45, 135, -135, 0, 90, -90, 180],
        angleThreshold = 30;


    /**
     * @class SmoothPolygon
     */
    SmoothPolygon = Polygon.extend({
        initialize: function(options) {
            this.deg = 180 / Math.PI;

            Polygon.prototype.initialize.call(this, options);
            // this._insertAnchors();
        },

        getShape: function() {
            var subShapes = [],
                i,
                vertices = this.getVertices();

            if (_.isArray(vertices[0])) {
                for (i = 0; i < vertices.length; i++) {
                    subShapes.push(this._generateShape(vertices[i]));
                }
            } else {
                subShapes.push(this._generateShape(vertices));
            }

            return subShapes;
        },

        _angleOfVertices: function(a, b) {
            var dx = b.x - a.x,
                dy = b.y - a.y;

            return Math.round(Math.atan2(dy, dx) * this.deg);
        },

        _getAngleRanges: function(index, vertices) {
            var prev, current, next,
                initial = index > 0 ? index - 1 : vertices.length - 1;

            prev = {
                start: initial > 0 ? initial - 1 : vertices.length - 1,
                end: initial
            };

            current = {
                start: initial,
                end: index
            };

            next = {
                start: index,
                end: index < vertices.length - 1 ? index + 1 : 0
            }

            return {
                prev: this._angleOfVertices(vertices[prev.start], vertices[prev.end]),
                current: this._angleOfVertices(vertices[current.start], vertices[current.end]),
                next: this._angleOfVertices(vertices[next.start], vertices[next.end])
            };
        },

        _createControlPoint: function(v1, v2, tangentOrigin, radius) {
            var v3,
                delta = v1.clone().sub(v2),
                normal = (new three.Vector2(delta.y, -delta.x)).normalize(),
                length = v1.distanceTo(v2);

            v3 = v2.clone().sub(v1).setLength(length * tangentOrigin);
            v3.add(v1).add(normal.multiplyScalar(radius));

            return v3;
        },

        _drawVertex: function(shape, vertex1, vertex2, index, vertices) {
            var angle, control, angleRanges,
                diff = 0, diffAbs,
                controlOrigin = 0.5,
                controlHeight = 0.03;

            angleRanges = this._getAngleRanges(index, vertices);
            angle = angleRanges.current; //this._angleOfVertices(vertex1, vertex2);
            // if (angleRanges.current !== angleRanges.next) {
            if (index === 0 || index > 1) {
                diff = angleRanges.prev - angleRanges.current;
                diffAbs = Math.abs(diff);
            }

            console.log(angleRanges, angle, diff);
            if (straight.indexOf(angleRanges.current) < 0 && ((diffAbs > 10 && diffAbs < 75) || (diffAbs > 75 && diffAbs < 115)) && (-angleRanges.current !== angleRanges.prev) && (Math.abs(angleRanges.current + angleRanges.prev) !== 180)) {
            // if (corners.indexOf(angleRanges.current) > -1 && corners.indexOf(angleRanges.next) < 0 && corners.indexOf(angleRanges.prev) < 0) {


                // if (straight.indexOf(angleRanges.prev) > -1 && straight.indexOf(angleRanges.next) > -1) {
                    // 0 - 90 --- 45 = 0.5
                    // 270 - 360 --- 315 = 0.5

                    if (Math.abs(angle) > 0 && Math.abs(angle) < 90) {
                        controlOrigin = Math.abs(angle) / 90;
                    } else if (Math.abs(angle) > 270 && Math.abs(angle) < 360) {
                        controlOrigin = (Math.abs(angle) - 270) / 90;
                    }

                    controlHeight = 0.06 * controlOrigin;
                    if (controlOrigin > 0.5) {
                        controlHeight = Math.abs(controlHeight - 0.05);
                    }
                    // controlHeight = 0.015;
                // } else if (straight.indexOf(angleRanges.prev) > -1 && straight.indexOf(angleRanges.current) < 0 && straight.indexOf(angleRanges.next) < 0) {
                //     controlOrigin = 0.25;
                //     controlHeight = 0.01;
                // } else if (straight.indexOf(angleRanges.prev) < 0 && straight.indexOf(angleRanges.current) < 0 && straight.indexOf(angleRanges.next) > -1) {
                //     controlOrigin = 0.75;
                //     controlHeight = 0.01;
                // }


                control = this._createControlPoint(vertex1, vertex2, controlOrigin, (diff < 0) ? -controlHeight : controlHeight);
                shape.quadraticCurveTo(
                    control.x, control.y,
                    vertex2.x, vertex2.y
                );
            } else {
                shape.lineTo(vertex2.x, vertex2.y);
            }
        },

        _plot: function(shape, vertex, index, vertices) {
            if (index === 0) {
                shape.moveTo(vertex.x, vertex.y);
                return;
            }

            this._drawVertex(shape, vertices[index - 1], vertex, index, vertices);
        },

        _generateShape: function(vertices) {
            console.log('generating shape')
            var shape = new three.Shape(),
                vertex, angle, prev, control;

            _.each(vertices, _.partial(this._plot, shape), this);

            // Complete path
            this._drawVertex(shape, vertices[vertices.length - 1], vertices[0], 0, vertices);

            return shape;
        },

        /**
         * Surrounds each vertex with two additional vertices for smoothing.
         */
        _insertAnchors: function() {
            var count = this.attributes.vertices.length,
                newVertices = [],
                radius = 0.01;

            console.log('inserting new anchors');
            _.each(this.attributes.vertices, function(vertex, index, baseVertices) {
                var previous, next, vector, radiusMult, length;

                if (index === 0) {
                    previous = baseVertices[count - 1];
                } else if (index === count - 1) {
                    next = baseVertices[0];
                }

                previous = previous || baseVertices[index - 1];
                next = next || baseVertices[index + 1];

                // left side - previous -> vertex
                // get vector length (l)
                // normalize vector to (l - radius) = lr
                //      if lr length is less than 0, halve radius and try again.
                //      repeat until vector length is valid
                // insert new anchor
                vector = vertex.clone().sub(previous);
                length = vector.length();
                radiusMult = 1;

                do {
                    vector.setLength(length - (radius * radiusMult));
                    radiusMult *= 0.5;
                } while (vector.length() < 0);

                vector.add(previous);
                newVertices.push(vector);

                newVertices.push(vertex);

                // right side - vertex -> next
                // get vector length (l)
                // normalize vector to (radius) = lr
                //      if lr length is greater than l, halve radius and try again.
                //      repeat until vector length is valid
                // insert new anchor
                vector = next.clone().sub(vertex);
                length = vector.length();
                radiusMult = 1;

                do {
                    vector.setLength(radius * radiusMult);
                    radiusMult *= 0.5;
                } while (vector.length() > length);

                vector.add(vertex);
                newVertices.push(vector);
            });

            this.attributes.vertices = newVertices;
        },

        /**
         * Returns cubic bezier segment control points.
         *
         * A bezier patch requires 3 vertex inputs per set of control points.
         *
         * @param  {Vector2} v1 - Path vertex
         * @param  {Vector2} v2 - Path vertex
         * @param  {Vector2} v3 - Path vertex
         * @return {Object} An object containing two control points {c1, c2}
         */
        // Derived from:
        //   http://www.benknowscode.com/2012/09/path-interpolation-using-cubic-bezier_9742.html
        //   http://www.antigrain.com/research/bezier_interpolation/
        _createControlPoints: function(v1, v2, v3) {
            var delta1 = v1.clone().sub(v2),
                delta2 = v2.clone().sub(v3),
                l1 = delta1.lengthSq(),
                l2 = delta2.lengthSq(),
                k = l2 / (l1 + l2),

                m1 = v1.clone().add(v2).divideScalar(2),
                m2 = v2.clone().add(v3).divideScalar(2),
                dm = m1.clone().sub(m2),
                cm = m2.clone().add(dm).multiplyScalar(k),
                translation = v2.clone().sub(cm);

            return {
                c1: m1.clone().add(translation),
                c2: m2.clone().add(translation)
            };
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

            widthF = widthR;
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
                var i, j, length, vertex, position, controls;
                var positionForVertex = function(vertex) {
                    return new three.Vector2(
                        Math.min(widthR, x + vertex.x * widthR),
                        Math.min(heightR, y + (1 - vertex.y) * heightR)
                    );
                };

                ctx.fillStyle = attrs.fill;

                ctx.beginPath();

                for (i = 0, length = self.attributes.vertices.length; i < length; i++) {
                    vertex = self.attributes.vertices[i];
                    position = positionForVertex(vertex);

                    if (i === 0) {
                        ctx.moveTo(position.x, position.y);
                    } else {
                        // j = (i == 1) ? i - 1 : i - 2;
                        j = (i == length - 1) ? 0 : i + 1;

                        controls = self._createControlPoints(
                            positionForVertex(self.attributes.vertices[i - 1]),
                            position,
                            positionForVertex(self.attributes.vertices[j])
                        );

                        ctx.bezierCurveTo(
                            controls.c1.x, controls.c1.y,
                            controls.c2.x, controls.c2.y,
                            position.x, position.y
                        );
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
        }
    });

    return SmoothPolygon;
});
