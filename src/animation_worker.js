define(function(require) {
    'use strict';

    var three = require('three'),
        _ = require('underscore'),
        Q = require('q'),
        easing;

    easing = {
        linear: function(time, start, change, duration) {
            return change * (time / duration) + start;
        }
    };

    /**
     * AnimationWorker constructor
     * @param {object} options - Insantiation options
     * @param {Camera|Shape} options.cartogramObject - A cartogram object (camera or shape) to animate
     * @param {integer} options.duration - Duration in milliseconds for the animation to run
     * @param {object} options.attrs - Attributes to animate
     * @param {THREE.Vector3} [options.attrs.position] - New position to move to
     * @param {THREE.Vector3} [options.attrs.scale] - New destination scale
     * @param {THREE.Vector3} [options.attrs.opacity] - New destination opacity
     */
    var AnimationWorker = function(options) {
        this.options = _.extend({
                easing: 'linear'
            }, options);

        if (!this.options.cartogramObject) {
            throw new Error('Missing Cartogram object to animate');
        }

        if (!this.options.cartogramObject.getAnimatableObject) {
            throw new Error('Cartogram object has not implemented `getAnimatableObject`');
        }

        if (!this.options.duration) {
            throw new Error('Missing animation duration');
        }

        if (!this.options.attrs) {
            throw new Error('Missing attributes to animate');
        }

        this.cartogramObject = options.cartogramObject;
        this.object3d = this.cartogramObject.getAnimatableObject();
        this.duration = options.duration;
        this._timePassed = 0;

        // XXX Refactor these
        this.newPosition = options.attrs.position || new three.Vector3(0, 0, 0);
        this.startPosition = this.object3d.position.clone();
        this.positionDelta = new three.Vector3(
            this.newPosition.x - this.startPosition.x,
            this.newPosition.y - this.startPosition.y,
            this.newPosition.z - this.startPosition.z
        );

        this.newScale = options.attrs.scale;
        this.startScale = this.object3d.scale.clone();
        if (this.newScale) {
            this.scaleDelta = new three.Vector2(
                this.newScale.x - this.startScale.x,
                this.newScale.y - this.startScale.y
            );
        }

        if (this.object3d.material) {
            this.newOpacity = options.attrs.opacity;
            this.startOpacity = this.object3d.material.opacity;

            if (this.newOpacity !== undefined) {

                if (this.startOpacity === undefined) {
                    this.startOpacity = 1.0;
                }
                this.opacityDelta = this.newOpacity - this.startOpacity;
            }
        }

        this.animationDfd = Q.defer();
        this.promise = this.animationDfd.promise;

        this._easingFn = easing[this.options.easing];
    };

    AnimationWorker.prototype = {
        update: function(delta) {
            this._timePassed += delta * 1000;
            this._timePassed = Math.min(this.duration, this._timePassed);

            this.object3d.position.set(
                this._easingFn(this._timePassed, this.startPosition.x, this.positionDelta.x, this.duration),
                this._easingFn(this._timePassed, this.startPosition.y, this.positionDelta.y, this.duration),
                this._easingFn(this._timePassed, this.startPosition.z, this.positionDelta.z, this.duration)
            );

            if (this.newOpacity !== undefined) {
                var opacity = this._easingFn(this._timePassed, this.startOpacity, this.opacityDelta, this.duration);

                this.cartogramObject.attr({
                    opacity: opacity
                });
            }

            if (this.newScale !== undefined) {
                this.cartogramObject.attr({
                    width: this._easingFn(this._timePassed, this.startScale.x, this.scaleDelta.x, this.duration),
                    height: this._easingFn(this._timePassed, this.startScale.y, this.scaleDelta.y, this.duration)
                });
            }

            this.animationDfd.notify(this, this._timePassed);

            if (this._timePassed >= this.duration) {
                this.animationDfd.resolve(this);
            }
        }
    };

    return AnimationWorker;
});
