export default function createReducer(handlers, initialState) {
    return function (state = initialState, action) {
        if (!(action.type in handlers)) {
            return state;
        }
        return handlers[action.type](state, action);
    };
}
