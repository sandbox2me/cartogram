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
            this.composer = new EffectComposer(this.picasso.renderer);
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

            if (this.composer && useComposer) {
                this.composer.render();
            } else {
                this.picasso.renderer.render(
                    this.picasso.paper.scene,
                    this.picasso.camera.camera
                );
            }
        },

        setSize: function(width, height) {

            if (this.composer) {
                this.composer.renderer.devicePixelRatio = window.devicePixelRatio || 1;
                this.composer.setSize(width, height);
            }

            if (this.picasso.isGL) {
                this.picasso.renderer.setPixelRatio(window.devicePixelRatio);
            } else {
                this.picasso.renderer.devicePixelRatio = window.devicePixelRatio;
            }
            this.picasso.renderer.setSize(width, height);
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
