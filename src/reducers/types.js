import { Map } from 'immutable';
import createReducer from 'utils/create_reducer';

const initialState = Map({});

const handlers = {
    'ADD_TYPE': (state, action) => {
        // Types are immutable
        if (state.has(action.typedef.name)) {
            return state;
        }

        return state.merge({
            [action.typedef.name]: action.typedef
        });
    },
    'REMOVE_TYPE_NAMED': (state, action) => {
        return state.delete(action.name);
    },
};

const reducer = createReducer(handlers, initialState);

export default reducer;
