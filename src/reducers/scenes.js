import _ from 'lodash';
import { List, Map } from 'immutable';
import createReducer from 'utils/create_reducer';

const initialState = Map({
    cameraController: undefined,

    targetDrawCallLimit: 400,

    pendingUpdates: List([]),

    actors: Map({}),
    actorObjects: Map({}),
    groups: Map([]),

    meshes: List([]),
    materials: List([]),
});


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

        groups = groups.set(action.group.name, action.group);

        return state.set('groups', groups);
    },

    'ADD_GROUPS': (state, action) => {
        let groups = state.get('groups');
        let groupMap = {};

        action.groups.forEach((group) => {
            groupMap[group.name] = group;
        });

        groups = groups.merge(groupMap);

        return state.set('groups', groups);
    },

    'ADD_ACTOR_OBJECTS': (state, action) => {
        let actorObjects = state.get('actorObjects').merge(action.actorObjects);

        return state.set('actorObjects', actorObjects);
    },

    'ADD_MESHES': (state, action) => {
        let meshes = state.get('meshes');

        // XXX Map actors to meshes
        meshes = meshes.merge(action.meshes);

        return state.set('meshes', meshes);
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
                actor.definition.position = actor.position = position;
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
