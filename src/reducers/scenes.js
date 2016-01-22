import _ from 'lodash';
import { List, Map } from 'immutable';
import createReducer from 'utils/create_reducer';

const initialState = Map({
    cameraController: undefined,

    targetDrawCallLimit: 400,

    pendingUpdates: List([]),

    actors: Map({}),
    actorObjects: Map({}),
    groupObjects: Map({}),
    groups: Map([])
});

const defaultGroupDefinition = {
    name: 'group',
    position: { x: 0, y: 0, z: 0 },
    angle: 0,
    rotateActors: true,
    actors: []
};

const handlers = {
    'ADD_CAMERA_CONTROLLER': (state, action) => {
        return state.set('cameraController', action.controller);
    },

    'ADD_ACTOR': (state, action) => {
        let actors = state.get('actors');

        actors = actors.set(action.actor.name, action.actor);

        return state.set('actors', actors);
    },

    'ADD_GROUP': (state, action) => {
        let groups = state.get('groups');

        groups = groups.set(action.group.name, _.merge({}, defaultGroupDefinition, action.group));

        return state.set('groups', groups);
    },

    'ADD_GROUPS': (state, action) => {
        let groups = state.get('groups');
        let groupMap = {};

        action.groups.forEach((group) => {
            groupMap[group.name] = _.merge({}, defaultGroupDefinition, action.group);
        });

        groups = groups.merge(groupMap);

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
                let { type, actor, index, definitionIndex, properties } = change;
                let shapes = [...actor.definition.shapes];
                shapes[definitionIndex] = properties;

                actor.definition.shapes = shapes;
            }

            if (change.type === 'actor') {
                let { actor, position } = change;

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
                    actor.definition.position = position;
                    actor.position = position;
                }
            }

            if (change.type === 'group') {
                let { group, data } = change;

                if (change.action === 'destroy') {
                    groups = groups.delete(group.name);
                    state = state.set('groups', groups);
                } else {
                    _.merge(group.definition, data);
                }
            }
            updateList.push(change);
        });

        pendingUpdates = pendingUpdates.push(...updateList);
        return state.set('pendingUpdates', pendingUpdates);
    },

    'RESET_UPDATES': (state, action) => {
        return state.set('pendingUpdates', List([]));
    }
};

const reducer = createReducer(handlers, initialState);

export default reducer;
