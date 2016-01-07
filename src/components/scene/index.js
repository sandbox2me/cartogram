import { Map } from 'immutable';
import three from 'three';

import Camera from './camera';
import RTree from './rtree';

class Scene {
    constructor(name, store) {
        this.name = name;
        this.store = store;
        this.dispatch = this.store.dispatch;

        this.threeScene = new three.Scene();
        this.camera = new Camera();
        this.rtree = new RTree();

        this._initializeStoreObserver();
    }

    // XXX Consider extracting this into a helper...
    _select(state) {
        return Map({
            core: state.core,
            scene: state.scene
        });
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
        this.camera.setState(
            this.state.get('scene').get('camera').set('screenSize', this.state.get('core').size)
        );
    }

    addActor(actor) {
        console.log('do something with the actor here');
    }

    render(renderer) {
        renderer.render(
            this.threeScene,
            this.camera.camera
        );
    }
};

export default Scene;
