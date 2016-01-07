import { Map } from 'immutable';
import { OrthographicCamera, Vector3 } from 'three';

class Camera {
    constructor() {}

    setState(newState) {
        let oldState = this.state;

        this.state = newState;

        if (!oldState) {
            this._initializeCamera();
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
            -1,
            maxZoom + 100
        );
        this.camera.cameraObject = this;
        this.camera._target = new Vector3(0, 0, 0);
        this.camera.lookAt(this.camera._target);
        this.camera.position.z = currentZoom;

        this.camera.updateProjectionMatrix();
    }

    _updateCameraState() {

    }
};

export default Camera;
