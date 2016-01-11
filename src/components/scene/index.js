import { List, Map } from 'immutable';
import _ from 'lodash';
import three from 'three';

import { scene as sceneActions } from '../../actions';
import Camera from './camera';
import RTree from './rtree';

import Actor from '../actor';
import * as Types from '../../types';

import { PointCloudBuilder } from './builders';


class Scene {
    constructor(name, store) {
        this.name = name;
        this.store = store;
        this.dispatch = this.store.dispatch;

        this.threeScene = new three.Scene();
        this.camera = new Camera(store);
        this.rtree = new RTree();

        this._initializeStoreObserver();
    }

    // XXX Consider extracting this into a helper...
    _select(state) {
        return state.scene;
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
        if (this.state.get('actors').size && !this.state.get('meshes').size) {
            // 1+ actors are in the scene, but no mesh data has been generated yet. Get to it!
            this.generateMeshes();
        } else if (this.state.get('groups').size && !this.state.get('meshes').size) {
            this.generateMeshes();
        } else if (oldState && this.state.get('actors') !== oldState.get('actors')) {
            // actors changed, update scene
            console.log('Updating scene')
        }
    }

    addCameraController(controller) {
        controller.setScene(this);

        this.dispatch(sceneActions.addCameraController(controller));
    }

    addActor(actor) {
        this.dispatch(sceneActions.addActor(actor));
    }

    addGroup(group) {
        this.dispatch(sceneActions.addGroup(group));
    }

    update(userCallback) {
        if (typeof userCallback === 'function') {
            userCallback(this);
        }

        let cameraController = this.state.get('cameraController');
        if (cameraController) {
            cameraController.update();
        }

    }

    render(renderer) {
        this.update();

        renderer.render(
            this.threeScene,
            this.camera.camera
        );
    }

    generateMeshes() {
        let actorObjects = [];
        let types = {};

        this.rtree.reset();

        this.state.get('groups').forEach((group, name) => {
            console.log(`Generating for group "${ name }"`);

            group.actors.forEach((actor) => {
                let actorObject = new Actor(actor);
                actorObjects.push(actorObject);

                actorObject.types.forEach((shapeList, type) => {
                    if (!types[type]) {
                        types[type] = [];
                    }
                    types[type] = [...types[type], ...shapeList];
                });
            });

            // this.rtree.insertActors(actorObjects);
        });

        this.state.get('actors').forEach((actor, name) => {
            console.log(`Generating for actor "${ name }"`);
            let actorObject = new Actor(actor);

            console.log(actorObject.bbox);

            actorObject.types.forEach((shapeList, type) => {
                if (!types[type]) {
                    types[type] = [];
                }
                types[type] = [...types[type], ...shapeList];
                this.rtree.insertShapes(shapeList);
            });

            actorObjects.push(actorObject);
        });

        // XXX Implement rtree based mesh grouping optimization in the future
        console.log('Building meshes');
        let meshes = [];
        _.forEach(types, (shapes, type) => {
            if (type === 'PointCircle') {
                // Generate point cloud
                let points = _.chain(shapes).pluck('type').pluck('position').value();
                let cloud = new PointCloudBuilder(points);

                meshes.push(cloud.getMesh());
            } else {
                // Use type class to create the appropriate shape
            }
        });

        if (meshes.length) {
            this.threeScene.add(...meshes);
        }
    }
};

export default Scene;
