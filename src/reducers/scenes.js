import { List, Map } from 'immutable';
import createReducer from 'utils/create_reducer';

const initialState = Map({
    camera: Map({
        maxZoom: 2000,
        minZoom: 50,
        currentZoom: 300,
        position: { x: 0, y: 0 }
    }),

    actors: Map({}),
    groups: List([]),

    meshes: List([]),
    materials: List([]),
});


const handlers = {
    'UPDATE_CAMERA_POSITION': (state, action) => {
        let scene = state.get('scenes').get(action.scene);
        let camera = scene.get('camera');

        camera = camera.set('position', action.position);

        return state.set('camera', camera);
    },

    'ADD_ACTOR': (state, action) => {
        let actors = state.get('actors');

        actors = actors.set(action.actor.name, action.actor);

        return state.set('actors', actors);
    },

    'ADD_GROUP': (state, action) => {
        let groups = state.get('groups');

        groups = groups.push(action.group);

        return state.set('groups', groups);
    },
};

const reducer = createReducer(handlers, initialState);

export default reducer;
