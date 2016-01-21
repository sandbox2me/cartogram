(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("THREE"), require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["THREE", "_"], factory);
	else if(typeof exports === 'object')
		exports["Cartogram"] = factory(require("THREE"), require("_"));
	else
		root["Cartogram"] = factory(root["THREE"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _cartogram = __webpack_require__(1);
	
	var _cartogram2 = _interopRequireDefault(_cartogram);
	
	var _components = __webpack_require__(52);
	
	var components = _interopRequireWildcard(_components);
	
	var _utils = __webpack_require__(55);
	
	var utils = _interopRequireWildcard(_utils);
	
	// Merge in top level components into Cartogram library
	Object.assign(_cartogram2['default'], components, utils);
	
	exports['default'] = _cartogram2['default'];
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _three = __webpack_require__(2);
	
	var _three2 = _interopRequireDefault(_three);
	
	var _lodash = __webpack_require__(3);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _redux = __webpack_require__(4);
	
	var _reducersInitializer = __webpack_require__(14);
	
	var _reducersInitializer2 = _interopRequireDefault(_reducersInitializer);
	
	var _reducers = __webpack_require__(17);
	
	var reducers = _interopRequireWildcard(_reducers);
	
	var _actions = __webpack_require__(25);
	
	var actions = _interopRequireWildcard(_actions);
	
	var _typesInitializer = __webpack_require__(31);
	
	var _typesInitializer2 = _interopRequireDefault(_typesInitializer);
	
	var _componentsScene = __webpack_require__(37);
	
	var _componentsScene2 = _interopRequireDefault(_componentsScene);
	
	var defaultOptions = {
	    resizeCanvas: true,
	    backgroundColor: '#ffffff'
	};
	
	var Cartogram = (function () {
	    function Cartogram(el) {
	        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	        _classCallCheck(this, Cartogram);
	
	        if (el.length) {
	            // Handle jQuery selectors
	            this.el = el[0];
	        } else {
	            this.el = el;
	        }
	
	        this.options = Object.assign({}, defaultOptions, {
	            width: document.body.parentNode.clientWidth,
	            height: document.body.parentNode.clientHeight
	        }, options);
	
	        this.width = this.options.width;
	        this.height = this.options.height;
	
	        this._initializeRenderer();
	        this._initializeData();
	        this._initializeModules();
	
	        this.render = this.render.bind(this);
	    }
	
	    _createClass(Cartogram, [{
	        key: '_initializeRenderer',
	        value: function _initializeRenderer() {
	            this.renderer = new _three2['default'].WebGLRenderer();
	            this.renderer.setSize(this.width, this.height);
	            this.renderer.setClearColor(new _three2['default'].Color(this.options.backgroundColor).getHex());
	            this.renderer.setPixelRatio(window.devicePixelRatio);
	            this.renderer.sortObjects = true;
	
	            this.el.appendChild(this.renderer.domElement);
	
	            // XXX Move this to the scene component
	            if (this.options.resizeCanvas) {
	                window.addEventListener('resize', _lodash2['default'].debounce(this._updateCanvasDimensions.bind(this), 100), false);
	            }
	        }
	    }, {
	        key: '_initializeData',
	        value: function _initializeData() {
	            var rootReducer = (0, _redux.combineReducers)(reducers);
	
	            this.store = (0, _reducersInitializer2['default'])(rootReducer);
	            this.dispatch = this.store.dispatch;
	
	            // FIXME
	            this.dispatch(actions.core.updateScreenSize({
	                width: this.width,
	                height: this.height
	            }));
	
	            this.dispatch(actions.core.setRenderer(this.renderer));
	            this.dispatch(actions.core.setCanvas(this.renderer.domElement));
	
	            this._registerPrimitiveTypes();
	        }
	    }, {
	        key: '_registerPrimitiveTypes',
	        value: function _registerPrimitiveTypes() {
	            var _this = this;
	
	            // Register initial primitive types
	            (0, _typesInitializer2['default'])(function (name, typedef) {
	                _this.registerType(name, typedef);
	            });
	        }
	    }, {
	        key: '_initializeModules',
	        value: function _initializeModules() {
	            this._defaultScene = new _componentsScene2['default']('default', this.store);
	        }
	    }, {
	        key: '_updateCanvasDimensions',
	        value: function _updateCanvasDimensions() {
	            var width, height;
	
	            width = this.el.parentNode.clientWidth;
	            height = this.el.parentNode.clientHeight;
	
	            // this.postprocessing.setSize(width, height);
	            this.renderer.setSize(width, height);
	            this.renderer.setPixelRatio(window.devicePixelRatio);
	
	            this.dispatch(actions.core.updateScreenSize({
	                width: width,
	                height: height
	            }));
	        }
	
	        // Public API
	    }, {
	        key: 'registerFont',
	        value: function registerFont(name, definition) {
	            var action = actions.fonts.registerAsync;
	            if (definition.dataURI) {
	                action = actions.fonts.registerWithData;
	            } else if (definition.image) {
	                action = actions.fonts.registerWithImage;
	            } else if (definition.texture) {
	                action = actions.fonts.registerWithTexture;
	            }
	
	            this.dispatch(action(name, definition));
	        }
	    }, {
	        key: 'registerType',
	        value: function registerType(name, definition) {
	            this.dispatch(actions.types.register({
	                name: name,
	                definition: definition
	            }));
	        }
	    }, {
	        key: 'getDefaultScene',
	        value: function getDefaultScene() {
	            return this._defaultScene;
	        }
	    }, {
	        key: 'render',
	        value: function render(userCallback) {
	            if (typeof userCallback === 'function') {
	                this._userRenderCallback = userCallback;
	            }
	
	            // Do rendering loop
	            this._defaultScene.render(this.renderer, this._userRenderCallback);
	            window.requestAnimationFrame(this.render);
	        }
	    }]);
	
	    return Cartogram;
	})();
	
	exports['default'] = Cartogram;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}
	
	var _createStore = __webpack_require__(5);
	
	var _createStore2 = _interopRequireDefault(_createStore);
	
	var _utilsCombineReducers = __webpack_require__(7);
	
	var _utilsCombineReducers2 = _interopRequireDefault(_utilsCombineReducers);
	
	var _utilsBindActionCreators = __webpack_require__(11);
	
	var _utilsBindActionCreators2 = _interopRequireDefault(_utilsBindActionCreators);
	
	var _utilsApplyMiddleware = __webpack_require__(12);
	
	var _utilsApplyMiddleware2 = _interopRequireDefault(_utilsApplyMiddleware);
	
	var _utilsCompose = __webpack_require__(13);
	
	var _utilsCompose2 = _interopRequireDefault(_utilsCompose);
	
	exports.createStore = _createStore2['default'];
	exports.combineReducers = _utilsCombineReducers2['default'];
	exports.bindActionCreators = _utilsBindActionCreators2['default'];
	exports.applyMiddleware = _utilsApplyMiddleware2['default'];
	exports.compose = _utilsCompose2['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = createStore;
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}
	
	var _utilsIsPlainObject = __webpack_require__(6);
	
	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);
	
	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = {
	  INIT: '@@redux/INIT'
	};
	
	exports.ActionTypes = ActionTypes;
	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	
	function createStore(reducer, initialState) {
	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }
	
	  var currentReducer = reducer;
	  var currentState = initialState;
	  var listeners = [];
	  var isDispatching = false;
	
	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }
	
	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    listeners.push(listener);
	    var isSubscribed = true;
	
	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }
	
	      isSubscribed = false;
	      var index = listeners.indexOf(listener);
	      listeners.splice(index, 1);
	    };
	  }
	
	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!_utilsIsPlainObject2['default'](action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }
	
	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }
	
	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }
	
	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }
	
	    listeners.slice().forEach(function (listener) {
	      return listener();
	    });
	    return action;
	  }
	
	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }
	
	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });
	
	  return {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  };
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = isPlainObject;
	var fnToString = function fnToString(fn) {
	  return Function.prototype.toString.call(fn);
	};
	var objStringValue = fnToString(Object);
	
	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */
	
	function isPlainObject(obj) {
	  if (!obj || typeof obj !== 'object') {
	    return false;
	  }
	
	  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;
	
	  if (proto === null) {
	    return true;
	  }
	
	  var constructor = proto.constructor;
	
	  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === objStringValue;
	}
	
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	exports.__esModule = true;
	exports['default'] = combineReducers;
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}
	
	var _createStore = __webpack_require__(5);
	
	var _isPlainObject = __webpack_require__(6);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _mapValues = __webpack_require__(9);
	
	var _mapValues2 = _interopRequireDefault(_mapValues);
	
	var _pick = __webpack_require__(10);
	
	var _pick2 = _interopRequireDefault(_pick);
	
	/* eslint-disable no-console */
	
	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';
	
	  return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
	}
	
	function getUnexpectedStateKeyWarningMessage(inputState, outputState, action) {
	  var reducerKeys = Object.keys(outputState);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';
	
	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }
	
	  if (!_isPlainObject2['default'](inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }
	
	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return reducerKeys.indexOf(key) < 0;
	  });
	
	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}
	
	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });
	
	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }
	
	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}
	
	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */
	
	function combineReducers(reducers) {
	  var finalReducers = _pick2['default'](reducers, function (val) {
	    return typeof val === 'function';
	  });
	  var sanityError;
	
	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }
	
	  var defaultState = _mapValues2['default'](finalReducers, function () {
	    return undefined;
	  });
	
	  return function combination(state, action) {
	    if (state === undefined) state = defaultState;
	
	    if (sanityError) {
	      throw sanityError;
	    }
	
	    var hasChanged = false;
	    var finalState = _mapValues2['default'](finalReducers, function (reducer, key) {
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	      return nextStateForKey;
	    });
	
	    if (process.env.NODE_ENV !== 'production') {
	      var warningMessage = getUnexpectedStateKeyWarningMessage(state, finalState, action);
	      if (warningMessage) {
	        console.error(warningMessage);
	      }
	    }
	
	    return hasChanged ? finalState : state;
	  };
	}
	
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	'use strict';
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Applies a function to every key-value pair inside an object.
	 *
	 * @param {Object} obj The source object.
	 * @param {Function} fn The mapper function that receives the value and the key.
	 * @returns {Object} A new object that contains the mapped values for the keys.
	 */
	"use strict";
	
	exports.__esModule = true;
	exports["default"] = mapValues;
	
	function mapValues(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    result[key] = fn(obj[key], key);
	    return result;
	  }, {});
	}
	
	module.exports = exports["default"];

