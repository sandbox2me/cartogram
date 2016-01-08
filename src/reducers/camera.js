import { Map } from 'immutable';
import createReducer from 'utils/create_reducer';

const initialState = Map({
    maxZoom: 2000,
    minZoom: 50,
    currentZoom: 300,
    position: { x: 0, y: 0 }
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
        return state.set('position', action.position);
    }
};

const reducer = createReducer(handlers, initialState);

export default reducer;
