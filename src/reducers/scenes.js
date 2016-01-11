import { List, Map } from 'immutable';
import createReducer from 'utils/create_reducer';

const initialState = Map({
    cameraController: undefined,

    actors: Map({}),
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
};

const reducer = createReducer(handlers, initialState);

export default reducer;
