import { Map } from 'immutable';
import { OrthographicCamera, PerspectiveCamera, Vector3 } from 'three';

import { camera as cameraActions } from 'actions';

class Camera {
    constructor(store) {
        this.store = store;
        this.dispatch = this.store.dispatch;

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
            maxZoom + 100
        );

        this.camera.position.z = currentZoom;
        this.camera.zoom = Math.abs(this.state.get('position').z - 2050) / 400;

        this.camera.updateProjectionMatrix();
    }

    _initializePerspectiveCamera() {
        let { width, height } = this.state.get('screenSize');
        let { currentZoom, maxZoom } = this.state.toObject();

        this.camera = new PerspectiveCamera(
            50,
            width / height,
            1,
            maxZoom + 100
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
        this.camera.updateProjectionMatrix();

    }

    getCamera() {
        return this.camera;
    }

    updatePosition() {
        let maxZoom = this.state.get('maxZoom');
        let minZoom = this.state.get('minZoom');

        if (this.camera.position.z > maxZoom) {
            this.camera.position.z = maxZoom;
        } else if (this.camera.position.z < minZoom) {
            this.camera.position.z = minZoom;
        }

        this.dispatch(cameraActions.updatePosition({
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z,
        }));
    }

};

export default Camera;
