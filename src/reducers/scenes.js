import { List, Map } from 'immutable';

const initialState = Map({
    camera: Map({
        maxZoom: 2000,
        minZoom: 50,
        currentZoom: 100,
        position: { x: 0, y: 0 }
    }),

    actors: List([]),
    groups: List([]),

    actorMap: Map({}),

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

        actors = actors.push(action.actor);

        return state.set('actors', actors);
    },

    'ADD_GROUP': (state, action) => {
        let groups = state.get('groups');

        groups = groups.push(action.group);

        return state.set('groups', groups);
    },
};

const reducer = (state = initialState, action) => {
    if (!(action.type in handlers)) {
        return state;
    }
    return handlers[action.type](state, action);
};

export default reducer;
