import { Map } from 'immutable';
import { OrthographicCamera, PerspectiveCamera, Vector3 } from 'three';

import { camera as cameraActions } from 'actions';

class Camera {
    constructor(store, scene) {
        this.store = store;
        this.dispatch = this.store.dispatch;

        this._scene = scene;

        this._initializeStoreObserver();
    }

    // XXX Consider extracting this into a helper...
    _select(state) {
        return state.camera.set('screenSize', state.core.get('size')).set('canvas', state.core.get('canvas'));
    }

    _initializeStoreObserver() {
        let handleChange = () => {
            let state = this.state;
            let nextState = this._select(this.store.getState());

            if (nextState !== state) {
                this.state = nextState;
                this.stateDidChange(state);
            }
        }
        this.store.subscribe(handleChange);
        handleChange();
    }

    stateDidChange(oldState) {
        if (!oldState) {
            if (this.state.get('mode') === 'perspective') {
                this._initializePerspectiveCamera();
            } else {
                this._initializeOrthographicCamera();
            }
        } else {
            this._updateCameraState(oldState);
        }
    }

    _initializeOrthographicCamera() {
        let { width, height } = this.state.get('screenSize');
        let { currentZoom, maxZoom } = this.state.toObject();

        this.camera = new OrthographicCamera(
            width / -2,
            width / 2,
            height / 2,
            height / -2,
            1,
            minZoom + 100
        );

        this.camera.position.z = currentZoom;
        this.camera.zoom = Math.abs(this.state.get('position').z - 2050) / 400;

        this.camera.updateProjectionMatrix();
    }

    _initializePerspectiveCamera() {
        let { width, height } = this.state.get('screenSize');
        let { currentZoom, minZoom } = this.state.toObject();

        this.camera = new PerspectiveCamera(
            50,
            width / height,
            1,
            minZoom + 100
        );
        this.camera.position.z = currentZoom;
    }

    _updateCameraState(oldState) {
        if (this.state.get('mode') === 'orthographic') {
            if (oldState.get('position').z !== this.state.get('position').z) {
                this.camera.zoom = Math.abs(this.state.get('position').z - 2050) / 400;
            }

            if (oldState.get('screenSize').width !== this.state.get('screenSize').width || oldState.get('screenSize').height !== this.state.get('screenSize').height) {
                let screenSize = this.state.get('screenSize');

                this.camera.left = screenSize.width / -2;
                this.camera.right = screenSize.width / 2;
                this.camera.top = screenSize.height / 2;
                this.camera.bottom = screenSize.height / -2;
            }
        } else {
            if (oldState.get('screenSize').width !== this.state.get('screenSize').width || oldState.get('screenSize').height !== this.state.get('screenSize').height) {
                let screenSize = this.state.get('screenSize');
                this.camera.aspect = screenSize.width / screenSize.height;
            }
        }

        if (oldState.get('minZoom') !== this.state.get('minZoom')) {
            this.camera.far = this.state.get('minZoom') + 1;
        }

        this.updatePosition(false);
        this.camera.updateProjectionMatrix();
    }

    getCamera() {
        return this.camera;
    }

    updatePosition(triggerChange=true) {
        let maxZoom = this.state.get('maxZoom');
        let minZoom = this.state.get('minZoom');

        if (this.camera.position.z > minZoom) {
            this.camera.position.z = minZoom;
        } else if (this.camera.position.z < maxZoom) {
            this.camera.position.z = maxZoom;
        }

        if (triggerChange) {
            this.dispatch(cameraActions.updatePosition({
                x: this.camera.position.x,
                y: this.camera.position.y,
                z: this.camera.position.z,
            }));

            _.defer(() => { this._scene.trigger('camera:motion'); })
        }
    }

    moveTo({ x, y }) {
        this.camera.position.x = x;
        this.camera.position.y = y;
        this.updatePosition();
        this._scene._needsRepaint = true;
    }

    zoomToFit({ x, y, x2, y2 }) {
        let fov = this.camera.fov;

        /*
        Using the top triangle and what we know about the model height and the vertical field of view of
        your camera (the angle between the two diagonal lines in your drawing), we can solve the problem
        using the trig function: tan(angle) = opposite / adjacent; where angle is half of your vertical
        fov angle (because we divided the space in two with the middle line), opposite is half of the
        model height (again because the space was divided in two to get right triangles), and adjacent
        is the distance the camera is from the model.

        So:
        tan( fovy / 2 ) = ( modelHeight / 2 ) / cameraDistance

        Now solve for cameraDistance:
        cameraDistance = ( modelHeight / 2 ) / tan( fovy / 2 )
        */

        let height = y2 - y;

        this.camera.position.z = (height / 2) / Math.tan(fov / 2);

        this.updatePosition();
    }

};

export default Camera;
