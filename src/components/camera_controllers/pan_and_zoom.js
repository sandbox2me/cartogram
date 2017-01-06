/*
 * Refactored from TrackballControls from THREE.js
 *
 * TrackballControls by:
 *     Eberhard Graether / http://egraether.com/
 *     Mark Lundin  / http://mark-lundin.com
 */
import { Vector2, Vector3 } from 'three';

const BUTTON_STATES = {
    NONE: -1,
};

export default class PanAndZoomCameraController {
    constructor(options) {
        this.options = options;

        this.buttonDefs = this.options.buttons;
        this.panSpeed = this.options.panSpeed || 2;

        this.button = -1;
        this._isPinching = false;
        this._lastPinchDistance = Infinity;

        this.panStart = new Vector2();
        this.panEnd = new Vector2();
        this._eye = new Vector3();
        this._zoomStart = new Vector2();
        this._zoomEnd = new Vector2();

        this._target = new Vector3();
        this._mouseVector = new Vector3();

        this._isLocked = false;
    }

    getMousePosition(x, y) {
        let { width, height } = this.camera.state.get('screenSize');
        let left = 0;
        let top = 0;

        this._mouseVector.set(
            (x - left) / width,
            (y - top) / height
        );
        return this._mouseVector;
    }

    setScene(scene) {
        this.scene = scene;
        this.camera = scene.camera;
        this.threeCamera = this.camera.camera;
        this.canvas = this.camera.state.get('canvas');

        this._target = this.threeCamera.position.clone();
        this._target.z = 0;
        this.threeCamera.lookAt(this._target);

        this._registerInputHandlers();
    }

    _registerInputHandlers() {
        this.scene.on('mousedown', ::this._handleMouseDown);
        this.scene.on('touchstart', ::this._handleTouchStart);

        this.scene.on('wheel', ::this._handleMouseWheel);
    }

    _initializePan(x, y) {
        this._mouseChange = new Vector2();
        this._up = new Vector3();
        this._pan = new Vector3();

        this.panStart.copy(this.getMousePosition(x, y));
        this.panEnd.copy(this.panStart);
    }

    _handleMouseDown(e) {
        if (this.button === -1) {
            this.button = e.buttons || e.which;
        }

        if (this.buttonDefs[this.button] === 'pan') {
            this._initializePan(e.pageX, e.pageY);
        }

        this.scene.on('mousemove', ::this._handleMouseMove);
        this.scene.on('mouseup', ::this._handleMouseUp);
    }

    _handleTouchStart(e) {
        let touchCount = e.touches.length;

        if (touchCount === 1 || touchCount > 2) {
            // Panning
            let touch = e.touches[0];
            this._initializePan(touch.pageX, touch.pageY);
        } else if (touchCount === 2) {
            // Zooming
            this._isPinching = true;
        }

        this.scene.on('touchmove', ::this._handleTouchMove);
        this.scene.on('touchend', ::this._handleMouseUp);
    }

    _handleTouchMove(e) {
        // Only care about the first touch, ignore multi touches
        // FIXME: zooming will use two touches, panning a single touch.
        let touchCount = e.touches.length;

        if (this._isLocked) {
            return;
        }

        if (touchCount === 1 || touchCount > 2) {
            let touch = e.touches[0];

            this.panEnd.copy(this.getMousePosition(touch.pageX, touch.pageY));
        } else if (touchCount === 2) {
            var distance = Math.sqrt(
                (e.touches[0].pageX - e.touches[1].pageX) * (e.touches[0].pageX - e.touches[1].pageX) +
                (e.touches[0].pageY - e.touches[1].pageY) * (e.touches[0].pageY - e.touches[1].pageY)
            );

            this._handlePinch(distance);
        }
    }

    _handleMouseMove(e) {
        if (e.buttons === 0 || e.which === 0) {
            this._handleMouseUp(e);
            return;
        }

        if (this.buttonDefs[this.button] === 'pan' && !this._isLocked) {
            this.panEnd.copy(this.getMousePosition(e.pageX, e.pageY));
        }
    }

    _handleMouseUp(e) {
        if (this.buttonDefs[this.button] === 'pan' || (e.touches && e.touches.length === 1)) {
            this._mouseChange = undefined;
            this.panEnd.copy(this.getMousePosition(e.pageX, e.pageY));
        }

        this.button = -1;
        this._lastPinchDistance = Infinity;

        this.scene.off('mousemove', ::this._handleMouseMove);
        this.scene.off('touchmove', ::this._handleMouseMove);

        this.scene.off('mouseup', ::this._handleMouseUp);
        this.scene.off('touchend', ::this._handleMouseUp);
    }

    _handleMouseWheel(e) {
        e.preventDefault();
        e.stopPropagation();

        let delta = 0;

        if (e.deltaY) {
            // Most browsers support deltaY from the wheel event
            delta = -e.deltaY;
        } else if (e.detail) {
            // Firefox versions
            delta = -e.detail;
        } else if (e.wheelDelta) {
            delta = e.wheelDelta / 40;
        }

        let velocityMultiplier = 0.01;

        if (navigator.userAgent.indexOf('irefox') > -1) {
            velocityMultiplier = 0.05;
        }

        this._zoomStart.y += delta * velocityMultiplier;
    }

    _handlePinch(distance) {
        if (this._lastPinchDistance === Infinity) {
            this._lastPinchDistance = distance;
        }

        let delta = distance - this._lastPinchDistance;
        this._zoomStart.y += delta * 0.02;

        console.log(delta, distance, this._lastPinchDistance)

        this._lastPinchDistance = distance;
    }

    doPan() {
        if (!this._mouseChange) {
            return;
        }

        this._mouseChange.copy(this.panEnd).sub(this.panStart);
        if (this._mouseChange.lengthSq()) {
            this._mouseChange.multiplyScalar(this._eye.length() * this.panSpeed);

            this._pan.copy(this._eye).cross(this.threeCamera.up).setLength(this._mouseChange.x);
            this._pan.add(this._up.copy(this.threeCamera.up).setLength(this._mouseChange.y));

            this.threeCamera.position.add(this._pan);
            this._target.add(this._pan);
            this.camera.updatePosition();

            this.panStart.copy(this.panEnd);
            this.scene._needsRepaint = true;
        }
    }

    doZoom() {
        let factor = 1.0 + ( this._zoomEnd.y - this._zoomStart.y ) * 0.2; //this.zoomSpeed;

        if (factor !== 1.0 && factor > 0.0) {
            this._eye.multiplyScalar(factor);
            this._zoomStart.copy( this._zoomEnd );

            this.threeCamera.position.addVectors(this._target, this._eye);
            console.log('pan and zoom: ', this.threeCamera.position.z)
            this.threeCamera.lookAt(this._target);
            this.camera.updatePosition();
            this.scene._needsRepaint = true;
        }
    }

    update() {
        if (this._isLocked) {
            return;
        }

        this._target = this.threeCamera.position.clone();
        this._target.z = 0;
        this._eye.subVectors(this.threeCamera.position, this._target);

        this.doZoom();
        this.doPan();
    }

    lock() {
        this._isLocked = true;
    }

    unlock() {
        this._isLocked = false;
    }
};
