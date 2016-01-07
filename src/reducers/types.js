import { Map } from 'immutable';

const initialState = Map({});

const handlers = {
    'ADD_TYPE': (state, action) => {
        // Types are immutable
        if (state.has(action.type.name)) {
            return state;
        }

        return state.merge({
            [action.type.name]: action.type
        });
    },
    'REMOVE_TYPE_NAMED': (state, action) => {
        return state.delete(action.name);
    },
};

const reducer = (state = initialState, action) => {
    if (!(action.type in handlers)) {
        return state;
    }
    return handlers[action.type](state, action);
};

export default reducer;
