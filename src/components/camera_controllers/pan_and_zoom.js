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

        this._target = new Vector3();
        this._mouseVector = new Vector3();
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
        this.canvas.addEventListener('mousedown', this._handleMouseDown, false);
    }

    @autobind
    _handleMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();

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

        this.canvas.addEventListener('mousemove', this._handleMouseMove, false);
        this.canvas.addEventListener('mouseup', this._handleMouseUp, false);
    }

    @autobind
    _handleMouseMove(e) {
        if (this.buttonDefs[this.button] === 'pan') {
            this.panEnd.copy(this.getMousePosition(e.pageX, e.pageY));
        }
    }

    @autobind
    _handleMouseUp(e) {
        if (this.buttonDefs[this.button] === 'pan') {
            this._mouseChange = undefined;
            this.panEnd.copy(this.getMousePosition(e.pageX, e.pageY));
        }

        this.canvas.removeEventListener('mousemove', this._handleMouseMove);
        this.canvas.removeEventListener('mouseup', this._handleMouseUp);
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
        }
    }

    update() {
        this._eye.subVectors(this.threeCamera.position, this._target);

        this.doPan();
    }
};
