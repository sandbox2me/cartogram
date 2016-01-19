import { List, Map } from 'immutable';
import createReducer from 'utils/create_reducer';

const initialState = Map({
    cameraController: undefined,

    targetDrawCallLimit: 400,

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
    }
};

const reducer = createReducer(handlers, initialState);

export default reducer;