/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * Picks key-value pairs from an object where values satisfy a predicate.
	 *
	 * @param {Object} obj The object to pick from.
	 * @param {Function} fn The predicate the values must satisfy to be copied.
	 * @returns {Object} The object with the values that satisfied the predicate.
	 */
	"use strict";
	
	exports.__esModule = true;
	exports["default"] = pick;
	
	function pick(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    if (fn(obj[key])) {
	      result[key] = obj[key];
	    }
	    return result;
	  }, {});
	}
	
	module.exports = exports["default"];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = bindActionCreators;
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}
	
	var _mapValues = __webpack_require__(9);
	
	var _mapValues2 = _interopRequireDefault(_mapValues);
	
	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}
	
	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */
	
	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }
	
	  if (typeof actionCreators !== 'object' || actionCreators === null || actionCreators === undefined) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }
	
	  return _mapValues2['default'](actionCreators, function (actionCreator) {
	    return bindActionCreator(actionCreator, dispatch);
	  });
	}
	
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }return target;
	};
	
	exports['default'] = applyMiddleware;
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { 'default': obj };
	}
	
	var _compose = __webpack_require__(13);
	
	var _compose2 = _interopRequireDefault(_compose);
	
	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }
	
	  return function (next) {
	    return function (reducer, initialState) {
	      var store = next(reducer, initialState);
	      var _dispatch = store.dispatch;
	      var chain = [];
	
	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);
	
	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * Composes single-argument functions from right to left.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing functions from right to
	 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
	 */
	"use strict";
	
	exports.__esModule = true;
	exports["default"] = compose;
	
	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }
	
	  return function (arg) {
	    return funcs.reduceRight(function (composed, f) {
	      return f(composed);
	    }, arg);
	  };
	}
	
	module.exports = exports["default"];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _redux = __webpack_require__(4);
	
	var _reduxThunk = __webpack_require__(15);
	
	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);
	
	var _reduxLogger = __webpack_require__(16);
	
	var _reduxLogger2 = _interopRequireDefault(_reduxLogger);
	
	var logger = (0, _reduxLogger2['default'])();
	var createStoreWithMiddleware = (0, _redux.applyMiddleware)(_reduxThunk2['default'], logger)(_redux.createStore);
	
	exports['default'] = createStoreWithMiddleware;
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	function thunkMiddleware(_ref) {
	  var dispatch = _ref.dispatch;
	  var getState = _ref.getState;
	
	  return function (next) {
	    return function (action) {
	      return typeof action === 'function' ? action(dispatch, getState) : next(action);
	    };
	  };
	}
	
	module.exports = thunkMiddleware;

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	
	var repeat = function repeat(str, times) {
	  return new Array(times + 1).join(str);
	};
	var pad = function pad(num, maxLength) {
	  return repeat("0", maxLength - num.toString().length) + num;
	};
	var formatTime = function formatTime(time) {
	  return " @ " + pad(time.getHours(), 2) + ":" + pad(time.getMinutes(), 2) + ":" + pad(time.getSeconds(), 2) + "." + pad(time.getMilliseconds(), 3);
	};
	
	// Use the new performance api to get better precision if available
	var timer = typeof performance !== "undefined" && typeof performance.now === "function" ? performance : Date;
	
	/**
	 * Creates logger with followed options
	 *
	 * @namespace
	 * @property {object} options - options for logger
	 * @property {string} options.level - console[level]
	 * @property {boolean} options.duration - print duration of each action?
	 * @property {boolean} options.timestamp - print timestamp with each action?
	 * @property {object} options.colors - custom colors
	 * @property {object} options.logger - implementation of the `console` API
	 * @property {boolean} options.logErrors - should errors in action execution be caught, logged, and re-thrown?
	 * @property {boolean} options.collapsed - is group collapsed?
	 * @property {boolean} options.predicate - condition which resolves logger behavior
	 * @property {function} options.stateTransformer - transform state before print
	 * @property {function} options.actionTransformer - transform action before print
	 * @property {function} options.errorTransformer - transform error before print
	 */
	
	function createLogger() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  return function (_ref) {
	    var getState = _ref.getState;
	    return function (next) {
	      return function (action) {
	        var _options$level = options.level;
	        var level = _options$level === undefined ? "log" : _options$level;
	        var _options$logger = options.logger;
	        var logger = _options$logger === undefined ? window.console : _options$logger;
	        var _options$logErrors = options.logErrors;
	        var logErrors = _options$logErrors === undefined ? true : _options$logErrors;
	        var collapsed = options.collapsed;
	        var predicate = options.predicate;
	        var _options$duration = options.duration;
	        var duration = _options$duration === undefined ? false : _options$duration;
	        var _options$timestamp = options.timestamp;
	        var timestamp = _options$timestamp === undefined ? true : _options$timestamp;
	        var transformer = options.transformer;
	        var _options$stateTransfo = options.stateTransformer;
	        var // deprecated
	        stateTransformer = _options$stateTransfo === undefined ? function (state) {
	          return state;
	        } : _options$stateTransfo;
	        var _options$actionTransf = options.actionTransformer;
	        var actionTransformer = _options$actionTransf === undefined ? function (actn) {
	          return actn;
	        } : _options$actionTransf;
	        var _options$errorTransfo = options.errorTransformer;
	        var errorTransformer = _options$errorTransfo === undefined ? function (error) {
	          return error;
	        } : _options$errorTransfo;
	        var _options$colors = options.colors;
	        var colors = _options$colors === undefined ? {
	          title: function title() {
	            return "#000000";
	          },
	          prevState: function prevState() {
	            return "#9E9E9E";
	          },
	          action: function action() {
	            return "#03A9F4";
	          },
	          nextState: function nextState() {
	            return "#4CAF50";
	          },
	          error: function error() {
	            return "#F20404";
	          }
	        } : _options$colors;
	
	        // exit if console undefined
	
	        if (typeof logger === "undefined") {
	          return next(action);
	        }
	
	        // exit early if predicate function returns false
	        if (typeof predicate === "function" && !predicate(getState, action)) {
	          return next(action);
	        }
	
	        if (transformer) {
	          console.error("Option 'transformer' is deprecated, use stateTransformer instead");
	        }
	
	        var started = timer.now();
	        var prevState = stateTransformer(getState());
	
	        var formattedAction = actionTransformer(action);
	        var returnedValue = undefined;
	        var error = undefined;
	        if (logErrors) {
	          try {
	            returnedValue = next(action);
	          } catch (e) {
	            error = errorTransformer(e);
	          }
	        } else {
	          returnedValue = next(action);
	        }
	
	        var took = timer.now() - started;
	        var nextState = stateTransformer(getState());
	
	        // message
	        var time = new Date();
	        var isCollapsed = typeof collapsed === "function" ? collapsed(getState, action) : collapsed;
	
	        var formattedTime = formatTime(time);
	        var titleCSS = colors.title ? "color: " + colors.title(formattedAction) + ";" : null;
	        var title = "action " + formattedAction.type + (timestamp ? formattedTime : "") + (duration ? " in " + took.toFixed(2) + " ms" : "");
	
	        // render
	        try {
	          if (isCollapsed) {
	            if (colors.title) logger.groupCollapsed("%c " + title, titleCSS);else logger.groupCollapsed(title);
	          } else {
	            if (colors.title) logger.group("%c " + title, titleCSS);else logger.group(title);
	          }
	        } catch (e) {
	          logger.log(title);
	        }
	
	        if (colors.prevState) logger[level]("%c prev state", "color: " + colors.prevState(prevState) + "; font-weight: bold", prevState);else logger[level]("prev state", prevState);
	
	        if (colors.action) logger[level]("%c action", "color: " + colors.action(formattedAction) + "; font-weight: bold", formattedAction);else logger[level]("action", formattedAction);
	
	        if (error) {
	          if (colors.error) logger[level]("%c error", "color: " + colors.error(error, prevState) + "; font-weight: bold", error);else logger[level]("error", error);
	        } else {
	          if (colors.nextState) logger[level]("%c next state", "color: " + colors.nextState(nextState) + "; font-weight: bold", nextState);else logger[level]("next state", nextState);
	        }
	
	        try {
	          logger.groupEnd();
	        } catch (e) {
	          logger.log("—— log end ——");
	        }
	
	        if (error) throw error;
	        return returnedValue;
	      };
	    };
	  };
	}
	
	module.exports = createLogger;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	var _camera = __webpack_require__(18);
	
	exports.camera = _interopRequire(_camera);
	
	var _core = __webpack_require__(21);
	
	exports.core = _interopRequire(_core);
	
	var _fonts = __webpack_require__(22);
	
	exports.fonts = _interopRequire(_fonts);
	
	var _scenes = __webpack_require__(23);
	
	exports.scene = _interopRequire(_scenes);
	
	var _types = __webpack_require__(24);
	
	exports.types = _interopRequire(_types);

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _immutable = __webpack_require__(19);
	
	var _utilsCreate_reducer = __webpack_require__(20);
	
	var _utilsCreate_reducer2 = _interopRequireDefault(_utilsCreate_reducer);
	
	var initialState = (0, _immutable.Map)({
	    maxZoom: 2000,
	    minZoom: 50,
	    currentZoom: 300,
	    position: { x: 0, y: 0 }
	});
	
	var handlers = {
	    'UPDATE_MAX_ZOOM': function UPDATE_MAX_ZOOM(state, action) {
	        return state.set('maxZoom', action.maxZoom);
	    },
	
	    'UPDATE_MIN_ZOOM': function UPDATE_MIN_ZOOM(state, action) {
	        return state.set('minZoom', action.minZoom);
	    },
	
	    'UPDATE_CURRENT_ZOOM': function UPDATE_CURRENT_ZOOM(state, action) {
	        return state.set('currentZoom', action.zoom);
	    },
	
	    'UPDATE_POSITION': function UPDATE_POSITION(state, action) {
	        return state.set('position', action.position);
	    }
	};
	
	var reducer = (0, _utilsCreate_reducer2['default'])(handlers, initialState);
	
	exports['default'] = reducer;
	module.exports = exports['default'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 *  Copyright (c) 2014-2015, Facebook, Inc.
	 *  All rights reserved.
	 *
	 *  This source code is licensed under the BSD-style license found in the
	 *  LICENSE file in the root directory of this source tree. An additional grant
	 *  of patent rights can be found in the PATENTS file in the same directory.
	 */'use strict';(function(global,factory){ true?module.exports = factory():typeof define === 'function' && define.amd?define(factory):global.Immutable = factory();})(undefined,function(){'use strict';var SLICE$0=Array.prototype.slice;function createClass(ctor,superClass){if(superClass){ctor.prototype = Object.create(superClass.prototype);}ctor.prototype.constructor = ctor;}function Iterable(value){return isIterable(value)?value:Seq(value);}createClass(KeyedIterable,Iterable);function KeyedIterable(value){return isKeyed(value)?value:KeyedSeq(value);}createClass(IndexedIterable,Iterable);function IndexedIterable(value){return isIndexed(value)?value:IndexedSeq(value);}createClass(SetIterable,Iterable);function SetIterable(value){return isIterable(value) && !isAssociative(value)?value:SetSeq(value);}function isIterable(maybeIterable){return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);}function isKeyed(maybeKeyed){return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);}function isIndexed(maybeIndexed){return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);}function isAssociative(maybeAssociative){return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);}function isOrdered(maybeOrdered){return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);}Iterable.isIterable = isIterable;Iterable.isKeyed = isKeyed;Iterable.isIndexed = isIndexed;Iterable.isAssociative = isAssociative;Iterable.isOrdered = isOrdered;Iterable.Keyed = KeyedIterable;Iterable.Indexed = IndexedIterable;Iterable.Set = SetIterable;var IS_ITERABLE_SENTINEL='@@__IMMUTABLE_ITERABLE__@@';var IS_KEYED_SENTINEL='@@__IMMUTABLE_KEYED__@@';var IS_INDEXED_SENTINEL='@@__IMMUTABLE_INDEXED__@@';var IS_ORDERED_SENTINEL='@@__IMMUTABLE_ORDERED__@@'; // Used for setting prototype methods that IE8 chokes on.
	var DELETE='delete'; // Constants describing the size of trie nodes.
	var SHIFT=5; // Resulted in best performance after ______?
	var SIZE=1 << SHIFT;var MASK=SIZE - 1; // A consistent shared value representing "not set" which equals nothing other
	// than itself, and nothing that could be provided externally.
	var NOT_SET={}; // Boolean references, Rough equivalent of `bool &`.
	var CHANGE_LENGTH={value:false};var DID_ALTER={value:false};function MakeRef(ref){ref.value = false;return ref;}function SetRef(ref){ref && (ref.value = true);} // A function which returns a value representing an "owner" for transient writes
	// to tries. The return value will only ever equal itself, and will not equal
	// the return of any subsequent call of this function.
	function OwnerID(){} // http://jsperf.com/copy-array-inline
	function arrCopy(arr,offset){offset = offset || 0;var len=Math.max(0,arr.length - offset);var newArr=new Array(len);for(var ii=0;ii < len;ii++) {newArr[ii] = arr[ii + offset];}return newArr;}function ensureSize(iter){if(iter.size === undefined){iter.size = iter.__iterate(returnTrue);}return iter.size;}function wrapIndex(iter,index){ // This implements "is array index" which the ECMAString spec defines as:
	//
	//     A String property name P is an array index if and only if
	//     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
	//     to 2^32−1.
	//
	// http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
	if(typeof index !== 'number'){var uint32Index=index >>> 0; // N >>> 0 is shorthand for ToUint32
	if('' + uint32Index !== index || uint32Index === 4294967295){return NaN;}index = uint32Index;}return index < 0?ensureSize(iter) + index:index;}function returnTrue(){return true;}function wholeSlice(begin,end,size){return (begin === 0 || size !== undefined && begin <= -size) && (end === undefined || size !== undefined && end >= size);}function resolveBegin(begin,size){return resolveIndex(begin,size,0);}function resolveEnd(end,size){return resolveIndex(end,size,size);}function resolveIndex(index,size,defaultIndex){return index === undefined?defaultIndex:index < 0?Math.max(0,size + index):size === undefined?index:Math.min(size,index);} /* global Symbol */var ITERATE_KEYS=0;var ITERATE_VALUES=1;var ITERATE_ENTRIES=2;var REAL_ITERATOR_SYMBOL=typeof Symbol === 'function' && Symbol.iterator;var FAUX_ITERATOR_SYMBOL='@@iterator';var ITERATOR_SYMBOL=REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;function Iterator(next){this.next = next;}Iterator.prototype.toString = function(){return '[Iterator]';};Iterator.KEYS = ITERATE_KEYS;Iterator.VALUES = ITERATE_VALUES;Iterator.ENTRIES = ITERATE_ENTRIES;Iterator.prototype.inspect = Iterator.prototype.toSource = function(){return this.toString();};Iterator.prototype[ITERATOR_SYMBOL] = function(){return this;};function iteratorValue(type,k,v,iteratorResult){var value=type === 0?k:type === 1?v:[k,v];iteratorResult?iteratorResult.value = value:iteratorResult = {value:value,done:false};return iteratorResult;}function iteratorDone(){return {value:undefined,done:true};}function hasIterator(maybeIterable){return !!getIteratorFn(maybeIterable);}function isIterator(maybeIterator){return maybeIterator && typeof maybeIterator.next === 'function';}function getIterator(iterable){var iteratorFn=getIteratorFn(iterable);return iteratorFn && iteratorFn.call(iterable);}function getIteratorFn(iterable){var iteratorFn=iterable && (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL] || iterable[FAUX_ITERATOR_SYMBOL]);if(typeof iteratorFn === 'function'){return iteratorFn;}}function isArrayLike(value){return value && typeof value.length === 'number';}createClass(Seq,Iterable);function Seq(value){return value === null || value === undefined?emptySequence():isIterable(value)?value.toSeq():seqFromValue(value);}Seq.of = function() /*...values*/{return Seq(arguments);};Seq.prototype.toSeq = function(){return this;};Seq.prototype.toString = function(){return this.__toString('Seq {','}');};Seq.prototype.cacheResult = function(){if(!this._cache && this.__iterateUncached){this._cache = this.entrySeq().toArray();this.size = this._cache.length;}return this;}; // abstract __iterateUncached(fn, reverse)
	Seq.prototype.__iterate = function(fn,reverse){return seqIterate(this,fn,reverse,true);}; // abstract __iteratorUncached(type, reverse)
	Seq.prototype.__iterator = function(type,reverse){return seqIterator(this,type,reverse,true);};createClass(KeyedSeq,Seq);function KeyedSeq(value){return value === null || value === undefined?emptySequence().toKeyedSeq():isIterable(value)?isKeyed(value)?value.toSeq():value.fromEntrySeq():keyedSeqFromValue(value);}KeyedSeq.prototype.toKeyedSeq = function(){return this;};createClass(IndexedSeq,Seq);function IndexedSeq(value){return value === null || value === undefined?emptySequence():!isIterable(value)?indexedSeqFromValue(value):isKeyed(value)?value.entrySeq():value.toIndexedSeq();}IndexedSeq.of = function() /*...values*/{return IndexedSeq(arguments);};IndexedSeq.prototype.toIndexedSeq = function(){return this;};IndexedSeq.prototype.toString = function(){return this.__toString('Seq [',']');};IndexedSeq.prototype.__iterate = function(fn,reverse){return seqIterate(this,fn,reverse,false);};IndexedSeq.prototype.__iterator = function(type,reverse){return seqIterator(this,type,reverse,false);};createClass(SetSeq,Seq);function SetSeq(value){return (value === null || value === undefined?emptySequence():!isIterable(value)?indexedSeqFromValue(value):isKeyed(value)?value.entrySeq():value).toSetSeq();}SetSeq.of = function() /*...values*/{return SetSeq(arguments);};SetSeq.prototype.toSetSeq = function(){return this;};Seq.isSeq = isSeq;Seq.Keyed = KeyedSeq;Seq.Set = SetSeq;Seq.Indexed = IndexedSeq;var IS_SEQ_SENTINEL='@@__IMMUTABLE_SEQ__@@';Seq.prototype[IS_SEQ_SENTINEL] = true;createClass(ArraySeq,IndexedSeq);function ArraySeq(array){this._array = array;this.size = array.length;}ArraySeq.prototype.get = function(index,notSetValue){return this.has(index)?this._array[wrapIndex(this,index)]:notSetValue;};ArraySeq.prototype.__iterate = function(fn,reverse){var array=this._array;var maxIndex=array.length - 1;for(var ii=0;ii <= maxIndex;ii++) {if(fn(array[reverse?maxIndex - ii:ii],ii,this) === false){return ii + 1;}}return ii;};ArraySeq.prototype.__iterator = function(type,reverse){var array=this._array;var maxIndex=array.length - 1;var ii=0;return new Iterator(function(){return ii > maxIndex?iteratorDone():iteratorValue(type,ii,array[reverse?maxIndex - ii++:ii++]);});};createClass(ObjectSeq,KeyedSeq);function ObjectSeq(object){var keys=Object.keys(object);this._object = object;this._keys = keys;this.size = keys.length;}ObjectSeq.prototype.get = function(key,notSetValue){if(notSetValue !== undefined && !this.has(key)){return notSetValue;}return this._object[key];};ObjectSeq.prototype.has = function(key){return this._object.hasOwnProperty(key);};ObjectSeq.prototype.__iterate = function(fn,reverse){var object=this._object;var keys=this._keys;var maxIndex=keys.length - 1;for(var ii=0;ii <= maxIndex;ii++) {var key=keys[reverse?maxIndex - ii:ii];if(fn(object[key],key,this) === false){return ii + 1;}}return ii;};ObjectSeq.prototype.__iterator = function(type,reverse){var object=this._object;var keys=this._keys;var maxIndex=keys.length - 1;var ii=0;return new Iterator(function(){var key=keys[reverse?maxIndex - ii:ii];return ii++ > maxIndex?iteratorDone():iteratorValue(type,key,object[key]);});};ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;createClass(IterableSeq,IndexedSeq);function IterableSeq(iterable){this._iterable = iterable;this.size = iterable.length || iterable.size;}IterableSeq.prototype.__iterateUncached = function(fn,reverse){if(reverse){return this.cacheResult().__iterate(fn,reverse);}var iterable=this._iterable;var iterator=getIterator(iterable);var iterations=0;if(isIterator(iterator)){var step;while(!(step = iterator.next()).done) {if(fn(step.value,iterations++,this) === false){break;}}}return iterations;};IterableSeq.prototype.__iteratorUncached = function(type,reverse){if(reverse){return this.cacheResult().__iterator(type,reverse);}var iterable=this._iterable;var iterator=getIterator(iterable);if(!isIterator(iterator)){return new Iterator(iteratorDone);}var iterations=0;return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type,iterations++,step.value);});};createClass(IteratorSeq,IndexedSeq);function IteratorSeq(iterator){this._iterator = iterator;this._iteratorCache = [];}IteratorSeq.prototype.__iterateUncached = function(fn,reverse){if(reverse){return this.cacheResult().__iterate(fn,reverse);}var iterator=this._iterator;var cache=this._iteratorCache;var iterations=0;while(iterations < cache.length) {if(fn(cache[iterations],iterations++,this) === false){return iterations;}}var step;while(!(step = iterator.next()).done) {var val=step.value;cache[iterations] = val;if(fn(val,iterations++,this) === false){break;}}return iterations;};IteratorSeq.prototype.__iteratorUncached = function(type,reverse){if(reverse){return this.cacheResult().__iterator(type,reverse);}var iterator=this._iterator;var cache=this._iteratorCache;var iterations=0;return new Iterator(function(){if(iterations >= cache.length){var step=iterator.next();if(step.done){return step;}cache[iterations] = step.value;}return iteratorValue(type,iterations,cache[iterations++]);});}; // # pragma Helper functions
	function isSeq(maybeSeq){return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);}var EMPTY_SEQ;function emptySequence(){return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));}function keyedSeqFromValue(value){var seq=Array.isArray(value)?new ArraySeq(value).fromEntrySeq():isIterator(value)?new IteratorSeq(value).fromEntrySeq():hasIterator(value)?new IterableSeq(value).fromEntrySeq():typeof value === 'object'?new ObjectSeq(value):undefined;if(!seq){throw new TypeError('Expected Array or iterable object of [k, v] entries, ' + 'or keyed object: ' + value);}return seq;}function indexedSeqFromValue(value){var seq=maybeIndexedSeqFromValue(value);if(!seq){throw new TypeError('Expected Array or iterable object of values: ' + value);}return seq;}function seqFromValue(value){var seq=maybeIndexedSeqFromValue(value) || typeof value === 'object' && new ObjectSeq(value);if(!seq){throw new TypeError('Expected Array or iterable object of values, or keyed object: ' + value);}return seq;}function maybeIndexedSeqFromValue(value){return isArrayLike(value)?new ArraySeq(value):isIterator(value)?new IteratorSeq(value):hasIterator(value)?new IterableSeq(value):undefined;}function seqIterate(seq,fn,reverse,useKeys){var cache=seq._cache;if(cache){var maxIndex=cache.length - 1;for(var ii=0;ii <= maxIndex;ii++) {var entry=cache[reverse?maxIndex - ii:ii];if(fn(entry[1],useKeys?entry[0]:ii,seq) === false){return ii + 1;}}return ii;}return seq.__iterateUncached(fn,reverse);}function seqIterator(seq,type,reverse,useKeys){var cache=seq._cache;if(cache){var maxIndex=cache.length - 1;var ii=0;return new Iterator(function(){var entry=cache[reverse?maxIndex - ii:ii];return ii++ > maxIndex?iteratorDone():iteratorValue(type,useKeys?entry[0]:ii - 1,entry[1]);});}return seq.__iteratorUncached(type,reverse);}function fromJS(json,converter){return converter?fromJSWith(converter,json,'',{'':json}):fromJSDefault(json);}function fromJSWith(converter,json,key,parentJSON){if(Array.isArray(json)){return converter.call(parentJSON,key,IndexedSeq(json).map(function(v,k){return fromJSWith(converter,v,k,json);}));}if(isPlainObj(json)){return converter.call(parentJSON,key,KeyedSeq(json).map(function(v,k){return fromJSWith(converter,v,k,json);}));}return json;}function fromJSDefault(json){if(Array.isArray(json)){return IndexedSeq(json).map(fromJSDefault).toList();}if(isPlainObj(json)){return KeyedSeq(json).map(fromJSDefault).toMap();}return json;}function isPlainObj(value){return value && (value.constructor === Object || value.constructor === undefined);} /**
	   * An extension of the "same-value" algorithm as [described for use by ES6 Map
	   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
	   *
	   * NaN is considered the same as NaN, however -0 and 0 are considered the same
	   * value, which is different from the algorithm described by
	   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
	   *
	   * This is extended further to allow Objects to describe the values they
	   * represent, by way of `valueOf` or `equals` (and `hashCode`).
	   *
	   * Note: because of this extension, the key equality of Immutable.Map and the
	   * value equality of Immutable.Set will differ from ES6 Map and Set.
	   *
	   * ### Defining custom values
	   *
	   * The easiest way to describe the value an object represents is by implementing
	   * `valueOf`. For example, `Date` represents a value by returning a unix
	   * timestamp for `valueOf`:
	   *
	   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
	   *     var date2 = new Date(1234567890000);
	   *     date1.valueOf(); // 1234567890000
	   *     assert( date1 !== date2 );
	   *     assert( Immutable.is( date1, date2 ) );
	   *
	   * Note: overriding `valueOf` may have other implications if you use this object
	   * where JavaScript expects a primitive, such as implicit string coercion.
	   *
	   * For more complex types, especially collections, implementing `valueOf` may
	   * not be performant. An alternative is to implement `equals` and `hashCode`.
	   *
	   * `equals` takes another object, presumably of similar type, and returns true
	   * if the it is equal. Equality is symmetrical, so the same result should be
	   * returned if this and the argument are flipped.
	   *
	   *     assert( a.equals(b) === b.equals(a) );
	   *
	   * `hashCode` returns a 32bit integer number representing the object which will
	   * be used to determine how to store the value object in a Map or Set. You must
	   * provide both or neither methods, one must not exist without the other.
	   *
	   * Also, an important relationship between these methods must be upheld: if two
	   * values are equal, they *must* return the same hashCode. If the values are not
	   * equal, they might have the same hashCode; this is called a hash collision,
	   * and while undesirable for performance reasons, it is acceptable.
	   *
	   *     if (a.equals(b)) {
	   *       assert( a.hashCode() === b.hashCode() );
	   *     }
	   *
	   * All Immutable collections implement `equals` and `hashCode`.
	   *
	   */function is(valueA,valueB){if(valueA === valueB || valueA !== valueA && valueB !== valueB){return true;}if(!valueA || !valueB){return false;}if(typeof valueA.valueOf === 'function' && typeof valueB.valueOf === 'function'){valueA = valueA.valueOf();valueB = valueB.valueOf();if(valueA === valueB || valueA !== valueA && valueB !== valueB){return true;}if(!valueA || !valueB){return false;}}if(typeof valueA.equals === 'function' && typeof valueB.equals === 'function' && valueA.equals(valueB)){return true;}return false;}function deepEqual(a,b){if(a === b){return true;}if(!isIterable(b) || a.size !== undefined && b.size !== undefined && a.size !== b.size || a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash || isKeyed(a) !== isKeyed(b) || isIndexed(a) !== isIndexed(b) || isOrdered(a) !== isOrdered(b)){return false;}if(a.size === 0 && b.size === 0){return true;}var notAssociative=!isAssociative(a);if(isOrdered(a)){var entries=a.entries();return b.every(function(v,k){var entry=entries.next().value;return entry && is(entry[1],v) && (notAssociative || is(entry[0],k));}) && entries.next().done;}var flipped=false;if(a.size === undefined){if(b.size === undefined){if(typeof a.cacheResult === 'function'){a.cacheResult();}}else {flipped = true;var _=a;a = b;b = _;}}var allEqual=true;var bSize=b.__iterate(function(v,k){if(notAssociative?!a.has(v):flipped?!is(v,a.get(k,NOT_SET)):!is(a.get(k,NOT_SET),v)){allEqual = false;return false;}});return allEqual && a.size === bSize;}createClass(Repeat,IndexedSeq);function Repeat(value,times){if(!(this instanceof Repeat)){return new Repeat(value,times);}this._value = value;this.size = times === undefined?Infinity:Math.max(0,times);if(this.size === 0){if(EMPTY_REPEAT){return EMPTY_REPEAT;}EMPTY_REPEAT = this;}}Repeat.prototype.toString = function(){if(this.size === 0){return 'Repeat []';}return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';};Repeat.prototype.get = function(index,notSetValue){return this.has(index)?this._value:notSetValue;};Repeat.prototype.includes = function(searchValue){return is(this._value,searchValue);};Repeat.prototype.slice = function(begin,end){var size=this.size;return wholeSlice(begin,end,size)?this:new Repeat(this._value,resolveEnd(end,size) - resolveBegin(begin,size));};Repeat.prototype.reverse = function(){return this;};Repeat.prototype.indexOf = function(searchValue){if(is(this._value,searchValue)){return 0;}return -1;};Repeat.prototype.lastIndexOf = function(searchValue){if(is(this._value,searchValue)){return this.size;}return -1;};Repeat.prototype.__iterate = function(fn,reverse){for(var ii=0;ii < this.size;ii++) {if(fn(this._value,ii,this) === false){return ii + 1;}}return ii;};Repeat.prototype.__iterator = function(type,reverse){var this$0=this;var ii=0;return new Iterator(function(){return ii < this$0.size?iteratorValue(type,ii++,this$0._value):iteratorDone();});};Repeat.prototype.equals = function(other){return other instanceof Repeat?is(this._value,other._value):deepEqual(other);};var EMPTY_REPEAT;function invariant(condition,error){if(!condition)throw new Error(error);}createClass(Range,IndexedSeq);function Range(start,end,step){if(!(this instanceof Range)){return new Range(start,end,step);}invariant(step !== 0,'Cannot step a Range by 0');start = start || 0;if(end === undefined){end = Infinity;}step = step === undefined?1:Math.abs(step);if(end < start){step = -step;}this._start = start;this._end = end;this._step = step;this.size = Math.max(0,Math.ceil((end - start) / step - 1) + 1);if(this.size === 0){if(EMPTY_RANGE){return EMPTY_RANGE;}EMPTY_RANGE = this;}}Range.prototype.toString = function(){if(this.size === 0){return 'Range []';}return 'Range [ ' + this._start + '...' + this._end + (this._step > 1?' by ' + this._step:'') + ' ]';};Range.prototype.get = function(index,notSetValue){return this.has(index)?this._start + wrapIndex(this,index) * this._step:notSetValue;};Range.prototype.includes = function(searchValue){var possibleIndex=(searchValue - this._start) / this._step;return possibleIndex >= 0 && possibleIndex < this.size && possibleIndex === Math.floor(possibleIndex);};Range.prototype.slice = function(begin,end){if(wholeSlice(begin,end,this.size)){return this;}begin = resolveBegin(begin,this.size);end = resolveEnd(end,this.size);if(end <= begin){return new Range(0,0);}return new Range(this.get(begin,this._end),this.get(end,this._end),this._step);};Range.prototype.indexOf = function(searchValue){var offsetValue=searchValue - this._start;if(offsetValue % this._step === 0){var index=offsetValue / this._step;if(index >= 0 && index < this.size){return index;}}return -1;};Range.prototype.lastIndexOf = function(searchValue){return this.indexOf(searchValue);};Range.prototype.__iterate = function(fn,reverse){var maxIndex=this.size - 1;var step=this._step;var value=reverse?this._start + maxIndex * step:this._start;for(var ii=0;ii <= maxIndex;ii++) {if(fn(value,ii,this) === false){return ii + 1;}value += reverse?-step:step;}return ii;};Range.prototype.__iterator = function(type,reverse){var maxIndex=this.size - 1;var step=this._step;var value=reverse?this._start + maxIndex * step:this._start;var ii=0;return new Iterator(function(){var v=value;value += reverse?-step:step;return ii > maxIndex?iteratorDone():iteratorValue(type,ii++,v);});};Range.prototype.equals = function(other){return other instanceof Range?this._start === other._start && this._end === other._end && this._step === other._step:deepEqual(this,other);};var EMPTY_RANGE;createClass(Collection,Iterable);function Collection(){throw TypeError('Abstract');}createClass(KeyedCollection,Collection);function KeyedCollection(){}createClass(IndexedCollection,Collection);function IndexedCollection(){}createClass(SetCollection,Collection);function SetCollection(){}Collection.Keyed = KeyedCollection;Collection.Indexed = IndexedCollection;Collection.Set = SetCollection;var imul=typeof Math.imul === 'function' && Math.imul(0xffffffff,2) === -2?Math.imul:function imul(a,b){a = a | 0; // int
	b = b | 0; // int
	var c=a & 0xffff;var d=b & 0xffff; // Shift by 0 fixes the sign on the high part.
	return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16 >>> 0) | 0; // int
	}; // v8 has an optimization for storing 31-bit signed numbers.
	// Values which have either 00 or 11 as the high order bits qualify.
	// This function drops the highest order bit in a signed number, maintaining
	// the sign bit.
	function smi(i32){return i32 >>> 1 & 0x40000000 | i32 & 0xBFFFFFFF;}function hash(o){if(o === false || o === null || o === undefined){return 0;}if(typeof o.valueOf === 'function'){o = o.valueOf();if(o === false || o === null || o === undefined){return 0;}}if(o === true){return 1;}var type=typeof o;if(type === 'number'){var h=o | 0;if(h !== o){h ^= o * 0xFFFFFFFF;}while(o > 0xFFFFFFFF) {o /= 0xFFFFFFFF;h ^= o;}return smi(h);}if(type === 'string'){return o.length > STRING_HASH_CACHE_MIN_STRLEN?cachedHashString(o):hashString(o);}if(typeof o.hashCode === 'function'){return o.hashCode();}if(type === 'object'){return hashJSObj(o);}if(typeof o.toString === 'function'){return hashString(o.toString());}throw new Error('Value type ' + type + ' cannot be hashed.');}function cachedHashString(string){var hash=stringHashCache[string];if(hash === undefined){hash = hashString(string);if(STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE){STRING_HASH_CACHE_SIZE = 0;stringHashCache = {};}STRING_HASH_CACHE_SIZE++;stringHashCache[string] = hash;}return hash;} // http://jsperf.com/hashing-strings
	function hashString(string){ // This is the hash from JVM
	// The hash code for a string is computed as
	// s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
	// where s[i] is the ith character of the string and n is the length of
	// the string. We "mod" the result to make it between 0 (inclusive) and 2^31
	// (exclusive) by dropping high bits.
	var hash=0;for(var ii=0;ii < string.length;ii++) {hash = 31 * hash + string.charCodeAt(ii) | 0;}return smi(hash);}function hashJSObj(obj){var hash;if(usingWeakMap){hash = weakMap.get(obj);if(hash !== undefined){return hash;}}hash = obj[UID_HASH_KEY];if(hash !== undefined){return hash;}if(!canDefineProperty){hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];if(hash !== undefined){return hash;}hash = getIENodeHash(obj);if(hash !== undefined){return hash;}}hash = ++objHashUID;if(objHashUID & 0x40000000){objHashUID = 0;}if(usingWeakMap){weakMap.set(obj,hash);}else if(isExtensible !== undefined && isExtensible(obj) === false){throw new Error('Non-extensible objects are not allowed as keys.');}else if(canDefineProperty){Object.defineProperty(obj,UID_HASH_KEY,{'enumerable':false,'configurable':false,'writable':false,'value':hash});}else if(obj.propertyIsEnumerable !== undefined && obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable){ // Since we can't define a non-enumerable property on the object
	// we'll hijack one of the less-used non-enumerable properties to
	// save our hash on it. Since this is a function it will not show up in
	// `JSON.stringify` which is what we want.
	obj.propertyIsEnumerable = function(){return this.constructor.prototype.propertyIsEnumerable.apply(this,arguments);};obj.propertyIsEnumerable[UID_HASH_KEY] = hash;}else if(obj.nodeType !== undefined){ // At this point we couldn't get the IE `uniqueID` to use as a hash
	// and we couldn't use a non-enumerable property to exploit the
	// dontEnum bug so we simply add the `UID_HASH_KEY` on the node
	// itself.
	obj[UID_HASH_KEY] = hash;}else {throw new Error('Unable to set a non-enumerable property on object.');}return hash;} // Get references to ES5 object methods.
	var isExtensible=Object.isExtensible; // True if Object.defineProperty works as expected. IE8 fails this test.
	var canDefineProperty=(function(){try{Object.defineProperty({},'@',{});return true;}catch(e) {return false;}})(); // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
	// and avoid memory leaks from the IE cloneNode bug.
	function getIENodeHash(node){if(node && node.nodeType > 0){switch(node.nodeType){case 1: // Element
	return node.uniqueID;case 9: // Document
	return node.documentElement && node.documentElement.uniqueID;}}} // If possible, use a WeakMap.
	var usingWeakMap=typeof WeakMap === 'function';var weakMap;if(usingWeakMap){weakMap = new WeakMap();}var objHashUID=0;var UID_HASH_KEY='__immutablehash__';if(typeof Symbol === 'function'){UID_HASH_KEY = Symbol(UID_HASH_KEY);}var STRING_HASH_CACHE_MIN_STRLEN=16;var STRING_HASH_CACHE_MAX_SIZE=255;var STRING_HASH_CACHE_SIZE=0;var stringHashCache={};function assertNotInfinite(size){invariant(size !== Infinity,'Cannot perform this action with an infinite size.');}createClass(Map,KeyedCollection); // @pragma Construction
	function Map(value){return value === null || value === undefined?emptyMap():isMap(value) && !isOrdered(value)?value:emptyMap().withMutations(function(map){var iter=KeyedIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v,k){return map.set(k,v);});});}Map.prototype.toString = function(){return this.__toString('Map {','}');}; // @pragma Access
	Map.prototype.get = function(k,notSetValue){return this._root?this._root.get(0,undefined,k,notSetValue):notSetValue;}; // @pragma Modification
	Map.prototype.set = function(k,v){return updateMap(this,k,v);};Map.prototype.setIn = function(keyPath,v){return this.updateIn(keyPath,NOT_SET,function(){return v;});};Map.prototype.remove = function(k){return updateMap(this,k,NOT_SET);};Map.prototype.deleteIn = function(keyPath){return this.updateIn(keyPath,function(){return NOT_SET;});};Map.prototype.update = function(k,notSetValue,updater){return arguments.length === 1?k(this):this.updateIn([k],notSetValue,updater);};Map.prototype.updateIn = function(keyPath,notSetValue,updater){if(!updater){updater = notSetValue;notSetValue = undefined;}var updatedValue=updateInDeepMap(this,forceIterator(keyPath),notSetValue,updater);return updatedValue === NOT_SET?undefined:updatedValue;};Map.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = 0;this._root = null;this.__hash = undefined;this.__altered = true;return this;}return emptyMap();}; // @pragma Composition
	Map.prototype.merge = function() /*...iters*/{return mergeIntoMapWith(this,undefined,arguments);};Map.prototype.mergeWith = function(merger){var iters=SLICE$0.call(arguments,1);return mergeIntoMapWith(this,merger,iters);};Map.prototype.mergeIn = function(keyPath){var iters=SLICE$0.call(arguments,1);return this.updateIn(keyPath,emptyMap(),function(m){return typeof m.merge === 'function'?m.merge.apply(m,iters):iters[iters.length - 1];});};Map.prototype.mergeDeep = function() /*...iters*/{return mergeIntoMapWith(this,deepMerger,arguments);};Map.prototype.mergeDeepWith = function(merger){var iters=SLICE$0.call(arguments,1);return mergeIntoMapWith(this,deepMergerWith(merger),iters);};Map.prototype.mergeDeepIn = function(keyPath){var iters=SLICE$0.call(arguments,1);return this.updateIn(keyPath,emptyMap(),function(m){return typeof m.mergeDeep === 'function'?m.mergeDeep.apply(m,iters):iters[iters.length - 1];});};Map.prototype.sort = function(comparator){ // Late binding
	return OrderedMap(sortFactory(this,comparator));};Map.prototype.sortBy = function(mapper,comparator){ // Late binding
	return OrderedMap(sortFactory(this,comparator,mapper));}; // @pragma Mutability
	Map.prototype.withMutations = function(fn){var mutable=this.asMutable();fn(mutable);return mutable.wasAltered()?mutable.__ensureOwner(this.__ownerID):this;};Map.prototype.asMutable = function(){return this.__ownerID?this:this.__ensureOwner(new OwnerID());};Map.prototype.asImmutable = function(){return this.__ensureOwner();};Map.prototype.wasAltered = function(){return this.__altered;};Map.prototype.__iterator = function(type,reverse){return new MapIterator(this,type,reverse);};Map.prototype.__iterate = function(fn,reverse){var this$0=this;var iterations=0;this._root && this._root.iterate(function(entry){iterations++;return fn(entry[1],entry[0],this$0);},reverse);return iterations;};Map.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}if(!ownerID){this.__ownerID = ownerID;this.__altered = false;return this;}return makeMap(this.size,this._root,ownerID,this.__hash);};function isMap(maybeMap){return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);}Map.isMap = isMap;var IS_MAP_SENTINEL='@@__IMMUTABLE_MAP__@@';var MapPrototype=Map.prototype;MapPrototype[IS_MAP_SENTINEL] = true;MapPrototype[DELETE] = MapPrototype.remove;MapPrototype.removeIn = MapPrototype.deleteIn; // #pragma Trie Nodes
	function ArrayMapNode(ownerID,entries){this.ownerID = ownerID;this.entries = entries;}ArrayMapNode.prototype.get = function(shift,keyHash,key,notSetValue){var entries=this.entries;for(var ii=0,len=entries.length;ii < len;ii++) {if(is(key,entries[ii][0])){return entries[ii][1];}}return notSetValue;};ArrayMapNode.prototype.update = function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){var removed=value === NOT_SET;var entries=this.entries;var idx=0;for(var len=entries.length;idx < len;idx++) {if(is(key,entries[idx][0])){break;}}var exists=idx < len;if(exists?entries[idx][1] === value:removed){return this;}SetRef(didAlter);(removed || !exists) && SetRef(didChangeSize);if(removed && entries.length === 1){return; // undefined
	}if(!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE){return createNodes(ownerID,entries,key,value);}var isEditable=ownerID && ownerID === this.ownerID;var newEntries=isEditable?entries:arrCopy(entries);if(exists){if(removed){idx === len - 1?newEntries.pop():newEntries[idx] = newEntries.pop();}else {newEntries[idx] = [key,value];}}else {newEntries.push([key,value]);}if(isEditable){this.entries = newEntries;return this;}return new ArrayMapNode(ownerID,newEntries);};function BitmapIndexedNode(ownerID,bitmap,nodes){this.ownerID = ownerID;this.bitmap = bitmap;this.nodes = nodes;}BitmapIndexedNode.prototype.get = function(shift,keyHash,key,notSetValue){if(keyHash === undefined){keyHash = hash(key);}var bit=1 << ((shift === 0?keyHash:keyHash >>> shift) & MASK);var bitmap=this.bitmap;return (bitmap & bit) === 0?notSetValue:this.nodes[popCount(bitmap & bit - 1)].get(shift + SHIFT,keyHash,key,notSetValue);};BitmapIndexedNode.prototype.update = function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){if(keyHash === undefined){keyHash = hash(key);}var keyHashFrag=(shift === 0?keyHash:keyHash >>> shift) & MASK;var bit=1 << keyHashFrag;var bitmap=this.bitmap;var exists=(bitmap & bit) !== 0;if(!exists && value === NOT_SET){return this;}var idx=popCount(bitmap & bit - 1);var nodes=this.nodes;var node=exists?nodes[idx]:undefined;var newNode=updateNode(node,ownerID,shift + SHIFT,keyHash,key,value,didChangeSize,didAlter);if(newNode === node){return this;}if(!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE){return expandNodes(ownerID,nodes,bitmap,keyHashFrag,newNode);}if(exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])){return nodes[idx ^ 1];}if(exists && newNode && nodes.length === 1 && isLeafNode(newNode)){return newNode;}var isEditable=ownerID && ownerID === this.ownerID;var newBitmap=exists?newNode?bitmap:bitmap ^ bit:bitmap | bit;var newNodes=exists?newNode?setIn(nodes,idx,newNode,isEditable):spliceOut(nodes,idx,isEditable):spliceIn(nodes,idx,newNode,isEditable);if(isEditable){this.bitmap = newBitmap;this.nodes = newNodes;return this;}return new BitmapIndexedNode(ownerID,newBitmap,newNodes);};function HashArrayMapNode(ownerID,count,nodes){this.ownerID = ownerID;this.count = count;this.nodes = nodes;}HashArrayMapNode.prototype.get = function(shift,keyHash,key,notSetValue){if(keyHash === undefined){keyHash = hash(key);}var idx=(shift === 0?keyHash:keyHash >>> shift) & MASK;var node=this.nodes[idx];return node?node.get(shift + SHIFT,keyHash,key,notSetValue):notSetValue;};HashArrayMapNode.prototype.update = function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){if(keyHash === undefined){keyHash = hash(key);}var idx=(shift === 0?keyHash:keyHash >>> shift) & MASK;var removed=value === NOT_SET;var nodes=this.nodes;var node=nodes[idx];if(removed && !node){return this;}var newNode=updateNode(node,ownerID,shift + SHIFT,keyHash,key,value,didChangeSize,didAlter);if(newNode === node){return this;}var newCount=this.count;if(!node){newCount++;}else if(!newNode){newCount--;if(newCount < MIN_HASH_ARRAY_MAP_SIZE){return packNodes(ownerID,nodes,newCount,idx);}}var isEditable=ownerID && ownerID === this.ownerID;var newNodes=setIn(nodes,idx,newNode,isEditable);if(isEditable){this.count = newCount;this.nodes = newNodes;return this;}return new HashArrayMapNode(ownerID,newCount,newNodes);};function HashCollisionNode(ownerID,keyHash,entries){this.ownerID = ownerID;this.keyHash = keyHash;this.entries = entries;}HashCollisionNode.prototype.get = function(shift,keyHash,key,notSetValue){var entries=this.entries;for(var ii=0,len=entries.length;ii < len;ii++) {if(is(key,entries[ii][0])){return entries[ii][1];}}return notSetValue;};HashCollisionNode.prototype.update = function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){if(keyHash === undefined){keyHash = hash(key);}var removed=value === NOT_SET;if(keyHash !== this.keyHash){if(removed){return this;}SetRef(didAlter);SetRef(didChangeSize);return mergeIntoNode(this,ownerID,shift,keyHash,[key,value]);}var entries=this.entries;var idx=0;for(var len=entries.length;idx < len;idx++) {if(is(key,entries[idx][0])){break;}}var exists=idx < len;if(exists?entries[idx][1] === value:removed){return this;}SetRef(didAlter);(removed || !exists) && SetRef(didChangeSize);if(removed && len === 2){return new ValueNode(ownerID,this.keyHash,entries[idx ^ 1]);}var isEditable=ownerID && ownerID === this.ownerID;var newEntries=isEditable?entries:arrCopy(entries);if(exists){if(removed){idx === len - 1?newEntries.pop():newEntries[idx] = newEntries.pop();}else {newEntries[idx] = [key,value];}}else {newEntries.push([key,value]);}if(isEditable){this.entries = newEntries;return this;}return new HashCollisionNode(ownerID,this.keyHash,newEntries);};function ValueNode(ownerID,keyHash,entry){this.ownerID = ownerID;this.keyHash = keyHash;this.entry = entry;}ValueNode.prototype.get = function(shift,keyHash,key,notSetValue){return is(key,this.entry[0])?this.entry[1]:notSetValue;};ValueNode.prototype.update = function(ownerID,shift,keyHash,key,value,didChangeSize,didAlter){var removed=value === NOT_SET;var keyMatch=is(key,this.entry[0]);if(keyMatch?value === this.entry[1]:removed){return this;}SetRef(didAlter);if(removed){SetRef(didChangeSize);return; // undefined
	}if(keyMatch){if(ownerID && ownerID === this.ownerID){this.entry[1] = value;return this;}return new ValueNode(ownerID,this.keyHash,[key,value]);}SetRef(didChangeSize);return mergeIntoNode(this,ownerID,shift,hash(key),[key,value]);}; // #pragma Iterators
	ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate = function(fn,reverse){var entries=this.entries;for(var ii=0,maxIndex=entries.length - 1;ii <= maxIndex;ii++) {if(fn(entries[reverse?maxIndex - ii:ii]) === false){return false;}}};BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate = function(fn,reverse){var nodes=this.nodes;for(var ii=0,maxIndex=nodes.length - 1;ii <= maxIndex;ii++) {var node=nodes[reverse?maxIndex - ii:ii];if(node && node.iterate(fn,reverse) === false){return false;}}};ValueNode.prototype.iterate = function(fn,reverse){return fn(this.entry);};createClass(MapIterator,Iterator);function MapIterator(map,type,reverse){this._type = type;this._reverse = reverse;this._stack = map._root && mapIteratorFrame(map._root);}MapIterator.prototype.next = function(){var type=this._type;var stack=this._stack;while(stack) {var node=stack.node;var index=stack.index++;var maxIndex;if(node.entry){if(index === 0){return mapIteratorValue(type,node.entry);}}else if(node.entries){maxIndex = node.entries.length - 1;if(index <= maxIndex){return mapIteratorValue(type,node.entries[this._reverse?maxIndex - index:index]);}}else {maxIndex = node.nodes.length - 1;if(index <= maxIndex){var subNode=node.nodes[this._reverse?maxIndex - index:index];if(subNode){if(subNode.entry){return mapIteratorValue(type,subNode.entry);}stack = this._stack = mapIteratorFrame(subNode,stack);}continue;}}stack = this._stack = this._stack.__prev;}return iteratorDone();};function mapIteratorValue(type,entry){return iteratorValue(type,entry[0],entry[1]);}function mapIteratorFrame(node,prev){return {node:node,index:0,__prev:prev};}function makeMap(size,root,ownerID,hash){var map=Object.create(MapPrototype);map.size = size;map._root = root;map.__ownerID = ownerID;map.__hash = hash;map.__altered = false;return map;}var EMPTY_MAP;function emptyMap(){return EMPTY_MAP || (EMPTY_MAP = makeMap(0));}function updateMap(map,k,v){var newRoot;var newSize;if(!map._root){if(v === NOT_SET){return map;}newSize = 1;newRoot = new ArrayMapNode(map.__ownerID,[[k,v]]);}else {var didChangeSize=MakeRef(CHANGE_LENGTH);var didAlter=MakeRef(DID_ALTER);newRoot = updateNode(map._root,map.__ownerID,0,undefined,k,v,didChangeSize,didAlter);if(!didAlter.value){return map;}newSize = map.size + (didChangeSize.value?v === NOT_SET?-1:1:0);}if(map.__ownerID){map.size = newSize;map._root = newRoot;map.__hash = undefined;map.__altered = true;return map;}return newRoot?makeMap(newSize,newRoot):emptyMap();}function updateNode(node,ownerID,shift,keyHash,key,value,didChangeSize,didAlter){if(!node){if(value === NOT_SET){return node;}SetRef(didAlter);SetRef(didChangeSize);return new ValueNode(ownerID,keyHash,[key,value]);}return node.update(ownerID,shift,keyHash,key,value,didChangeSize,didAlter);}function isLeafNode(node){return node.constructor === ValueNode || node.constructor === HashCollisionNode;}function mergeIntoNode(node,ownerID,shift,keyHash,entry){if(node.keyHash === keyHash){return new HashCollisionNode(ownerID,keyHash,[node.entry,entry]);}var idx1=(shift === 0?node.keyHash:node.keyHash >>> shift) & MASK;var idx2=(shift === 0?keyHash:keyHash >>> shift) & MASK;var newNode;var nodes=idx1 === idx2?[mergeIntoNode(node,ownerID,shift + SHIFT,keyHash,entry)]:(newNode = new ValueNode(ownerID,keyHash,entry),idx1 < idx2?[node,newNode]:[newNode,node]);return new BitmapIndexedNode(ownerID,1 << idx1 | 1 << idx2,nodes);}function createNodes(ownerID,entries,key,value){if(!ownerID){ownerID = new OwnerID();}var node=new ValueNode(ownerID,hash(key),[key,value]);for(var ii=0;ii < entries.length;ii++) {var entry=entries[ii];node = node.update(ownerID,0,undefined,entry[0],entry[1]);}return node;}function packNodes(ownerID,nodes,count,excluding){var bitmap=0;var packedII=0;var packedNodes=new Array(count);for(var ii=0,bit=1,len=nodes.length;ii < len;ii++,bit <<= 1) {var node=nodes[ii];if(node !== undefined && ii !== excluding){bitmap |= bit;packedNodes[packedII++] = node;}}return new BitmapIndexedNode(ownerID,bitmap,packedNodes);}function expandNodes(ownerID,nodes,bitmap,including,node){var count=0;var expandedNodes=new Array(SIZE);for(var ii=0;bitmap !== 0;ii++,bitmap >>>= 1) {expandedNodes[ii] = bitmap & 1?nodes[count++]:undefined;}expandedNodes[including] = node;return new HashArrayMapNode(ownerID,count + 1,expandedNodes);}function mergeIntoMapWith(map,merger,iterables){var iters=[];for(var ii=0;ii < iterables.length;ii++) {var value=iterables[ii];var iter=KeyedIterable(value);if(!isIterable(value)){iter = iter.map(function(v){return fromJS(v);});}iters.push(iter);}return mergeIntoCollectionWith(map,merger,iters);}function deepMerger(existing,value,key){return existing && existing.mergeDeep && isIterable(value)?existing.mergeDeep(value):is(existing,value)?existing:value;}function deepMergerWith(merger){return function(existing,value,key){if(existing && existing.mergeDeepWith && isIterable(value)){return existing.mergeDeepWith(merger,value);}var nextValue=merger(existing,value,key);return is(existing,nextValue)?existing:nextValue;};}function mergeIntoCollectionWith(collection,merger,iters){iters = iters.filter(function(x){return x.size !== 0;});if(iters.length === 0){return collection;}if(collection.size === 0 && !collection.__ownerID && iters.length === 1){return collection.constructor(iters[0]);}return collection.withMutations(function(collection){var mergeIntoMap=merger?function(value,key){collection.update(key,NOT_SET,function(existing){return existing === NOT_SET?value:merger(existing,value,key);});}:function(value,key){collection.set(key,value);};for(var ii=0;ii < iters.length;ii++) {iters[ii].forEach(mergeIntoMap);}});}function updateInDeepMap(existing,keyPathIter,notSetValue,updater){var isNotSet=existing === NOT_SET;var step=keyPathIter.next();if(step.done){var existingValue=isNotSet?notSetValue:existing;var newValue=updater(existingValue);return newValue === existingValue?existing:newValue;}invariant(isNotSet || existing && existing.set,'invalid keyPath');var key=step.value;var nextExisting=isNotSet?NOT_SET:existing.get(key,NOT_SET);var nextUpdated=updateInDeepMap(nextExisting,keyPathIter,notSetValue,updater);return nextUpdated === nextExisting?existing:nextUpdated === NOT_SET?existing.remove(key):(isNotSet?emptyMap():existing).set(key,nextUpdated);}function popCount(x){x = x - (x >> 1 & 0x55555555);x = (x & 0x33333333) + (x >> 2 & 0x33333333);x = x + (x >> 4) & 0x0f0f0f0f;x = x + (x >> 8);x = x + (x >> 16);return x & 0x7f;}function setIn(array,idx,val,canEdit){var newArray=canEdit?array:arrCopy(array);newArray[idx] = val;return newArray;}function spliceIn(array,idx,val,canEdit){var newLen=array.length + 1;if(canEdit && idx + 1 === newLen){array[idx] = val;return array;}var newArray=new Array(newLen);var after=0;for(var ii=0;ii < newLen;ii++) {if(ii === idx){newArray[ii] = val;after = -1;}else {newArray[ii] = array[ii + after];}}return newArray;}function spliceOut(array,idx,canEdit){var newLen=array.length - 1;if(canEdit && idx === newLen){array.pop();return array;}var newArray=new Array(newLen);var after=0;for(var ii=0;ii < newLen;ii++) {if(ii === idx){after = 1;}newArray[ii] = array[ii + after];}return newArray;}var MAX_ARRAY_MAP_SIZE=SIZE / 4;var MAX_BITMAP_INDEXED_SIZE=SIZE / 2;var MIN_HASH_ARRAY_MAP_SIZE=SIZE / 4;createClass(List,IndexedCollection); // @pragma Construction
	function List(value){var empty=emptyList();if(value === null || value === undefined){return empty;}if(isList(value)){return value;}var iter=IndexedIterable(value);var size=iter.size;if(size === 0){return empty;}assertNotInfinite(size);if(size > 0 && size < SIZE){return makeList(0,size,SHIFT,null,new VNode(iter.toArray()));}return empty.withMutations(function(list){list.setSize(size);iter.forEach(function(v,i){return list.set(i,v);});});}List.of = function() /*...values*/{return this(arguments);};List.prototype.toString = function(){return this.__toString('List [',']');}; // @pragma Access
	List.prototype.get = function(index,notSetValue){index = wrapIndex(this,index);if(index >= 0 && index < this.size){index += this._origin;var node=listNodeFor(this,index);return node && node.array[index & MASK];}return notSetValue;}; // @pragma Modification
	List.prototype.set = function(index,value){return updateList(this,index,value);};List.prototype.remove = function(index){return !this.has(index)?this:index === 0?this.shift():index === this.size - 1?this.pop():this.splice(index,1);};List.prototype.insert = function(index,value){return this.splice(index,0,value);};List.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = this._origin = this._capacity = 0;this._level = SHIFT;this._root = this._tail = null;this.__hash = undefined;this.__altered = true;return this;}return emptyList();};List.prototype.push = function() /*...values*/{var values=arguments;var oldSize=this.size;return this.withMutations(function(list){setListBounds(list,0,oldSize + values.length);for(var ii=0;ii < values.length;ii++) {list.set(oldSize + ii,values[ii]);}});};List.prototype.pop = function(){return setListBounds(this,0,-1);};List.prototype.unshift = function() /*...values*/{var values=arguments;return this.withMutations(function(list){setListBounds(list,-values.length);for(var ii=0;ii < values.length;ii++) {list.set(ii,values[ii]);}});};List.prototype.shift = function(){return setListBounds(this,1);}; // @pragma Composition
	List.prototype.merge = function() /*...iters*/{return mergeIntoListWith(this,undefined,arguments);};List.prototype.mergeWith = function(merger){var iters=SLICE$0.call(arguments,1);return mergeIntoListWith(this,merger,iters);};List.prototype.mergeDeep = function() /*...iters*/{return mergeIntoListWith(this,deepMerger,arguments);};List.prototype.mergeDeepWith = function(merger){var iters=SLICE$0.call(arguments,1);return mergeIntoListWith(this,deepMergerWith(merger),iters);};List.prototype.setSize = function(size){return setListBounds(this,0,size);}; // @pragma Iteration
	List.prototype.slice = function(begin,end){var size=this.size;if(wholeSlice(begin,end,size)){return this;}return setListBounds(this,resolveBegin(begin,size),resolveEnd(end,size));};List.prototype.__iterator = function(type,reverse){var index=0;var values=iterateList(this,reverse);return new Iterator(function(){var value=values();return value === DONE?iteratorDone():iteratorValue(type,index++,value);});};List.prototype.__iterate = function(fn,reverse){var index=0;var values=iterateList(this,reverse);var value;while((value = values()) !== DONE) {if(fn(value,index++,this) === false){break;}}return index;};List.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}if(!ownerID){this.__ownerID = ownerID;return this;}return makeList(this._origin,this._capacity,this._level,this._root,this._tail,ownerID,this.__hash);};function isList(maybeList){return !!(maybeList && maybeList[IS_LIST_SENTINEL]);}List.isList = isList;var IS_LIST_SENTINEL='@@__IMMUTABLE_LIST__@@';var ListPrototype=List.prototype;ListPrototype[IS_LIST_SENTINEL] = true;ListPrototype[DELETE] = ListPrototype.remove;ListPrototype.setIn = MapPrototype.setIn;ListPrototype.deleteIn = ListPrototype.removeIn = MapPrototype.removeIn;ListPrototype.update = MapPrototype.update;ListPrototype.updateIn = MapPrototype.updateIn;ListPrototype.mergeIn = MapPrototype.mergeIn;ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;ListPrototype.withMutations = MapPrototype.withMutations;ListPrototype.asMutable = MapPrototype.asMutable;ListPrototype.asImmutable = MapPrototype.asImmutable;ListPrototype.wasAltered = MapPrototype.wasAltered;function VNode(array,ownerID){this.array = array;this.ownerID = ownerID;} // TODO: seems like these methods are very similar
	VNode.prototype.removeBefore = function(ownerID,level,index){if(index === level?1 << level:0 || this.array.length === 0){return this;}var originIndex=index >>> level & MASK;if(originIndex >= this.array.length){return new VNode([],ownerID);}var removingFirst=originIndex === 0;var newChild;if(level > 0){var oldChild=this.array[originIndex];newChild = oldChild && oldChild.removeBefore(ownerID,level - SHIFT,index);if(newChild === oldChild && removingFirst){return this;}}if(removingFirst && !newChild){return this;}var editable=editableVNode(this,ownerID);if(!removingFirst){for(var ii=0;ii < originIndex;ii++) {editable.array[ii] = undefined;}}if(newChild){editable.array[originIndex] = newChild;}return editable;};VNode.prototype.removeAfter = function(ownerID,level,index){if(index === (level?1 << level:0) || this.array.length === 0){return this;}var sizeIndex=index - 1 >>> level & MASK;if(sizeIndex >= this.array.length){return this;}var newChild;if(level > 0){var oldChild=this.array[sizeIndex];newChild = oldChild && oldChild.removeAfter(ownerID,level - SHIFT,index);if(newChild === oldChild && sizeIndex === this.array.length - 1){return this;}}var editable=editableVNode(this,ownerID);editable.array.splice(sizeIndex + 1);if(newChild){editable.array[sizeIndex] = newChild;}return editable;};var DONE={};function iterateList(list,reverse){var left=list._origin;var right=list._capacity;var tailPos=getTailOffset(right);var tail=list._tail;return iterateNodeOrLeaf(list._root,list._level,0);function iterateNodeOrLeaf(node,level,offset){return level === 0?iterateLeaf(node,offset):iterateNode(node,level,offset);}function iterateLeaf(node,offset){var array=offset === tailPos?tail && tail.array:node && node.array;var from=offset > left?0:left - offset;var to=right - offset;if(to > SIZE){to = SIZE;}return function(){if(from === to){return DONE;}var idx=reverse?--to:from++;return array && array[idx];};}function iterateNode(node,level,offset){var values;var array=node && node.array;var from=offset > left?0:left - offset >> level;var to=(right - offset >> level) + 1;if(to > SIZE){to = SIZE;}return function(){do {if(values){var value=values();if(value !== DONE){return value;}values = null;}if(from === to){return DONE;}var idx=reverse?--to:from++;values = iterateNodeOrLeaf(array && array[idx],level - SHIFT,offset + (idx << level));}while(true);};}}function makeList(origin,capacity,level,root,tail,ownerID,hash){var list=Object.create(ListPrototype);list.size = capacity - origin;list._origin = origin;list._capacity = capacity;list._level = level;list._root = root;list._tail = tail;list.__ownerID = ownerID;list.__hash = hash;list.__altered = false;return list;}var EMPTY_LIST;function emptyList(){return EMPTY_LIST || (EMPTY_LIST = makeList(0,0,SHIFT));}function updateList(list,index,value){index = wrapIndex(list,index);if(index !== index){return list;}if(index >= list.size || index < 0){return list.withMutations(function(list){index < 0?setListBounds(list,index).set(0,value):setListBounds(list,0,index + 1).set(index,value);});}index += list._origin;var newTail=list._tail;var newRoot=list._root;var didAlter=MakeRef(DID_ALTER);if(index >= getTailOffset(list._capacity)){newTail = updateVNode(newTail,list.__ownerID,0,index,value,didAlter);}else {newRoot = updateVNode(newRoot,list.__ownerID,list._level,index,value,didAlter);}if(!didAlter.value){return list;}if(list.__ownerID){list._root = newRoot;list._tail = newTail;list.__hash = undefined;list.__altered = true;return list;}return makeList(list._origin,list._capacity,list._level,newRoot,newTail);}function updateVNode(node,ownerID,level,index,value,didAlter){var idx=index >>> level & MASK;var nodeHas=node && idx < node.array.length;if(!nodeHas && value === undefined){return node;}var newNode;if(level > 0){var lowerNode=node && node.array[idx];var newLowerNode=updateVNode(lowerNode,ownerID,level - SHIFT,index,value,didAlter);if(newLowerNode === lowerNode){return node;}newNode = editableVNode(node,ownerID);newNode.array[idx] = newLowerNode;return newNode;}if(nodeHas && node.array[idx] === value){return node;}SetRef(didAlter);newNode = editableVNode(node,ownerID);if(value === undefined && idx === newNode.array.length - 1){newNode.array.pop();}else {newNode.array[idx] = value;}return newNode;}function editableVNode(node,ownerID){if(ownerID && node && ownerID === node.ownerID){return node;}return new VNode(node?node.array.slice():[],ownerID);}function listNodeFor(list,rawIndex){if(rawIndex >= getTailOffset(list._capacity)){return list._tail;}if(rawIndex < 1 << list._level + SHIFT){var node=list._root;var level=list._level;while(node && level > 0) {node = node.array[rawIndex >>> level & MASK];level -= SHIFT;}return node;}}function setListBounds(list,begin,end){ // Sanitize begin & end using this shorthand for ToInt32(argument)
	// http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
	if(begin !== undefined){begin = begin | 0;}if(end !== undefined){end = end | 0;}var owner=list.__ownerID || new OwnerID();var oldOrigin=list._origin;var oldCapacity=list._capacity;var newOrigin=oldOrigin + begin;var newCapacity=end === undefined?oldCapacity:end < 0?oldCapacity + end:oldOrigin + end;if(newOrigin === oldOrigin && newCapacity === oldCapacity){return list;} // If it's going to end after it starts, it's empty.
	if(newOrigin >= newCapacity){return list.clear();}var newLevel=list._level;var newRoot=list._root; // New origin might need creating a higher root.
	var offsetShift=0;while(newOrigin + offsetShift < 0) {newRoot = new VNode(newRoot && newRoot.array.length?[undefined,newRoot]:[],owner);newLevel += SHIFT;offsetShift += 1 << newLevel;}if(offsetShift){newOrigin += offsetShift;oldOrigin += offsetShift;newCapacity += offsetShift;oldCapacity += offsetShift;}var oldTailOffset=getTailOffset(oldCapacity);var newTailOffset=getTailOffset(newCapacity); // New size might need creating a higher root.
	while(newTailOffset >= 1 << newLevel + SHIFT) {newRoot = new VNode(newRoot && newRoot.array.length?[newRoot]:[],owner);newLevel += SHIFT;} // Locate or create the new tail.
	var oldTail=list._tail;var newTail=newTailOffset < oldTailOffset?listNodeFor(list,newCapacity - 1):newTailOffset > oldTailOffset?new VNode([],owner):oldTail; // Merge Tail into tree.
	if(oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length){newRoot = editableVNode(newRoot,owner);var node=newRoot;for(var level=newLevel;level > SHIFT;level -= SHIFT) {var idx=oldTailOffset >>> level & MASK;node = node.array[idx] = editableVNode(node.array[idx],owner);}node.array[oldTailOffset >>> SHIFT & MASK] = oldTail;} // If the size has been reduced, there's a chance the tail needs to be trimmed.
	if(newCapacity < oldCapacity){newTail = newTail && newTail.removeAfter(owner,0,newCapacity);} // If the new origin is within the tail, then we do not need a root.
	if(newOrigin >= newTailOffset){newOrigin -= newTailOffset;newCapacity -= newTailOffset;newLevel = SHIFT;newRoot = null;newTail = newTail && newTail.removeBefore(owner,0,newOrigin); // Otherwise, if the root has been trimmed, garbage collect.
	}else if(newOrigin > oldOrigin || newTailOffset < oldTailOffset){offsetShift = 0; // Identify the new top root node of the subtree of the old root.
	while(newRoot) {var beginIndex=newOrigin >>> newLevel & MASK;if(beginIndex !== newTailOffset >>> newLevel & MASK){break;}if(beginIndex){offsetShift += (1 << newLevel) * beginIndex;}newLevel -= SHIFT;newRoot = newRoot.array[beginIndex];} // Trim the new sides of the new root.
	if(newRoot && newOrigin > oldOrigin){newRoot = newRoot.removeBefore(owner,newLevel,newOrigin - offsetShift);}if(newRoot && newTailOffset < oldTailOffset){newRoot = newRoot.removeAfter(owner,newLevel,newTailOffset - offsetShift);}if(offsetShift){newOrigin -= offsetShift;newCapacity -= offsetShift;}}if(list.__ownerID){list.size = newCapacity - newOrigin;list._origin = newOrigin;list._capacity = newCapacity;list._level = newLevel;list._root = newRoot;list._tail = newTail;list.__hash = undefined;list.__altered = true;return list;}return makeList(newOrigin,newCapacity,newLevel,newRoot,newTail);}function mergeIntoListWith(list,merger,iterables){var iters=[];var maxSize=0;for(var ii=0;ii < iterables.length;ii++) {var value=iterables[ii];var iter=IndexedIterable(value);if(iter.size > maxSize){maxSize = iter.size;}if(!isIterable(value)){iter = iter.map(function(v){return fromJS(v);});}iters.push(iter);}if(maxSize > list.size){list = list.setSize(maxSize);}return mergeIntoCollectionWith(list,merger,iters);}function getTailOffset(size){return size < SIZE?0:size - 1 >>> SHIFT << SHIFT;}createClass(OrderedMap,Map); // @pragma Construction
	function OrderedMap(value){return value === null || value === undefined?emptyOrderedMap():isOrderedMap(value)?value:emptyOrderedMap().withMutations(function(map){var iter=KeyedIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v,k){return map.set(k,v);});});}OrderedMap.of = function() /*...values*/{return this(arguments);};OrderedMap.prototype.toString = function(){return this.__toString('OrderedMap {','}');}; // @pragma Access
	OrderedMap.prototype.get = function(k,notSetValue){var index=this._map.get(k);return index !== undefined?this._list.get(index)[1]:notSetValue;}; // @pragma Modification
	OrderedMap.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = 0;this._map.clear();this._list.clear();return this;}return emptyOrderedMap();};OrderedMap.prototype.set = function(k,v){return updateOrderedMap(this,k,v);};OrderedMap.prototype.remove = function(k){return updateOrderedMap(this,k,NOT_SET);};OrderedMap.prototype.wasAltered = function(){return this._map.wasAltered() || this._list.wasAltered();};OrderedMap.prototype.__iterate = function(fn,reverse){var this$0=this;return this._list.__iterate(function(entry){return entry && fn(entry[1],entry[0],this$0);},reverse);};OrderedMap.prototype.__iterator = function(type,reverse){return this._list.fromEntrySeq().__iterator(type,reverse);};OrderedMap.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}var newMap=this._map.__ensureOwner(ownerID);var newList=this._list.__ensureOwner(ownerID);if(!ownerID){this.__ownerID = ownerID;this._map = newMap;this._list = newList;return this;}return makeOrderedMap(newMap,newList,ownerID,this.__hash);};function isOrderedMap(maybeOrderedMap){return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);}OrderedMap.isOrderedMap = isOrderedMap;OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;function makeOrderedMap(map,list,ownerID,hash){var omap=Object.create(OrderedMap.prototype);omap.size = map?map.size:0;omap._map = map;omap._list = list;omap.__ownerID = ownerID;omap.__hash = hash;return omap;}var EMPTY_ORDERED_MAP;function emptyOrderedMap(){return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(),emptyList()));}function updateOrderedMap(omap,k,v){var map=omap._map;var list=omap._list;var i=map.get(k);var has=i !== undefined;var newMap;var newList;if(v === NOT_SET){ // removed
	if(!has){return omap;}if(list.size >= SIZE && list.size >= map.size * 2){newList = list.filter(function(entry,idx){return entry !== undefined && i !== idx;});newMap = newList.toKeyedSeq().map(function(entry){return entry[0];}).flip().toMap();if(omap.__ownerID){newMap.__ownerID = newList.__ownerID = omap.__ownerID;}}else {newMap = map.remove(k);newList = i === list.size - 1?list.pop():list.set(i,undefined);}}else {if(has){if(v === list.get(i)[1]){return omap;}newMap = map;newList = list.set(i,[k,v]);}else {newMap = map.set(k,list.size);newList = list.set(list.size,[k,v]);}}if(omap.__ownerID){omap.size = newMap.size;omap._map = newMap;omap._list = newList;omap.__hash = undefined;return omap;}return makeOrderedMap(newMap,newList);}createClass(ToKeyedSequence,KeyedSeq);function ToKeyedSequence(indexed,useKeys){this._iter = indexed;this._useKeys = useKeys;this.size = indexed.size;}ToKeyedSequence.prototype.get = function(key,notSetValue){return this._iter.get(key,notSetValue);};ToKeyedSequence.prototype.has = function(key){return this._iter.has(key);};ToKeyedSequence.prototype.valueSeq = function(){return this._iter.valueSeq();};ToKeyedSequence.prototype.reverse = function(){var this$0=this;var reversedSequence=reverseFactory(this,true);if(!this._useKeys){reversedSequence.valueSeq = function(){return this$0._iter.toSeq().reverse();};}return reversedSequence;};ToKeyedSequence.prototype.map = function(mapper,context){var this$0=this;var mappedSequence=mapFactory(this,mapper,context);if(!this._useKeys){mappedSequence.valueSeq = function(){return this$0._iter.toSeq().map(mapper,context);};}return mappedSequence;};ToKeyedSequence.prototype.__iterate = function(fn,reverse){var this$0=this;var ii;return this._iter.__iterate(this._useKeys?function(v,k){return fn(v,k,this$0);}:(ii = reverse?resolveSize(this):0,function(v){return fn(v,reverse?--ii:ii++,this$0);}),reverse);};ToKeyedSequence.prototype.__iterator = function(type,reverse){if(this._useKeys){return this._iter.__iterator(type,reverse);}var iterator=this._iter.__iterator(ITERATE_VALUES,reverse);var ii=reverse?resolveSize(this):0;return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type,reverse?--ii:ii++,step.value,step);});};ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;createClass(ToIndexedSequence,IndexedSeq);function ToIndexedSequence(iter){this._iter = iter;this.size = iter.size;}ToIndexedSequence.prototype.includes = function(value){return this._iter.includes(value);};ToIndexedSequence.prototype.__iterate = function(fn,reverse){var this$0=this;var iterations=0;return this._iter.__iterate(function(v){return fn(v,iterations++,this$0);},reverse);};ToIndexedSequence.prototype.__iterator = function(type,reverse){var iterator=this._iter.__iterator(ITERATE_VALUES,reverse);var iterations=0;return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type,iterations++,step.value,step);});};createClass(ToSetSequence,SetSeq);function ToSetSequence(iter){this._iter = iter;this.size = iter.size;}ToSetSequence.prototype.has = function(key){return this._iter.includes(key);};ToSetSequence.prototype.__iterate = function(fn,reverse){var this$0=this;return this._iter.__iterate(function(v){return fn(v,v,this$0);},reverse);};ToSetSequence.prototype.__iterator = function(type,reverse){var iterator=this._iter.__iterator(ITERATE_VALUES,reverse);return new Iterator(function(){var step=iterator.next();return step.done?step:iteratorValue(type,step.value,step.value,step);});};createClass(FromEntriesSequence,KeyedSeq);function FromEntriesSequence(entries){this._iter = entries;this.size = entries.size;}FromEntriesSequence.prototype.entrySeq = function(){return this._iter.toSeq();};FromEntriesSequence.prototype.__iterate = function(fn,reverse){var this$0=this;return this._iter.__iterate(function(entry){ // Check if entry exists first so array access doesn't throw for holes
	// in the parent iteration.
	if(entry){validateEntry(entry);var indexedIterable=isIterable(entry);return fn(indexedIterable?entry.get(1):entry[1],indexedIterable?entry.get(0):entry[0],this$0);}},reverse);};FromEntriesSequence.prototype.__iterator = function(type,reverse){var iterator=this._iter.__iterator(ITERATE_VALUES,reverse);return new Iterator(function(){while(true) {var step=iterator.next();if(step.done){return step;}var entry=step.value; // Check if entry exists first so array access doesn't throw for holes
	// in the parent iteration.
	if(entry){validateEntry(entry);var indexedIterable=isIterable(entry);return iteratorValue(type,indexedIterable?entry.get(0):entry[0],indexedIterable?entry.get(1):entry[1],step);}}});};ToIndexedSequence.prototype.cacheResult = ToKeyedSequence.prototype.cacheResult = ToSetSequence.prototype.cacheResult = FromEntriesSequence.prototype.cacheResult = cacheResultThrough;function flipFactory(iterable){var flipSequence=makeSequence(iterable);flipSequence._iter = iterable;flipSequence.size = iterable.size;flipSequence.flip = function(){return iterable;};flipSequence.reverse = function(){var reversedSequence=iterable.reverse.apply(this); // super.reverse()
	reversedSequence.flip = function(){return iterable.reverse();};return reversedSequence;};flipSequence.has = function(key){return iterable.includes(key);};flipSequence.includes = function(key){return iterable.has(key);};flipSequence.cacheResult = cacheResultThrough;flipSequence.__iterateUncached = function(fn,reverse){var this$0=this;return iterable.__iterate(function(v,k){return fn(k,v,this$0) !== false;},reverse);};flipSequence.__iteratorUncached = function(type,reverse){if(type === ITERATE_ENTRIES){var iterator=iterable.__iterator(type,reverse);return new Iterator(function(){var step=iterator.next();if(!step.done){var k=step.value[0];step.value[0] = step.value[1];step.value[1] = k;}return step;});}return iterable.__iterator(type === ITERATE_VALUES?ITERATE_KEYS:ITERATE_VALUES,reverse);};return flipSequence;}function mapFactory(iterable,mapper,context){var mappedSequence=makeSequence(iterable);mappedSequence.size = iterable.size;mappedSequence.has = function(key){return iterable.has(key);};mappedSequence.get = function(key,notSetValue){var v=iterable.get(key,NOT_SET);return v === NOT_SET?notSetValue:mapper.call(context,v,key,iterable);};mappedSequence.__iterateUncached = function(fn,reverse){var this$0=this;return iterable.__iterate(function(v,k,c){return fn(mapper.call(context,v,k,c),k,this$0) !== false;},reverse);};mappedSequence.__iteratorUncached = function(type,reverse){var iterator=iterable.__iterator(ITERATE_ENTRIES,reverse);return new Iterator(function(){var step=iterator.next();if(step.done){return step;}var entry=step.value;var key=entry[0];return iteratorValue(type,key,mapper.call(context,entry[1],key,iterable),step);});};return mappedSequence;}function reverseFactory(iterable,useKeys){var reversedSequence=makeSequence(iterable);reversedSequence._iter = iterable;reversedSequence.size = iterable.size;reversedSequence.reverse = function(){return iterable;};if(iterable.flip){reversedSequence.flip = function(){var flipSequence=flipFactory(iterable);flipSequence.reverse = function(){return iterable.flip();};return flipSequence;};}reversedSequence.get = function(key,notSetValue){return iterable.get(useKeys?key:-1 - key,notSetValue);};reversedSequence.has = function(key){return iterable.has(useKeys?key:-1 - key);};reversedSequence.includes = function(value){return iterable.includes(value);};reversedSequence.cacheResult = cacheResultThrough;reversedSequence.__iterate = function(fn,reverse){var this$0=this;return iterable.__iterate(function(v,k){return fn(v,k,this$0);},!reverse);};reversedSequence.__iterator = function(type,reverse){return iterable.__iterator(type,!reverse);};return reversedSequence;}function filterFactory(iterable,predicate,context,useKeys){var filterSequence=makeSequence(iterable);if(useKeys){filterSequence.has = function(key){var v=iterable.get(key,NOT_SET);return v !== NOT_SET && !!predicate.call(context,v,key,iterable);};filterSequence.get = function(key,notSetValue){var v=iterable.get(key,NOT_SET);return v !== NOT_SET && predicate.call(context,v,key,iterable)?v:notSetValue;};}filterSequence.__iterateUncached = function(fn,reverse){var this$0=this;var iterations=0;iterable.__iterate(function(v,k,c){if(predicate.call(context,v,k,c)){iterations++;return fn(v,useKeys?k:iterations - 1,this$0);}},reverse);return iterations;};filterSequence.__iteratorUncached = function(type,reverse){var iterator=iterable.__iterator(ITERATE_ENTRIES,reverse);var iterations=0;return new Iterator(function(){while(true) {var step=iterator.next();if(step.done){return step;}var entry=step.value;var key=entry[0];var value=entry[1];if(predicate.call(context,value,key,iterable)){return iteratorValue(type,useKeys?key:iterations++,value,step);}}});};return filterSequence;}function countByFactory(iterable,grouper,context){var groups=Map().asMutable();iterable.__iterate(function(v,k){groups.update(grouper.call(context,v,k,iterable),0,function(a){return a + 1;});});return groups.asImmutable();}function groupByFactory(iterable,grouper,context){var isKeyedIter=isKeyed(iterable);var groups=(isOrdered(iterable)?OrderedMap():Map()).asMutable();iterable.__iterate(function(v,k){groups.update(grouper.call(context,v,k,iterable),function(a){return a = a || [],a.push(isKeyedIter?[k,v]:v),a;});});var coerce=iterableClass(iterable);return groups.map(function(arr){return reify(iterable,coerce(arr));});}function sliceFactory(_x,_x2,_x3,_x4){var _again=true;_function: while(_again) {var iterable=_x,begin=_x2,end=_x3,useKeys=_x4;_again = false;var originalSize=iterable.size; // Sanitize begin & end using this shorthand for ToInt32(argument)
	// http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
	if(begin !== undefined){begin = begin | 0;}if(end !== undefined){end = end | 0;}if(wholeSlice(begin,end,originalSize)){return iterable;}var resolvedBegin=resolveBegin(begin,originalSize);var resolvedEnd=resolveEnd(end,originalSize); // begin or end will be NaN if they were provided as negative numbers and
	// this iterable's size is unknown. In that case, cache first so there is
	// a known size and these do not resolve to NaN.
	if(resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd){_x = iterable.toSeq().cacheResult();_x2 = begin;_x3 = end;_x4 = useKeys;_again = true;originalSize = resolvedBegin = resolvedEnd = undefined;continue _function;} // Note: resolvedEnd is undefined when the original sequence's length is
	// unknown and this slice did not supply an end and should contain all
	// elements after resolvedBegin.
	// In that case, resolvedSize will be NaN and sliceSize will remain undefined.
	var resolvedSize=resolvedEnd - resolvedBegin;var sliceSize;if(resolvedSize === resolvedSize){sliceSize = resolvedSize < 0?0:resolvedSize;}var sliceSeq=makeSequence(iterable); // If iterable.size is undefined, the size of the realized sliceSeq is
	// unknown at this point unless the number of items to slice is 0
	sliceSeq.size = sliceSize === 0?sliceSize:iterable.size && sliceSize || undefined;if(!useKeys && isSeq(iterable) && sliceSize >= 0){sliceSeq.get = function(index,notSetValue){index = wrapIndex(this,index);return index >= 0 && index < sliceSize?iterable.get(index + resolvedBegin,notSetValue):notSetValue;};}sliceSeq.__iterateUncached = function(fn,reverse){var this$0=this;if(sliceSize === 0){return 0;}if(reverse){return this.cacheResult().__iterate(fn,reverse);}var skipped=0;var isSkipping=true;var iterations=0;iterable.__iterate(function(v,k){if(!(isSkipping && (isSkipping = skipped++ < resolvedBegin))){iterations++;return fn(v,useKeys?k:iterations - 1,this$0) !== false && iterations !== sliceSize;}});return iterations;};sliceSeq.__iteratorUncached = function(type,reverse){if(sliceSize !== 0 && reverse){return this.cacheResult().__iterator(type,reverse);} // Don't bother instantiating parent iterator if taking 0.
	var iterator=sliceSize !== 0 && iterable.__iterator(type,reverse);var skipped=0;var iterations=0;return new Iterator(function(){while(skipped++ < resolvedBegin) {iterator.next();}if(++iterations > sliceSize){return iteratorDone();}var step=iterator.next();if(useKeys || type === ITERATE_VALUES){return step;}else if(type === ITERATE_KEYS){return iteratorValue(type,iterations - 1,undefined,step);}else {return iteratorValue(type,iterations - 1,step.value[1],step);}});};return sliceSeq;}}function takeWhileFactory(iterable,predicate,context){var takeSequence=makeSequence(iterable);takeSequence.__iterateUncached = function(fn,reverse){var this$0=this;if(reverse){return this.cacheResult().__iterate(fn,reverse);}var iterations=0;iterable.__iterate(function(v,k,c){return predicate.call(context,v,k,c) && ++iterations && fn(v,k,this$0);});return iterations;};takeSequence.__iteratorUncached = function(type,reverse){var this$0=this;if(reverse){return this.cacheResult().__iterator(type,reverse);}var iterator=iterable.__iterator(ITERATE_ENTRIES,reverse);var iterating=true;return new Iterator(function(){if(!iterating){return iteratorDone();}var step=iterator.next();if(step.done){return step;}var entry=step.value;var k=entry[0];var v=entry[1];if(!predicate.call(context,v,k,this$0)){iterating = false;return iteratorDone();}return type === ITERATE_ENTRIES?step:iteratorValue(type,k,v,step);});};return takeSequence;}function skipWhileFactory(iterable,predicate,context,useKeys){var skipSequence=makeSequence(iterable);skipSequence.__iterateUncached = function(fn,reverse){var this$0=this;if(reverse){return this.cacheResult().__iterate(fn,reverse);}var isSkipping=true;var iterations=0;iterable.__iterate(function(v,k,c){if(!(isSkipping && (isSkipping = predicate.call(context,v,k,c)))){iterations++;return fn(v,useKeys?k:iterations - 1,this$0);}});return iterations;};skipSequence.__iteratorUncached = function(type,reverse){var this$0=this;if(reverse){return this.cacheResult().__iterator(type,reverse);}var iterator=iterable.__iterator(ITERATE_ENTRIES,reverse);var skipping=true;var iterations=0;return new Iterator(function(){var step,k,v;do {step = iterator.next();if(step.done){if(useKeys || type === ITERATE_VALUES){return step;}else if(type === ITERATE_KEYS){return iteratorValue(type,iterations++,undefined,step);}else {return iteratorValue(type,iterations++,step.value[1],step);}}var entry=step.value;k = entry[0];v = entry[1];skipping && (skipping = predicate.call(context,v,k,this$0));}while(skipping);return type === ITERATE_ENTRIES?step:iteratorValue(type,k,v,step);});};return skipSequence;}function concatFactory(iterable,values){var isKeyedIterable=isKeyed(iterable);var iters=[iterable].concat(values).map(function(v){if(!isIterable(v)){v = isKeyedIterable?keyedSeqFromValue(v):indexedSeqFromValue(Array.isArray(v)?v:[v]);}else if(isKeyedIterable){v = KeyedIterable(v);}return v;}).filter(function(v){return v.size !== 0;});if(iters.length === 0){return iterable;}if(iters.length === 1){var singleton=iters[0];if(singleton === iterable || isKeyedIterable && isKeyed(singleton) || isIndexed(iterable) && isIndexed(singleton)){return singleton;}}var concatSeq=new ArraySeq(iters);if(isKeyedIterable){concatSeq = concatSeq.toKeyedSeq();}else if(!isIndexed(iterable)){concatSeq = concatSeq.toSetSeq();}concatSeq = concatSeq.flatten(true);concatSeq.size = iters.reduce(function(sum,seq){if(sum !== undefined){var size=seq.size;if(size !== undefined){return sum + size;}}},0);return concatSeq;}function flattenFactory(iterable,depth,useKeys){var flatSequence=makeSequence(iterable);flatSequence.__iterateUncached = function(fn,reverse){var iterations=0;var stopped=false;function flatDeep(iter,currentDepth){var this$0=this;iter.__iterate(function(v,k){if((!depth || currentDepth < depth) && isIterable(v)){flatDeep(v,currentDepth + 1);}else if(fn(v,useKeys?k:iterations++,this$0) === false){stopped = true;}return !stopped;},reverse);}flatDeep(iterable,0);return iterations;};flatSequence.__iteratorUncached = function(type,reverse){var iterator=iterable.__iterator(type,reverse);var stack=[];var iterations=0;return new Iterator(function(){while(iterator) {var step=iterator.next();if(step.done !== false){iterator = stack.pop();continue;}var v=step.value;if(type === ITERATE_ENTRIES){v = v[1];}if((!depth || stack.length < depth) && isIterable(v)){stack.push(iterator);iterator = v.__iterator(type,reverse);}else {return useKeys?step:iteratorValue(type,iterations++,v,step);}}return iteratorDone();});};return flatSequence;}function flatMapFactory(iterable,mapper,context){var coerce=iterableClass(iterable);return iterable.toSeq().map(function(v,k){return coerce(mapper.call(context,v,k,iterable));}).flatten(true);}function interposeFactory(iterable,separator){var interposedSequence=makeSequence(iterable);interposedSequence.size = iterable.size && iterable.size * 2 - 1;interposedSequence.__iterateUncached = function(fn,reverse){var this$0=this;var iterations=0;iterable.__iterate(function(v,k){return (!iterations || fn(separator,iterations++,this$0) !== false) && fn(v,iterations++,this$0) !== false;},reverse);return iterations;};interposedSequence.__iteratorUncached = function(type,reverse){var iterator=iterable.__iterator(ITERATE_VALUES,reverse);var iterations=0;var step;return new Iterator(function(){if(!step || iterations % 2){step = iterator.next();if(step.done){return step;}}return iterations % 2?iteratorValue(type,iterations++,separator):iteratorValue(type,iterations++,step.value,step);});};return interposedSequence;}function sortFactory(iterable,comparator,mapper){if(!comparator){comparator = defaultComparator;}var isKeyedIterable=isKeyed(iterable);var index=0;var entries=iterable.toSeq().map(function(v,k){return [k,v,index++,mapper?mapper(v,k,iterable):v];}).toArray();entries.sort(function(a,b){return comparator(a[3],b[3]) || a[2] - b[2];}).forEach(isKeyedIterable?function(v,i){entries[i].length = 2;}:function(v,i){entries[i] = v[1];});return isKeyedIterable?KeyedSeq(entries):isIndexed(iterable)?IndexedSeq(entries):SetSeq(entries);}function maxFactory(iterable,comparator,mapper){if(!comparator){comparator = defaultComparator;}if(mapper){var entry=iterable.toSeq().map(function(v,k){return [v,mapper(v,k,iterable)];}).reduce(function(a,b){return maxCompare(comparator,a[1],b[1])?b:a;});return entry && entry[0];}else {return iterable.reduce(function(a,b){return maxCompare(comparator,a,b)?b:a;});}}function maxCompare(comparator,a,b){var comp=comparator(b,a); // b is considered the new max if the comparator declares them equal, but
	// they are not equal and b is in fact a nullish value.
	return comp === 0 && b !== a && (b === undefined || b === null || b !== b) || comp > 0;}function zipWithFactory(keyIter,zipper,iters){var zipSequence=makeSequence(keyIter);zipSequence.size = new ArraySeq(iters).map(function(i){return i.size;}).min(); // Note: this a generic base implementation of __iterate in terms of
	// __iterator which may be more generically useful in the future.
	zipSequence.__iterate = function(fn,reverse){ /* generic:
	      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        iterations++;
	        if (fn(step.value[1], step.value[0], this) === false) {
	          break;
	        }
	      }
	      return iterations;
	      */ // indexed:
	var iterator=this.__iterator(ITERATE_VALUES,reverse);var step;var iterations=0;while(!(step = iterator.next()).done) {if(fn(step.value,iterations++,this) === false){break;}}return iterations;};zipSequence.__iteratorUncached = function(type,reverse){var iterators=iters.map(function(i){return i = Iterable(i),getIterator(reverse?i.reverse():i);});var iterations=0;var isDone=false;return new Iterator(function(){var steps;if(!isDone){steps = iterators.map(function(i){return i.next();});isDone = steps.some(function(s){return s.done;});}if(isDone){return iteratorDone();}return iteratorValue(type,iterations++,zipper.apply(null,steps.map(function(s){return s.value;})));});};return zipSequence;} // #pragma Helper Functions
	function reify(iter,seq){return isSeq(iter)?seq:iter.constructor(seq);}function validateEntry(entry){if(entry !== Object(entry)){throw new TypeError('Expected [K, V] tuple: ' + entry);}}function resolveSize(iter){assertNotInfinite(iter.size);return ensureSize(iter);}function iterableClass(iterable){return isKeyed(iterable)?KeyedIterable:isIndexed(iterable)?IndexedIterable:SetIterable;}function makeSequence(iterable){return Object.create((isKeyed(iterable)?KeyedSeq:isIndexed(iterable)?IndexedSeq:SetSeq).prototype);}function cacheResultThrough(){if(this._iter.cacheResult){this._iter.cacheResult();this.size = this._iter.size;return this;}else {return Seq.prototype.cacheResult.call(this);}}function defaultComparator(a,b){return a > b?1:a < b?-1:0;}function forceIterator(keyPath){var iter=getIterator(keyPath);if(!iter){ // Array might not be iterable in this environment, so we need a fallback
	// to our wrapped type.
	if(!isArrayLike(keyPath)){throw new TypeError('Expected iterable or array-like: ' + keyPath);}iter = getIterator(Iterable(keyPath));}return iter;}createClass(Record,KeyedCollection);function Record(defaultValues,name){var hasInitialized;var RecordType=function Record(values){if(values instanceof RecordType){return values;}if(!(this instanceof RecordType)){return new RecordType(values);}if(!hasInitialized){hasInitialized = true;var keys=Object.keys(defaultValues);setProps(RecordTypePrototype,keys);RecordTypePrototype.size = keys.length;RecordTypePrototype._name = name;RecordTypePrototype._keys = keys;RecordTypePrototype._defaultValues = defaultValues;}this._map = Map(values);};var RecordTypePrototype=RecordType.prototype = Object.create(RecordPrototype);RecordTypePrototype.constructor = RecordType;return RecordType;}Record.prototype.toString = function(){return this.__toString(recordName(this) + ' {','}');}; // @pragma Access
	Record.prototype.has = function(k){return this._defaultValues.hasOwnProperty(k);};Record.prototype.get = function(k,notSetValue){if(!this.has(k)){return notSetValue;}var defaultVal=this._defaultValues[k];return this._map?this._map.get(k,defaultVal):defaultVal;}; // @pragma Modification
	Record.prototype.clear = function(){if(this.__ownerID){this._map && this._map.clear();return this;}var RecordType=this.constructor;return RecordType._empty || (RecordType._empty = makeRecord(this,emptyMap()));};Record.prototype.set = function(k,v){if(!this.has(k)){throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));}var newMap=this._map && this._map.set(k,v);if(this.__ownerID || newMap === this._map){return this;}return makeRecord(this,newMap);};Record.prototype.remove = function(k){if(!this.has(k)){return this;}var newMap=this._map && this._map.remove(k);if(this.__ownerID || newMap === this._map){return this;}return makeRecord(this,newMap);};Record.prototype.wasAltered = function(){return this._map.wasAltered();};Record.prototype.__iterator = function(type,reverse){var this$0=this;return KeyedIterable(this._defaultValues).map(function(_,k){return this$0.get(k);}).__iterator(type,reverse);};Record.prototype.__iterate = function(fn,reverse){var this$0=this;return KeyedIterable(this._defaultValues).map(function(_,k){return this$0.get(k);}).__iterate(fn,reverse);};Record.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}var newMap=this._map && this._map.__ensureOwner(ownerID);if(!ownerID){this.__ownerID = ownerID;this._map = newMap;return this;}return makeRecord(this,newMap,ownerID);};var RecordPrototype=Record.prototype;RecordPrototype[DELETE] = RecordPrototype.remove;RecordPrototype.deleteIn = RecordPrototype.removeIn = MapPrototype.removeIn;RecordPrototype.merge = MapPrototype.merge;RecordPrototype.mergeWith = MapPrototype.mergeWith;RecordPrototype.mergeIn = MapPrototype.mergeIn;RecordPrototype.mergeDeep = MapPrototype.mergeDeep;RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;RecordPrototype.setIn = MapPrototype.setIn;RecordPrototype.update = MapPrototype.update;RecordPrototype.updateIn = MapPrototype.updateIn;RecordPrototype.withMutations = MapPrototype.withMutations;RecordPrototype.asMutable = MapPrototype.asMutable;RecordPrototype.asImmutable = MapPrototype.asImmutable;function makeRecord(likeRecord,map,ownerID){var record=Object.create(Object.getPrototypeOf(likeRecord));record._map = map;record.__ownerID = ownerID;return record;}function recordName(record){return record._name || record.constructor.name || 'Record';}function setProps(prototype,names){try{names.forEach(setProp.bind(undefined,prototype));}catch(error) { // Object.defineProperty failed. Probably IE8.
	}}function setProp(prototype,name){Object.defineProperty(prototype,name,{get:function get(){return this.get(name);},set:function set(value){invariant(this.__ownerID,'Cannot set on an immutable record.');this.set(name,value);}});}createClass(Set,SetCollection); // @pragma Construction
	function Set(value){return value === null || value === undefined?emptySet():isSet(value) && !isOrdered(value)?value:emptySet().withMutations(function(set){var iter=SetIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v){return set.add(v);});});}Set.of = function() /*...values*/{return this(arguments);};Set.fromKeys = function(value){return this(KeyedIterable(value).keySeq());};Set.prototype.toString = function(){return this.__toString('Set {','}');}; // @pragma Access
	Set.prototype.has = function(value){return this._map.has(value);}; // @pragma Modification
	Set.prototype.add = function(value){return updateSet(this,this._map.set(value,true));};Set.prototype.remove = function(value){return updateSet(this,this._map.remove(value));};Set.prototype.clear = function(){return updateSet(this,this._map.clear());}; // @pragma Composition
	Set.prototype.union = function(){var iters=SLICE$0.call(arguments,0);iters = iters.filter(function(x){return x.size !== 0;});if(iters.length === 0){return this;}if(this.size === 0 && !this.__ownerID && iters.length === 1){return this.constructor(iters[0]);}return this.withMutations(function(set){for(var ii=0;ii < iters.length;ii++) {SetIterable(iters[ii]).forEach(function(value){return set.add(value);});}});};Set.prototype.intersect = function(){var iters=SLICE$0.call(arguments,0);if(iters.length === 0){return this;}iters = iters.map(function(iter){return SetIterable(iter);});var originalSet=this;return this.withMutations(function(set){originalSet.forEach(function(value){if(!iters.every(function(iter){return iter.includes(value);})){set.remove(value);}});});};Set.prototype.subtract = function(){var iters=SLICE$0.call(arguments,0);if(iters.length === 0){return this;}iters = iters.map(function(iter){return SetIterable(iter);});var originalSet=this;return this.withMutations(function(set){originalSet.forEach(function(value){if(iters.some(function(iter){return iter.includes(value);})){set.remove(value);}});});};Set.prototype.merge = function(){return this.union.apply(this,arguments);};Set.prototype.mergeWith = function(merger){var iters=SLICE$0.call(arguments,1);return this.union.apply(this,iters);};Set.prototype.sort = function(comparator){ // Late binding
	return OrderedSet(sortFactory(this,comparator));};Set.prototype.sortBy = function(mapper,comparator){ // Late binding
	return OrderedSet(sortFactory(this,comparator,mapper));};Set.prototype.wasAltered = function(){return this._map.wasAltered();};Set.prototype.__iterate = function(fn,reverse){var this$0=this;return this._map.__iterate(function(_,k){return fn(k,k,this$0);},reverse);};Set.prototype.__iterator = function(type,reverse){return this._map.map(function(_,k){return k;}).__iterator(type,reverse);};Set.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}var newMap=this._map.__ensureOwner(ownerID);if(!ownerID){this.__ownerID = ownerID;this._map = newMap;return this;}return this.__make(newMap,ownerID);};function isSet(maybeSet){return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);}Set.isSet = isSet;var IS_SET_SENTINEL='@@__IMMUTABLE_SET__@@';var SetPrototype=Set.prototype;SetPrototype[IS_SET_SENTINEL] = true;SetPrototype[DELETE] = SetPrototype.remove;SetPrototype.mergeDeep = SetPrototype.merge;SetPrototype.mergeDeepWith = SetPrototype.mergeWith;SetPrototype.withMutations = MapPrototype.withMutations;SetPrototype.asMutable = MapPrototype.asMutable;SetPrototype.asImmutable = MapPrototype.asImmutable;SetPrototype.__empty = emptySet;SetPrototype.__make = makeSet;function updateSet(set,newMap){if(set.__ownerID){set.size = newMap.size;set._map = newMap;return set;}return newMap === set._map?set:newMap.size === 0?set.__empty():set.__make(newMap);}function makeSet(map,ownerID){var set=Object.create(SetPrototype);set.size = map?map.size:0;set._map = map;set.__ownerID = ownerID;return set;}var EMPTY_SET;function emptySet(){return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));}createClass(OrderedSet,Set); // @pragma Construction
	function OrderedSet(value){return value === null || value === undefined?emptyOrderedSet():isOrderedSet(value)?value:emptyOrderedSet().withMutations(function(set){var iter=SetIterable(value);assertNotInfinite(iter.size);iter.forEach(function(v){return set.add(v);});});}OrderedSet.of = function() /*...values*/{return this(arguments);};OrderedSet.fromKeys = function(value){return this(KeyedIterable(value).keySeq());};OrderedSet.prototype.toString = function(){return this.__toString('OrderedSet {','}');};function isOrderedSet(maybeOrderedSet){return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);}OrderedSet.isOrderedSet = isOrderedSet;var OrderedSetPrototype=OrderedSet.prototype;OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;OrderedSetPrototype.__empty = emptyOrderedSet;OrderedSetPrototype.__make = makeOrderedSet;function makeOrderedSet(map,ownerID){var set=Object.create(OrderedSetPrototype);set.size = map?map.size:0;set._map = map;set.__ownerID = ownerID;return set;}var EMPTY_ORDERED_SET;function emptyOrderedSet(){return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));}createClass(Stack,IndexedCollection); // @pragma Construction
	function Stack(value){return value === null || value === undefined?emptyStack():isStack(value)?value:emptyStack().unshiftAll(value);}Stack.of = function() /*...values*/{return this(arguments);};Stack.prototype.toString = function(){return this.__toString('Stack [',']');}; // @pragma Access
	Stack.prototype.get = function(index,notSetValue){var head=this._head;index = wrapIndex(this,index);while(head && index--) {head = head.next;}return head?head.value:notSetValue;};Stack.prototype.peek = function(){return this._head && this._head.value;}; // @pragma Modification
	Stack.prototype.push = function() /*...values*/{if(arguments.length === 0){return this;}var newSize=this.size + arguments.length;var head=this._head;for(var ii=arguments.length - 1;ii >= 0;ii--) {head = {value:arguments[ii],next:head};}if(this.__ownerID){this.size = newSize;this._head = head;this.__hash = undefined;this.__altered = true;return this;}return makeStack(newSize,head);};Stack.prototype.pushAll = function(iter){iter = IndexedIterable(iter);if(iter.size === 0){return this;}assertNotInfinite(iter.size);var newSize=this.size;var head=this._head;iter.reverse().forEach(function(value){newSize++;head = {value:value,next:head};});if(this.__ownerID){this.size = newSize;this._head = head;this.__hash = undefined;this.__altered = true;return this;}return makeStack(newSize,head);};Stack.prototype.pop = function(){return this.slice(1);};Stack.prototype.unshift = function() /*...values*/{return this.push.apply(this,arguments);};Stack.prototype.unshiftAll = function(iter){return this.pushAll(iter);};Stack.prototype.shift = function(){return this.pop.apply(this,arguments);};Stack.prototype.clear = function(){if(this.size === 0){return this;}if(this.__ownerID){this.size = 0;this._head = undefined;this.__hash = undefined;this.__altered = true;return this;}return emptyStack();};Stack.prototype.slice = function(begin,end){if(wholeSlice(begin,end,this.size)){return this;}var resolvedBegin=resolveBegin(begin,this.size);var resolvedEnd=resolveEnd(end,this.size);if(resolvedEnd !== this.size){ // super.slice(begin, end);
	return IndexedCollection.prototype.slice.call(this,begin,end);}var newSize=this.size - resolvedBegin;var head=this._head;while(resolvedBegin--) {head = head.next;}if(this.__ownerID){this.size = newSize;this._head = head;this.__hash = undefined;this.__altered = true;return this;}return makeStack(newSize,head);}; // @pragma Mutability
	Stack.prototype.__ensureOwner = function(ownerID){if(ownerID === this.__ownerID){return this;}if(!ownerID){this.__ownerID = ownerID;this.__altered = false;return this;}return makeStack(this.size,this._head,ownerID,this.__hash);}; // @pragma Iteration
	Stack.prototype.__iterate = function(fn,reverse){if(reverse){return this.reverse().__iterate(fn);}var iterations=0;var node=this._head;while(node) {if(fn(node.value,iterations++,this) === false){break;}node = node.next;}return iterations;};Stack.prototype.__iterator = function(type,reverse){if(reverse){return this.reverse().__iterator(type);}var iterations=0;var node=this._head;return new Iterator(function(){if(node){var value=node.value;node = node.next;return iteratorValue(type,iterations++,value);}return iteratorDone();});};function isStack(maybeStack){return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);}Stack.isStack = isStack;var IS_STACK_SENTINEL='@@__IMMUTABLE_STACK__@@';var StackPrototype=Stack.prototype;StackPrototype[IS_STACK_SENTINEL] = true;StackPrototype.withMutations = MapPrototype.withMutations;StackPrototype.asMutable = MapPrototype.asMutable;StackPrototype.asImmutable = MapPrototype.asImmutable;StackPrototype.wasAltered = MapPrototype.wasAltered;function makeStack(size,head,ownerID,hash){var map=Object.create(StackPrototype);map.size = size;map._head = head;map.__ownerID = ownerID;map.__hash = hash;map.__altered = false;return map;}var EMPTY_STACK;function emptyStack(){return EMPTY_STACK || (EMPTY_STACK = makeStack(0));} /**
	   * Contributes additional methods to a constructor
	   */function mixin(ctor,methods){var keyCopier=function keyCopier(key){ctor.prototype[key] = methods[key];};Object.keys(methods).forEach(keyCopier);Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(methods).forEach(keyCopier);return ctor;}Iterable.Iterator = Iterator;mixin(Iterable,{ // ### Conversion to other types
	toArray:function toArray(){assertNotInfinite(this.size);var array=new Array(this.size || 0);this.valueSeq().__iterate(function(v,i){array[i] = v;});return array;},toIndexedSeq:function toIndexedSeq(){return new ToIndexedSequence(this);},toJS:function toJS(){return this.toSeq().map(function(value){return value && typeof value.toJS === 'function'?value.toJS():value;}).__toJS();},toJSON:function toJSON(){return this.toSeq().map(function(value){return value && typeof value.toJSON === 'function'?value.toJSON():value;}).__toJS();},toKeyedSeq:function toKeyedSeq(){return new ToKeyedSequence(this,true);},toMap:function toMap(){ // Use Late Binding here to solve the circular dependency.
	return Map(this.toKeyedSeq());},toObject:function toObject(){assertNotInfinite(this.size);var object={};this.__iterate(function(v,k){object[k] = v;});return object;},toOrderedMap:function toOrderedMap(){ // Use Late Binding here to solve the circular dependency.
	return OrderedMap(this.toKeyedSeq());},toOrderedSet:function toOrderedSet(){ // Use Late Binding here to solve the circular dependency.
	return OrderedSet(isKeyed(this)?this.valueSeq():this);},toSet:function toSet(){ // Use Late Binding here to solve the circular dependency.
	return Set(isKeyed(this)?this.valueSeq():this);},toSetSeq:function toSetSeq(){return new ToSetSequence(this);},toSeq:function toSeq(){return isIndexed(this)?this.toIndexedSeq():isKeyed(this)?this.toKeyedSeq():this.toSetSeq();},toStack:function toStack(){ // Use Late Binding here to solve the circular dependency.
	return Stack(isKeyed(this)?this.valueSeq():this);},toList:function toList(){ // Use Late Binding here to solve the circular dependency.
	return List(isKeyed(this)?this.valueSeq():this);}, // ### Common JavaScript methods and properties
	toString:function toString(){return '[Iterable]';},__toString:function __toString(head,tail){if(this.size === 0){return head + tail;}return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;}, // ### ES6 Collection methods (ES6 Array and Map)
	concat:function concat(){var values=SLICE$0.call(arguments,0);return reify(this,concatFactory(this,values));},includes:function includes(searchValue){return this.some(function(value){return is(value,searchValue);});},entries:function entries(){return this.__iterator(ITERATE_ENTRIES);},every:function every(predicate,context){assertNotInfinite(this.size);var returnValue=true;this.__iterate(function(v,k,c){if(!predicate.call(context,v,k,c)){returnValue = false;return false;}});return returnValue;},filter:function filter(predicate,context){return reify(this,filterFactory(this,predicate,context,true));},find:function find(predicate,context,notSetValue){var entry=this.findEntry(predicate,context);return entry?entry[1]:notSetValue;},findEntry:function findEntry(predicate,context){var found;this.__iterate(function(v,k,c){if(predicate.call(context,v,k,c)){found = [k,v];return false;}});return found;},findLastEntry:function findLastEntry(predicate,context){return this.toSeq().reverse().findEntry(predicate,context);},forEach:function forEach(sideEffect,context){assertNotInfinite(this.size);return this.__iterate(context?sideEffect.bind(context):sideEffect);},join:function join(separator){assertNotInfinite(this.size);separator = separator !== undefined?'' + separator:',';var joined='';var isFirst=true;this.__iterate(function(v){isFirst?isFirst = false:joined += separator;joined += v !== null && v !== undefined?v.toString():'';});return joined;},keys:function keys(){return this.__iterator(ITERATE_KEYS);},map:function map(mapper,context){return reify(this,mapFactory(this,mapper,context));},reduce:function reduce(reducer,initialReduction,context){assertNotInfinite(this.size);var reduction;var useFirst;if(arguments.length < 2){useFirst = true;}else {reduction = initialReduction;}this.__iterate(function(v,k,c){if(useFirst){useFirst = false;reduction = v;}else {reduction = reducer.call(context,reduction,v,k,c);}});return reduction;},reduceRight:function reduceRight(reducer,initialReduction,context){var reversed=this.toKeyedSeq().reverse();return reversed.reduce.apply(reversed,arguments);},reverse:function reverse(){return reify(this,reverseFactory(this,true));},slice:function slice(begin,end){return reify(this,sliceFactory(this,begin,end,true));},some:function some(predicate,context){return !this.every(not(predicate),context);},sort:function sort(comparator){return reify(this,sortFactory(this,comparator));},values:function values(){return this.__iterator(ITERATE_VALUES);}, // ### More sequential methods
	butLast:function butLast(){return this.slice(0,-1);},isEmpty:function isEmpty(){return this.size !== undefined?this.size === 0:!this.some(function(){return true;});},count:function count(predicate,context){return ensureSize(predicate?this.toSeq().filter(predicate,context):this);},countBy:function countBy(grouper,context){return countByFactory(this,grouper,context);},equals:function equals(other){return deepEqual(this,other);},entrySeq:function entrySeq(){var iterable=this;if(iterable._cache){ // We cache as an entries array, so we can just return the cache!
	return new ArraySeq(iterable._cache);}var entriesSequence=iterable.toSeq().map(entryMapper).toIndexedSeq();entriesSequence.fromEntrySeq = function(){return iterable.toSeq();};return entriesSequence;},filterNot:function filterNot(predicate,context){return this.filter(not(predicate),context);},findLast:function findLast(predicate,context,notSetValue){return this.toKeyedSeq().reverse().find(predicate,context,notSetValue);},first:function first(){return this.find(returnTrue);},flatMap:function flatMap(mapper,context){return reify(this,flatMapFactory(this,mapper,context));},flatten:function flatten(depth){return reify(this,flattenFactory(this,depth,true));},fromEntrySeq:function fromEntrySeq(){return new FromEntriesSequence(this);},get:function get(searchKey,notSetValue){return this.find(function(_,key){return is(key,searchKey);},undefined,notSetValue);},getIn:function getIn(searchKeyPath,notSetValue){var nested=this; // Note: in an ES6 environment, we would prefer:
	// for (var key of searchKeyPath) {
	var iter=forceIterator(searchKeyPath);var step;while(!(step = iter.next()).done) {var key=step.value;nested = nested && nested.get?nested.get(key,NOT_SET):NOT_SET;if(nested === NOT_SET){return notSetValue;}}return nested;},groupBy:function groupBy(grouper,context){return groupByFactory(this,grouper,context);},has:function has(searchKey){return this.get(searchKey,NOT_SET) !== NOT_SET;},hasIn:function hasIn(searchKeyPath){return this.getIn(searchKeyPath,NOT_SET) !== NOT_SET;},isSubset:function isSubset(iter){iter = typeof iter.includes === 'function'?iter:Iterable(iter);return this.every(function(value){return iter.includes(value);});},isSuperset:function isSuperset(iter){iter = typeof iter.isSubset === 'function'?iter:Iterable(iter);return iter.isSubset(this);},keySeq:function keySeq(){return this.toSeq().map(keyMapper).toIndexedSeq();},last:function last(){return this.toSeq().reverse().first();},max:function max(comparator){return maxFactory(this,comparator);},maxBy:function maxBy(mapper,comparator){return maxFactory(this,comparator,mapper);},min:function min(comparator){return maxFactory(this,comparator?neg(comparator):defaultNegComparator);},minBy:function minBy(mapper,comparator){return maxFactory(this,comparator?neg(comparator):defaultNegComparator,mapper);},rest:function rest(){return this.slice(1);},skip:function skip(amount){return this.slice(Math.max(0,amount));},skipLast:function skipLast(amount){return reify(this,this.toSeq().reverse().skip(amount).reverse());},skipWhile:function skipWhile(predicate,context){return reify(this,skipWhileFactory(this,predicate,context,true));},skipUntil:function skipUntil(predicate,context){return this.skipWhile(not(predicate),context);},sortBy:function sortBy(mapper,comparator){return reify(this,sortFactory(this,comparator,mapper));},take:function take(amount){return this.slice(0,Math.max(0,amount));},takeLast:function takeLast(amount){return reify(this,this.toSeq().reverse().take(amount).reverse());},takeWhile:function takeWhile(predicate,context){return reify(this,takeWhileFactory(this,predicate,context));},takeUntil:function takeUntil(predicate,context){return this.takeWhile(not(predicate),context);},valueSeq:function valueSeq(){return this.toIndexedSeq();}, // ### Hashable Object
	hashCode:function hashCode(){return this.__hash || (this.__hash = hashIterable(this));} // ### Internal
	// abstract __iterate(fn, reverse)
	// abstract __iterator(type, reverse)
	}); // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
	// var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
	// var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
	// var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';
	var IterablePrototype=Iterable.prototype;IterablePrototype[IS_ITERABLE_SENTINEL] = true;IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;IterablePrototype.__toJS = IterablePrototype.toArray;IterablePrototype.__toStringMapper = quoteString;IterablePrototype.inspect = IterablePrototype.toSource = function(){return this.toString();};IterablePrototype.chain = IterablePrototype.flatMap;IterablePrototype.contains = IterablePrototype.includes; // Temporary warning about using length
	(function(){try{Object.defineProperty(IterablePrototype,'length',{get:function get(){if(!Iterable.noLengthWarning){var stack;try{throw new Error();}catch(error) {stack = error.stack;}if(stack.indexOf('_wrapObject') === -1){console && console.warn && console.warn('iterable.length has been deprecated, ' + 'use iterable.size or iterable.count(). ' + 'This warning will become a silent error in a future version. ' + stack);return this.size;}}}});}catch(e) {}})();mixin(KeyedIterable,{ // ### More sequential methods
	flip:function flip(){return reify(this,flipFactory(this));},findKey:function findKey(predicate,context){var entry=this.findEntry(predicate,context);return entry && entry[0];},findLastKey:function findLastKey(predicate,context){return this.toSeq().reverse().findKey(predicate,context);},keyOf:function keyOf(searchValue){return this.findKey(function(value){return is(value,searchValue);});},lastKeyOf:function lastKeyOf(searchValue){return this.findLastKey(function(value){return is(value,searchValue);});},mapEntries:function mapEntries(mapper,context){var this$0=this;var iterations=0;return reify(this,this.toSeq().map(function(v,k){return mapper.call(context,[k,v],iterations++,this$0);}).fromEntrySeq());},mapKeys:function mapKeys(mapper,context){var this$0=this;return reify(this,this.toSeq().flip().map(function(k,v){return mapper.call(context,k,v,this$0);}).flip());}});var KeyedIterablePrototype=KeyedIterable.prototype;KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;KeyedIterablePrototype.__toJS = IterablePrototype.toObject;KeyedIterablePrototype.__toStringMapper = function(v,k){return JSON.stringify(k) + ': ' + quoteString(v);};mixin(IndexedIterable,{ // ### Conversion to other types
	toKeyedSeq:function toKeyedSeq(){return new ToKeyedSequence(this,false);}, // ### ES6 Collection methods (ES6 Array and Map)
	filter:function filter(predicate,context){return reify(this,filterFactory(this,predicate,context,false));},findIndex:function findIndex(predicate,context){var entry=this.findEntry(predicate,context);return entry?entry[0]:-1;},indexOf:function indexOf(searchValue){var key=this.toKeyedSeq().keyOf(searchValue);return key === undefined?-1:key;},lastIndexOf:function lastIndexOf(searchValue){var key=this.toKeyedSeq().reverse().keyOf(searchValue);return key === undefined?-1:key; // var index =
	// return this.toSeq().reverse().indexOf(searchValue);
	},reverse:function reverse(){return reify(this,reverseFactory(this,false));},slice:function slice(begin,end){return reify(this,sliceFactory(this,begin,end,false));},splice:function splice(index,removeNum /*, ...values*/){var numArgs=arguments.length;removeNum = Math.max(removeNum | 0,0);if(numArgs === 0 || numArgs === 2 && !removeNum){return this;} // If index is negative, it should resolve relative to the size of the
	// collection. However size may be expensive to compute if not cached, so
	// only call count() if the number is in fact negative.
	index = resolveBegin(index,index < 0?this.count():this.size);var spliced=this.slice(0,index);return reify(this,numArgs === 1?spliced:spliced.concat(arrCopy(arguments,2),this.slice(index + removeNum)));}, // ### More collection methods
	findLastIndex:function findLastIndex(predicate,context){var key=this.toKeyedSeq().findLastKey(predicate,context);return key === undefined?-1:key;},first:function first(){return this.get(0);},flatten:function flatten(depth){return reify(this,flattenFactory(this,depth,false));},get:function get(index,notSetValue){index = wrapIndex(this,index);return index < 0 || this.size === Infinity || this.size !== undefined && index > this.size?notSetValue:this.find(function(_,key){return key === index;},undefined,notSetValue);},has:function has(index){index = wrapIndex(this,index);return index >= 0 && (this.size !== undefined?this.size === Infinity || index < this.size:this.indexOf(index) !== -1);},interpose:function interpose(separator){return reify(this,interposeFactory(this,separator));},interleave:function interleave() /*...iterables*/{var iterables=[this].concat(arrCopy(arguments));var zipped=zipWithFactory(this.toSeq(),IndexedSeq.of,iterables);var interleaved=zipped.flatten(true);if(zipped.size){interleaved.size = zipped.size * iterables.length;}return reify(this,interleaved);},last:function last(){return this.get(-1);},skipWhile:function skipWhile(predicate,context){return reify(this,skipWhileFactory(this,predicate,context,false));},zip:function zip() /*, ...iterables */{var iterables=[this].concat(arrCopy(arguments));return reify(this,zipWithFactory(this,defaultZipper,iterables));},zipWith:function zipWith(zipper /*, ...iterables */){var iterables=arrCopy(arguments);iterables[0] = this;return reify(this,zipWithFactory(this,zipper,iterables));}});IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;mixin(SetIterable,{ // ### ES6 Collection methods (ES6 Array and Map)
	get:function get(value,notSetValue){return this.has(value)?value:notSetValue;},includes:function includes(value){return this.has(value);}, // ### More sequential methods
	keySeq:function keySeq(){return this.valueSeq();}});SetIterable.prototype.has = IterablePrototype.includes; // Mixin subclasses
	mixin(KeyedSeq,KeyedIterable.prototype);mixin(IndexedSeq,IndexedIterable.prototype);mixin(SetSeq,SetIterable.prototype);mixin(KeyedCollection,KeyedIterable.prototype);mixin(IndexedCollection,IndexedIterable.prototype);mixin(SetCollection,SetIterable.prototype); // #pragma Helper functions
	function keyMapper(v,k){return k;}function entryMapper(v,k){return [k,v];}function not(predicate){return function(){return !predicate.apply(this,arguments);};}function neg(predicate){return function(){return -predicate.apply(this,arguments);};}function quoteString(value){return typeof value === 'string'?JSON.stringify(value):value;}function defaultZipper(){return arrCopy(arguments);}function defaultNegComparator(a,b){return a < b?1:a > b?-1:0;}function hashIterable(iterable){if(iterable.size === Infinity){return 0;}var ordered=isOrdered(iterable);var keyed=isKeyed(iterable);var h=ordered?1:0;var size=iterable.__iterate(keyed?ordered?function(v,k){h = 31 * h + hashMerge(hash(v),hash(k)) | 0;}:function(v,k){h = h + hashMerge(hash(v),hash(k)) | 0;}:ordered?function(v){h = 31 * h + hash(v) | 0;}:function(v){h = h + hash(v) | 0;});return murmurHashOfSize(size,h);}function murmurHashOfSize(size,h){h = imul(h,0xCC9E2D51);h = imul(h << 15 | h >>> -15,0x1B873593);h = imul(h << 13 | h >>> -13,5);h = (h + 0xE6546B64 | 0) ^ size;h = imul(h ^ h >>> 16,0x85EBCA6B);h = imul(h ^ h >>> 13,0xC2B2AE35);h = smi(h ^ h >>> 16);return h;}function hashMerge(a,b){return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
	}var Immutable={Iterable:Iterable,Seq:Seq,Collection:Collection,Map:Map,OrderedMap:OrderedMap,List:List,Stack:Stack,Set:Set,OrderedSet:OrderedSet,Record:Record,Range:Range,Repeat:Repeat,is:is,fromJS:fromJS};return Immutable;});

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = createReducer;
	
	function createReducer(handlers, initialState) {
	    return function (state, action) {
	        if (state === undefined) state = initialState;
	
	        if (!(action.type in handlers)) {
	            return state;
	        }
	        return handlers[action.type](state, action);
	    };
	}
	
	module.exports = exports["default"];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _immutable = __webpack_require__(19);
	
	var _utilsCreate_reducer = __webpack_require__(20);
	
	var _utilsCreate_reducer2 = _interopRequireDefault(_utilsCreate_reducer);
	
	var initialState = (0, _immutable.Map)({
	    size: {
	        width: 0,
	        height: 0
	    },
	    el: undefined,
	    canvas: undefined,
	    renderer: undefined,
	    resizeWithWindow: true
	});
	
	var handlers = {
	    'RECEIVE_SIZE': function RECEIVE_SIZE(state, action) {
	        return state.set('size', action.size);
	    },
	    'RECEIVE_EL': function RECEIVE_EL(state, action) {
	        return state.set('el', action.el);
	    },
	    'RECEIVE_CANVAS': function RECEIVE_CANVAS(state, action) {
	        return state.set('canvas', action.canvas);
	    },
	    'RECEIVE_RENDERER': function RECEIVE_RENDERER(state, action) {
	        return state.set('renderer', action.renderer);
	    }
	};
	
	var reducer = (0, _utilsCreate_reducer2['default'])(handlers, initialState);
	
	exports['default'] = reducer;
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _immutable = __webpack_require__(19);
	
	var _utilsCreate_reducer = __webpack_require__(20);
	
	var _utilsCreate_reducer2 = _interopRequireDefault(_utilsCreate_reducer);
	
	var initialState = (0, _immutable.Map)({
	    fonts: (0, _immutable.Map)({})
	});
	
	var handlers = {
	    REGISTER_FONT: function REGISTER_FONT(state, action) {
	        var fonts = state.get('fonts');
	
	        fonts = fonts.set(action.name, action.font);
	
	        return state.set('fonts', fonts);
	    }
	};
	
	var reducer = (0, _utilsCreate_reducer2['default'])(handlers, initialState);
	exports['default'] = reducer;
	module.exports = exports['default'];

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _immutable = __webpack_require__(19);
	
	var _utilsCreate_reducer = __webpack_require__(20);
	
	var _utilsCreate_reducer2 = _interopRequireDefault(_utilsCreate_reducer);
	
	var initialState = (0, _immutable.Map)({
	    cameraController: undefined,
	
	    targetDrawCallLimit: 400,
	
	    actors: (0, _immutable.Map)({}),
	    groups: (0, _immutable.Map)([]),
	
	    meshes: (0, _immutable.List)([]),
	    materials: (0, _immutable.List)([])
	});
	
	var handlers = {
	    'ADD_CAMERA_CONTROLLER': function ADD_CAMERA_CONTROLLER(state, action) {
	        return state.set('cameraController', action.controller);
	    },
	
	    'ADD_ACTOR': function ADD_ACTOR(state, action) {
	        var actors = state.get('actors');
	
	        actors = actors.set(action.actor.name, action.actor);
	
	        return state.set('actors', actors);
	    },
	
	    'ADD_GROUP': function ADD_GROUP(state, action) {
	        var groups = state.get('groups');
	
	        groups = groups.set(action.group.name, action.group);
	
	        return state.set('groups', groups);
	    },
	
	    'ADD_GROUPS': function ADD_GROUPS(state, action) {
	        var groups = state.get('groups');
	        var groupMap = {};
	
	        action.groups.forEach(function (group) {
	            groupMap[group.name] = group;
	        });
	
	        groups = groups.merge(groupMap);
	
	        return state.set('groups', groups);
	    },
	
	    'ADD_MESHES': function ADD_MESHES(state, action) {
	        var meshes = state.get('meshes');
	
	        // XXX Map actors to meshes
	        meshes = meshes.merge(action.meshes);
	
	        return state.set('meshes', meshes);
	    }
	};
	
	var reducer = (0, _utilsCreate_reducer2['default'])(handlers, initialState);
	
	exports['default'] = reducer;
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var _immutable = __webpack_require__(19);
	
	var _utilsCreate_reducer = __webpack_require__(20);
	
	var _utilsCreate_reducer2 = _interopRequireDefault(_utilsCreate_reducer);
	
	var initialState = (0, _immutable.Map)({});
	
	var handlers = {
	    'ADD_TYPE': function ADD_TYPE(state, action) {
	        // Types are immutable
	        if (state.has(action.typedef.name)) {
	            return state;
	        }
	
	        return state.merge(_defineProperty({}, action.typedef.name, action.typedef));
	    },
	    'REMOVE_TYPE_NAMED': function REMOVE_TYPE_NAMED(state, action) {
	        return state['delete'](action.name);
	    }
	};
	
	var reducer = (0, _utilsCreate_reducer2['default'])(handlers, initialState);
	
	exports['default'] = reducer;
	module.exports = exports['default'];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	var _camera = __webpack_require__(26);
	
	exports.camera = _interopRequire(_camera);
	
	var _core = __webpack_require__(27);
	
	exports.core = _interopRequire(_core);
	
	var _fonts = __webpack_require__(28);
	
	exports.fonts = _interopRequire(_fonts);
	
	var _scenes = __webpack_require__(29);
	
	exports.scene = _interopRequire(_scenes);
	
	var _types = __webpack_require__(30);
	
	exports.types = _interopRequire(_types);

