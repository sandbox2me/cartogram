define(function(require) {
    'use strict';

    var three = require('three'),
        _ = require('underscore'),
        Postprocessing,

        EffectComposer = require('./lib/effect_composer'),
        RenderPass = require('./lib/render_pass'),
        ShaderPass = require('./lib/shader_pass'),
        VignetteShader = require('./shaders/vignette_shader'),
        FXAAShader = require('./shaders/fxaa_shader');

    Postprocessing = function(cartogram) {
        this.cartogram = cartogram;

        if (this.cartogram.isGL) {
            this.composerRenderTarget = new three.WebGLRenderTarget(
                this.cartogram.width * window.devicePixelRatio,
                this.cartogram.height * window.devicePixelRatio,
                {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBFormat,
                    stencilBuffer: false
                }
            );

            this.composer = new EffectComposer(this.cartogram.renderer, this.composerRenderTarget);
            this.composer.addPass(
                new RenderPass(
                    this.cartogram.paper.scene,
                    this.cartogram.paper.getCamera()
                )
            );
        }

        this.shaders = {};
    };

    Postprocessing.prototype = {
        initialize: function(shaders) {
            var i;

            if (!this.composer || (!shaders || !shaders.length)) {
                return;
            }

            for (i = 0; i < shaders.length; i++) {
                this['addShader' + shaders[i]]((i == shaders.length - 1));
            }
        },

        render: function(useComposer) {
            useComposer = useComposer === undefined ? true : useComposer;

            this.updateSize();
            if (this.composer && useComposer) {
                this.composer.render();
            } else {
                this.cartogram.renderer.render(
                    this.cartogram.paper.scene,
                    this.cartogram.camera.camera
                );
            }
        },

        updateSize: function(useComposer) {
            var width, height;

            if (window.devicePixelRatio !== this.lastSeenPixelRatio) {
                this.setSize(this.cartogram.el.offsetWidth, this.cartogram.el.offsetHeight);
            }
        },

        setSize: function(width, height) {
            if (this.composer) {
                this.composer.setSize(width, height);

                this.composerRenderTarget.setSize(
                    width * window.devicePixelRatio,
                    height * window.devicePixelRatio
                );
                this.composer.reset(this.composerRenderTarget);
            }

            if (this.cartogram.isGL) {
                // Use the true devicePixelRatio of the screen, because window zoom affects this value.
                this.cartogram.renderer.setPixelRatio(Math.round(window.devicePixelRatio));
            } else {
                this.cartogram.renderer.devicePixelRatio = window.devicePixelRatio;
            }

            this.cartogram.renderer.setSize(width, height);
            this.lastSeenPixelRatio = window.devicePixelRatio;
        },

        update: function() {
            _.each(this.shaders, function(shader, key) {
                var functionName = 'updateShader' + key;
                if (this[functionName]) {
                    this[functionName]();
                }
            }, this);
        },

        // XXX Extract these into postprocessing modules?
        addShaderFXAA: function(renderToScreen) {
            this.shaders.fxaa = new ShaderPass(FXAAShader);
            this.shaders.fxaa.renderToScreen = renderToScreen;
            this.composer.addPass(this.shaders.fxaa);
        },

        updateShaderfxaa: function() {
            this.shaders.fxaa.uniforms['resolution'].value = new three.Vector2(1 / this.cartogram.width, 1 / this.cartogram.height);
        },

        addShaderVignette: function(renderToScreen) {
            this.shaders.vignette = new ShaderPass(VignetteShader);
            this.shaders.vignette.uniforms['darkness'].value = 1.2;
            this.shaders.vignette.uniforms['offset'].value = 0.6;
            this.shaders.vignette.renderToScreen = renderToScreen;
            this.composer.addPass(this.shaders.vignette);
        }
    };

    return Postprocessing;
});
