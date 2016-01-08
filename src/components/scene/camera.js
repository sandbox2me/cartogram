import { Map } from 'immutable';
import { OrthographicCamera, PerspectiveCamera } from 'three';

class Camera {
    constructor() {}

    setState(newState) {
        let oldState = this.state;

        this.state = newState;

        if (!oldState) {
            this._initializePerspectiveCamera();
        } else {
            this._updateCameraState();
        }
    }

    _initializeCamera() {
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
        // this.camera.cameraObject = this;
        // this.camera._target = new Vector3(0, 0, 0);
        // this.camera.lookAt(this.camera._target);
        this.camera.position.z = currentZoom;

        // this.camera.updateProjectionMatrix();
    }

    _initializePerspectiveCamera() {
        let { width, height } = this.state.get('screenSize');
        let { currentZoom, maxZoom } = this.state.toObject();

        this.camera = new PerspectiveCamera(
            70,
            width / height,
            1,
            1000
        );
        this.camera.position.z = 400;
    }

    _updateCameraState() {
        // debugger
    }
};

export default Camera;
