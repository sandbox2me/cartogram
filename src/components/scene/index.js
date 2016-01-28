import _ from 'lodash';
import three from 'three';

import { scene as sceneActions } from '../../actions';
import Camera from './camera';
import EventBinder from './events';
import EventBus from './event_bus';
import RTree from './rtree';

import { Actor, Group } from 'components';

import * as Builders from './builders';


class Scene {
    constructor(name, store) {
        this.name = name;
        this.store = store;
        this.dispatch = this.store.dispatch;

        this.eventBus = new EventBus();

        this.threeScene = new three.Scene();
        this.camera = new Camera(store);
        this.rtree = new RTree();
        this.typedTrees = {};
        this.builders = {};

        this._pendingChanges = [];

        this._initializeStoreObserver();
    }

    // XXX Consider extracting this into a helper...
    _select(state) {
        return state.scene.set('fonts', state.fonts).set('core', state.core);
    }

    _initializeStoreObserver() {
        let handleChange = () => {
            let state = this.state;
            let nextState = this._select(this.store.getState());

            if (nextState !== state) {
                this.state = nextState;
                this.stateDidChange(state);
            }
        };

        this.store.subscribe(handleChange);
        handleChange();
        this.eventDispatch = new EventBinder(this);
    }

    on() {
        this.eventBus.on(...arguments);
    }
    off() {
        this.eventBus.off(...arguments);
    }
    trigger() {
        this.eventBus.trigger(...arguments);
    }

    stateDidChange(oldState) {
        if (this.state.get('actors').size && !this.state.get('actorObjects').size) {
            // 1+ actors are in the scene, but no mesh data has been generated yet. Get to it!
            this._generateMeshes();
        } else if (this.state.get('groups').size && !this.state.get('groupObjects').size) {
            this._generateMeshes();
        } else if (oldState && this.state.get('actors') !== oldState.get('actors')) {
            // actors changed, update scene
        } else if (oldState && this.state.get('groups').size > oldState.get('groups').size) {
            // actors changed, update scene
            this._addObjects();
        } else if (oldState && this.state.get('pendingUpdates') !== oldState.get('pendingUpdates') && this.state.get('pendingUpdates').size) {
            this._updateMeshes();
        }
    }

    addCameraController(controller) {
        controller.setScene(this);

        this.dispatch(sceneActions.addCameraController(controller));
    }

    addActor(actor) {
        actor = _.cloneDeep(actor);
        actor.scene = this;

        this.dispatch(sceneActions.addActor(actor));
    }

    addGroup(group) {
        group.scene = this;
        group.actors = _.cloneDeep(group.actors);
        group.actors.forEach((actor) => {
            actor.group = group;
            actor.scene = this;
        });

        this.dispatch(sceneActions.addGroup(group));
    }

    addGroups(groups) {
        groups.forEach((group) => {
            group.scene = this;
            group.actors = _.cloneDeep(group.actors);
            group.actors.forEach((actor) => {
                actor.group = group;
                actor.scene = this;
            });
        });

        this.dispatch(sceneActions.addGroups(groups));
    }

    updateShape(shapeTypeInstance, properties) {
        let { actor, index } = shapeTypeInstance;
        let definitionIndex = actor.definition.shapes.indexOf(shapeTypeInstance.shape);

        this._pendingChanges.push({
            type: 'shape',
            actor,
            index,
            definitionIndex,
            properties
        });
    }

    pushChange(change) {
        this._pendingChanges.push(change);
    }

    pushChanges(changes) {
        this._pendingChanges = this._pendingChanges.concat(changes);
    }

    objectsAtPath(path) {
        let segments = path.replace(/(^\/)|(\/$)/g, '').split('/');
        let actorObjects = this.state.get('actorObjects');
        let groupObjects = this.state.get('groupObjects');
        let objects = {};

        // Search in groups
        let groupPath = `/${ segments[0] }`;
        let group = groupObjects.get(groupPath);
        if (group) {
            // Get actor
            objects['group'] = group;

            if (!segments[1]) {
                return objects;
            }

            let actor = group.actors[segments[1]];
            if (segments[2]) {
                // Find shape
                let child = actor.children[segments[2]];
                objects['shape'] = child;
            }

            objects['actor'] = actor;
            return objects;
        }

        // Search in actors
        let actor = actorObjects.get(`/${ segments[0] }`);
        if (actor) {
            // Get actor
            if (segments[1]) {
                // Find shape
                let child = actor.children[segments[1]];
                objects['shape'] = child;
            }

            objects['actor'] = actor;
            return objects;
        }
    }

    _update(userCallback) {
        if (typeof userCallback === 'function') {
            userCallback(this);
        }

        let cameraController = this.state.get('cameraController');
        if (cameraController) {
            cameraController.update();
        }

        if (this._pendingChanges.length) {
            this.dispatch(sceneActions.commitChanges(this._pendingChanges));
            this._pendingChanges = [];
        }
    }

