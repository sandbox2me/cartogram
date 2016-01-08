import { Map } from 'immutable';
import createReducer from 'utils/create_reducer';

const initialState = Map({
    size: {
        width: 0,
        height: 0
    },
    el: undefined,
    canvas: undefined,
    renderer: undefined,
    resizeWithWindow: true
});

const handlers = {
    'RECEIVE_SIZE': (state, action) => {
        return state.set('size', action.size);
    },
    'RECEIVE_EL': (state, action) => {
        return state.set('el', action.el);
    },
    'RECEIVE_CANVAS': (state, action) => {
        return state.set('canvas', action.canvas);
    },
    'RECEIVE_RENDERER': (state, action) => {
        return state.set('renderer', action.renderer);
    },
};

const reducer = createReducer(handlers, initialState);

export default reducer;
