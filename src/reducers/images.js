import { Map } from 'immutable';

import createReducer from 'utils/create_reducer';

const initialState = Map({
    images: Map({})
});

const handlers = {
    REGISTER_IMAGE: (state, action) => {
        let images = state.get('images');

        images = images.set(action.name, action.image);

        return state.set('images', images);
    }
};

const reducer = createReducer(handlers, initialState);
export default reducer;