    render(renderer, userCallback) {
        this._update(userCallback);

        renderer.render(
            this.threeScene,
            this.camera.camera
        );
    }

    _generateMeshes() {
        let actorObjectList = [];
        let actorObjects = {};
        let groupObjects = {};
        let types = {};

        this.rtree.reset();

        this.state.get('groups').forEach((group, name) => {
            console.log(`Generating for group "${ name }"`);

            let groupObject = new Group(group);
            groupObjects[groupObject.path] = groupObject;

            group.actors.forEach((actor) => {
                let actorObject = new Actor(actor);
                actorObjectList.push(actorObject);
                groupObject.addActorObject(actorObject);

                _.forEach(actorObject.types, (shapeList, type) => {
                    if (!types[type]) {
                        types[type] = [];
                        this.typedTrees[type] = new RTree();
                    }

                    types[type] = types[type].concat(shapeList);
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

            actorObjects[`/${ name }`] = actorObject;
            actorObjectList.push(actorObject);
        });

        this.rtree.insertActors(actorObjectList);

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
                console.time('Builder create');
                let builder = new Builders[type](shapes, this.typedTrees[type], this.state);
                this.builders[type] = builder;
                meshes.push(builder.mesh);
                console.timeEnd('Builder create');
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
            this.dispatch(sceneActions.addGroupObjects(groupObjects));
            this.dispatch(sceneActions.addActorObjects(actorObjects));
        }
    }

    _addObjects() {
        let actorObjectList = [];
        let actorObjects = {};
        let groupObjects = {};
        let types = {};

        this.state.get('groups').forEach((group, name) => {
            if (this.objectsAtPath(`/${ name }`)) {
                console.log(`Group "${ name }" exists. Continuing.`);
                return;
            }
            console.log(`Generating for group "${ name }"`);

            let groupObject = new Group(group);
            groupObjects[groupObject.path] = groupObject;

            group.actors.forEach((actor) => {
                let actorObject = new Actor(actor);
                actorObjectList.push(actorObject);
                groupObject.addActorObject(actorObject);

                _.forEach(actorObject.types, (shapeList, type) => {
                    if (!types[type]) {
                        types[type] = [];
                    }

                    types[type] = types[type].concat(shapeList);
                });
            });
        });

        if (!Object.keys(types).length) {
            console.log('No changes to scene');
            return;
        }

        this.rtree.insertActors(actorObjectList);

        console.log('Building meshes');
        let meshes = [];
        _.forEach(types, (shapes, type) => {
            // Use type class to create the appropriate shapes
            let builder = this.builders[type];

            if (!builder) {
                builder = new Builders[type](shapes, this.typedTrees[type], this.state);
                this.builders[type] = builder;
            } else {
                builder.addShapes(shapes, this.state);
            }
            meshes.push(builder.mesh);
        });

        if (meshes.length) {
            meshes.forEach((mesh) => {
                let index = _.findIndex(this.threeScene.children, { builderType: mesh.builderType });

                if (index > -1) {
                    this.threeScene.children[index] = mesh;
                } else {
                    this.threeScene.add(mesh);
                }
            });
        }

        // Finalize state
        if (Object.keys(actorObjects).length) {
            this.dispatch(sceneActions.addActorObjects(actorObjects));
        }
        if (Object.keys(groupObjects).length) {
            this.dispatch(sceneActions.addGroupObjects(groupObjects));
        }
    }

    _updateMeshes() {
        let pendingChanges = this.state.get('pendingUpdates');
        let hasActorChanges = false;
        let destroyedGroups = [];
        let destroyedActors = [];

        pendingChanges.forEach((change) => {
            let { type, action } = change;

            if (type === 'shape') {
                let { actor, properties } = change;
                let shape = actor.children[properties.name];
                actor.updateChild(properties);

                this.builders[properties.type].updateAttributesAtIndex(shape.index)
            }

            if (type === 'actor') {
                let { actor } = change;
                if (action === 'destroy') {
                    destroyedActors.push(actor);
                } else {
                    _.values(actor.children).forEach((shapeTypeInstance) => {
                        this.builders[shapeTypeInstance.shape.type].updateAttributesAtIndex(shapeTypeInstance.index);
                    });
                }
                hasActorChanges = true;
            }

            if (type === 'group') {
                let { group } = change;
                if (action === 'destroy') {
                    destroyedGroups.push(group);
                } else {
                    group.actorList.forEach((actor) => {
                        actor._bbox = undefined;
                        _.values(actor.children).forEach((shapeTypeInstance) => {
                            this.builders[shapeTypeInstance.shape.type].updateAttributesAtIndex(shapeTypeInstance.index);
                        });
                        hasActorChanges = true;
                    });
                }
            }
        });

        if (destroyedGroups.length || destroyedActors.length) {
            this._removeObjects(destroyedGroups, destroyedActors);
            hasActorChanges = true;
        }

        if (pendingChanges.size) {
            this.dispatch(sceneActions.resetUpdates());
        }
        if (hasActorChanges) {
            // XXX Fix this brute-force approach
            this.rtree.reset();

            this.rtree.insertActors(this.state.get('actorObjects').toArray());
            this.state.get('groupObjects').forEach((group) => {
                this.rtree.insertActors(group.actorList);
            });
        }
    }

    _removeObjects(groups=[], actors=[]) {
        let removedGroupObjects = [];
        let removedTypes = {};

        actors.forEach((actorObject) => {
            this.groupAtPath(actorObject.path).removeActorObject(actorObject);
            _.forEach(actorObject.types, (shapeList, type) => {
                if (!removedTypes[type]) {
                    removedTypes[type] = [];
                }

                removedTypes[type] = removedTypes[type].concat(shapeList);
            });
        });

        groups.forEach((groupObject) => {
            let { name, definition } = groupObject;

            console.log(`Destroying group "${ name }"`);

            removedGroupObjects.push(groupObject.path);
            definition.actors.forEach((actor) => {
                let actorObject = groupObject.actors[actor.name];
                if (actorObject === undefined) debugger;
                _.forEach(actorObject.types, (shapeList, type) => {
                    if (!removedTypes[type]) {
                        removedTypes[type] = [];
                    }

                    removedTypes[type] = removedTypes[type].concat(shapeList);
                });
            });
        });

        let meshes = [];
        let removedMeshes = [];

        _.forEach(removedTypes, (shapes, type) => {
            let builder = this.builders[type];

            builder.removeShapes(shapes, this.state);

            let mesh = builder.mesh;
            if (mesh) {
                meshes.push(mesh);
            } else {
                delete this.builders[type];
                removedMeshes.push(type);
            }
        });

        if (removedMeshes.length) {
            removedMeshes.forEach((builderType) => {
                let index = _.findIndex(this.threeScene.children, { builderType });

                this.threeScene.remove(this.threeScene.children[index]);
            });
        }

        if (meshes.length) {
            meshes.forEach((mesh) => {
                let index = _.findIndex(this.threeScene.children, { builderType: mesh.builderType });

                if (index > -1) {
                    this.threeScene.children[index] = mesh;
                } else {
                    this.threeScene.add(mesh);
                }
            });
        }

        if (removedGroupObjects.length) {
            this.dispatch(sceneActions.removeGroupObjects(removedGroupObjects));
        }
    }

    worldToScreenPositionVector(position) {
        let { width, height } = this.state.get('core').get('size');
        let vector = new three.Vector3(position.x, position.y, -1);
        vector.project(this.camera.camera);

        let percX = (vector.x + 1) / 2;
        let percY = (-vector.y + 1) / 2;
        let left = percX * width;
        let top = percY * height;

        return new three.Vector2(left, top);
    }

    screenToWorldPosition(position) {
        let { width, height } = this.state.get('core').get('size');
        let camera = this.camera.getCamera();
        let vector = new three.Vector3();

        vector.set(
            (position.x / width) * 2 - 1,
            -(position.y / height) * 2 + 1,
            0.5
        );
        vector.unproject(camera);

        let direction = vector.sub(camera.position).normalize();
        let distance = -camera.position.z / direction.z;

        return camera.position.clone().add(direction.multiplyScalar(distance));
    }

    actorsAtWorldPosition(position) {
        let intersections = this.rtree.searchPoint(position);
        let actorPaths = intersections.map((intersection) => {
            let actor = intersection[4].actor;

            if (!actor.hasHitMask || actor.checkHitMask(position)) {
                return actor.path;
            }

            return undefined;
        });

        return _.compact(actorPaths);
    }

    actorsAtScreenPosition(position) {
        let worldPosition = this.screenToWorldPosition(position);
        return this.actorsAtWorldPosition(worldPosition);
    }

    actorsInScreenRegion(bbox) {
        let worldOrigin = this.screenToWorldPosition(bbox);
        let worldDest = this.screenToWorldPosition({ x: bbox.x + bbox.width, y: bbox.y + bbox.height });
        let intersections = this.rtree.search({
            x: worldOrigin.x,
            y: worldOrigin.y,
            x2: worldDest.x,
            y2: worldDest.y
        });

        let actorPaths = intersections.map((intersection) => {
            let actor = intersection[4].actor;

            if (!actor.hasHitMask || actor.checkHitMask(position)) {
                return actor.path;
            }

            return undefined;
        });

        return _.compact(actorPaths);
    }

    actorAtPath(path) {
        return this.objectsAtPath(path).actor;
    }

    groupAtPath(path) {
        return this.objectsAtPath(path).group;
    }
};

export default Scene;
