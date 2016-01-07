import { Map } from 'immutable';

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
        return state.merge(action.size);
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

const reducer = (state = initialState, action) => {
    if (!(action.type in handlers)) {
        return state;
    }
    return handlers[action.type](state, action);
};

export default reducer;
