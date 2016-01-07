import three from 'three';

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

        this.initializeRenderer();
        this.initializeData();
        this.initializeModules();
    }

    initializeRenderer() {
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
            window.addEventListener('resize', _.debounce(this.updateCanvasDimensions, 100), false);
        }
    }

    initializeData() {

    }

    initializeModules() {

    }

    updateCanvasDimensions() {
        var width, height;

        width = this.el.parentNode.clientWidth;
        height = this.el.parentNode.clientHeight;

        // this.postprocessing.setSize(width, height);
        this.renderer.setSize(width, height);

        this.width = width;
        this.height = height;

        // this.camera.updateSize();
    }

    render() {
        // Do rendering loop
    }
}
