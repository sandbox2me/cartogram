/* global Stats */
define(function(require) {
    'use strict';

    var three = require('three'),
        _ = require('underscore'),
        packageJson = require('text!../package.json'),
        CanvasRenderer = require('./lib/canvas_renderer'),
        CartogramPaper = require('./paper'),
        CartogramCamera = require('./camera'),
        CartogramInteraction = require('./interaction'),
        CartogramPostprocessing = require('./postprocessing'),
        CartogramSceneTree = require('./scene_tree'),
        CartogramColor = require('./color'),
        CartogramDebug = require('./debug'),
        animationManager = require('./animation_manager'),
        Cartogram;

    packageJson = JSON.parse(packageJson);

    Cartogram = function(el, options) {
        _.bindAll(
            this,
            'render',
            'updateCanvasDimensions'
        );

        this.options = _.extend({
            immediate: true,
            resizeCanvas: true,
            backgroundColor: '#ffffff',
            showDebug: false,
            canvas: undefined // Optional option
        }, options);

        this.version = packageJson.version;
        this.el = el;
        this.SDFFonts = {};

        this.initializeRenderer(options.width, options.height);
        this.initializeModules();

        if (this.options.showDebug) {
            this.initializeDebug();
        }
    };

    Cartogram.prototype = {
        initializeRenderer: function(optionalWidth, optionalHeight) {
            var hasWebGL = window.WebGLRenderingContext,
                width = optionalWidth || this.el.parentNode.clientWidth,
                height = optionalHeight || this.el.parentNode.clientHeight;

            if (hasWebGL || this.options.forceGL) {
                try {
                    this.renderer = new three.WebGLRenderer({
                        canvas: this.options.canvas,
                        precision: 'highp',
                        alpha: true,
                        premultipliedAlpha: true,
                        stencil: true
                    });
                } catch(e) {
                    this.renderer = new CanvasRenderer();
                }
            }
            else {
                this.renderer = new CanvasRenderer();
            }

            this.width = width;
            this.height = height;

            this.isGL = this.renderer instanceof three.WebGLRenderer;

            this.renderer.setClearColor((new three.Color(this.options.backgroundColor)).getHex(), 1);
            // this.renderer.setClearColor(0x88aa00, 1);
            if (this.isGL) {
                // this.renderer.setBlending(
                //     three.CustomBlending,
                //     three.AddEquation,
                //     three.SrcAlphaFactor,
                //     three.OneMinusSrcAlphaFactor
                // );
            }

            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.width, this.height);
            this.renderer.sortObjects = true;

            if (this.options.resizeCanvas) {
                window.addEventListener('resize', _.debounce(this.updateCanvasDimensions, 100), false);
            }
        },

        initializeModules: function() {
            this.clock = new three.Clock();

            this.paper = new CartogramPaper(this);
            this.sceneTree = new CartogramSceneTree(this);
            this.camera = new CartogramCamera(this, this.options);
            this.interaction = new CartogramInteraction(this);
            this.color = CartogramColor;

            this.animationManager = animationManager;

            this.postprocessing = new CartogramPostprocessing(this);
            this.postprocessing.setSize(this.width, this.height);
            this.postprocessing.initialize([
                'FXAA'
                // 'Vignette'
            ]);
        },

        initializeDebug: function() {
            this.stats = new Stats();
            this.stats.setMode(0); // 0: fps, 1: ms

            // Align top-left
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.body.appendChild( this.stats.domElement );

            CartogramDebug.initialize();
            CartogramDebug.updateMode('<strong>' + (this.isGL ? '<i class="ico-event ico--large"></i>  WebGL' : 'Canvas') + '</strong>');
        },

        render: function() {
            if (this.options.showDebug) { this.stats.begin(); }
            animationManager.update(this.clock.getDelta());

            this.camera.update();
            this.interaction.update();


            this.postprocessing.update();
            // XXX(parris): Dan thinks circles look better with this on.
            // Anti-aliasing on makes text a little crunchier regardless of technique
            // SDFText looks better, but the tradeoff seems worth it.
            this.postprocessing.render(window.devicePixelRatio < 1.5);
            // this.postprocessing.render(false);

            if (this.options.showDebug) { this.stats.end(); }

            if (this.options.showDebug) {
                var rendererInfo = this.renderer.info;
                CartogramDebug.updateRendererInfo(
                    (this.isGL ? '<p>Textures: <strong>' + rendererInfo.memory.textures + '</strong></p>' : '') +
                    (this.isGL ? '<p>Geometries: <strong>' + rendererInfo.memory.geometries + '</strong></p>' : '') +
                    (this.isGL ? '<p>Programs: <strong>' + rendererInfo.memory.programs + '</strong></p>' : '') +
                    '<p>Vertices: <strong>' + rendererInfo.render.vertices + '</strong></p>' +
                    '<p>Faces: <strong>' + rendererInfo.render.faces + '</strong></p>' +
                    '<p>Draw Calls: <strong>' + rendererInfo.render.calls + '</strong></p>'
                );
            }

            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(this.render);
            } else {
                window.setTimeout(this.render, 16);
            }
        },

        updateCanvasDimensions: function() {
            // XXX May need to adjust camera Z position to maintain zoom level
            var width, height;

            width = this.el.parentNode.clientWidth;
            height = this.el.parentNode.clientHeight;

            this.postprocessing.setSize(width, height);

            this.width = width;
            this.height = height;

            this.camera.updateSize();
            // this.camera.camera.aspect = width / height;
            // this.camera.updateProjectionMatrix();

        },

        destroy: function() {
            if (this.options.resizeCanvas) {
                window.removeEventListener('resize', this.updateCanvasDimensions, false);
            }
        }
    };

    // Create a new instance of Paper so we don't
    // need a global renderer object.
    Cartogram.Shapes = new CartogramPaper({
        options: {
            immediate: false
        }
    });

    // delete unusable paper methods from the instance
    delete Cartogram.Shapes.clear;
    delete Cartogram.Shapes.remove;
    delete Cartogram.Shapes.add;

    return Cartogram;
});
