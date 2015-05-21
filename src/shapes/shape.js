/**
 * @module shape
 */
define(function(require) {
    'use strict';

    var three = require('three'),
        _ = require('underscore'),
        Backbone = require('backbone'),

        cacheStore = require('../stores/cache'),
        EventBusMixin = require('../event_bus'),
        materialStore = require('../stores/materials'),
        settingsStore = require('../stores/settings'),
        SpriteCollection = require('../sprite_collection'),

        spriteCollection = new SpriteCollection(),

        defaultAttrs = {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            cursor: 'default',
            fill: '#ffffff'
        },

        styleAttrs = [
            '_unique',
            '_type',
            'fill',
            'stroke',
            'strokeWidth'
        ];

    /**
     * Base class for all shape types.
     * @constructor
     * @alias shape
     *
     * @param {object} options - Initial shape attributes
     */
    var Shape = function(options) {
        this.options = options;
        this.attributes = _.extend({}, defaultAttrs, options);

        this.paper = this.attributes.paper;

        // WARNING: shared caches across all objects
        this._globalMaterialCache = materialStore;
        this._cache = cacheStore;

        this.id = _.uniqueId('s_');

        this.useTexture = true;

        this.initialize.apply(this, arguments);
        this.geometry = this.getGeometry();
        this.material = this.getMaterial(this.attributes, this.texture);

        this.shape = new three.Mesh(this.geometry, this.material);
        this.shape.shape = this;

        this._updatePosition();
        this._updateSize();
        this.on('change', function() {
            this.material = this.getMaterial(this.attributes);
            this.shape.material = this.material;

            // TODO: Fix changing position, size, and rotation
            // this._updatePosition();
            this._updateSize();

            // Inform the set that the material has possibly changed
            if (this.set) {
                this.set.updateGeometry(this, this.getLayer());
            }
        });

        return this;
    };

    _.extend(Shape.prototype, EventBusMixin, {
        /**
         * Initialization method for subclasses to implement as necessary.
         *
         * @memberof shape
         * @instance
         * @param {object} options
         */
        initialize: function() {},

        /**
         * Gets the geometry for this shape. Creates a new geometry object
         * if none exists.
         *
         * @memberof shape
         * @instance
         * @returns {PlaneGeometry} THREE PlaneGeometry
         */
        getGeometry: function() {
            if (!this.geometry) {
                this.geometry = new three.PlaneGeometry(1, 1, 1, 1);
            }
            return this.geometry;
        },

        _textureCache: function() {
            return this._cache.textures;
        },

        _materialCache: function() {
            return this._cache.materials;
        },

        _spriteCollection: function() {
            return spriteCollection;
        },

        /**
         * Get the THREE Texture for a given set of attributes.
         *
         * @memberof shape
         * @instance
         * @param {object} attributes
         * @returns {Texture} THREE Texture
         */
        getTexture: function(attributes) {
            var attrs = _.pick(attributes, styleAttrs),
                attrString = JSON.stringify(attrs),
                texture = this._textureCache()[attrString],
                image;

            if (!texture) {
                // console.log('new texture!')
                image = this._spriteCollection().get(attrs);
                if (!image) {
                    image = this.generateSprite(attrs);
                    this._spriteCollection().add(attrs, image);
                }

                texture = this._textureFromCanvas(image);
                this._textureCache()[attrString] = texture;
            }

            return texture;
        },

        /**
         * Get the THREE Material for a given set of attributes
         *
         * @memberof shape
         * @instance
         * @param {object} attributes
         * @param {Texture} texture - THREE texture for this material
         * @returns {Material} THREE Material
         */
        getMaterial: function(attributes) {
            var attrs = _.pick(attributes, styleAttrs),
                attrString = JSON.stringify(attrs),
                material = this._materialForAttrString(attrString),
                opaqueMaterial,
                texture;

            if (!material) {
                if (this.useTexture) {
                    texture = this.getTexture(attributes);
                }
                material = this._createMaterial(texture);

                this._globalMaterialCache.push(material);
                this._materialCache()[attrString] = material;
                material.materialCacheIndex = this._globalMaterialCache.length - 1;
            }

            if ('opacity' in attributes) {
                attrs._opacityChanged = true;
                attrString = JSON.stringify(attrs);
                opaqueMaterial = this._materialForAttrString(attrString);

                if (!opaqueMaterial) {
                    opaqueMaterial = material.clone();
                    this._globalMaterialCache.push(opaqueMaterial);
                    this._materialCache()[attrString] = opaqueMaterial;
                    opaqueMaterial.materialCacheIndex = this._globalMaterialCache.length - 1;
                }

                opaqueMaterial.opacity = attributes.opacity;
                material = opaqueMaterial;
            }

            this.materialCacheIndex = material.materialCacheIndex;
            // console.log('cache index: ' + this.materialCacheIndex)
            material.needsUpdate = true;

            return material;
        },

        _materialForAttrString: function(attrString) {
            return this._materialCache()[attrString];
        },

        _createMaterial: function(texture) {
            var material;

            if (settingsStore.isGL) {
                material = new three.MeshBasicMaterial({
                    transparent: true,
                    emissive: 0xffffff,
                    map: texture
                    // wireframe: true,
                    // color: 0x000000
                    // alphaTest: 0.8,
                });
            } else {
                material = new three.MeshBasicMaterial({
                    transparent: true,
                    map: texture
                });
            }

            return material;
        },

        _textureFromCanvas: function(canvas) {
            var texture = new three.Texture(canvas);
            texture.premultipliedAlpha = false;
            texture.generateMipmaps = false;
            texture.magFilter = texture.minFilter = three.NearestFilter;
            texture.needsUpdate = true;

            return texture;
        },

        generateSprite: function() {
            throw new Error('generateSprite method not implemented!');
        },

        getVisibleSize: function() {
            var fov = this.options.paper.getCamera().fov * Math.PI / 180,
                visibleHeight = 2 * Math.tan(fov / 2) * this.options.paper.getCamera().position.z,
                visibleWidth = visibleHeight * this.options.paper.getCamera().aspect;

            var width = (this.shape.scale.x / visibleWidth) * this.options.paper.p.width;
            var height = (this.shape.scale.y / visibleHeight) * this.options.paper.p.height;

            return new three.Vector2(width, height);
        },

        _updatePosition: function() {
            this.shape.position.x = this.attributes.x;
            this.shape.position.y = this.attributes.y;
        },

        _updateSize: function() {
            this.shape.scale.x = this.attributes.width;
            this.shape.scale.y = this.attributes.height;

            this.shape.geometry.verticesNeedUpdate = true;
        },

        /**
         * Rotate set by radians.
         */
        rotate: function(angleRad) {
            this._rotation = angleRad;
            this.shape.rotation.z = angleRad;
        },

        /**
         * Rotate set by degrees.
         */
        rotateDeg: function(angleDeg) {
            this.rotate((angleDeg || 0) * -0.01745329252);
        },

        /**
         * Get or set the position Vector3 of the shape. Position is relative
         * to the position of the shape's parent set, or the world if the shape
         * is not in a set.
         *
         * @memberof shape
         * @instance
         * @returns {Vector3}
         */
        position: function(obj) {
            if (typeof obj === 'undefined') {
                return this.shape.position;
            }

            _.extend(this.shape.position, obj);
        },

        /**
         * Gets the absolute position of the shape in the scene in relation to
         * the position of all parent sets.
         *
         * @memberof shape
         * @instance
         * @returns {Vector2}
         */
        absolutePosition: function() {
            var position = {
                x: this.shape.position.x,
                y: this.shape.position.y
            };

            if (this.set) {
                position.x += this.set.position().x;
                position.y -= this.set.position().y;
            }

            return position;
        },

        /**
         * Get or set the rotation Vector3 of the shape.
         *
         * @memberof shape
         * @instance
         * @returns {Vector3}
         */
        rotation: function(obj) {
            if (typeof obj !== 'undefined') {
                _.extend(this.shape.rotation, obj);
            }

            return this.shape.rotation;
        },

        setLayer: function(layer) {
            this.shape.position.z = layer;
            this._layer = layer;
            this.shape.updateMatrix();  // XXX(alex): Unsure if necessary
        },

        getLayer: function() {
            if (this.shape.position.z !== this._layer) {
                this.shape.position.z = this._layer;
            }
            return this.shape.position.z;
        },

        // RaphaelJS API Implementation

        /**
         * Get or set attributes on the shape.
         *
         * * Passing no arguments will return the attribute object.
         * * Passing in an object of attribute key/values will update those
         *   values in the attributes object.
         * * Passing in an attribute key and value as the first two arguments
         *   will update those values in the attributes object.
         *
         * A change event will fire when an attribute is set, unless
         * `silent` is true in the `options` object.
         *
         * @memberof shape
         * @instance
         * @param {(string|object)=} attribute - The attribute to get or set;
         *        or key/values to set if an `object` is passed.
         * @param {string=} value - The value to set for the above attribute.
         * * Can be `undefined` if attribute is an `object` and options
         *   are required.
         * * Value will be ignored if attribute is an `object`.
         * @param {object=} options
         * @param {boolean} options.silent - **True**: Will not trigger any
         *        `change` events for attribute updates.
         */
        attr: function(attribute, value, options) {
            if (!attribute && !value) {
                return this.attributes;
            }

            if (typeof attribute === 'object') {
                _.extend(this.attributes, attribute);
                if ('cursor' in this.attributes) {
                    this._setCursor(this.attributes['cursor']);
                }
            } else {
                if (attribute === 'cursor') {
                    this._setCursor(value);
                }
                if (value) {
                    this.attributes[attribute] = value;
                } else {
                    return this.attributes[attribute];
                }
            }

            if (!options || (options && !options.silent)) {
                this.trigger('change', this, this.attributes);
                if (typeof attribute === 'string') {
                    this.trigger('change:' + attribute, this, value);
                }
            }

            return this;
        },

        _setCursor: function(cursorStyle) {
            document.body.style.cursor = cursorStyle;
        },

        /**
         * @typedef BoundingBox
         * @type {object}
         * @property {number} x
         * @property {number} y
         * @property {number} width
         * @property {number} height
         */

        /**
         * Get the bounding box for the shape.
         *
         * Shape subclasses are expected to implement this function as
         * appropriate for their type.
         *
         * @memberof shape
         * @instance
         * @returns {BoundingBox}
         */
        getBBox: function() {
            if (this._bbox) {
                return this._bbox;
            }

            var position = this.absolutePosition(),
                matrix,
                g = this.shape.geometry.clone(),
                bbox;

            this.shape.updateMatrix();
            matrix = this.shape.matrix.clone();

            if (this.set) {
                matrix = this.set.getMatrix().multiply(this.shape.matrix.clone());
            }

            g.applyMatrix(matrix);
            g.computeBoundingBox();
            bbox = g.boundingBox;

            if (this.attributes._type === 'circle') {
                //debugger;
            }

            this._bbox = {
                x: bbox.min.x,
                y: -bbox.max.y,
                x2: bbox.max.x,
                y2: -bbox.min.y,
                width: bbox.size().x,
                height: bbox.size().y
            };

            return this._bbox;
        },

        isPointInside: function(x, y) {
            return true;
        },

        getAnimatableObject: function() {
            return this.shape;
        },

        animate: function(attrs, duration) {
            var promise = this.options.paper.picasso.animationManager.add({
                picassoObject: this,
                duration: duration,
                attrs: attrs
            }).progress(_.bind(function(worker) {
                // XXX Probably trigger a moved event?
                // For opacity, we need to update the shared textures
            }, this));

            return promise;
        },

        click: function(handler) {
            this.on('click', handler);
        },

        dblclick: function(handler) {
            this.on('dblclick', handler);
        },

        longpress: function(handler) {
            this.on('longpress', handler);
        },

        drag: function(onMove, onStart, onEnd) {
            var self = this;
            this.on('mousedown', function(shape) {
                onStart(shape);
                self.on('mousemove', function(shape) {
                    onMove(shape);
                });
                self.on('mouseup', function(shape) {
                    onEnd();
                });
            });
        },

        mousedown: function(handler) {
            this.on('mousedown', handler);
        },
        mousemove: function(handler) {
            this.on('mousemove', handler);
        },
        mouseout: function(handler) {
            this.on('mouseout', handler);
        },
        mouseover: function(handler) {
            this.on('mouseover', handler);
        },
        mouseup: function(handler) {
            this.on('mouseup', handler);
        },
        touchstart: function(handler) {
            this.on('touchstart', handler);
        },
        touchend: function(handler) {
            this.on('touchend', handler);
        },
        touchmove: function(handler) {
            this.on('touchmove', handler);
        },
        touchcancel: function(handler) {
            this.on('touchcancel', handler);
        },

        unclick: function(handler) {},
        undblclick: function(handler) {},
        undrag: function() {},
        unhover: function(handlerIn, handlerOut) {},
        unmousedown: function(handler) {
            this.off('mousedown', handler);
        },
        unmousemove: function(handler) {
            this.off('mousemove', handler);
        },
        unmouseout: function(handler) {
            this.off('mouseout', handler);
        },
        unmouseover: function(handler) {
            this.off('mouseover', handler);
        },
        unmouseup: function(handler) {
            this.off('mouseup', handler);
        },
        untouchstart: function(handler) {
            this.off('untouchstart', handler);
        },
        untouchend: function(handler) {
            this.off('untouchend', handler);
        },
        untouchmove: function(handler) {
            this.off('untouchmove', handler);
        },
        untouchcancel: function(handler) {
            this.off('untouchcancel', handler);
        },

        scale: function() {},
        transform: function(handler) {}
    });

    Shape.extend = Backbone.View.extend;

    return Shape;
});
