import { List, Map } from 'immutable';

import createReducer from 'utils/create_reducer';

const initialState = Map({
    fonts: Map({})
});

const handlers = {
    REGISTER_FONT: (state, action) => {
        let fonts = state.get('fonts');

        fonts = fonts.set(action.name, action.font);

        return state.set('fonts', fonts);
    }
};

const reducer = createReducer(handlers, initialState);
export default reducer;
