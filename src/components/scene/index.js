import _ from 'lodash';
import three from 'three';

import { scene as sceneActions, camera as cameraActions } from '../../actions';
import Camera from './camera';
import EventBinder from './events';
import EventBus from './event_bus';
import Path from './path';
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

        this.camera = new Camera(store, this);
        this.path = new Path(this);
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
        if (oldState && oldState.get('core').get('size') !== this.state.get('core').get('size')) {
            this.trigger('screen:resized');
        }

        if (!oldState || this.state.get('pendingUpdates') !== oldState.get('pendingUpdates')) {
            if (this.state.get('pendingUpdates').size) {
                console.log(`processing ${ this.state.get('pendingUpdates').size } updates...`);
                this._updateMeshes();
            }
        }
    }

    get threeScenes() {
        return this.state.get('sceneLayers').toObject();
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
            console.log(this._pendingChanges);
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
            renderer.clear();

            _.forEach(this.threeScenes, (scene) => {
                renderer.render(scene, this.camera.camera);
                renderer.clearDepth();
            });

            this._needsRepaint = false;
        }
    }

    buildersForLayer(layer) {
        if (!this.builders[layer]) {
            this.builders[layer] = {};
        }
        return this.builders[layer];
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
        let layerChanges = {};
        let actorChanges = {};

        let layer = 'default';

        pendingChanges.forEach((change) => {
            let { type, action } = change;

            if (type === 'shape') {
                console.warn('Manipulating shapes is deprecated!');

                let { actor, properties } = change;
                let shape = actor.children[properties.name];
                actor.updateChild(properties);

                this.buildersForLayer(layer)[properties.type].updateAttributesAtIndex(shape.index);
            }

            if (type === 'actor') {
                let { actor } = change;
                let layer = actor._groupObject.layer;

                if (action === 'destroy') {
                    console.error('Actors without a group are no longer supported');
                    // destroyedActors.push(actor);
                } else {
                    _.values(actor.children).forEach((shapeTypeInstance) => {
                        if (shapeTypeInstance.shape.type === 'Text' && shapeTypeInstance.hasChangedString()) {
                            // Text objects need to recalulate chunks and sizing when the string changes
                            hasActorChanges = true;
                            hasDestructiveAction = true;
                        }

                        let builder = this.buildersForLayer(layer)[shapeTypeInstance.shape.type];
                        if (builder) {
                            builder.updateAttributesAtIndex(shapeTypeInstance.index);
                        } else {
                            console.warn(`Builder for ${ shapeTypeInstance.shape.type } type on ${ layer } layer not found when trying to update attributes for shape at ${ shapeTypeInstance.index }.`);
                        }
                    });
                }
                hasActorChanges = true;
            }

            if (type === 'group') {
                let { group } = change;
                let layer = group.layer;

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
                } else if (action === 'changeLayer') {
                    // Here we extract the group from its present mesh and move it to a layer specific mesh
                    // Allowing for nicer layering visuals with transparencies
                    let { layer, prevLayer } = change.data;
                    let { typesIndexes = {} } = layerChanges;

                    group.actorList.forEach((actor) => {
                        _.values(actor.children).forEach((shapeTypeInstance) => {
                            let type = shapeTypeInstance.shape.type;

                            if (!typesIndexes[type]) {
                                typesIndexes[type] = [];
                            }
                            typesIndexes[type].push(shapeTypeInstance.index);
                        });
                    });

                    if (!_.isEmpty(typesIndexes)) {
                        layerChanges = {
                            layer,
                            prevLayer,
                            typesIndexes,
                        };
                    }

                    hasActorChanges = true;
                    hasDestructiveAction = true;
                } else if (action === 'toTop') {
                    let typesIndexes = {};

                    group.actorList.forEach((actor) => {
                        _.values(actor.children).forEach((shapeTypeInstance) => {
                            let type = shapeTypeInstance.shape.type;

                            if (!typesIndexes[type]) {
                                typesIndexes[type] = [];
                            }
                            typesIndexes[type].push(shapeTypeInstance.index);
                        });
                    });

                    _.forEach(typesIndexes, (indexes, type) => {
                        this.buildersForLayer(layer)[type].shapesToTop(indexes);
                        this.buildersForLayer(layer)[type].reindex();
                    });

                    hasActorChanges = true;
                    hasDestructiveAction = true;
                } else {
                    group.actorList.forEach((actor) => {
                        actor._bbox = undefined;
                        _.values(actor.children).forEach((shapeTypeInstance) => {
                            if (shapeTypeInstance.shape.type === 'Text' && shapeTypeInstance.hasChangedString()) {
                                // Text objects need to recalulate chunks and sizing when the string changes
                                hasActorChanges = true;
                                hasDestructiveAction = true;
                            }

                            if (!actorChanges[layer]) {
                                actorChanges[layer] = [];
                            }
                            actorChanges[layer].push(shapeTypeInstance);
                        });
                        hasActorChanges = true;
                    });
                }
            }
        });

        if (!_.isEmpty(layerChanges)) {
            console.log('Updating layers...');
            let { typesIndexes, prevLayer, layer } = layerChanges;

            _.forEach(typesIndexes, (indexes, type) => {
                let shapes = this.buildersForLayer(prevLayer)[type].yankShapes(indexes);
                let builder = this.buildersForLayer(layer)[type];

                if (!builder) {
                    builder = new Builders[type](shapes, this.typedTrees[type], this.state);
                    this.buildersForLayer(layer)[type] = builder;
                } else {
                    builder.addShapes(shapes, this.state);
                }
            });
        }

        if (!_.isEmpty(actorChanges)) {
            console.log('Running actor changes')
            _.forEach(actorChanges, function (shapeTypeInstances, layer) {
                shapeTypeInstances.forEach(function (shapeTypeInstance) {
                    this.buildersForLayer(layer)[shapeTypeInstance.shape.type].updateAttributesAtIndex(shapeTypeInstance.index);
                }.bind(this));
            }, this);
        }

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
            let layer = actorObject._groupObject.layer;

            this.groupAtPath(actorObject.path).removeActorObject(actorObject);
            _.forEach(actorObject.types, (shapeList, shapeType) => {
                let type = `${ layer }:${ shapeType }`;

                if (!removedTypes[type]) {
                    removedTypes[type] = [];
                }

                removedTypes[type] = removedTypes[type].concat(shapeList);
            });
        });

        groups.forEach((groupObject) => {
            let { name, definition } = groupObject;
            let layer = groupObject.layer;

            console.log(`Destroying group "${ name }"`);

            removedGroupObjects.push(groupObject.path);
            definition.actors.forEach((actor) => {
                let actorObject = groupObject.actors[actor.name];

                if (actorObject === undefined) debugger;

                _.forEach(actorObject.types, (shapeList, shapeType) => {
                    let type = `${ layer }:${ shapeType }`;

                    if (!removedTypes[type]) {
                        removedTypes[type] = [];
                    }

                    removedTypes[type] = removedTypes[type].concat(shapeList);
                });
            });
        });

        _.forEach(removedTypes, (shapes, layerType) => {
            let [layer, type] = layerType.split(':');
            let builder = this.buildersForLayer(layer)[type];

            builder.removeShapes(shapes, this.state);
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
            let layer = groupObject.layer;

            groupObjects[groupObject.path] = groupObject;
            group.actors.forEach((actor) => {
                let actorObject = new Actor(actor, groupObject);

                actorObjectList.push(actorObject);
                groupObject.addActorObject(actorObject);

                _.forEach(actorObject.types, (shapeList, layerType) => {
                    let type = `${ layer }:${ layerType }`;

                    if (!types[type]) {
                        types[type] = [];
                    }

                    types[type] = types[type].concat(shapeList);
                });
            });
        });

        if (!Object.keys(types).length) {
            console.log('No changes to scene');
        }

        _.forEach(types, (shapes, layerType) => {
            // Use type class to create the appropriate shapes
            let [layer, type] = layerType.split(':');
            let builder = this.buildersForLayer(layer)[type];

            if (!builder) {
                builder = new Builders[type](shapes, this.typedTrees[type], this.state);
                this.buildersForLayer(layer)[type] = builder;
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
        let layer = groupObject.layer;

        actors.forEach((actor) => {
            let actorObject = new Actor(actor, groupObject);

            actorObjectList.push(actorObject);
            groupObject.addActorObject(actorObject);

            _.forEach(actorObject.types, (shapeList, layerType) => {
                let type = `${ layer }:${ layerType }`;

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

        _.forEach(types, (shapes, layerType) => {
            // Use type class to create the appropriate shapes
            let [layer, type] = layerType.split(':');
            let builder = this.buildersForLayer(layer)[type];

            if (!builder) {
                builder = new Builders[layers][type](shapes, this.typedTrees[type], this.state);
                this.builders[layers][type] = builder;
            } else {
                builder.addShapes(shapes, this.state);
            }
        });
    }

    _removeActorsFromGroup({ group, actors }) {
        let groupObject = this.state.get('groupObjects').get(group.path);
        let actorObjectList = [];
        let removedTypes = {};
        let layer = groupObject.layer;

        actors.forEach((actor) => {
            let actorObject = groupObject.actors[actor.name];
            groupObject.removeActorObject(actorObject);

            _.forEach(actorObject.types, (shapeList, layerType) => {
                let type = `${ layer }:${ layerType }`;

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

        _.forEach(removedTypes, (shapes, layerType) => {
            let [layer, type] = layerType.split(':');
            let builder = this.buildersForLayer(layer)[type];

            builder.removeShapes(shapes, this.state);
        });
    }

    _generateMeshes() {
        _.forEach(this.builders, (builders, layer) => {
            let meshes = [];
            let scene = this.threeScenes[layer];

            _.forEach(builders, (builder, type) => meshes.push(...builder.mesh));

            // Clear out the 3 scene's internal children state, any unneeded meshes
            // won't get renegerated.
            scene.children = [];

            if (meshes.length) {
                console.log(`Building ${ meshes.length } meshes`);
                scene.add(...meshes);
            }
        });
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

    setCursor(style, options={}) {
        if (this._lockCursorSet && options.lock !== false) {
            return;
        }

        if (options.lock !== undefined) {
            this._lockCursorSet = options.lock;
        }

        this.state.get('core').get('canvas').style.cursor = style;
    }
};

export default Scene;
