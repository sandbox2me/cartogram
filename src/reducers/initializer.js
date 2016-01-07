import {
    createStore,
    applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';
import logger from 'redux-logger';

let createStoreWithMiddleware = applyMiddleware(logger, thunk)(createStore);

export default createStoreWithMiddleware;
