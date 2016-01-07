import three from 'three';
import _ from 'lodash';

import createStore from './reducers/initializer';

const defaultOptions = {
    resizeCanvas: true,
    backgroundColor: '#ffffff',
};

class Cartogram {
    constructor(el, options=defaultOptions) {
        if (el.length) {
            // Handle jQuery selectors
            this.el = el[0];
        } else {
            this.el = el;
        }

        this.options = Object.assign({
            width: this.el.parentNode.clientWidth,
            height: this.el.parentNode.clientHeight
        }, options);

        this.width = this.options.width;
        this.height = this.options.height;

        this._initializeRenderer();
        this._initializeData();
        this._initializeModules();
    }

    _initializeRenderer() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'cartogram-webgl-canvas';
        this.el.appendChild(this.canvas);

        this.renderer = new three.WebGLRenderer({
            canvas: this.canvas,
            precision: 'highp',
            alpha: true,
            premultipliedAlpha: true,
            stencil: true
        });

        this.renderer.setClearColor((new three.Color(this.options.backgroundColor)).getHex(), 1);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.sortObjects = true;

        if (this.options.resizeCanvas) {
            window.addEventListener('resize', _.debounce(this._updateCanvasDimensions, 100), false);
        }
    }

    _initializeData() {
        this.store = createStore()
    }

    _initializeModules() {

    }

    _updateCanvasDimensions() {
        var width, height;

        width = this.el.parentNode.clientWidth;
        height = this.el.parentNode.clientHeight;

        // this.postprocessing.setSize(width, height);
        this.renderer.setSize(width, height);

        this.width = width;
        this.height = height;

        // this.camera.updateSize();
    }

    // Public API
    registerType(name, definition) {
        typeActions.register({
            name,
            definition
        });
    }

    addScene(scene) {
        sceneActions.add({ scene });
    }

    removeScene(scene) {
        var remove = sceneActions.remove;

        if (typeof scene === 'string') {
            remove = sceneActions.removeWithName;
        }

        remove(scene);
    }

    render() {
        // Do rendering loop
    }
}
