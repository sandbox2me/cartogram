import three from 'three';
import _ from 'lodash';
import { combineReducers } from 'redux';

import createStore from './reducers/initializer';
import * as reducers from './reducers';
import * as actions from './actions';

import typeInitializer from './types/initializer';

import Scene from './components/scene';

const defaultOptions = {
    resizeCanvas: true,
    backgroundColor: '#ffffff',
};

class Cartogram {
    constructor(el, options={}) {
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

    _initializeRenderer() {
        this.renderer = new three.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor((new three.Color(this.options.backgroundColor)).getHex());
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.sortObjects = true;

        this.el.appendChild(this.renderer.domElement);

        // XXX Move this to the scene component
        if (this.options.resizeCanvas) {
            window.addEventListener('resize', _.debounce(this._updateCanvasDimensions.bind(this), 100), false);
        }
    }

    _initializeData() {
        let rootReducer = combineReducers(reducers);

        this.store = createStore(rootReducer);
        this.dispatch = this.store.dispatch;

        this._updateCanvasDimensions();

        this.dispatch(actions.core.setRenderer(this.renderer));
        this.dispatch(actions.core.setCanvas(this.renderer.domElement));

        this._registerPrimitiveTypes();
    }

    _registerPrimitiveTypes() {
        // Register initial primitive types
        typeInitializer((name, typedef) => {
            this.registerType(name, typedef);
        });
    }

    _initializeModules() {
        this._defaultScene = new Scene('default', this.store);
    }

    _updateCanvasDimensions() {
        let width = this.el.parentNode.clientWidth;
        let height = this.el.parentNode.clientHeight;
        let bbox = this.el.parentNode.getBoundingClientRect();

        // this.postprocessing.setSize(width, height);
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.dispatch(actions.core.updateScreenSize({
            width,
            height,
            top: bbox.top,
            left: bbox.left
        }));

        if (this._defaultScene) {
            this._defaultScene._needsRepaint = true;
        }
    }

    // Public API
    get state() {
        return this.store.getState();
    }

    registerFont(name, definition) {
        this.dispatch(actions.fonts.registerWithURI(
            name,
            definition
        ));
    }

    registerType(name, definition) {
        this.dispatch(actions.types.register({
            name,
            definition
        }));
    }

    getDefaultScene() {
        return this._defaultScene;
    }

    render(userCallback) {
        if (typeof userCallback === 'function') {
            this._userRenderCallback = userCallback;
        }

        // Do rendering loop
        this._defaultScene.render(this.renderer, this._userRenderCallback);
        window.requestAnimationFrame(this.render);
    }
}

export default Cartogram;
