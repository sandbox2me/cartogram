define(function(require) {
    'use strict';

    var EventBusMixin = require('./event_bus'),
        three = require('three'),
        _ = require('underscore'),
        TrackballControls = require('./lib/TrackballControls'),
        Camera;


    Camera = function(cartogram, options) {
        _.bindAll(
            this,
            'zoomIn',
            'zoomOut',
            'zoomTo',
            'panLeft',
            'panRight',
            'panUp'
        );

        this.cartogram = cartogram;

        this.options = {
            enableInteraction: true,
            basePanSpeed: 2,
            panDamping: 0.8,
            zoomSpeed: 0.2,
            minZoom: 50,
            maxZoom: 2000,
            staticMoving: true,
            step: 200
        };
        this.updateSettings(options);

        this.currentZoom = 500;

        this.aspect = this.cartogram.width / this.cartogram.height;

        // window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2
        this.camera = new three.OrthographicCamera(
            this.cartogram.width / -2,
            this.cartogram.width / 2,
            this.cartogram.height / 2,
            this.cartogram.height / -2,
            -100,
            this.options.maxZoom + 100
        );
        this.camera.cameraObject = this;

        // Stash the lookAt value to simplify panning
        this.camera._target = new three.Vector3(0, 0, 0);
        this.camera.lookAt(this.camera._target);
        this.camera.position.z = this.currentZoom;
        this.camera.updateProjectionMatrix();

        // Init camera controls after rendering
        window.setTimeout(_.bind(function() {
            this.enableInteraction = this.options.enableInteraction;
            if (this.enableInteraction) {
                this.initializeControls();
            }
        }, this));
    };

    _.extend(Camera.prototype, EventBusMixin, {
        initializeControls: function() {
            this.controls = new TrackballControls(this.camera, this.cartogram.renderer.domElement);

            this._updateControlsSettings();
            this._lastPosition = {};

            var epsilon = 0.5;

            this.controls.addEventListener('change', _.bind(function() {
                var position = this.camera.getWorldPosition();
                if (!this._lastPosition.x) {
                    this._lastPosition = position;
                } else if (
                    position.x - this._lastPosition.x > epsilon ||
                    position.y - this._lastPosition.y > epsilon ||
                    position.z - this._lastPosition.z > epsilon
                ) {
                    this._lastPosition = position;

                    if (!this._eventsBlocked) {
                        this.trigger('panned');
                        this.trigger('zoomed', { scale: position.z });
                        this.trigger('motion');
                    }
                }
            }, this));

            if (!this.cartogram.isGL) {
                // Framerate is often quite low in Canvas, disable the friction effect
                this.controls.staticMoving = true;

                // Increase perceived performance in Canvas mode when panning/zooming
                this.controls.panSpeed *= 2;
                this.controls.zoomSpeed *= 2;
            }
        },

        _updateControlsSettings: function() {
            var heightRatio = this.cartogram.height / 1080,
                panSpeed = this.options.basePanSpeed * heightRatio;

            this.controls.noRotate = true;
            this.controls.noRoll = true;
            this.controls.noKeys = true;

            this.controls.panSpeed = panSpeed;
            this.controls.zoomSpeed = this.options.zoomSpeed;
            this.controls.minDistance = this.options.minZoom;
            this.controls.maxDistance = this.options.maxZoom;

            this.controls.staticMoving = this.options.staticMoving;
            this.controls.dynamicDampingFactor = this.options.panDamping;
        },

        updateSettings: function(options) {
            _.extend(this.options, options);

            // need for internal EB purposes
            this.scales = _.range(this.options.minZoom, this.options.maxZoom + this.options.step, this.options.step);
            this.defaultScale = this.options.step;

            if (this.camera) {
                this.camera.far = this.options.maxZoom + 100;
                this.camera.updateProjectionMatrix();
            }

            if (this.controls) {
                this._updateControlsSettings();
            }

            this.trigger('zoomRangeUpdate');
        },

        setZoomLevel: function(zoomLevel) {
            this.camera.position.z = zoomLevel;
        },

        getZoomLevel: function() {
            return this.currentZoom;
        },

        getFrustum: function() {
            var frustum = new three.Frustum();

            this.camera.updateMatrix();
            this.camera.updateMatrixWorld();
            this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);

            frustum.setFromMatrix(
                new three.Matrix4().multiplyMatrices(
                    this.camera.projectionMatrix,
                    this.camera.matrixWorldInverse
                )
            );

            return frustum;
        },

        doesFrustumIntersectBox: function(mesh) {
            var frustum = this.getFrustum(),
                box;

            mesh.updateMatrix();
            mesh.updateMatrixWorld();
            box = new three.Box3();
            box.setFromObject(mesh);

            return frustum.intersectsBox(box);
        },

        getDistance: function() {
            return this.camera.position.z;
        },

        updateProjectionMatrix: function() {
            this.camera.updateProjectionMatrix();
            this.camera.updateMatrixWorld();
        },

        updateSize: function() {

            // XXX(alex): Zoom ratio notes
            // Z position figures to desired camera.zoom value
            // 300: 1.829 (3.658)
            // 900: 1.0 (2.0)
            // 1500: 0.366 (0.732)

            var magic = 1100,
                zoom = magic / this.currentZoom / 2;

            this.camera.zoom = zoom;
            this.camera.left = this.cartogram.width / -2;
            this.camera.right = this.cartogram.width / 2;
            this.camera.top = this.cartogram.height / 2;
            this.camera.bottom = this.cartogram.height / -2;

            this.camera.updateProjectionMatrix();

            this.controls.handleResize();

            this._updateControlsSettings();
        },

        update: function() {
            if (this.enableInteraction) {
                // Update lookAt here, the camera controls depend on it,
                // otherwise we get weird rotations
                var target = this.camera.position.clone();
                this.camera.userData.target.setX(target.x);
                this.camera.userData.target.setY(target.y);

                this.controls.update();
            }

            if (this.currentZoom !== this.camera.position.z) {
                this.currentZoom = this.camera.position.z;
                this.updateSize();
            }
        },

        getAnimatableObject: function() {
            return this.camera;
        },

        animate: function(attrs, options) {
            var promise = this.cartogram.animationManager.add({
                cartogramObject: this,
                duration: options.duration,
                attrs: attrs
            }).then(_.bind(function(worker) {
                this.controls.target.x = attrs.position.x;
                this.controls.target.y = attrs.position.y;

                if (options.blockEvents === true) {
                    this._eventsBlocked = false;
                }

                // XXX Maybe we need a `motion` event to cover zoom and pan?
                this.trigger('zoomed', {
                    scale: attrs.position.z
                });
                this.trigger('panned');
            }, this));

            if (options.blockEvents === true) {
                this._eventsBlocked = true;
            }

            return promise;
        },

        /**
         * Pans camera to a given x,y position
         * @param  {THREE.Vector2} position - x,y location to pan to
         * @param  {integer} duration - Animation duration in milliseconds
         * @return {Promise} AnimationWorker promise
         */
        panToPosition: function(position, duration) {
            if (!duration) {
                // Move camera immediately
                this.camera.position.x = this.controls.target.x = position.x;
                this.camera.position.y = this.controls.target.y = position.y;
                this.trigger('panned');
            } else {
                return this.animate({
                    position: new three.Vector3(
                        position.x,
                        position.y,
                        this.camera.position.z
                    )
                }, {
                    duration: duration,
                    blockEvents: true
                });
            }
        },

        /**
         * Zoom camera to a given `Z`
         * @param  {float} z - Z level to zoom to, automatically constrained by `minZoom` and `maxZoom`.
         * @param  {integer} duration - Animation duration in milliseconds
         * @return {Promise} AnimationWorker promise
         */
        zoomTo: function(z, duration) {
            return this.animate({
                position: new three.Vector3(
                    this.camera.position.x,
                    this.camera.position.y,
                    z
                )
            }, {
                duration: duration,
                blockEvents: true
            });
        },

        /**
         * Pan and zoom camera to a given x,y,z position
         * @param  {THREE.Vector3} position - x,y,z location to pan and zoom to
         * @param  {integer} duration - Animation duration in milliseconds
         * @return {Promise} AnimationWorker promise
         */
        panAndZoomToPosition: function(position, duration) {
            return this.animate({
                position: position
            }, {
                duration: duration,
                blockEvents: true
            });
        },

        /**
         * Convert a shape matrix to a screen position
         *
         * @param  { THREE.Matrix } matrix world coordinates
         * @return { THREE.Vector2 } screen coordinates
         */
        worldToScreenPosition: function(matrix) {
            var position = new three.Vector3();

            position.setFromMatrixPosition(matrix);
            return this.worldToScreenPositionVector(position);
        },

        worldToScreenPositionVector: function(position) {
            var percX, percY, left, top,
                vector = new three.Vector3(position.x, position.y, -1);

            vector.project(this.camera);

            percX = (vector.x + 1) / 2;
            percY = (-vector.y + 1) / 2;
            left = percX * this.cartogram.width;
            top = percY * this.cartogram.height;
            return new three.Vector2(left, top);
        },

        screenToWorldPosition: function(position) {
            var vector = new three.Vector3(),
                direction, distance;

            vector.set(
                (position.x / this.cartogram.width) * 2 - 1,
                -(position.y / this.cartogram.height) * 2 + 1,
                0.5
            );
            vector.unproject(this.camera);

            // debugger;

            direction = vector.sub(this.camera.position).normalize();
            distance = -this.camera.position.z / direction.z;
            return this.camera.position.clone().add(direction.multiplyScalar(distance));
        },

        zoomOut: function() {
            var newDistance = false,
                distance = this.getDistance();

            _.each(this.scales, function(val) {
                if (distance < val && !newDistance) {
                    newDistance = val;
                }
            });

            if (newDistance) {
                this.zoomTo(newDistance, 300);
            }
        },

        zoomIn: function() {
            var newDistance = false,
                distance = this.getDistance();

            _.each(this.scales, function(val) {
                if (distance > val) {
                    newDistance = val;
                }
            });

            if (newDistance) {
                this.zoomTo(newDistance, 300);
            }
        },

        panLeft: function() {
            this.panToPosition({
                x: this.camera.position.x - this.options.step,
                y: this.camera.position.y
            }, 300);
        },

        panRight: function() {
            this.panToPosition({
                x: this.camera.position.x + this.options.step,
                y: this.camera.position.y
            }, 300);
        },

        panUp: function() {
            this.panToPosition({
                x: this.camera.position.x,
                y: this.camera.position.y + this.options.step
            }, 300);
        },

        panDown: function() {
            this.panToPosition({
                x: this.camera.position.x,
                y: this.camera.position.y - this.options.step
            }, 300);
        }

    });

    return Camera;
});
