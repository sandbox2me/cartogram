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

    Postprocessing = function(picasso) {
        this.picasso = picasso;

        if (this.picasso.isGL) {
            this.composerRenderTarget = new three.WebGLRenderTarget(
                this.picasso.width * window.devicePixelRatio,
                this.picasso.height * window.devicePixelRatio,
                {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBFormat,
                    stencilBuffer: false
                }
            );

            this.composer = new EffectComposer(this.picasso.renderer, this.composerRenderTarget);
            this.composer.addPass(
                new RenderPass(
                    this.picasso.paper.scene,
                    this.picasso.paper.getCamera()
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
                this.picasso.renderer.render(
                    this.picasso.paper.scene,
                    this.picasso.camera.camera
                );
            }
        },

        updateSize: function(useComposer) {
            var width, height;

            if (window.devicePixelRatio !== this.lastSeenPixelRatio) {
                this.setSize(this.picasso.el.offsetWidth, this.picasso.el.offsetHeight);
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

            if (this.picasso.isGL) {
                // Use the true devicePixelRatio of the screen, because window zoom affects this value.
                this.picasso.renderer.setPixelRatio(Math.round(window.devicePixelRatio));
            } else {
                this.picasso.renderer.devicePixelRatio = window.devicePixelRatio;
            }

            this.picasso.renderer.setSize(width, height);
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
            this.shaders.fxaa.uniforms['resolution'].value = new three.Vector2(1 / this.picasso.width, 1 / this.picasso.height);
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
