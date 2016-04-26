import _ from 'lodash';
import { List, Map, OrderedMap } from 'immutable';
import createReducer from 'utils/create_reducer';
import { degToRad } from 'utils/math';

import { Scene } from 'three';


const initialState = Map({
    cameraController: undefined,

    targetDrawCallLimit: 400,

    pendingUpdates: List([]),

    layers: OrderedMap({
        default: 0
    }),
    sceneLayers: OrderedMap({
        default: new Scene(),
    }),

    actors: Map({}),
    actorObjects: Map({}),
    groupObjects: Map({}),
    groups: Map([])
});

const defaultGroupDefinition = {
    name: 'group',
    position: { x: 0, y: 0, z: 0 },
    angle: 0,
    rotateChildren: true,
    actors: []
};

const crudOrdering = {
    update: 0,
    destroy: 1,
    create: 2,
};

function basicMerge(left, right) {
    _.forEach(right, (v, k) => {
        left[k] = v;
    });

    return left;
}

function mergeMissing(obj, defaults) {
    Object.keys(defaults).forEach((k) => {
        if (!(k in obj)) {
            obj[k] = defaults[k];
        }
    });

    return obj;
}

function fixGroupAngleProperties(group) {
    if (group.angle && !group.angleRad) {
        group.angle = -1 * group.angle;
        group.angleRad = degToRad(group.angle);
        group.angleCos = Math.cos(group.angleRad);
        group.angleSin = Math.sin(group.angleRad);
    }

    return group;
}

const handlers = {
    'ADD_CAMERA_CONTROLLER': (state, action) => {
        return state.set('cameraController', action.controller);
    },

    'REGISTER_LAYERS': (state, action) => {
        let layers = state.get('layers');
        let sceneLayers = state.get('sceneLayers');
        const sceneLayerKeys = Object.keys(sceneLayers.toObject());

        layers = layers.merge(action.layers);

        let scenes = {};
        Object.keys(action.layers).forEach((layer) => {
            if (sceneLayerKeys.indexOf(layer) == -1) {
                scenes[layer] = new Scene();
            }
        });
        sceneLayers = sceneLayers.merge(scenes);

        state = state.set('layers', layers);
        return state.set('sceneLayers', sceneLayers);
    },

    'ADD_ACTOR_OBJECTS': (state, action) => {
        let actorObjects = state.get('actorObjects').merge(action.actorObjects);

        return state.set('actorObjects', actorObjects);
    },

    'ADD_GROUP_OBJECTS': (state, action) => {
        let groupObjects = state.get('groupObjects').merge(action.groupObjects);

        return state.set('groupObjects', groupObjects);
    },

    'REMOVE_GROUP_OBJECTS': (state, action) => {
        let groupObjects = state.get('groupObjects');

        action.groupObjectPaths.forEach((path) => {
            groupObjects = groupObjects.delete(path);
        });
        console.log('Removed group object')
        return state.set('groupObjects', groupObjects);
    },

    'COMMIT_CHANGES': (state, action) => {
        let { changes } = action;
        let updateList = [];
        let pendingUpdates = state.get('pendingUpdates');
        let groups = state.get('groups');

        // Ensure order of changes: update -> destroy -> create
        changes.sort((a, b) => {
            return crudOrdering[a.action] - crudOrdering[b.action];
        });

        changes.forEach((change) => {
            if (change.type === 'shape') {
                let { actor, definitionIndex, properties } = change;
                let shapes = [...actor.definition.shapes];
                shapes[definitionIndex] = properties;

                actor.definition.shapes = shapes;
            }

            if (change.type === 'actor') {
                let { actor, data } = change;

                if (change.action === 'destroy') {
                    let group = actor.group;
                    let index = _.findIndex(group.actors, { name: actor.name });
                    group.actors = _.compact(group.actors.splice(index, 1));

                    if (!group.actors.length) {
                        // Last actor destroys its parent
                        groups = groups.delete(group.name);
                        change = {
                            type: 'group',
                            action: 'destroy',
                            group
                        };
                    } else {
                        groups = groups.set(group.name, group);
                    }
                } else {
                    basicMerge(actor.definition, data);
                }
            }

            if (change.type === 'group') {
                let { group, data } = change;

                if (change.action === 'create') {
                    group = fixGroupAngleProperties(group);
                    groups = groups.set(group.name, mergeMissing(group, defaultGroupDefinition));
                } else if (change.action === 'destroy') {
                    groups = groups.delete(group.name);
                } else if (change.action === 'update') {
                    basicMerge(group.definition, data);
                }
            }
            updateList.push(change);
        });
        state = state.set('groups', groups);

        pendingUpdates = pendingUpdates.push(...updateList);
        return state.set('pendingUpdates', pendingUpdates);
    },

    'RESET_UPDATES': (state) => {
        return state.set('pendingUpdates', List([]));
    },

    'FORCE_REDRAW': (state) => {
        let groups = state.get('groupObjects');
        let actors = state.get('actorObjects');
        let updateList = [];
        let pendingUpdates = state.get('pendingUpdates');

        groups.forEach((group) => {
            updateList.push({
                type: 'group',
                action: 'update',
                group
            });
        });
        actors.forEach((actor) => {
            updateList.push({
                type: 'actor',
                action: 'update',
                actor
            });
        });

        pendingUpdates = pendingUpdates.push(...updateList);
        return state.set('pendingUpdates', pendingUpdates);
    }
};

const reducer = createReducer(handlers, initialState);

export default reducer;
