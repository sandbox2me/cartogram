define(function(require) {
    'use strict';

    var _ = require('underscore'),
        three = require('three');

    var Interaction = function(cartogram) {
        _.bindAll(
            this,
            'updateMousePosition',
            'handleMouseOut',
            'handleMouseMove',
            'handleMouseDown',
            'handleMouseUp',
            'handleClick',
            'handleDoubleClick',
            'handleLongPress',
            'handleTouchStart',
            'handleTouchEnd',
            'handleTouchMove',
            'handleTouchCancel'
        );

        this.cartogram = cartogram;
        this.mousePosition = new three.Vector2(-Infinity, -Infinity);
        this._previousMousePosition = this.mousePosition.clone();

        this.raycaster = new three.Raycaster();

        this.cartogram.renderer.domElement.addEventListener('mouseout', this.handleMouseOut, false);
        this.cartogram.renderer.domElement.addEventListener('mousemove', this.handleMouseMove, false);
        this.cartogram.renderer.domElement.addEventListener('mousedown', this.handleMouseDown, false);
        this.cartogram.renderer.domElement.addEventListener('mouseup', this.handleMouseUp, false);
        this.cartogram.renderer.domElement.addEventListener('click', this.handleClick, false);
        this.cartogram.renderer.domElement.addEventListener('dblclick', this.handleDoubleClick, false);

        this.cartogram.renderer.domElement.addEventListener('touchstart', this.handleTouchStart, false);
        this.cartogram.renderer.domElement.addEventListener('touchend', this.handleTouchEnd, false);
        this.cartogram.renderer.domElement.addEventListener('touchmove', this.handleTouchMove, false);
        this.cartogram.renderer.domElement.addEventListener('touchcancel', this.handleTouchCancel, false);

        this.longPressDelay = 1000;
    };

    Interaction.prototype = {
        _resetMouse: function() {
            this.mousePosition.offScreen = true;
            this.mousePosition.set(-Infinity, -Infinity);
        },

        updateMousePosition: function(e) {
            var height = this.cartogram.renderer.domElement.scrollHeight,
                width = this.cartogram.renderer.domElement.scrollWidth,
                elBBox = this.cartogram.renderer.domElement.getBoundingClientRect(),
                touches = e.changedTouches,
                x, y;

            this._previousMousePosition.copy(this.mousePosition);

            if (touches && touches.length) {
                x = (((touches[0].pageX - elBBox.left) / width) * 2) - 1;
                y = (-((touches[0].pageY - elBBox.top) / height) * 2) + 1;
            } else {
                x = (((e.clientX - elBBox.left) / width) * 2) - 1;
                y = (-((e.clientY - elBBox.top) / height) * 2) + 1;
            }

            this.mousePosition.set(x, y);
            this.mousePosition.offScreen = false;
        },

        handleMouseOut: function() {
            if (this.intersected) {
                this.intersected.shape.trigger('mouseout', this.intersected.shape, this.intersected);
            }
            this._resetMouse();
        },

        handleMouseMove: function(e) {
            this.updateMousePosition(e);
            this.isDragging = this.hasMouseDown;

            if (e.changedTouches) {
            }

            if (!this.mousePosition.equals(this._previousMousePosition)) {
                this.cartogram.paper.trigger('mousemove', e, this);
            }
        },

        handleMouseDown: function(e) {
            this.hasMouseDown = true;

            if (this.intersected) {
                this.intersected.shape.trigger('mousedown', this.intersected.shape, e, this);
            } else {
                this.cartogram.paper.trigger('mousedown', e, this);
            }
        },

        handleMouseUp: function(e) {
            this.isDragging = this.hasMouseDown = false;
            if (this.intersected) {
                this.intersected.shape.trigger('mouseup', this.intersected.shape, e, this);
            } else {
                this.cartogram.paper.trigger('mouseup', e, this);
            }
        },

        handleClick: function(e) {
            // A mousedown on a shape + a drag off of the shape shouldn't trigger a click event
            var intersected;

            if (e.changedTouches) {
                // We don't want touch events to trigger a click, re: iOS 300ms
                // click delay for taps lasting less than ~125ms (http://developer.telerik.com/featured/300-ms-click-delay-ios-8/)
                this.handleTouchEnd(e);
                return;
            }

            if (this.hasLongPress) {
                // Don't trigger click event if we detect this is a long click
                return;
            }

            window.clearTimeout(this.longPressTimeout);

            intersected = this.getValidIntersection();

            if (this.intersected && intersected && this.intersected.shape.id === intersected.shape.id) {
                this.intersected.shape.trigger('click', this.intersected.shape, e, this);
            } else if (!this.intersected) {
                this.cartogram.paper.trigger('click', e, this);
            }
        },
        handleDoubleClick: function(e) {
            // A mousedown on a shape + a drag off of the shape shouldn't trigger a click event
            var intersected = this.getValidIntersection();
            if (this.intersected && intersected && this.intersected.shape.id === intersected.shape.id) {
                this.intersected.shape.trigger('dblclick', this.intersected.shape, e, this);
            } else if (!this.intersected) {
                this.cartogram.paper.trigger('dblclick', e, this);
            }
        },

        handleLongPress: function(e) {
            this.hasLongPress = true;

            var intersected = this.getValidIntersection();

            if (this.intersected && intersected && this.intersected.shape.id === intersected.shape.id) {
                this.intersected.shape.trigger('longpress', this.intersected.shape, e, this);
            } else if (!this.intersected) {
                this.cartogram.paper.trigger('longpress', e, this);
            }
        },

        handleTouchStart: function(e) {
            this.cartogram.renderer.domElement.removeEventListener('mousemove', this.handleMouseMove);

            this.hasMouseDown = true;
            this.updateMousePosition(e);

            this.startLongPressDetection();

            if  (this.intersected) {
                this.intersected.shape.trigger('touchstart', this.intersected.shape, e, this);
            } else {
                this.cartogram.paper.trigger('touchstart', e, this);
            }
        },
        handleTouchEnd: function(e) {
            if (!this.hasLongPress) {
                window.clearTimeout(this.longPressTimeout);
            } else {
                // If we detect a long press, trigger a touch cancel instead
                this.handleTouchCancel(e);
                return;
            }

            if (this.intersected) {
                this.intersected.shape.trigger('touchend', this.intersected.shape, e, this);
                if (!this.isDragging) {
                    this.intersected.shape.trigger('click', this.intersected.shape, e, this);
                }
            } else {
                this.cartogram.paper.trigger('touchend', e, this);
                if (!this.isDragging) {
                    this.cartogram.paper.trigger('click', e, this);
                }
            }

            this.isDragging = this.hasMouseDown = false;
            this.mousePosition.offScreen = true;
            this._resetMouse();
        },
        handleTouchMove: function(e) {
            this.updateMousePosition(e);
            this.isDragging = true;

            if (!this.hasLongPress) {
                window.clearTimeout(this.longPressTimeout);
            }

            if (this.intersected) {
                this.intersected.shape.trigger('touchmove', this.intersected.shape, e, this);
            } else {
                this.cartogram.paper.trigger('touchmove', e, this);
            }
        },
        handleTouchCancel: function(e) {
            this.isDragging = this.hasMouseDown = false;

            if (!this.hasLongPress) {
                window.clearTimeout(this.longPressTimeout);
            }

            if (this.intersected) {
                this.intersected.shape.trigger('touchcancel', this.intersected.shape, e, this);
            } else {
                this.cartogram.paper.trigger('touchcancel', e, this);
            }
            this.handleMouseOut(e);
        },

        update: function() {
            var intersected;

            // XXX Checking for very small distance between
            // _previousMousePosition and mousePosition might be better than
            // equality checking.
            if (this.mousePosition.offScreen) {
                if (this.intersected) {
                    this.intersected.shape.trigger('mouseout', this.intersected.shape, this.intersected);
                    this.intersected = null;
                }
                return;
            }

            if (!this._previousMousePosition.equals(this.mousePosition) && this.isDragging) {
                return;
            }

            intersected = this.getValidIntersection();
            if (intersected) {
                if (!this.intersected || this.intersected.shape.id !== intersected.shape.id) {
                    if (this.intersected) {
                        this.intersected.shape.trigger('mouseout', this.intersected.shape, this.intersected);
                    }
                    this.intersected = intersected;
                    this.intersected.shape.trigger('mouseover', this.intersected.shape, this.intersected);
                }
            } else {
                if (this.intersected) {
                    this.intersected.shape.trigger('mouseout', this.intersected.shape, this.intersected);
                    this.intersected = null;
                }
            }
        },

        startLongPressDetection: function() {
            this.hasLongPress = false;
            this.longPressTimeout = window.setTimeout(this.handleLongPress, this.longPressDelay);
        },

        getValidIntersection: function() {
            var intersections = [],
                intersected,
                mouseVector = new three.Vector2(this.mousePosition.x, this.mousePosition.y),
                i, length,
                shape;

            this.raycaster.setFromCamera(mouseVector, this.cartogram.paper.getCamera());
            intersections = this.raycaster.intersectObjects(this.cartogram.paper.scene.children);

            if (intersections.length > 0){
                intersected = intersections[0];
                intersected.point.y = -intersected.point.y;

                var treesect = this.cartogram.sceneTree.searchPoint(intersected.point);

                for (i = 0, length = treesect.length; i < length; i++) {
                    shape = treesect[i][4].shape;
                    if (
                        (shape.isVisible || (shape.set && shape.set.isVisible)) &&
                        shape.isPointInside(intersected.point.x, intersected.point.y)
                    ) {
                        return {
                            shape: shape,
                            point: intersected.point
                        };
                    }
                }
            }
        }
    };

    return Interaction;
});
