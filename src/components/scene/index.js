import _ from 'lodash';
import three from 'three';

import { scene as sceneActions, camera as cameraActions } from '../../actions';
import Camera from './camera';
import EventBinder from './events';
import EventBus from './event_bus';
import RTree from './rtree';

import { Actor, Group } from 'components';

import * as Builders from './builders';

const DELETED_BUILDER = -1;

class Scene {
    constructor(name, store) {
        this.name = name;
        this.store = store;
        this.dispatch = this.store.dispatch;

        this.eventBus = new EventBus();

        this.threeScene = new three.Scene();
        this.camera = new Camera(store, this);
        this.rtree = new RTree();
        this.typedTrees = {};
        this.builders = {};

        this._pendingChanges = [];
        this._needsRepaint = true;
        this._stateChanged = false;

        this._initializeStoreObserver();
    }

    // XXX Consider extracting this into a helper...
    _select(state) {
        return state.scene.set('fonts', state.fonts).set('core', state.core);
    }

    _initializeStoreObserver() {
        this.store.subscribe(this._updateState.bind(this));
        this._updateState();
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
        // Iterate pending changes
        if (!oldState || this.state.get('pendingUpdates') !== oldState.get('pendingUpdates')) {
            if (this.state.get('pendingUpdates').size) {
                console.log(`processing ${ this.state.get('pendingUpdates').size } updates...`);
                this._updateMeshes();
            }
        }
    }

    addCameraController(controller) {
        controller.setScene(this);

        this.dispatch(sceneActions.addCameraController(controller));
    }

    setCameraZoomRange(min, max) {
        this.dispatch(cameraActions.updateMinZoom(min));
        this.dispatch(cameraActions.updateMaxZoom(max));
    }

    addGroup(group) {
        this.addGroups([group]);
    }

    addGroups(groups) {
        let changes = [];

        groups.forEach((group) => {
            group.scene = this;
            group.actors = _.cloneDeep(group.actors);
            group.actors.forEach((actor) => {
                actor.group = group;
                actor.scene = this;
            });

            changes.push({
                type: 'group',
                action: 'create',
                group
            });
        });

        this.pushChanges(changes);
    }

