/*
 * Refactored from TrackballControls from THREE.js
 *
 * TrackballControls by:
 *     Eberhard Graether / http://egraether.com/
 *     Mark Lundin  / http://mark-lundin.com
 */
import { Vector2, Vector3 } from 'three';

import autobind from 'utils/autobind';

const BUTTON_STATES = {
    NONE: -1,
};

export default class PanAndZoomCameraController {
    constructor(options) {
        this.options = options;

        this.buttonDefs = this.options.buttons;
        this.panSpeed = this.options.panSpeed || 2;

        this.button = -1;

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
        this.scene.on('mousedown', this._handleMouseDown);
        this.scene.on('wheel', this._handleMouseWheel);
    }

    @autobind
    _handleMouseDown(e) {
        if (this.button === -1) {
            this.button = e.button;
        }

        if (this.buttonDefs[this.button] === 'pan') {
            this._mouseChange = new Vector2();
            this._up = new Vector3();
            this._pan = new Vector3();

            this.panStart.copy(this.getMousePosition(e.pageX, e.pageY));
            this.panEnd.copy(this.panStart);
        }

        this.scene.on('mousemove', this._handleMouseMove);
        this.scene.on('mouseup', this._handleMouseUp);
    }

    @autobind
    _handleMouseMove(e) {
        if (this.buttonDefs[this.button] === 'pan' && !this._isLocked) {
            this.panEnd.copy(this.getMousePosition(e.pageX, e.pageY));
        }
    }

    @autobind
    _handleMouseUp(e) {
        if (this.buttonDefs[this.button] === 'pan') {
            this._mouseChange = undefined;
            this.panEnd.copy(this.getMousePosition(e.pageX, e.pageY));
        }

        this.scene.off('mousemove', this._handleMouseMove);
        this.scene.off('mouseup', this._handleMouseUp);
    }

    @autobind
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

        this._zoomStart.y += delta * 0.01;
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
