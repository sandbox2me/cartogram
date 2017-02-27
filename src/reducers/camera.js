import { Map } from 'immutable';
import createReducer from 'utils/create_reducer';

const initialState = Map({
    mode: 'perspective',
    minZoom: 2000,
    maxZoom: 50,
    currentZoom: 500,
    position: { x: 0, y: 0, z: 500 }
});

const handlers = {
    'UPDATE_MAX_ZOOM': (state, action) => {
        return state.set('maxZoom', action.maxZoom);
    },

    'UPDATE_MIN_ZOOM': (state, action) => {
        return state.set('minZoom', action.minZoom);
    },

    'UPDATE_CURRENT_ZOOM': (state, action) => {
        return state.set('currentZoom', action.zoom);
    },

    'UPDATE_POSITION': (state, action) => {
        return state
            .set('position', {...action.position, z: 0})
            .set('currentZoom', action.position.z);
    }
};

const reducer = createReducer(handlers, initialState);

export default reducer;