    updateShape(shapeTypeInstance, properties) {
        let { actor, index } = shapeTypeInstance;
        let definitionIndex = actor.definition.shapes.indexOf(shapeTypeInstance.shape);

        this.pushChange({
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

    _updateState() {
        let state = this.state;
        let nextState = this._select(this.store.getState());

        if (nextState !== state) {
            this.state = nextState;
            this.stateDidChange(state);
        }
    }

    _update(userCallback) {
        if (typeof userCallback === 'function') {
            userCallback(this);
        }

        if (this._pendingChanges.length) {
            this.dispatch(sceneActions.commitChanges(this._pendingChanges));
            this._pendingChanges = [];
        }

        let cameraController = this.state.get('cameraController');
        if (cameraController) {
            cameraController.update();
        }
    }

    render(renderer, userCallback) {
        this._update(userCallback);

        if (this._needsRepaint) {
            renderer.render(
                this.threeScene,
                this.camera.camera
            );
            this._needsRepaint = false;
        }
    }

    _updateMeshes() {
        let pendingChanges = this.state.get('pendingUpdates');
        let hasActorChanges = false;
        let hasDestructiveAction = false;
        let destroyedGroups = [];
        let destroyedActors = [];
        let newGroups = [];
        let insertedActors = {};
        let removedActors = {};

        pendingChanges.forEach((change) => {
            let { type, action } = change;

            if (type === 'shape') {
                console.warn('Manipulating shapes is deprecated!');

                let { actor, properties } = change;
                let shape = actor.children[properties.name];
                actor.updateChild(properties);

                this.builders[properties.type].updateAttributesAtIndex(shape.index);
            }


            if (type === 'actor') {
                let { actor } = change;
                if (action === 'destroy') {
                    console.error('Actors without a group are no longer supported');
                    // destroyedActors.push(actor);
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
                } else if (action === 'create') {
                    newGroups.push(group);
                } else if (action === 'insertActor') {
                    if (!insertedActors[group.path]) {
                        insertedActors[group.path] = { group, actors: [] };
                    }
                    insertedActors[group.path].actors.push(change.actor);
                } else if (action === 'removeActor') {
                    if (!removedActors[group.path]) {
                        removedActors[group.path] = { group, actors: [] };
                    }
                    removedActors[group.path].actors.push(change.actor);
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

        if (!_.isEmpty(removedActors)) {
            console.log('Removing actors from groups...');
            _.forEach(removedActors, ::this._removeActorsFromGroup);
            hasActorChanges = true;
            hasDestructiveAction = true;
        }

        if (!_.isEmpty(insertedActors)) {
            console.log('Adding actors to groups...');
            _.forEach(insertedActors, ::this._addActorsToGroup);
            hasActorChanges = true;
            hasDestructiveAction = true;
        }

        if (destroyedGroups.length || destroyedActors.length) {
            console.log('Removing groups...')
            this._removeObjects(destroyedGroups, destroyedActors);
            hasActorChanges = true;
            hasDestructiveAction = true;
        }

        if (newGroups.length) {
            console.log('Adding groups...')
            this._addObjects(newGroups);
            hasActorChanges = true;
            hasDestructiveAction = true;
        }

        if (pendingChanges.size) {
            this.dispatch(sceneActions.resetUpdates());
            this._needsRepaint = true;
        }

        if (hasActorChanges) {
            if (hasDestructiveAction) {
                this._generateMeshes();
            }

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

        _.forEach(removedTypes, (shapes, type) => {
            let builder = this.builders[type];

            builder.removeShapes(shapes, this.state);

            let mesh = builder.mesh;
            if (!mesh.length) {
                // Mark mesh as deleted for later
                // This might get recreated during an add, that's cool.
                this.builders[type] = DELETED_BUILDER;
            }
        });

        if (removedGroupObjects.length) {
            this.dispatch(sceneActions.removeGroupObjects(removedGroupObjects));
        }
    }

    _addObjects(groups) {
        let actorObjectList = [];
        let actorObjects = {};
        let groupObjects = {};
        let types = {};

        groups.forEach((group) => {
            let name = group.name;

            // if (this.objectsAtPath(`/${ name }`)) {
            //     console.log(`Group "${ name }" exists. Continuing.`);
            //     return;
            // }
            console.log(`Generating for group "${ name }"`);

            let groupObject = new Group(group);

            groupObjects[groupObject.path] = groupObject;
            group.actors.forEach((actor) => {
                let actorObject = new Actor(actor, groupObject);

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
            // return ;
        }

        // let meshes = [];
        _.forEach(types, (shapes, type) => {
            // Use type class to create the appropriate shapes
            let builder = this.builders[type];

            if (!builder || builder === DELETED_BUILDER) {
                builder = new Builders[type](shapes, this.typedTrees[type], this.state);
                this.builders[type] = builder;
            } else {
                builder.addShapes(shapes, this.state);
            }
        });

        // Finalize state
        if (Object.keys(actorObjects).length) {
            this.dispatch(sceneActions.addActorObjects(actorObjects));
            this._needsRepaint = true;
        }
        if (Object.keys(groupObjects).length) {
            this.dispatch(sceneActions.addGroupObjects(groupObjects));
            this._needsRepaint = true;
        }
    }

    _addActorsToGroup({ group, actors }) {
        let groupObject = this.state.get('groupObjects').get(group.path);
        let actorObjectList = [];
        let types = {};

        actors.forEach((actor) => {
            let actorObject = new Actor(actor, groupObject);

            actorObjectList.push(actorObject);
            groupObject.addActorObject(actorObject);

            _.forEach(actorObject.types, (shapeList, type) => {
                if (!types[type]) {
                    types[type] = [];
                }

                types[type] = types[type].concat(shapeList);
            });
        });

        // Push updated groupObject to store or will that happen automatically?

        if (!Object.keys(types).length) {
            console.log('No changes to scene');
            return;
        } else {
            this._needsRepaint = true;
        }

        _.forEach(types, (shapes, type) => {
            // Use type class to create the appropriate shapes
            let builder = this.builders[type];

            if (!builder || builder === DELETED_BUILDER) {
                builder = new Builders[type](shapes, this.typedTrees[type], this.state);
                this.builders[type] = builder;
            } else {
                builder.addShapes(shapes, this.state);
            }
        });
    }

    _removeActorsFromGroup({ group, actors }) {
        let groupObject = this.state.get('groupObjects').get(group.path);
        let actorObjectList = [];
        let removedTypes = {};

        actors.forEach((actor) => {
            let actorObject = groupObject.actors[actor.name];
            groupObject.removeActorObject(actorObject);

            _.forEach(actorObject.types, (shapeList, type) => {
                if (!removedTypes[type]) {
                    removedTypes[type] = [];
                }

                removedTypes[type] = removedTypes[type].concat(shapeList);
            });
        });

        if (!Object.keys(removedTypes).length) {
            console.log('No changes to scene');
            return;
        } else {
            this._needsRepaint = true;
        }

        _.forEach(removedTypes, (shapes, type) => {
            let builder = this.builders[type];

            builder.removeShapes(shapes, this.state);

            let mesh = builder.mesh;
            if (!mesh.length) {
                // Mark mesh as deleted for later
                // This might get recreated during an add, that's cool.
                this.builders[type] = DELETED_BUILDER;
            }
        });
    }

    _generateMeshes() {
        let meshes = [];
        let removedMeshes = [];

        _.forEach(this.builders, (builder, type) => {
            if (builder === DELETED_BUILDER) {
                delete this.builders[type];
                removedMeshes.push(type);
            } else {
                meshes = [...meshes, ...builder.mesh];
            }
        });

        if (removedMeshes.length) {
            removedMeshes.forEach((builderType) => {
                let index = _.findIndex(this.threeScene.children, { builderType });

                this.threeScene.remove(this.threeScene.children[index]);
            });
        }

        if (meshes.length) {
            console.log(`Building ${ meshes.length } meshes`);

            meshes.forEach((mesh) => {
                let index = _.findIndex(this.threeScene.children, { builderType: mesh.builderType });

                if (index > -1) {
                    this.threeScene.children[index] = mesh;
                } else {
                    this.threeScene.add(mesh);
                }
            });
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

    _intersectionsInScreenRegion(bbox) {
        let worldOrigin = this.screenToWorldPosition({ x: bbox.x, y: bbox.y });
        let worldDest = this.screenToWorldPosition({ x: bbox.x2, y: bbox.y2 });

        return this.rtree.search({
            x: worldOrigin.x,
            y: worldOrigin.y,
            x2: worldDest.x,
            y2: worldDest.y
        });
    }

    actorsInScreenRegion(bbox) {
        let intersections = this._intersectionsInScreenRegion(bbox);

        return intersections.map((intersection) => intersection[4].actor.path);
    }

    groupsInScreenRegion(bbox) {
        let intersections = this._intersectionsInScreenRegion(bbox);
        let groups = intersections.map((intersection) => {
            return intersection[4].actor._groupObject.path;
        });
        return _.uniq(groups);
    }

    actorAtPath(path) {
        let objects = this.objectsAtPath(path);
        return objects ? objects.actor : null;
    }

    groupAtPath(path) {
        let objects = this.objectsAtPath(path);
        return objects ? objects.group : null;
    }

    registerLayers(layers) {
        this.dispatch(sceneActions.registerLayers(layers));
    }

    getLayerValue(layer) {
        return this.state.get('layers').get(layer) || 0;
    }

    forceRedraw() {
        this.dispatch(sceneActions.forceRedraw());
    }

    setCursor(style) {
        this.state.get('core').get('canvas').style.cursor = style;
    }
};

export default Scene;