/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function updateMaxZoom(maxZoom) {
	    return {
	        type: 'UPDATE_MAX_ZOOM',
	        maxZoom: maxZoom
	    };
	}
	
	function updateMinZoom(minZoom) {
	    return {
	        type: 'UPDATE_MIN_ZOOM',
	        minZoom: minZoom
	    };
	}
	
	function updateCurrentZoom(zoom) {
	    return {
	        type: 'UPDATE_CURRENT_ZOOM',
	        zoom: zoom
	    };
	}
	
	function updatePosition(position) {
	    return {
	        type: 'UPDATE_POSITION',
	        position: position
	    };
	}
	
	exports['default'] = {
	    updateMaxZoom: updateMaxZoom,
	    updateMinZoom: updateMinZoom,
	    updateCurrentZoom: updateCurrentZoom,
	    updatePosition: updatePosition
	};
	module.exports = exports['default'];

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function updateScreenSize(size) {
	    return {
	        type: 'RECEIVE_SIZE',
	        size: size
	    };
	}
	
	function setRenderer(renderer) {
	    return {
	        type: 'RECEIVE_RENDERER',
	        renderer: renderer
	    };
	}
	
	function setCanvas(canvas) {
	    return {
	        type: 'RECEIVE_CANVAS',
	        canvas: canvas
	    };
	}
	
	exports['default'] = {
	    updateScreenSize: updateScreenSize,
	    setRenderer: setRenderer,
	    setCanvas: setCanvas
	};
	module.exports = exports['default'];

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _three = __webpack_require__(2);
	
	var loader = new _three.TextureLoader();
	
	var SDFFont = (function () {
	    function SDFFont(name, definition, texture) {
	        _classCallCheck(this, SDFFont);
	
	        this.name = name;
	        this.test = definition.test;
	        this.metrics = definition.metrics;
	        this.texture = texture;
	    }
	
	    _createClass(SDFFont, [{
	        key: 'canUseFor',
	        value: function canUseFor(str) {
	            return this.test.test(str);
	        }
	    }, {
	        key: 'getDimensionsForSize',
	        value: function getDimensionsForSize(character, size) {
	            var heightRatio = this.metrics.chars[character].height / this.metrics.info.size,
	                widthRatio = this.metrics.chars[character].width / this.metrics.info.size,
	                xAdvanceRatio = this.metrics.chars[character].xadvance / this.metrics.info.size,
	                xOffsetRatio = this.metrics.chars[character].xoffset / this.metrics.info.size,
	                yOffsetRatio = this.metrics.chars[character].yoffset / this.metrics.info.size;
	
	            return {
	                height: heightRatio * size,
	                width: widthRatio * size,
	                xAdvance: xAdvanceRatio * size,
	                xOffset: xOffsetRatio * size,
	                yOffset: yOffsetRatio * size
	            };
	        }
	    }]);
	
	    return SDFFont;
	})();
	
	function registerAsync(name, fontDef) {
	    throw new Error('registerAsync is not fully implemented!');
	
	    return function (dispatch) {
	        loader.load(fontDef.textureUrl, function (texture) {
	            dispatch(registerSync(name, new SDFFont(name, fontDef, texture)));
	        }, undefined, function (xhr) {
	            throw new Error('Error loading texture \'' + fontDef.textureUrl + '\': ' + xhr);
	        });
	    };
	}
	
	function registerWithData(name, fontDef) {
	    return function (dispatch) {
	        var img = new Image();
	        img.src = fontDef.dataURI;
	
	        dispatch(registerSync(name, new SDFFont(name, fontDef, new _three.Texture(img))));
	    };
	}
	
	function registerWithImage(name, fontDef) {
	    return function (dispatch) {
	        dispatch(registerSync(name, new SDFFont(name, fontDef, new _three.Texture(fontDef.image))));
	    };
	}
	
	function registerWithTexture(name, fontDef) {
	    return function (dispatch) {
	        dispatch(registerSync(name, new SDFFont(name, fontDef, fontDef.texture)));
	    };
	}
	
	function registerSync(name, font) {
	    return {
	        type: 'REGISTER_FONT',
	        name: name,
	        font: font
	    };
	}
	
	exports['default'] = {
	    registerAsync: registerAsync,
	    registerWithData: registerWithData,
	    registerWithImage: registerWithImage,
	    registerWithTexture: registerWithTexture
	};
	module.exports = exports['default'];

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function addCameraController(controller) {
	    return {
	        type: 'ADD_CAMERA_CONTROLLER',
	        controller: controller
	    };
	}
	
	function addActor(actor) {
	    return {
	        type: 'ADD_ACTOR',
	        actor: actor
	    };
	}
	
	function addGroup(group) {
	    return {
	        type: 'ADD_GROUP',
	        group: group
	    };
	}
	
	function addGroups(groups) {
	    return {
	        type: 'ADD_GROUPS',
	        groups: groups
	    };
	}
	
	function addMeshes(meshes) {
	    return {
	        type: 'ADD_MESHES',
	        meshes: meshes
	    };
	}
	
	exports['default'] = {
	    addCameraController: addCameraController,
	    addActor: addActor,
	    addGroup: addGroup,
	    addGroups: addGroups,
	    addMeshes: addMeshes
	};
	module.exports = exports['default'];

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function register(typedef) {
	    return {
	        type: 'ADD_TYPE',
	        typedef: typedef
	    };
	}
	
	function unregister(typedef) {
	    return {
	        type: 'REMOVE_TYPE',
	        name: typedef.name
	    };
	}
	
	exports['default'] = {
	    register: register,
	    unregister: unregister
	};
	module.exports = exports['default'];

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports['default'] = typeInitializer;
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _index = __webpack_require__(32);
	
	var primitives = _interopRequireWildcard(_index);
	
	function typeInitializer(registerFunc) {
	    Object.keys(primitives).forEach(function (name) {
	        registerFunc(name, primitives[name]);
	    });
	}
	
	module.exports = exports['default'];

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	var _point_circle = __webpack_require__(33);
	
	exports.PointCircle = _interopRequire(_point_circle);
	
	var _rectangle = __webpack_require__(35);
	
	exports.Rectangle = _interopRequire(_rectangle);
	
	var _text = __webpack_require__(36);
	
	exports.Text = _interopRequire(_text);

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _base = __webpack_require__(34);
	
	var _base2 = _interopRequireDefault(_base);
	
	var PointCircle = (function (_BaseType) {
	    _inherits(PointCircle, _BaseType);
	
	    function PointCircle(shape, actor) {
	        _classCallCheck(this, PointCircle);
	
	        if (shape.type !== 'PointCircle') {
	            throw new Error('Type mismatch, expected \'PointCircle\' got \'' + shape.type + '\'');
	        }
	
	        _get(Object.getPrototypeOf(PointCircle.prototype), 'constructor', this).call(this, shape, actor);
	    }
	
	    _createClass(PointCircle, [{
	        key: 'getBBox',
	        value: function getBBox() {
	            if (!this.bbox) {
	                var radius = this.shape.radius;
	
	                var position = this.position;
	
	                this.bbox = {
	                    width: radius,
	                    height: radius,
	                    x: position.x - radius / 2,
	                    y: position.y - radius / 2
	                };
	            }
	            return this.bbox;
	        }
	    }]);
	
	    return PointCircle;
	})(_base2['default']);
	
	;
	
	exports['default'] = PointCircle;
	module.exports = exports['default'];

