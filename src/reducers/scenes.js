import { List, Map } from 'immutable';

const initialSceneState = Map({
    camera: Map({
        maxZoom: 100,
        minZoom: 100,
        position: { x: 0, y: 0 }
    }),

    actors: List([]),
    groups: List([]),

    actorMap: Map({}),

    meshes: List([]),
    materials: List([]),
});

const initialState = Map({
    scenes: Map({}),
    active: undefined
});

const handlers = {
    'CREATE_SCENE': (state, action) => {
        let scenes = state.get('scenes');
        scenes = scenes.set(action.sceneName, initialSceneState);
        return state.set('scenes', scenes);
    },

    'SET_ACTIVE_SCENE': (state, action) => {
        return state.set('active', action.name);
    },

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
