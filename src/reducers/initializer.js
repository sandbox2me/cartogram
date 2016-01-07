import {
    createStore,
    applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);

export default createStoreWithMiddleware;