/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var BaseType = (function () {
	    function BaseType(shape, actor) {
	        _classCallCheck(this, BaseType);
	
	        this.actor = actor;
	        this.shape = shape;
	    }
	
	    _createClass(BaseType, [{
	        key: 'getBBox',
	        value: function getBBox() {
	            throw new Error('getBBox not implemented');
	        }
	    }, {
	        key: 'position',
	        get: function get() {
	            return {
	                x: this.shape.position.x + this.actor.getPosition().x,
	                y: this.shape.position.y + this.actor.getPosition().y,
	                z: this.shape.position.z + this.actor.getPosition().z
	            };
	        }
	    }]);
	
	    return BaseType;
	})();
	
	;
	
	exports['default'] = BaseType;
	module.exports = exports['default'];

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _base = __webpack_require__(34);
	
	var _base2 = _interopRequireDefault(_base);
	
	var Rectangle = (function (_BaseType) {
	    _inherits(Rectangle, _BaseType);
	
	    function Rectangle(shape, actor) {
	        _classCallCheck(this, Rectangle);
	
	        if (shape.type !== 'Rectangle') {
	            throw new Error('Type mismatch, expected \'Rectangle\' got \'' + shape.type + '\'');
	        }
	
	        _get(Object.getPrototypeOf(Rectangle.prototype), 'constructor', this).call(this, shape, actor);
	    }
	
	    _createClass(Rectangle, [{
	        key: 'getBBox',
	        value: function getBBox() {
	            if (!this.bbox) {
	                var size = this.shape.size;
	
	                var position = this.position;
	
	                this.bbox = {
	                    x: position.x - size.width / 2,
	                    y: position.y - size.height / 2,
	                    width: size.width,
	                    height: size.height
	                };
	            }
	            return this.bbox;
	        }
	    }, {
	        key: 'getGeometry',
	        value: function getGeometry() {
	            return sharedGeometry;
	        }
	    }]);
	
	    return Rectangle;
	})(_base2['default']);
	
	;
	
	exports['default'] = Rectangle;
	module.exports = exports['default'];

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _lodash = __webpack_require__(3);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _base = __webpack_require__(34);
	
	var _base2 = _interopRequireDefault(_base);
	
	var Text = (function (_BaseType) {
	    _inherits(Text, _BaseType);
	
	    function Text(shape, actor) {
	        _classCallCheck(this, Text);
	
	        if (shape.type !== 'Text') {
	            throw new Error('Type mismatch, expected \'Rectangle\' got \'' + shape.type + '\'');
	        }
	
	        _get(Object.getPrototypeOf(Text.prototype), 'constructor', this).call(this, shape, actor);
	
	        this.calculateChunks();
	        this.calculateSize();
	    }
	
	    _createClass(Text, [{
	        key: 'calculateChunks',
	        value: function calculateChunks() {
	            var _this = this;
	
	            var font = this.actor.scene.state.get('fonts').get('fonts').get(this.shape.font);
	            var chunks = [];
	            var x = 0;
	
	            var textureWidth = font.metrics.common.scaleW;
	            var textureHeight = font.metrics.common.scaleH;
	
	            if (!font) {
	                throw new Error('Font \'' + this.shape.font + '\' not found');
	            }
	
	            _lodash2['default'].each(this.shape.string, function (character, index) {
	                console.log('chunking \'' + character + '\'');
	
	                var _font$getDimensionsForSize = font.getDimensionsForSize(character, _this.shape.size);
	
	                var width = _font$getDimensionsForSize.width;
	                var height = _font$getDimensionsForSize.height;
	                var xOffset = _font$getDimensionsForSize.xOffset;
	                var yOffset = _font$getDimensionsForSize.yOffset;
	                var xAdvance = _font$getDimensionsForSize.xAdvance;
	
	                var minX = -(width / 2);
	                var minY = height / 2;
	
	                var charX = x - minX;
	                var charY = -minY - yOffset;
	
	                var charMetrics = font.metrics.chars[character];
	                var charLeft = charMetrics.x / textureWidth;
	                var charTop = 1 - charMetrics.y / textureHeight;
	                var charTexWidth = charMetrics.width / textureWidth;
	                var charTexHeight = charMetrics.height / textureHeight;
	
	                chunks.push({
	                    character: character,
	                    width: width,
	                    height: height,
	                    x: charX,
	                    y: charY,
	                    uv: {
	                        x: charLeft,
	                        y: charTop,
	                        width: charTexWidth,
	                        height: charTexHeight
	                    }
	                });
	
	                x += xAdvance; // - xOffset;
	            });
	
	            this.chunks = chunks;
	        }
	    }, {
	        key: 'calculateSize',
	        value: function calculateSize() {
	            var minX = Infinity;
	            var maxX = -Infinity;
	            var minY = Infinity;
	            var maxY = -Infinity;
	            var i = undefined;
	
	            this.chunks.forEach(function (chunk, i) {
	                var x = chunk.x;
	                var y = chunk.y;
	                var width = chunk.width;
	                var height = chunk.height;
	
	                if (x - width / 2 < minX) {
	                    minX = x - width / 2;
	                }
	                if (x + width / 2 > maxX) {
	                    maxX = x + width / 2;
	                }
	                if (y - height / 2 < minY) {
	                    minY = y - height / 2;
	                }
	                if (y + height / 2 > maxY) {
	                    maxY = y + height / 2;
	                }
	            });
	
	            if (maxX === -Infinity) {
	                debugger;
	                throw new Error('Error finding size for string \'' + this.shape.string + '\'');
	            }
	
	            this.size = {
	                width: maxX - minX,
	                height: maxY - minY
	            };
	        }
	    }, {
	        key: 'getBBox',
	        value: function getBBox() {
	            if (!this.bbox) {
	                var size = this.size;
	                var position = this.position;
	
	                this.bbox = {
	                    x: position.x - size.width / 2,
	                    y: position.y - size.height / 2,
	                    width: size.width,
	                    height: size.height
	                };
	            }
	            return this.bbox;
	        }
	    }]);
	
	    return Text;
	})(_base2['default']);
	
	;
	
	exports['default'] = Text;
	module.exports = exports['default'];

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _immutable = __webpack_require__(19);
	
	var _lodash = __webpack_require__(3);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _three = __webpack_require__(2);
	
	var _three2 = _interopRequireDefault(_three);
	
	var _actions = __webpack_require__(25);
	
	var _camera = __webpack_require__(38);
	
	var _camera2 = _interopRequireDefault(_camera);
	
	var _rtree = __webpack_require__(39);
	
	var _rtree2 = _interopRequireDefault(_rtree);
	
	var _actor = __webpack_require__(41);
	
	var _actor2 = _interopRequireDefault(_actor);
	
	var _types = __webpack_require__(32);
	
	var Types = _interopRequireWildcard(_types);
	
	var _builders = __webpack_require__(42);
	
	var Builders = _interopRequireWildcard(_builders);
	
	var Scene = (function () {
	    function Scene(name, store) {
	        _classCallCheck(this, Scene);
	
	        this.name = name;
	        this.store = store;
	        this.dispatch = this.store.dispatch;
	
	        this.threeScene = new _three2['default'].Scene();
	        this.camera = new _camera2['default'](store);
	        this.rtree = new _rtree2['default']();
	        this.typedTrees = {};
	
	        this._initializeStoreObserver();
	    }
	
	    // XXX Consider extracting this into a helper...
	
	    _createClass(Scene, [{
	        key: '_select',
	        value: function _select(state) {
	            return state.scene.set('fonts', state.fonts);
	        }
	    }, {
	        key: '_initializeStoreObserver',
	        value: function _initializeStoreObserver() {
	            var _this = this;
	
	            var handleChange = function handleChange() {
	                var state = _this.state;
	                var nextState = _this._select(_this.store.getState());
	
	                if (nextState !== state) {
	                    _this.state = nextState;
	                    _this.stateDidChange(state);
	                }
	            };
	            this.store.subscribe(handleChange);
	            handleChange();
	        }
	    }, {
	        key: 'stateDidChange',
	        value: function stateDidChange(oldState) {
	            if (this.state.get('actors').size && !this.state.get('meshes').size) {
	                // 1+ actors are in the scene, but no mesh data has been generated yet. Get to it!
	                this.generateMeshes();
	            } else if (this.state.get('groups').size && !this.state.get('meshes').size) {
	                this.generateMeshes();
	            } else if (oldState && this.state.get('actors') !== oldState.get('actors')) {
	                // actors changed, update scene
	                console.log('Updating scene');
	            }
	        }
	    }, {
	        key: 'addCameraController',
	        value: function addCameraController(controller) {
	            controller.setScene(this);
	
	            this.dispatch(_actions.scene.addCameraController(controller));
	        }
	    }, {
	        key: 'addActor',
	        value: function addActor(actor) {
	            actor.scene = this;
	            this.dispatch(_actions.scene.addActor(actor));
	        }
	    }, {
	        key: 'addGroup',
	        value: function addGroup(group) {
	            group.scene = this;
	            this.dispatch(_actions.scene.addGroup(group));
	        }
	    }, {
	        key: 'addGroups',
	        value: function addGroups(groups) {
	            var _this2 = this;
	
	            groups.forEach(function (group) {
	                group.scene = _this2;
	            });
	            this.dispatch(_actions.scene.addGroups(groups));
	        }
	    }, {
	        key: 'update',
	        value: function update(userCallback) {
	            if (typeof userCallback === 'function') {
	                userCallback(this);
	            }
	
	            var cameraController = this.state.get('cameraController');
	            if (cameraController) {
	                cameraController.update();
	            }
	        }
	    }, {
	        key: 'render',
	        value: function render(renderer, userCallback) {
	            this.update(userCallback);
	
	            renderer.render(this.threeScene, this.camera.camera);
	        }
	    }, {
	        key: 'generateMeshes',
	        value: function generateMeshes() {
	            var _this3 = this;
	
	            var actorObjects = [];
	            var types = {};
	
	            this.rtree.reset();
	
	            this.state.get('groups').forEach(function (group, name) {
	                console.log('Generating for group "' + name + '"');
	
	                group.actors.forEach(function (actor) {
	                    var actorObject = new _actor2['default'](actor);
	                    actorObjects.push(actorObject);
	
	                    _lodash2['default'].forEach(actorObject.types, function (shapeList, type) {
	                        if (!types[type]) {
	                            types[type] = [];
	                            _this3.typedTrees[type] = new _rtree2['default']();
	                        }
	
	                        for (var i = 0; i < shapeList.length; i++) {
	                            types[type].push(shapeList[i]);
	                        }
	                    });
	                });
	            });
	
	            this.state.get('actors').forEach(function (actor, name) {
	                console.log('Generating for actor "' + name + '"');
	                var actorObject = new _actor2['default'](actor);
	
	                console.log(actorObject.bbox);
	
	                _lodash2['default'].forEach(actorObject.types, function (shapeList, type) {
	                    if (!types[type]) {
	                        types[type] = [];
	                        _this3.typedTrees[type] = new _rtree2['default']();
	                    }
	                    types[type] = [].concat(_toConsumableArray(types[type]), _toConsumableArray(shapeList));
	                    _this3.rtree.insertShapes(shapeList);
	                    _this3.typedTrees[type].insertShapes(shapeList);
	                });
	
	                actorObjects.push(actorObject);
	            });
	
	            this.rtree.insertActors(actorObjects);
	
	            // XXX Implement rtree based mesh grouping optimization in the future
	            console.log('Building meshes');
	            var meshes = [];
	            _lodash2['default'].forEach(types, function (shapes, type) {
	                if (type === 'PointCircle') {
	                    // Generate point cloud
	                    var cloud = new Builders.PointCloud(shapes);
	
	                    meshes.push(cloud.getMesh());
	                } else {
	                    // Use type class to create the appropriate shapes
	                    var builder = new Builders[type](shapes, _this3.typedTrees[type], _this3.state);
	                    meshes.push(builder.mesh);
	
	                    // meshes = meshes.concat(shapes.map((shape) => {
	                    //     let built = new Builders[type](shape);
	                    //     let mesh = built.getMesh();
	                    //     return mesh;
	                    // }));
	                }
	            });
	
	            // Check we're within drawcall limits
	            if (meshes.length > this.state.get('targetDrawCallLimit')) {
	                // merge geometries now
	                console.log('draw call limit passed!');
	
	                // Split meshes into smaller master Object3Ds
	                var i = 0;
	                var groups = [new _three2['default'].Object3D(), new _three2['default'].Object3D()];
	                for (i; i < meshes.length; i++) {
	                    groups[i % 2].add(meshes[i]);
	                }
	
	                meshes = groups;
	            }
	
	            if (meshes.length) {
	                var _threeScene;
	
	                (_threeScene = this.threeScene).add.apply(_threeScene, _toConsumableArray(meshes));
	                this.dispatch(_actions.scene.addMeshes(meshes));
	            }
	        }
	    }]);
	
	    return Scene;
	})();
	
	;
	
	exports['default'] = Scene;
	module.exports = exports['default'];

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _immutable = __webpack_require__(19);
	
	var _three = __webpack_require__(2);
	
	var _actions = __webpack_require__(25);
	
	var Camera = (function () {
	    function Camera(store) {
	        _classCallCheck(this, Camera);
	
	        this.store = store;
	        this.dispatch = this.store.dispatch;
	
	        this._initializeStoreObserver();
	    }
	
	    // XXX Consider extracting this into a helper...
	
	    _createClass(Camera, [{
	        key: '_select',
	        value: function _select(state) {
	            return state.camera.set('screenSize', state.core.get('size')).set('canvas', state.core.get('canvas'));
	        }
	    }, {
	        key: '_initializeStoreObserver',
	        value: function _initializeStoreObserver() {
	            var _this = this;
	
	            var handleChange = function handleChange() {
	                var state = _this.state;
	                var nextState = _this._select(_this.store.getState());
	
	                if (nextState !== state) {
	                    _this.state = nextState;
	                    _this.stateDidChange(state);
	                }
	            };
	            this.store.subscribe(handleChange);
	            handleChange();
	        }
	    }, {
	        key: 'stateDidChange',
	        value: function stateDidChange(oldState) {
	            if (!oldState) {
	                this._initializeCamera();
	            } else {
	                this._updateCameraState();
	            }
	        }
	    }, {
	        key: '_initializeCamera',
	        value: function _initializeCamera() {
	            var _state$get = this.state.get('screenSize');
	
	            var width = _state$get.width;
	            var height = _state$get.height;
	
	            var _state$toObject = this.state.toObject();
	
	            var currentZoom = _state$toObject.currentZoom;
	            var maxZoom = _state$toObject.maxZoom;
	
	            this.camera = new _three.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, maxZoom + 100);
	            this.camera.cameraObject = this;
	            // this.camera._target = new Vector3(0, 0, 0);
	            // this.camera.lookAt(this.camera._target);
	            this.camera.position.z = currentZoom;
	
	            this.camera.updateProjectionMatrix();
	        }
	    }, {
	        key: '_initializePerspectiveCamera',
	        value: function _initializePerspectiveCamera() {
	            var _state$get2 = this.state.get('screenSize');
	
	            var width = _state$get2.width;
	            var height = _state$get2.height;
	
	            var _state$toObject2 = this.state.toObject();
	
	            var currentZoom = _state$toObject2.currentZoom;
	            var maxZoom = _state$toObject2.maxZoom;
	
	            this.camera = new _three.PerspectiveCamera(70, width / height, 1, 1000);
	            this.camera.position.z = 400;
	        }
	    }, {
	        key: '_updateCameraState',
	        value: function _updateCameraState() {
	            // debugger
	            console.log('Updating camera state');
	        }
	    }, {
	        key: 'updatePosition',
	        value: function updatePosition() {
	            this.dispatch(_actions.camera.updatePosition({
	                x: this.camera.position.x,
	                y: this.camera.position.y
	            }));
	        }
	    }]);
	
	    return Camera;
	})();
	
	;
	
	exports['default'] = Camera;
	module.exports = exports['default'];

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _rbush = __webpack_require__(40);
	
	var _rbush2 = _interopRequireDefault(_rbush);
	
	var RTree = (function () {
	    function RTree() {
	        var maxNodeFill = arguments.length <= 0 || arguments[0] === undefined ? 20 : arguments[0];
	
	        _classCallCheck(this, RTree);
	
	        this.tree = (0, _rbush2['default'])(maxNodeFill);
	    }
	
	    _createClass(RTree, [{
	        key: '_dataForShape',
	        value: function _dataForShape(shape) {
	            var bbox = shape.type.getBBox();
	
	            return [bbox.x, bbox.y, bbox.x + bbox.width, bbox.y + bbox.height, { shape: shape }];
	        }
	    }, {
	        key: '_dataForActor',
	        value: function _dataForActor(actor) {
	            var bbox = actor.bbox;
	
	            return [bbox.x, bbox.y, bbox.x + bbox.width, bbox.y + bbox.height, { actor: actor }];
	        }
	    }, {
	        key: 'insert',
	        value: function insert(shapeType) {
	
	            this.tree.insert(data);
	
	            return this;
	        }
	    }, {
	        key: 'insertShapes',
	        value: function insertShapes(shapes) {
	            var _this = this;
	
	            var bboxes = shapes.map(function (shape) {
	                return _this._dataForShape(shape);
	            });
	
	            this.tree.load(bboxes);
	        }
	    }, {
	        key: 'insertActors',
	        value: function insertActors(actors) {
	            var _this2 = this;
	
	            var bboxes = actors.map(function (actor) {
	                return _this2._dataForActor(actor);
	            });
	
	            this.tree.load(bboxes);
	        }
	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.tree.clear();
	        }
	    }]);
	
	    return RTree;
	})();
	
	;
	
	exports['default'] = RTree;
	module.exports = exports['default'];

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*
	 (c) 2015, Vladimir Agafonkin
	 RBush, a JavaScript library for high-performance 2D spatial indexing of points and rectangles.
	 https://github.com/mourner/rbush
	*/
	
	'use strict';
	
	(function () {
	    'use strict';
	
	    function rbush(maxEntries, format) {
	
	        // jshint newcap: false, validthis: true
	        if (!(this instanceof rbush)) return new rbush(maxEntries, format);
	
	        // max entries in a node is 9 by default; min node fill is 40% for best performance
	        this._maxEntries = Math.max(4, maxEntries || 9);
	        this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));
	
	        if (format) {
	            this._initFormat(format);
	        }
	
	        this.clear();
	    }
	
	    rbush.prototype = {
	
	        all: function all() {
	            return this._all(this.data, []);
	        },
	
	        search: function search(bbox) {
	
	            var node = this.data,
	                result = [],
	                toBBox = this.toBBox;
	
	            if (!intersects(bbox, node.bbox)) return result;
	
	            var nodesToSearch = [],
	                i,
	                len,
	                child,
	                childBBox;
	
	            while (node) {
	                for (i = 0, len = node.children.length; i < len; i++) {
	
	                    child = node.children[i];
	                    childBBox = node.leaf ? toBBox(child) : child.bbox;
	
	                    if (intersects(bbox, childBBox)) {
	                        if (node.leaf) result.push(child);else if (contains(bbox, childBBox)) this._all(child, result);else nodesToSearch.push(child);
	                    }
	                }
	                node = nodesToSearch.pop();
	            }
	
	            return result;
	        },
	
	        collides: function collides(bbox) {
	
	            var node = this.data,
	                toBBox = this.toBBox;
	
	            if (!intersects(bbox, node.bbox)) return false;
	
	            var nodesToSearch = [],
	                i,
	                len,
	                child,
	                childBBox;
	
	            while (node) {
	                for (i = 0, len = node.children.length; i < len; i++) {
	
	                    child = node.children[i];
	                    childBBox = node.leaf ? toBBox(child) : child.bbox;
	
	                    if (intersects(bbox, childBBox)) {
	                        if (node.leaf || contains(bbox, childBBox)) return true;
	                        nodesToSearch.push(child);
	                    }
	                }
	                node = nodesToSearch.pop();
	            }
	
	            return false;
	        },
	
	        load: function load(data) {
	            if (!(data && data.length)) return this;
	
	            if (data.length < this._minEntries) {
	                for (var i = 0, len = data.length; i < len; i++) {
	                    this.insert(data[i]);
	                }
	                return this;
	            }
	
	            // recursively build the tree with the given data from stratch using OMT algorithm
	            var node = this._build(data.slice(), 0, data.length - 1, 0);
	
	            if (!this.data.children.length) {
	                // save as is if tree is empty
	                this.data = node;
	            } else if (this.data.height === node.height) {
	                // split root if trees have the same height
	                this._splitRoot(this.data, node);
	            } else {
	                if (this.data.height < node.height) {
	                    // swap trees if inserted one is bigger
	                    var tmpNode = this.data;
	                    this.data = node;
	                    node = tmpNode;
	                }
	
	                // insert the small tree into the large tree at appropriate level
	                this._insert(node, this.data.height - node.height - 1, true);
	            }
	
	            return this;
	        },
	
	        insert: function insert(item) {
	            if (item) this._insert(item, this.data.height - 1);
	            return this;
	        },
	
	        clear: function clear() {
	            this.data = {
	                children: [],
	                height: 1,
	                bbox: empty(),
	                leaf: true
	            };
	            return this;
	        },
	
	        remove: function remove(item) {
	            if (!item) return this;
	
	            var node = this.data,
	                bbox = this.toBBox(item),
	                path = [],
	                indexes = [],
	                i,
	                parent,
	                index,
	                goingUp;
	
	            // depth-first iterative tree traversal
	            while (node || path.length) {
	
	                if (!node) {
	                    // go up
	                    node = path.pop();
	                    parent = path[path.length - 1];
	                    i = indexes.pop();
	                    goingUp = true;
	                }
	
	                if (node.leaf) {
	                    // check current node
	                    index = node.children.indexOf(item);
	
	                    if (index !== -1) {
	                        // item found, remove the item and condense tree upwards
	                        node.children.splice(index, 1);
	                        path.push(node);
	                        this._condense(path);
	                        return this;
	                    }
	                }
	
	                if (!goingUp && !node.leaf && contains(node.bbox, bbox)) {
	                    // go down
	                    path.push(node);
	                    indexes.push(i);
	                    i = 0;
	                    parent = node;
	                    node = node.children[0];
	                } else if (parent) {
	                    // go right
	                    i++;
	                    node = parent.children[i];
	                    goingUp = false;
	                } else node = null; // nothing found
	            }
	
	            return this;
	        },
	
	        toBBox: function toBBox(item) {
	            return item;
	        },
	
	        compareMinX: function compareMinX(a, b) {
	            return a[0] - b[0];
	        },
	        compareMinY: function compareMinY(a, b) {
	            return a[1] - b[1];
	        },
	
	        toJSON: function toJSON() {
	            return this.data;
	        },
	
	        fromJSON: function fromJSON(data) {
	            this.data = data;
	            return this;
	        },
	
	        _all: function _all(node, result) {
	            var nodesToSearch = [];
	            while (node) {
	                if (node.leaf) result.push.apply(result, node.children);else nodesToSearch.push.apply(nodesToSearch, node.children);
	
	                node = nodesToSearch.pop();
	            }
	            return result;
	        },
	
	        _build: function _build(items, left, right, height) {
	
	            var N = right - left + 1,
	                M = this._maxEntries,
	                node;
	
	            if (N <= M) {
	                // reached leaf level; return leaf
	                node = {
	                    children: items.slice(left, right + 1),
	                    height: 1,
	                    bbox: null,
	                    leaf: true
	                };
	                calcBBox(node, this.toBBox);
	                return node;
	            }
	
	            if (!height) {
	                // target height of the bulk-loaded tree
	                height = Math.ceil(Math.log(N) / Math.log(M));
	
	                // target number of root entries to maximize storage utilization
	                M = Math.ceil(N / Math.pow(M, height - 1));
	            }
	
	            node = {
	                children: [],
	                height: height,
	                bbox: null,
	                leaf: false
	            };
	
	            // split the items into M mostly square tiles
	
	            var N2 = Math.ceil(N / M),
	                N1 = N2 * Math.ceil(Math.sqrt(M)),
	                i,
	                j,
	                right2,
	                right3;
	
	            multiSelect(items, left, right, N1, this.compareMinX);
	
	            for (i = left; i <= right; i += N1) {
	
	                right2 = Math.min(i + N1 - 1, right);
	
	                multiSelect(items, i, right2, N2, this.compareMinY);
	
	                for (j = i; j <= right2; j += N2) {
	
	                    right3 = Math.min(j + N2 - 1, right2);
	
	                    // pack each entry recursively
	                    node.children.push(this._build(items, j, right3, height - 1));
	                }
	            }
	
	            calcBBox(node, this.toBBox);
	
	            return node;
	        },
	
	        _chooseSubtree: function _chooseSubtree(bbox, node, level, path) {
	
	            var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;
	
	            while (true) {
	                path.push(node);
	
	                if (node.leaf || path.length - 1 === level) break;
	
	                minArea = minEnlargement = Infinity;
	
	                for (i = 0, len = node.children.length; i < len; i++) {
	                    child = node.children[i];
	                    area = bboxArea(child.bbox);
	                    enlargement = enlargedArea(bbox, child.bbox) - area;
	
	                    // choose entry with the least area enlargement
	                    if (enlargement < minEnlargement) {
	                        minEnlargement = enlargement;
	                        minArea = area < minArea ? area : minArea;
	                        targetNode = child;
	                    } else if (enlargement === minEnlargement) {
	                        // otherwise choose one with the smallest area
	                        if (area < minArea) {
	                            minArea = area;
	                            targetNode = child;
	                        }
	                    }
	                }
	
	                node = targetNode;
	            }
	
	            return node;
	        },
	
	        _insert: function _insert(item, level, isNode) {
	
	            var toBBox = this.toBBox,
	                bbox = isNode ? item.bbox : toBBox(item),
	                insertPath = [];
	
	            // find the best node for accommodating the item, saving all nodes along the path too
	            var node = this._chooseSubtree(bbox, this.data, level, insertPath);
	
	            // put the item into the node
	            node.children.push(item);
	            extend(node.bbox, bbox);
	
	            // split on node overflow; propagate upwards if necessary
	            while (level >= 0) {
	                if (insertPath[level].children.length > this._maxEntries) {
	                    this._split(insertPath, level);
	                    level--;
	                } else break;
	            }
	
	            // adjust bboxes along the insertion path
	            this._adjustParentBBoxes(bbox, insertPath, level);
	        },
	
	        // split overflowed node into two
	        _split: function _split(insertPath, level) {
	
	            var node = insertPath[level],
	                M = node.children.length,
	                m = this._minEntries;
	
	            this._chooseSplitAxis(node, m, M);
	
	            var splitIndex = this._chooseSplitIndex(node, m, M);
	
	            var newNode = {
	                children: node.children.splice(splitIndex, node.children.length - splitIndex),
	                height: node.height,
	                bbox: null,
	                leaf: false
	            };
	
	            if (node.leaf) newNode.leaf = true;
	
	            calcBBox(node, this.toBBox);
	            calcBBox(newNode, this.toBBox);
	
	            if (level) insertPath[level - 1].children.push(newNode);else this._splitRoot(node, newNode);
	        },
	
	        _splitRoot: function _splitRoot(node, newNode) {
	            // split root node
	            this.data = {
	                children: [node, newNode],
	                height: node.height + 1,
	                bbox: null,
	                leaf: false
	            };
	            calcBBox(this.data, this.toBBox);
	        },
	
	        _chooseSplitIndex: function _chooseSplitIndex(node, m, M) {
	
	            var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;
	
	            minOverlap = minArea = Infinity;
	
	            for (i = m; i <= M - m; i++) {
	                bbox1 = distBBox(node, 0, i, this.toBBox);
	                bbox2 = distBBox(node, i, M, this.toBBox);
	
	                overlap = intersectionArea(bbox1, bbox2);
	                area = bboxArea(bbox1) + bboxArea(bbox2);
	
	                // choose distribution with minimum overlap
	                if (overlap < minOverlap) {
	                    minOverlap = overlap;
	                    index = i;
	
	                    minArea = area < minArea ? area : minArea;
	                } else if (overlap === minOverlap) {
	                    // otherwise choose distribution with minimum area
	                    if (area < minArea) {
	                        minArea = area;
	                        index = i;
	                    }
	                }
	            }
	
	            return index;
	        },
	
	        // sorts node children by the best axis for split
	        _chooseSplitAxis: function _chooseSplitAxis(node, m, M) {
	
	            var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX,
	                compareMinY = node.leaf ? this.compareMinY : compareNodeMinY,
	                xMargin = this._allDistMargin(node, m, M, compareMinX),
	                yMargin = this._allDistMargin(node, m, M, compareMinY);
	
	            // if total distributions margin value is minimal for x, sort by minX,
	            // otherwise it's already sorted by minY
	            if (xMargin < yMargin) node.children.sort(compareMinX);
	        },
	
	        // total margin of all possible split distributions where each node is at least m full
	        _allDistMargin: function _allDistMargin(node, m, M, compare) {
	
	            node.children.sort(compare);
	
	            var toBBox = this.toBBox,
	                leftBBox = distBBox(node, 0, m, toBBox),
	                rightBBox = distBBox(node, M - m, M, toBBox),
	                margin = bboxMargin(leftBBox) + bboxMargin(rightBBox),
	                i,
	                child;
	
	            for (i = m; i < M - m; i++) {
	                child = node.children[i];
	                extend(leftBBox, node.leaf ? toBBox(child) : child.bbox);
	                margin += bboxMargin(leftBBox);
	            }
	
	            for (i = M - m - 1; i >= m; i--) {
	                child = node.children[i];
	                extend(rightBBox, node.leaf ? toBBox(child) : child.bbox);
	                margin += bboxMargin(rightBBox);
	            }
	
	            return margin;
	        },
	
	        _adjustParentBBoxes: function _adjustParentBBoxes(bbox, path, level) {
	            // adjust bboxes along the given tree path
	            for (var i = level; i >= 0; i--) {
	                extend(path[i].bbox, bbox);
	            }
	        },
	
	        _condense: function _condense(path) {
	            // go through the path, removing empty nodes and updating bboxes
	            for (var i = path.length - 1, siblings; i >= 0; i--) {
	                if (path[i].children.length === 0) {
	                    if (i > 0) {
	                        siblings = path[i - 1].children;
	                        siblings.splice(siblings.indexOf(path[i]), 1);
	                    } else this.clear();
	                } else calcBBox(path[i], this.toBBox);
	            }
	        },
	
	        _initFormat: function _initFormat(format) {
	            // data format (minX, minY, maxX, maxY accessors)
	
	            // uses eval-type function compilation instead of just accepting a toBBox function
	            // because the algorithms are very sensitive to sorting functions performance,
	            // so they should be dead simple and without inner calls
	
	            // jshint evil: true
	
	            var compareArr = ['return a', ' - b', ';'];
	
	            this.compareMinX = new Function('a', 'b', compareArr.join(format[0]));
	            this.compareMinY = new Function('a', 'b', compareArr.join(format[1]));
	
	            this.toBBox = new Function('a', 'return [a' + format.join(', a') + '];');
	        }
	    };
	
	    // calculate node's bbox from bboxes of its children
	    function calcBBox(node, toBBox) {
	        node.bbox = distBBox(node, 0, node.children.length, toBBox);
	    }
	
	    // min bounding rectangle of node children from k to p-1
	    function distBBox(node, k, p, toBBox) {
	        var bbox = empty();
	
	        for (var i = k, child; i < p; i++) {
	            child = node.children[i];
	            extend(bbox, node.leaf ? toBBox(child) : child.bbox);
	        }
	
	        return bbox;
	    }
	
	    function empty() {
	        return [Infinity, Infinity, -Infinity, -Infinity];
	    }
	
	    function extend(a, b) {
	        a[0] = Math.min(a[0], b[0]);
	        a[1] = Math.min(a[1], b[1]);
	        a[2] = Math.max(a[2], b[2]);
	        a[3] = Math.max(a[3], b[3]);
	        return a;
	    }
	
	    function compareNodeMinX(a, b) {
	        return a.bbox[0] - b.bbox[0];
	    }
	    function compareNodeMinY(a, b) {
	        return a.bbox[1] - b.bbox[1];
	    }
	
	    function bboxArea(a) {
	        return (a[2] - a[0]) * (a[3] - a[1]);
	    }
	    function bboxMargin(a) {
	        return a[2] - a[0] + (a[3] - a[1]);
	    }
	
	    function enlargedArea(a, b) {
	        return (Math.max(b[2], a[2]) - Math.min(b[0], a[0])) * (Math.max(b[3], a[3]) - Math.min(b[1], a[1]));
	    }
	
	    function intersectionArea(a, b) {
	        var minX = Math.max(a[0], b[0]),
	            minY = Math.max(a[1], b[1]),
	            maxX = Math.min(a[2], b[2]),
	            maxY = Math.min(a[3], b[3]);
	
	        return Math.max(0, maxX - minX) * Math.max(0, maxY - minY);
	    }
	
	    function contains(a, b) {
	        return a[0] <= b[0] && a[1] <= b[1] && b[2] <= a[2] && b[3] <= a[3];
	    }
	
	    function intersects(a, b) {
	        return b[0] <= a[2] && b[1] <= a[3] && b[2] >= a[0] && b[3] >= a[1];
	    }
	
	    // sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
	    // combines selection algorithm with binary divide & conquer approach
	
	    function multiSelect(arr, left, right, n, compare) {
	        var stack = [left, right],
	            mid;
	
	        while (stack.length) {
	            right = stack.pop();
	            left = stack.pop();
	
	            if (right - left <= n) continue;
	
	            mid = left + Math.ceil((right - left) / n / 2) * n;
	            select(arr, left, right, mid, compare);
	
	            stack.push(left, mid, mid, right);
	        }
	    }
	
	    // Floyd-Rivest selection algorithm:
	    // sort an array between left and right (inclusive) so that the smallest k elements come first (unordered)
	    function select(arr, left, right, k, compare) {
	        var n, i, z, s, sd, newLeft, newRight, t, j;
	
	        while (right > left) {
	            if (right - left > 600) {
	                n = right - left + 1;
	                i = k - left + 1;
	                z = Math.log(n);
	                s = 0.5 * Math.exp(2 * z / 3);
	                sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (i - n / 2 < 0 ? -1 : 1);
	                newLeft = Math.max(left, Math.floor(k - i * s / n + sd));
	                newRight = Math.min(right, Math.floor(k + (n - i) * s / n + sd));
	                select(arr, newLeft, newRight, k, compare);
	            }
	
	            t = arr[k];
	            i = left;
	            j = right;
	
	            swap(arr, left, k);
	            if (compare(arr[right], t) > 0) swap(arr, left, right);
	
	            while (i < j) {
	                swap(arr, i, j);
	                i++;
	                j--;
	                while (compare(arr[i], t) < 0) i++;
	                while (compare(arr[j], t) > 0) j--;
	            }
	
	            if (compare(arr[left], t) === 0) swap(arr, left, j);else {
	                j++;
	                swap(arr, j, right);
	            }
	
	            if (j <= k) left = j + 1;
	            if (k <= j) right = j - 1;
	        }
	    }
	
	    function swap(arr, i, j) {
	        var tmp = arr[i];
	        arr[i] = arr[j];
	        arr[j] = tmp;
	    }
	
	    // export as AMD/CommonJS module or global variable
	    if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	        return rbush;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else if (typeof module !== 'undefined') module.exports = rbush;else if (typeof self !== 'undefined') self.rbush = rbush;else window.rbush = rbush;
	})();

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _immutable = __webpack_require__(19);
	
	var _types = __webpack_require__(32);
	
	var Types = _interopRequireWildcard(_types);
	
	var Actor = (function () {
	    function Actor(definition) {
	        _classCallCheck(this, Actor);
	
	        this.definition = definition;
	        this.scene = this.definition.scene;
	        this.position = this.definition.position;
	        this.types = (0, _immutable.Map)({});
	        this.bbox = {};
	
	        this._iterateChildren();
	    }
	
	    _createClass(Actor, [{
	        key: 'getPosition',
	        value: function getPosition() {
	            return this.position;
	        }
	    }, {
	        key: '_iterateChildren',
	        value: function _iterateChildren() {
	            var _this = this;
	
	            var actorTypes = {};
	            var minX = Infinity,
	                maxX = -Infinity,
	                minY = Infinity,
	                maxY = -Infinity;
	
	            this.definition.shapes.forEach(function (shape) {
	                var bbox = undefined;
	                var type = undefined;
	
	                if (!Types[shape.type]) {
	                    throw new Error('Shape type "' + shape.type + '" not found!');
	                }
	
	                type = new Types[shape.type](shape, _this);
	
	                bbox = type.getBBox();
	
	                if (bbox.x < minX) {
	                    minX = bbox.x;
	                }
	
	                if (bbox.x + bbox.width > maxX) {
	                    maxX = bbox.x + bbox.width;
	                }
	
	                if (bbox.y < minY) {
	                    minY = bbox.y;
	                }
	
	                if (bbox.y + bbox.height > maxY) {
	                    maxY = bbox.y + bbox.height;
	                }
	
	                if (!actorTypes[shape.type]) {
	                    actorTypes[shape.type] = [];
	                }
	
	                // I originally destructured shape here, and inserted bbox and type
	                // to create a new object. Turns out it's roughly twice as slow to
	                // do that, compared to not manipulating the object at all.
	                actorTypes[shape.type].push({
	                    shape: shape,
	                    bbox: bbox,
	                    type: type
	                });
	            });
	
	            this.bbox = {
	                x: minX,
	                y: minY,
	                width: maxX - minX,
	                height: maxY - minY
	            };
	
	            this.types = actorTypes;
	        }
	    }]);
	
	    return Actor;
	})();
	
	;
	
	exports['default'] = Actor;
	module.exports = exports['default'];

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// export { default as Merged } from './merged';
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	var _point_cloud = __webpack_require__(43);
	
	exports.PointCloud = _interopRequire(_point_cloud);
	
	var _rectangle = __webpack_require__(46);
	
	exports.Rectangle = _interopRequire(_rectangle);
	
	var _text = __webpack_require__(49);
	
	exports.Text = _interopRequire(_text);

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _three = __webpack_require__(2);
	
	var _shadersPoint_fragmentGlsl = __webpack_require__(44);
	
	var _shadersPoint_fragmentGlsl2 = _interopRequireDefault(_shadersPoint_fragmentGlsl);
	
	var _shadersPoint_vertexGlsl = __webpack_require__(45);
	
	var _shadersPoint_vertexGlsl2 = _interopRequireDefault(_shadersPoint_vertexGlsl);
	
	var PointCloudBuilder = (function () {
	    /**
	     * PointCloudBuilder class
	     *
	     * Builds a point cloud
	     *
	     * @param  {[Object]} points An array of basic vectors
	     */
	
	    function PointCloudBuilder(shapes) {
	        _classCallCheck(this, PointCloudBuilder);
	
	        this.shapes = shapes;
	
	        // Create initial array
	
	        this.geometry = new _three.BufferGeometry();
	        this.mesh = null;
	        this.material = null;
	
	        this._assignVertices();
	        this._createMesh();
	    }
	
	    _createClass(PointCloudBuilder, [{
	        key: '_assignVertices',
	        value: function _assignVertices() {
	            var _this = this;
	
	            this.vertices = new _three.BufferAttribute(new Float32Array(this.shapes.length * 3), 3);
	            this.colors = new _three.BufferAttribute(new Float32Array(this.shapes.length * 4), 4);
	            this.sizes = new _three.BufferAttribute(new Float32Array(this.shapes.length), 1);
	
	            this.shapes.forEach(function (shape, i) {
	                var _shape$shape = shape.shape;
	                var radius = _shape$shape.radius;
	                var fill = _shape$shape.fill;
	
	                var position = shape.type.position;
	
	                _this.vertices.setXYZ(i, position.x, position.y, position.z);
	                _this.sizes.setX(i, radius);
	                _this.colors.setXYZW(i, fill.r, fill.g, fill.b, 1.0);
	            });
	
	            this.geometry.addAttribute('position', this.vertices);
	            this.geometry.addAttribute('fill', this.colors);
	            this.geometry.addAttribute('size', this.sizes);
	        }
	    }, {
	        key: '_createMesh',
	        value: function _createMesh() {
	            // this.material = new PointsMaterial({ color: 0xffffff, size: 20.0 });
	            this.material = new _three.RawShaderMaterial({
	                vertexShader: _shadersPoint_vertexGlsl2['default'],
	                fragmentShader: _shadersPoint_fragmentGlsl2['default'],
	                transparent: true
	            });
	            this.mesh = new _three.Points(this.geometry, this.material);
	        }
	    }, {
	        key: 'getMesh',
	        value: function getMesh() {
	            return this.mesh;
	        }
	    }, {
	        key: 'getMaterial',
	        value: function getMaterial() {
	            return this.material;
	        }
	    }]);
	
	    return PointCloudBuilder;
	})();
	
	exports['default'] = PointCloudBuilder;
	;
	module.exports = exports['default'];

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = "#extension GL_OES_standard_derivatives : enable\nprecision highp float;\n\n// uniform vec4 stroke;\n// uniform float strokeWidth;\n\nvarying vec4 vFill;\n\nvoid main() {\n    vec4 stroke = vec4(1.0, 0.5, 0.0, 1.0);\n    float strokeWidth = 0.0;\n    float inset = 0.01;\n    float radius = 0.5; // - inset;\n    float distance = distance(gl_PointCoord, vec2(0.5, 0.5));\n\n    float afwidth = 0.9 * length(vec2(dFdx(distance), dFdy(distance)));\n    float outerStep = smoothstep(radius - afwidth, radius + afwidth, distance);\n    float innerStep = smoothstep(radius - inset, radius, distance + strokeWidth);\n\n    if (strokeWidth < 0.01) {\n        stroke = vFill;\n    }\n\n    if (distance > (radius - strokeWidth)) {\n        gl_FragColor = mix(stroke, vec4(1, 1, 1, 0.0), outerStep);\n    } else {\n        gl_FragColor = mix(vFill, stroke, innerStep);\n    }\n}\n"

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = "precision highp float;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\n\n// varying float vSize;\n// varying vec3 vFill;\n// varying vec3 vStroke;\n// varying float vStrokeWidth;\n\nattribute vec3 position;\nattribute vec4 fill;\nattribute float size;\n\nvarying vec4 vFill;\n\n// attribute vec3 stroke;\n// attribute float strokeWidth;\n\nvoid main() {\n    vFill = fill;\n    // vStroke = stroke;\n    // vStrokeWidth = strokeWidth;\n\n    gl_PointSize = size;\n\n    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n    gl_Position = projectionMatrix * mvPosition;\n}\n"

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// Generates an instanced geometry of rectangles, shader controlled scaling/rotation/color
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _three = __webpack_require__(2);
	
	var _shadersInstanced_rectangle_vertexGlsl = __webpack_require__(47);
	
	var _shadersInstanced_rectangle_vertexGlsl2 = _interopRequireDefault(_shadersInstanced_rectangle_vertexGlsl);
	
	var _shadersInstanced_rectangle_fragmentGlsl = __webpack_require__(48);
	
	var _shadersInstanced_rectangle_fragmentGlsl2 = _interopRequireDefault(_shadersInstanced_rectangle_fragmentGlsl);
	
	var Rectangle = (function () {
	    function Rectangle(shapes, rtree, sceneState) {
	        _classCallCheck(this, Rectangle);
	
	        this.sceneState = sceneState;
	        this.shapes = shapes;
	
	        this.geometry = new _three.InstancedBufferGeometry();
	
	        this.initialize();
	    }
	
	    _createClass(Rectangle, [{
	        key: 'initialize',
	        value: function initialize() {
	            this._constructVertices();
	            this._attributes();
	        }
	    }, {
	        key: '_constructVertices',
	        value: function _constructVertices() {
	            var vertices = new Float32Array([-0.5, 0.5, 0, 0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0]);
	
	            var uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
	
	            var indices = new Uint16Array([2, 1, 0, 3, 1, 2]);
	
	            this.geometry.addAttribute('position', new _three.BufferAttribute(vertices, 3));
	            this.geometry.addAttribute('uv', new _three.BufferAttribute(uvs, 2));
	            this.geometry.setIndex(new _three.BufferAttribute(indices, 1));
	        }
	    }, {
	        key: '_attributes',
	        value: function _attributes() {
	            var _this = this;
	
	            this.offsets = new _three.InstancedBufferAttribute(new Float32Array(this.shapes.length * 3), 3);
	            this.scales = new _three.InstancedBufferAttribute(new Float32Array(this.shapes.length * 2), 2);
	            this.colors = new _three.InstancedBufferAttribute(new Float32Array(this.shapes.length * 4), 4);
	
	            this.shapes.forEach(function (shape, i) {
	                var position = shape.type.position;
	                _this.offsets.setXYZ(i, position.x, position.y, position.z);
	
	                var size = shape.shape.size;
	                _this.scales.setXY(i, size.width, size.height);
	
	                // Assuming r,g,b object. Handle other things plz.
	                var color = shape.shape.fill;
	                _this.colors.setXYZW(i, color.r, color.g, color.b, 1.0);
	            });
	
	            this.geometry.addAttribute('offset', this.offsets);
	            this.geometry.addAttribute('scale', this.scales);
	            this.geometry.addAttribute('color', this.colors);
	        }
	    }, {
	        key: 'vertexShader',
	        get: function get() {
	            return _shadersInstanced_rectangle_vertexGlsl2['default'];
	        }
	    }, {
	        key: 'fragmentShader',
	        get: function get() {
	            return _shadersInstanced_rectangle_fragmentGlsl2['default'];
	        }
	    }, {
	        key: 'material',
	        get: function get() {
	            if (!this._material) {
	                this._material = new _three.RawShaderMaterial({
	                    vertexShader: this.vertexShader,
	                    fragmentShader: this.fragmentShader,
	                    transparent: true
	                });
	            }
	
	            return this._material;
	        }
	    }, {
	        key: 'mesh',
	        get: function get() {
	            if (!this._mesh) {
	                this._mesh = new _three.Mesh(this.geometry, this.material);
	                this._mesh.frustumCulled = false;
	            }
	
	            return this._mesh;
	        }
	    }]);
	
	    return Rectangle;
	})();
	
	exports['default'] = Rectangle;
	module.exports = exports['default'];

