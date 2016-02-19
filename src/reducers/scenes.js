import _ from 'lodash';
import { List, Map } from 'immutable';
import createReducer from 'utils/create_reducer';
import { degToRad } from 'utils/math';

const initialState = Map({
    cameraController: undefined,

    targetDrawCallLimit: 400,

    pendingUpdates: List([]),

    layers: Map({
        default: 0
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

        layers = layers.merge(action.layers);

        return state.set('layers', layers);
    },

    'ADD_ACTOR': (state, action) => {
        let actors = state.get('actors');

        actors = actors.set(action.actor.name, action.actor);

        return state.set('actors', actors);
    },

    'ADD_GROUP': (state, action) => {
        let groups = state.get('groups');

        action.group = fixGroupAngleProperties(action.group);

        groups = groups.set(action.group.name, mergeMissing(action.group, defaultGroupDefinition));

        return state.set('groups', groups);
    },

    'ADD_GROUPS': (state, action) => {
        let groups = state.get('groups');

        action.groups.forEach((group) => {
            group = fixGroupAngleProperties(group);
            groups = groups.set(group.name, mergeMissing(group, defaultGroupDefinition));
        });

        return state.set('groups', groups);
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

        return state.set('groupObjects', groupObjects);
    },

    'COMMIT_CHANGES': (state, action) => {
        let { changes } = action;
        let updateList = [];
        let pendingUpdates = state.get('pendingUpdates');
        let groups = state.get('groups');

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
                    state = state.set('groups', groups);
                } else {
                    basicMerge(actor.definition, data);
                }
            }

            if (change.type === 'group') {
                let { group, data } = change;

                if (change.action === 'destroy') {
                    groups = groups.delete(group.name);
                    state = state.set('groups', groups);
                } else {
                    basicMerge(group.definition, data);
                }
            }
            updateList.push(change);
        });

        pendingUpdates = pendingUpdates.push(...updateList);
        return state.set('pendingUpdates', pendingUpdates);
    },

    'RESET_UPDATES': (state, action) => {
        return state.set('pendingUpdates', List([]));
    },

    'FORCE_REDRAW': (state, action) => {
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
