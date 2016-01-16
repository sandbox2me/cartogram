import { List, Map } from 'immutable';
import _ from 'lodash';
import three from 'three';

import { scene as sceneActions } from '../../actions';
import Camera from './camera';
import RTree from './rtree';

import Actor from '../actor';
import * as Types from '../../types';

import * as Builders from './builders';


class Scene {
    constructor(name, store) {
        this.name = name;
        this.store = store;
        this.dispatch = this.store.dispatch;

        this.threeScene = new three.Scene();
        this.camera = new Camera(store);
        this.rtree = new RTree();
        this.typedTrees = {};

        this._initializeStoreObserver();
    }

    // XXX Consider extracting this into a helper...
    _select(state) {
        return state.scene.set('fonts', state.fonts);
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
        actor.scene = this;
        this.dispatch(sceneActions.addActor(actor));
    }

    addGroup(group) {
        group.scene = this;
        group.actors.forEach((actor) => { actor.scene = this; });
        this.dispatch(sceneActions.addGroup(group));
    }

    addGroups(groups) {
        groups.forEach((group) => { group.scene = this; });
        this.dispatch(sceneActions.addGroups(groups));
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

    render(renderer, userCallback) {
        this.update(userCallback);

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

                _.forEach(actorObject.types, (shapeList, type) => {
                    if (!types[type]) {
                        types[type] = [];
                        this.typedTrees[type] = new RTree();
                    }

                    for(let i = 0; i < shapeList.length; i++) {
                        types[type].push(shapeList[i]);
                    }
                });
            });
        });

        this.state.get('actors').forEach((actor, name) => {
            console.log(`Generating for actor "${ name }"`);
            let actorObject = new Actor(actor);

            console.log(actorObject.bbox);

            _.forEach(actorObject.types, (shapeList, type) => {
                if (!types[type]) {
                    types[type] = [];
                    this.typedTrees[type] = new RTree();
                }
                types[type] = [...types[type], ...shapeList];
                this.rtree.insertShapes(shapeList);
                this.typedTrees[type].insertShapes(shapeList);
            });

            actorObjects.push(actorObject);
        });

        this.rtree.insertActors(actorObjects);

        // XXX Implement rtree based mesh grouping optimization in the future
        console.log('Building meshes');
        let meshes = [];
        _.forEach(types, (shapes, type) => {
            if (type === 'PointCircle' && this.usePointClouds) {
                // Generate point cloud
                let cloud = new Builders.PointCloud(shapes);

                meshes.push(cloud.getMesh());
            } else {
                // Use type class to create the appropriate shapes
                let builder = new Builders[type](shapes, this.typedTrees[type], this.state);
                meshes.push(builder.mesh);
            }
        });


        // Check we're within drawcall limits
        if (meshes.length > this.state.get('targetDrawCallLimit')) {
            // merge geometries now
            console.log('draw call limit passed!')

            // Split meshes into smaller master Object3Ds
            let i = 0;
            let groups = [new three.Object3D(), new three.Object3D()];
            for (i; i < meshes.length; i++) {
                groups[i % 2].add(meshes[i]);
            }

            meshes = groups;
        }

        if (meshes.length) {
            this.threeScene.add(...meshes);
            this.dispatch(sceneActions.addMeshes(meshes));
        }
    }
};

export default Scene;