/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = "precision highp float;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\n\nattribute vec3 position;\nattribute vec3 offset;\nattribute vec2 scale;\nattribute vec4 color;\n\nvarying vec4 vColor;\n\n\nvoid main() {\n    vec3 vPosition = position * vec3(scale, 0);\n    vColor = color;\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(offset + vPosition, 1.0);\n}\n"

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = "precision highp float;\n\nvarying vec4 vColor;\n\nvoid main() {\n    gl_FragColor = vColor;\n}\n"

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _three = __webpack_require__(2);
	
	// What is text other than a whole bunch of little rectangles next to each other?
	
	var _rectangle = __webpack_require__(46);
	
	var _rectangle2 = _interopRequireDefault(_rectangle);
	
	var _shadersInstanced_text_vertexGlsl = __webpack_require__(50);
	
	var _shadersInstanced_text_vertexGlsl2 = _interopRequireDefault(_shadersInstanced_text_vertexGlsl);
	
	var _shadersInstanced_text_fragmentGlsl = __webpack_require__(51);
	
	var _shadersInstanced_text_fragmentGlsl2 = _interopRequireDefault(_shadersInstanced_text_fragmentGlsl);
	
	var Text = (function (_Rectangle) {
	    _inherits(Text, _Rectangle);
	
	    function Text() {
	        _classCallCheck(this, Text);
	
	        _get(Object.getPrototypeOf(Text.prototype), 'constructor', this).apply(this, arguments);
	    }
	
	    _createClass(Text, [{
	        key: 'initialize',
	        value: function initialize() {
	            this.font = this.sceneState.get('fonts').get('fonts').get(this.shapes[0].shape.font);
	
	            this.parseStrings();
	            this._constructVertices();
	
	            this._attributes();
	        }
	    }, {
	        key: 'parseStrings',
	        value: function parseStrings() {
	            var _this = this;
	
	            this.objectCount = 0;
	            this.shapes.forEach(function (shape) {
	                _this.objectCount += shape.type.chunks.length;
	            });
	        }
	    }, {
	        key: '_attributes',
	        value: function _attributes() {
	            var _this2 = this;
	
	            this.scales = new _three.InstancedBufferAttribute(new Float32Array(this.objectCount * 2), 2);
	            this.fontSizes = new _three.InstancedBufferAttribute(new Float32Array(this.objectCount), 1);
	            this.offsets = new _three.InstancedBufferAttribute(new Float32Array(this.objectCount * 3), 3);
	            this.colors = new _three.InstancedBufferAttribute(new Float32Array(this.objectCount * 4), 4);
	            this.texOffsets = new _three.InstancedBufferAttribute(new Float32Array(this.objectCount * 4), 4);
	
	            this.shapes.forEach(function (shape, i) {
	                var _shape$type = shape.type;
	                var position = _shape$type.position;
	                var bbox = _shape$type.bbox;
	                var _shape$shape = shape.shape;
	                var size = _shape$shape.size;
	                var fill = _shape$shape.fill;
	
	                shape.type.chunks.forEach(function (chunk, j) {
	                    var index = i + j;
	
	                    // Resize character
	                    _this2.scales.setXY(index, chunk.width, chunk.height);
	
	                    // Pass in font size
	                    _this2.fontSizes.setX(index, size);
	
	                    // Position character
	                    // console.log(index, chunk.x * 1.2, chunk.y, this.objectCount);
	                    _this2.offsets.setXYZ(index, chunk.x - bbox.width / 2 - position.x, chunk.y + bbox.height / 2 + position.y, position.z);
	
	                    // Color character
	                    _this2.colors.setXYZW(index, fill.r, fill.g, fill.b, 1.0);
	
	                    // Character texture UV offsets
	                    _this2.texOffsets.setXYZW(index, chunk.uv.x, chunk.uv.y, chunk.uv.width, chunk.uv.height);
	                });
	            });
	
	            this.geometry.addAttribute('scale', this.scales);
	            this.geometry.addAttribute('fontSize', this.fontSizes);
	            this.geometry.addAttribute('offset', this.offsets);
	            this.geometry.addAttribute('color', this.colors);
	            this.geometry.addAttribute('texOffset', this.texOffsets);
	        }
	    }, {
	        key: 'vertexShader',
	        get: function get() {
	            return _shadersInstanced_text_vertexGlsl2['default'];
	        }
	    }, {
	        key: 'fragmentShader',
	        get: function get() {
	            return _shadersInstanced_text_fragmentGlsl2['default'];
	        }
	    }, {
	        key: 'material',
	        get: function get() {
	            if (!this._material) {
	                // debugger
	                this._material = new _three.RawShaderMaterial({
	                    uniforms: {
	                        uSampler: {
	                            type: 't',
	                            value: this.font.texture
	                        },
	                        uTexSize: {
	                            type: 'v2',
	                            value: { x: this.font.metrics.common.scaleW, y: this.font.metrics.common.scaleH }
	                        },
	                        uMaxZoom: {
	                            type: 'f',
	                            value: 100 },
	                        //maxZoom
	                        uMaxSmoothing: {
	                            type: 'f',
	                            value: 8.0 },
	                        //maxSmoothing
	                        uMinSmoothing: {
	                            type: 'f',
	                            value: 1.0 }
	                    },
	                    //minSmoothing
	                    vertexShader: this.vertexShader,
	                    fragmentShader: this.fragmentShader,
	                    transparent: true
	                });
	            }
	
	            return this._material;
	        }
	    }]);
	
	    return Text;
	})(_rectangle2['default']);
	
	exports['default'] = Text;
	module.exports = exports['default'];

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = "precision highp float;\n\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPosition;\n\nattribute vec3 position;\nattribute vec2 uv;\nattribute vec3 offset;\nattribute vec2 scale;\nattribute vec4 color;\nattribute float fontSize;\nattribute vec4 texOffset;\n\nvarying vec4 vColor;\nvarying float vFontSize;\nvarying vec4 vTexOffset;\nvarying vec2 vUv;\nvarying float vDepth;\n\nvoid main() {\n    vec3 vPosition = position * vec3(scale, 0);\n\n    vColor = color;\n    vFontSize = fontSize;\n    vTexOffset = texOffset;\n    vUv = uv;\n    vDepth = 10.0; //cameraPosition.z;\n\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(offset + vPosition, 1.0);\n}\n"

