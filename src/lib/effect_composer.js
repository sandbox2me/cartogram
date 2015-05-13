/**
 * @author alteredq / http://alteredqualia.com/
 */
define(function(require) {
    'use strict';

    var THREE = require('three');
    var CopyShader = require('../shaders/copy_shader');
    var ShaderPass = require('./shader_pass');
    var MaskPass = require('./mask_pass');

    var EffectComposer = function ( renderer, renderTarget ) {

        this.renderer = renderer;

        if ( renderTarget === undefined ) {

            var width = window.innerWidth || 1;
            var height = window.innerHeight || 1;
            var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

            renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

        }

        this.renderTarget1 = renderTarget;
        this.renderTarget2 = renderTarget.clone();

        this.writeBuffer = this.renderTarget1;
        this.readBuffer = this.renderTarget2;

        this.passes = [];

        if ( CopyShader === undefined )
            console.error( "THREE.EffectComposer relies on THREE.CopyShader" );

        this.copyPass = new ShaderPass( CopyShader );

    };

    EffectComposer.prototype = {

        swapBuffers: function() {

            var tmp = this.readBuffer;
            this.readBuffer = this.writeBuffer;
            this.writeBuffer = tmp;

        },

        addPass: function ( pass ) {

            this.passes.push( pass );

        },

        insertPass: function ( pass, index ) {

            this.passes.splice( index, 0, pass );

        },

        render: function ( delta ) {

            this.writeBuffer = this.renderTarget1;
            this.readBuffer = this.renderTarget2;

            var maskActive = false;

            var pass, i, il = this.passes.length;

            for ( i = 0; i < il; i ++ ) {

                pass = this.passes[ i ];

                if ( !pass.enabled ) continue;

                pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

                if ( pass.needsSwap ) {

                    if ( maskActive ) {

                        var context = this.renderer.context;

                        context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );

                        this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );

                        context.stencilFunc( context.EQUAL, 1, 0xffffffff );

                    }

                    this.swapBuffers();

                }

                if ( pass instanceof MaskPass.MaskPass ) {

                    maskActive = true;

                } else if ( pass instanceof MaskPass.ClearMaskPass ) {

                    maskActive = false;

                }

            }

        },

        reset: function ( renderTarget ) {

            if ( renderTarget === undefined ) {

                renderTarget = this.renderTarget1.clone();

                renderTarget.width = window.innerWidth;
                renderTarget.height = window.innerHeight;

            }

            this.renderTarget1 = renderTarget;
            this.renderTarget2 = renderTarget.clone();

            this.writeBuffer = this.renderTarget1;
            this.readBuffer = this.renderTarget2;

        },

        setSize: function ( width, height ) {

            var renderTarget = this.renderTarget1.clone();

            renderTarget.width = width;
            renderTarget.height = height;

            this.reset( renderTarget );

        }

    };

    return EffectComposer;
});
