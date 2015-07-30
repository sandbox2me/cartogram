define(function(require) {
    'use strict';

    var three = require('three'),
        _ = require('underscore'),

        EventBusMixin = require('./event_bus'),
        materialStore = require('./stores/materials'),

        defaultRotation = new three.Euler(0, 0, 0, 'XYZ'),
        Set;


    Set = function(cartogram, layer) {
        this.layer = (layer === undefined) ? 0 : layer;
        this.cartogram = cartogram;
        this.clear();
    };

    // FIXME
    var objectForShape = function(shape) {
        if (shape instanceof Set) {
            return shape.sceneSet;
        }

        return shape.shape;
    };

    _.extend(Set.prototype, EventBusMixin, {
        type: 'set',

        clear: function() {
            this.geometryLayers = {};
            this.meshLayers = {};
            this.geometryLocationLayers = {};
            this.children = [];

            this._events = {};
            this._rotation = 0;

            return this;
        },
        // FIXME
        xpop: function() {
            var shape = this.children.pop();

            this.sceneSet.remove(this.sceneSet.getObjectById(objectForShape(shape).id));

            return shape;
        },
        add: function(shape) {
            return this.push(shape);
        },
        push: function(cartogramShape) {
            var geometry,
                matrix,
                layer,
                layerKeys, i, length, childIndex;

            childIndex= this.children.push(cartogramShape);
            cartogramShape.setIndex = childIndex - 1;
            cartogramShape.set = this;

            _.each(this._events, function(eventName, eventFunc) {
                cartogramShape.on(eventName, eventFunc);
            });

            if (cartogramShape.geometryLayers) {
                // dealing with a set
                // Merge its layers into ours
                layerKeys = cartogramShape.getLayerKeys();
                for (i = 0, length = layerKeys.length; i < length; i++) {
                    layer = layerKeys[i];
                    geometry = cartogramShape.meshLayers[layer].geometry;
                    matrix = cartogramShape.meshLayers[layer].matrix;
                    cartogramShape.meshLayers[layer].updateMatrix();

                    cartogramShape.geometryLocationLayers[layer] = {
                        faceLocation: this.geometryLayers[layer] ? this.geometryLayers[layer].faces.length : 0,
                        vertexLocation: this.geometryLayers[layer] ? this.geometryLayers[layer].vertices.length : 0
                    };
                    this._addToLayer(geometry, matrix, cartogramShape.materialCacheIndex, layer);
                }
            } else {
                // Cartogram Shape
                // Merge into appropriate layer
                if (!cartogramShape.shape) {
                    debugger;
                }
                geometry = cartogramShape.shape.geometry;
                matrix = cartogramShape.shape.matrix;
                cartogramShape.shape.updateMatrix();

                layer = cartogramShape.shape.position.z;

                cartogramShape._setLayer = layer;
                cartogramShape._setGeometryFaceLocation = this.geometryLayers[layer] ? this.geometryLayers[layer].faces.length : 0;
                cartogramShape._setGeometryVertexLocation = this.geometryLayers[layer] ? this.geometryLayers[layer].vertices.length : 0;
                this._addToLayer(geometry, matrix, cartogramShape.materialCacheIndex, layer);
            }

            if (this.set) {
                this.set.push(cartogramShape);
            }

            // this occurs when this is a top level shape
            if (this.scene) {
                this.scene.add(cartogramShape);
            }

            return cartogramShape;
        },

        _addToLayer: function(geometry, matrix, materialCacheIndex, layer) {
            var currentMatrix;

            if (!this.geometryLayers[layer]) {
                this.geometryLayers[layer] = new three.Geometry();
                this.meshLayers[layer] = new three.Mesh();
            }

            this.geometryLayers[layer].merge(
                geometry,
                matrix,
                materialCacheIndex
            );

            currentMatrix = this.meshLayers[layer].matrix.clone();
            this.meshLayers[layer] = new three.Mesh(
                this.geometryLayers[layer],
                new three.MeshFaceMaterial(materialStore)
            );
            this.meshLayers[layer].matrix = currentMatrix;
            this.meshLayers[layer].position.z = parseFloat(layer);
            this.meshLayers[layer].updateMatrix();
        },

        updateGeometry: function(cartogramShape, layerKey, hasDirtyVertices) {
            // console.log('updateGeometry: FIXME!');
            // return;

            var threeShape = objectForShape(cartogramShape),
                i, j, location, vertexLocation, length, geometry, scale, position, rotation, vertex;

            hasDirtyVertices = (hasDirtyVertices === undefined) ? false : hasDirtyVertices;


            var meshLayer = this.meshLayers[layerKey];

            if (cartogramShape instanceof Set) {
                geometry = cartogramShape.meshLayers[layerKey].geometry;
                scale = cartogramShape.meshLayers[layerKey].scale;
                position = cartogramShape.meshLayers[layerKey].position;
                rotation = cartogramShape.meshLayers[layerKey].rotation || defaultRotation;

                location = cartogramShape.geometryLocationLayers[layerKey].faceLocation;
                vertexLocation = cartogramShape.geometryLocationLayers[layerKey].vertexLocation;
            } else {
                geometry = cartogramShape.shape.geometry;
                scale = cartogramShape.shape.scale;
                position = cartogramShape.shape.position;
                rotation = cartogramShape.shape.rotation || defaultRotation;

                location = cartogramShape._setGeometryFaceLocation;
                vertexLocation = cartogramShape._setGeometryVertexLocation;
            }

            // Check if size has changed, compensate if so
            vertex = geometry.vertices[0].clone().multiply(scale).add(position);
            if (hasDirtyVertices || vertex.x != meshLayer.geometry.vertices[vertexLocation].x || vertex.y != meshLayer.geometry.vertices[vertexLocation].y) {
                for (i = 0, length = geometry.vertices.length; i < length; i++) {
                    vertex = geometry.vertices[i].clone().multiply(scale).applyEuler(rotation).add(position);
                    meshLayer.geometry.vertices[i + vertexLocation].copy(vertex);
                }
                hasDirtyVertices = true;
            }

            for (i = 0, length = geometry.faces.length; i < length; i++) {
                meshLayer.geometry.faces[i + location].materialIndex = geometry.faces[i].materialIndex + (cartogramShape.materialCacheIndex || 0);
                meshLayer.geometry.faces[i + location].faceVertexUvs = geometry.faces[i].faceVertexUvs;

                if (geometry.faces[i].faceVertexUvs && geometry.faces[i].faceVertexUvs[0].length) {
                    for (j = 0; j < geometry.faces[i].faceVertexUvs[0].length; j++) {
                        meshLayer.geometry.faceVertexUvs[0][i + location + j] = geometry.faces[i].faceVertexUvs[0][j];
                    }
                }
                // console.log('material index after: ' + this.sceneSet.faces[i + location].materialIndex);
            }

            meshLayer.geometry.uvsNeedUpdate = true;
            meshLayer.geometry.groupsNeedUpdate = true;
            meshLayer.geometry.verticesNeedUpdate = true;
            meshLayer.geometry.elementsNeedUpdate = true;
            meshLayer.geometry.buffersNeedUpdate = true;

            if (this.set) {
                this.set.updateGeometry(this, layerKey, hasDirtyVertices);
            }

            this.trigger('update');
        },

        disposeGeometry: function() {
            var layerKeys = this.getLayerKeys(),
                i, length;

            for (i = 0, length = layerKeys.length; i < length; i++) {
                this.geometryLayers[layerKeys[i]].dispose();
            }
        },

        _collectMatricies: function() {
            var matricies = [this.meshLayers[this.getLayerKeys()[0]].matrix.clone()];

            if (this.set) {
                matricies.push(this.set._collectMatricies());
            }

            return _.flatten(matricies);
        },

        getMatrix: function() {
            var matricies = this._collectMatricies().reverse(),
                matrix,
                i;

            matrix = matricies[0];

            for(i = 1; i < matricies.length; i++) {
                matrix.multiply(matricies[i]);
            }

            return matrix;
        },

        getLayerKeys: function() {
            if (!this._layerKeys || this._layerKeys.length !== _.keys(this.geometryLayers)) {
                this._layerKeys = _.keys(this.geometryLayers).sort(function(a, b) { return a > b; });
            }
            return this._layerKeys;
        },

        forEachMeshLayer: function(callback, context) {
            var layerKeys = this.getLayerKeys(),
                i, length,
                res;

            for (i = 0, length = layerKeys.length; i < length; i++) {
                res = callback.call(context, this.meshLayers[layerKeys[i]], layerKeys[i]);
                if (res) {
                    break;
                }
            }
            return res;
        },

        intersectsFrustum: function(frustum) {
            var box,
                intersects;

            intersects = this.forEachMeshLayer(function(layer) {
                layer.updateMatrix();
                layer.updateMatrix();
                layer.updateMatrixWorld();
                box = new three.Box3();
                box.setFromObject(layer);

                return frustum.intersectsBox(box);
            }, this);

            return intersects;
        },

        translateGeometry: function(vector) {
            this.forEachMeshLayer(function(layer) {
                layer.geometry.applyMatrix(new three.Matrix4().makeTranslation(vector.x, vector.y, 0));
            });
        },

        position: function(obj) {
            var layerKeys = this.getLayerKeys();

            // mark as dirty here
            if (typeof obj === 'undefined') {
                var mesh = this.meshLayers[layerKeys[0]],
                    position = mesh.position.clone();
                if (this.set) {
                    position.add(this.set.position());
                }
                return position;
            }

            this.forEachMeshLayer(function(layer, layerKey) {
                _.extend(layer.position, obj);

                layer.updateMatrix();

                if (this.set) {
                    this.set.updateGeometry(this, layerKey, true);
                }
            }, this);
        },

        absolutePosition: function() {
            var pos = this.position();

            if (this.set) {
                pos.sub(this.set.absolutePosition());
            }

            return pos;
        },

        rotation: function(obj) {
            if (typeof obj === 'undefined') {
                var rot = this._rotation;
                if (this.set) {

                }
            }

            _.extend(this.mesh.rotation, obj);
        },

        /**
         * Rotate set by radians.
         */
        rotate: function(angleRad) {
            this.forEachMeshLayer(function(layer) {
                layer.rotation.z = angleRad;
            });
            this._rotation = angleRad;
        },

        /**
         * Rotate set by degrees.
         */
        rotateDeg: function(angleDeg) {
            this.rotate((angleDeg || 0) * -0.01745329252);
        },

        // FIXME
        xremove: function(shapeOrID) {
            var shape;

            if (_.isNumber(shapeOrID)) {
                shape = this.children[shapeOrID];
            } else {
                shape = this.children[shapeOrID.setIndex];
            }

            this.children.splice(shape.setIndex, 1);
            this.sceneSet.remove(this.sceneSet.getObjectById(objectForShape(shape).id));

            return shape;
        },
        forEach: function(callback, context) {
            var i,
                length = this.children.length;

            context = context || this;

            for (i = 0; i < length; i++) {
                callback.call(context, this.children[i]);
            }

            return this;
        },

        getBBox: function(should) {
            var layerBoxes = [],
                grossBBox,
                bbox;

            if (this.bbox) {
                return this.bbox;
            }

            grossBBox = {
                min: { x: Infinity, y: Infinity },
                max: { x: -Infinity, y: -Infinity }
            };

            this.forEachMeshLayer(function(layer) {
                if (!layer.geometry.boundingBox) {
                    layer.geometry.computeBoundingBox();
                }
                layerBoxes.push(layer.geometry.boundingBox);
                bbox = layer.geometry.boundingBox;

                bbox.min.x -= layer.position.x;
                bbox.min.y -= layer.position.y;
                bbox.max.x -= layer.position.x;
                bbox.max.y -= layer.position.y;

                grossBBox.min.x = (bbox.min.x < grossBBox.min.x) ? bbox.min.x : grossBBox.min.x;
                grossBBox.min.y = (bbox.min.y < grossBBox.min.y) ? bbox.min.y : grossBBox.min.y;
                grossBBox.max.x = (bbox.max.x > grossBBox.max.x) ? bbox.max.x : grossBBox.max.x;
                grossBBox.max.y = (bbox.max.y > grossBBox.max.y) ? bbox.max.y : grossBBox.max.y;
            }, this);

            this.bbox = {
                x: grossBBox.min.x,
                y: grossBBox.min.y,
                x2: grossBBox.max.x,
                y2: grossBBox.max.y
            };

            return this.bbox;
        },

        getAnimatableObject: function() {
            return this.mesh;
        },

        animate: function(attrs, duration) {
            var promise = this.options.cartogram.animationManager.add({
                cartogramObject: this,
                duration: duration,
                attrs: attrs
            }).progress(_.bind(function(worker) {
                // XXX Probably trigger a moved event?
            }, this));

            return promise;
        },

        on: function(eventName, eventFunc) {
            // XXX Handle multiple handlers for the same event. :/
            this._events[eventName] = eventFunc;

            this.children.forEach(function(child) {
                child.on(eventName, eventFunc);
            });
        },

        off: function(eventName) {
            delete this.events[eventName];
            this.children.forEach(function(child) {
                child.off(eventName);
            });
        }

    });

    return Set;
});