/***/ },
/* 51 */
/***/ function(module, exports) {

	module.exports = "precision highp float;\n\nuniform sampler2D uSampler;\nuniform float uMaxZoom;\nuniform float uMaxSmoothing;\nuniform float uMinSmoothing;\nuniform vec2 texSize;\n\nvarying vec4 vColor;\nvarying float vFontSize;\nvarying vec4 vTexOffset;\n\nvarying vec2 vUv;\nvarying float vDepth;\n\nconst float cBuffer = 0.5;\n\nvoid main(void) {\n    vec2 uv;\n\n    // Calculate sampler coordinate\n    uv.x = vTexOffset.x + (vUv.x * vTexOffset.z);\n    uv.y = vTexOffset.y - (vUv.y * vTexOffset.w);\n\n    float smoothing = vDepth / uMaxZoom * (uMaxSmoothing - uMinSmoothing) + uMinSmoothing;\n    float gamma = (smoothing * 1.4142) / vFontSize;\n\n    float dist = texture2D(uSampler, uv).a;\n    float alpha = smoothstep(cBuffer - gamma, cBuffer + gamma, dist);\n\n    gl_FragColor = vec4(vColor.xyz, alpha);\n}\n"

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	var _actor = __webpack_require__(41);
	
	exports.Actor = _interopRequire(_actor);
	
	var _scene = __webpack_require__(37);
	
	exports.Scene = _interopRequire(_scene);
	
	var _camera_controllersPan_and_zoom = __webpack_require__(53);
	
	exports.PanAndZoomCameraController = _interopRequire(_camera_controllersPan_and_zoom);

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Refactored from TrackballControls from THREE.js
	 *
	 * TrackballControls by:
	 *     Eberhard Graether / http://egraether.com/
	 *     Mark Lundin  / http://mark-lundin.com
	 */
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _three = __webpack_require__(2);
	
	var _utilsAutobind = __webpack_require__(54);
	
	var _utilsAutobind2 = _interopRequireDefault(_utilsAutobind);
	
	var BUTTON_STATES = {
	    NONE: -1
	};
	
	var PanAndZoomCameraController = (function () {
	    function PanAndZoomCameraController(options) {
	        _classCallCheck(this, PanAndZoomCameraController);
	
	        this.options = options;
	
	        this.buttonDefs = this.options.buttons;
	        this.panSpeed = this.options.panSpeed || 2;
	
	        this.button = -1;
	
	        this.panStart = new _three.Vector2();
	        this.panEnd = new _three.Vector2();
	        this._eye = new _three.Vector3();
	
	        this._target = new _three.Vector3();
	        this._mouseVector = new _three.Vector3();
	    }
	
	    _createDecoratedClass(PanAndZoomCameraController, [{
	        key: 'getMousePosition',
	        value: function getMousePosition(x, y) {
	            var _camera$state$get = this.camera.state.get('screenSize');
	
	            var width = _camera$state$get.width;
	            var height = _camera$state$get.height;
	
	            var left = 0;
	            var top = 0;
	
	            this._mouseVector.set((x - left) / width, (y - top) / height);
	            return this._mouseVector;
	        }
	    }, {
	        key: 'setScene',
	        value: function setScene(scene) {
	            this.scene = scene;
	            this.camera = scene.camera;
	            this.threeCamera = this.camera.camera;
	            this.canvas = this.camera.state.get('canvas');
	
	            this._target = this.threeCamera.position.clone();
	            this._target.z = 0;
	            this.threeCamera.lookAt(this._target);
	
	            this._registerInputHandlers();
	        }
	    }, {
	        key: '_registerInputHandlers',
	        value: function _registerInputHandlers() {
	            this.canvas.addEventListener('mousedown', this._handleMouseDown, false);
	        }
	    }, {
	        key: '_handleMouseDown',
	        decorators: [_utilsAutobind2['default']],
	        value: function _handleMouseDown(e) {
	            e.preventDefault();
	            e.stopPropagation();
	
	            if (this.button === -1) {
	                this.button = e.button;
	            }
	
	            if (this.buttonDefs[this.button] === 'pan') {
	                this._mouseChange = new _three.Vector2();
	                this._up = new _three.Vector3();
	                this._pan = new _three.Vector3();
	
	                this.panStart.copy(this.getMousePosition(e.pageX, e.pageY));
	                this.panEnd.copy(this.panStart);
	            }
	
	            this.canvas.addEventListener('mousemove', this._handleMouseMove, false);
	            this.canvas.addEventListener('mouseup', this._handleMouseUp, false);
	        }
	    }, {
	        key: '_handleMouseMove',
	        decorators: [_utilsAutobind2['default']],
	        value: function _handleMouseMove(e) {
	            if (this.buttonDefs[this.button] === 'pan') {
	                this.panEnd.copy(this.getMousePosition(e.pageX, e.pageY));
	            }
	        }
	    }, {
	        key: '_handleMouseUp',
	        decorators: [_utilsAutobind2['default']],
	        value: function _handleMouseUp(e) {
	            if (this.buttonDefs[this.button] === 'pan') {
	                this._mouseChange = undefined;
	                this.panEnd.copy(this.getMousePosition(e.pageX, e.pageY));
	            }
	
	            this.canvas.removeEventListener('mousemove', this._handleMouseMove);
	            this.canvas.removeEventListener('mouseup', this._handleMouseUp);
	        }
	    }, {
	        key: 'doPan',
	        value: function doPan() {
	            if (!this._mouseChange) {
	                return;
	            }
	
	            this._mouseChange.copy(this.panEnd).sub(this.panStart);
	            if (this._mouseChange.lengthSq()) {
	                this._mouseChange.multiplyScalar(this._eye.length() * this.panSpeed);
	
	                this._pan.copy(this._eye).cross(this.threeCamera.up).setLength(this._mouseChange.x);
	                this._pan.add(this._up.copy(this.threeCamera.up).setLength(this._mouseChange.y));
	
	                this.threeCamera.position.add(this._pan);
	                this._target.add(this._pan);
	                this.camera.updatePosition();
	
	                this.panStart.copy(this.panEnd);
	            }
	        }
	    }, {
	        key: 'update',
	        value: function update() {
	            this._eye.subVectors(this.threeCamera.position, this._target);
	
	            this.doPan();
	        }
	    }]);
	
	    return PanAndZoomCameraController;
	})();
	
	exports['default'] = PanAndZoomCameraController;
	;
	module.exports = exports['default'];

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;// grabbed from: https://www.npmjs.com/package/es7-autobinder
	// currently have an issue with loading es6 modules from require
	"use strict";
	
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	    return function autobind(target, name, descriptor) {
	        var value = descriptor.value;
	
	        return {
	            configurable: true,
	            get: function get() {
	                var boundValue = value.bind(this);
	                Object.defineProperty(this, name, {
	                    value: boundValue,
	                    configurable: true,
	                    writable: true
	                });
	                return boundValue;
	            }
	        };
	    };
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _compute_distance = __webpack_require__(56);
	
	var _compute_distance2 = _interopRequireDefault(_compute_distance);
	
	var _curve_generators = __webpack_require__(57);
	
	var _curve_generators2 = _interopRequireDefault(_curve_generators);
	
	exports['default'] = {
	    utils: {
	        curveGenerators: _curve_generators2['default'],
	        computeDistance: _compute_distance2['default']
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 56 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = computeDistance;
	
	function computeDistance(point1, point2) {
	    return Math.sqrt(Math.pow(point2.x - point1.x, 2), Math.pow(point2.y - point1.y, 2));
	}
	
	module.exports = exports["default"];

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.generateQuadraticBezierCurve = generateQuadraticBezierCurve;
	exports.estimateArcLength = estimateArcLength;
	exports.generateLinearSpacedQuadraticBezierCurve = generateLinearSpacedQuadraticBezierCurve;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _compute_distance = __webpack_require__(56);
	
	var _compute_distance2 = _interopRequireDefault(_compute_distance);
	
	/**
	 * generateQuadraticBezierCurve
	 * derived from: http://math.stackexchange.com/questions/1360891/find-quadratic-bezier-curve-equation-based-on-its-control-points
	 *
	 * @param  {Object} controlPoint0 x, y coords for the first control point
	 * @param  {Object} controlPoint1 x, y coords for the second control point
	 * @param  {Object} controlPoint2 x, y coords for the third control point
	 * @param  {Integer} steps the number of points to generate
	 * @return {Array<Object>} an array of x,y coordinates for the number of steps specified
	 */
	
	function generateQuadraticBezierCurve(controlPoint0, controlPoint1, controlPoint2, steps) {
	    var curvePoints = [];
	
	    for (var i = 0; i < steps; i++) {
	        var position = i / steps;
	
	        var positionSquared = position * position;
	        var negativePosition = 1 - position;
	        var negativePositionSquared = negativePosition * negativePosition;
	
	        var a = negativePositionSquared;
	        var b = negativePosition * position * 2;
	        var c = positionSquared;
	
	        curvePoints.push({
	            x: a * controlPoint0.x + b * controlPoint1.x + c * controlPoint2.x,
	            y: a * controlPoint0.y + b * controlPoint1.y + c * controlPoint2.y
	        });
	    }
	
	    return curvePoints;
	}
	
	;
	
	/**
	 * Given a set of curve points, we can estimate the arc length
	 * @param  {Object} controlPoint0 x, y coords for the first control point
	 * @param  {Object} controlPoint1 x, y coords for the second control point
	 * @param  {Object} controlPoint2 x, y coords for the third control point
	 * @param  {Integer} steps the number of points to generate
	 * @return {Array<Object>} an array of x,y coordinates for the number of steps specified
	 */
	
	function estimateArcLength(curvePoints) {
	    var approximateArcLength = 0;
	    var previousPoint = curvePoints[0];
	
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;
	
	    try {
	        for (var _iterator = curvePoints[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var point = _step.value;
	
	            approximateArcLength += (0, _compute_distance2['default'])(previousPoint, point);
	            previousPoint = point;
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator['return']) {
	                _iterator['return']();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }
	
	    return approximateArcLength;
	}
	
	/**
	 * Creates a points linearly spaced along a bezier curve
	 * @param  {[type]} controlPoint0
	 * @param  {[type]} controlPoint1 [description]
	 * @param  {[type]} controlPoint2 [description]
	 * @param  {[type]} steps         [description]
	 * @return {[type]}               [description]
	 */
	
	function generateLinearSpacedQuadraticBezierCurve(controlPoint0, controlPoint1, controlPoint2, steps) {
	    var RESOLUTION_MULTIPLIER = 100;
	    var quadraticPoints = generateQuadraticBezierCurve(controlPoint0, controlPoint1, controlPoint2, steps * RESOLUTION_MULTIPLIER);
	
	    var arcLength = estimateArcLength(quadraticPoints);
	    var segmentLength = arcLength / (steps - 1);
	    var linearCurvePoints = [];
	    var nextPointDistance = 0;
	    var segmentsFound = 0;
	
	    var previousPoint = quadraticPoints[0];
	
	    for (var i = 0; i < quadraticPoints.length; i++) {
	        if (linearCurvePoints.length >= steps) {
	            break;
	        }
	
	        if ((0, _compute_distance2['default'])(previousPoint, quadraticPoints[i]) > nextPointDistance) {
	            linearCurvePoints.push(quadraticPoints[i]);
	            segmentsFound += 1;
	            nextPointDistance = Math.min(segmentsFound * segmentLength, arcLength);
	        }
	    }
	
	    // guarentees we get the last point
	    if (steps > linearCurvePoints.length) {
	        linearCurvePoints.push(quadraticPoints[quadraticPoints.length - 1]);
	    }
	
	    return linearCurvePoints;
	}
	
	exports['default'] = {
	    estimateArcLength: estimateArcLength,
	    quadraticBezierCurve: generateQuadraticBezierCurve,
	    linearSpacedQuadraticBezierCurve: generateLinearSpacedQuadraticBezierCurve
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=cartogram-dev.js.map