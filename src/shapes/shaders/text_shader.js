define(function(require) {
    'use strict';

    var textFragmentShader = require('text!./text_fragment.glsl'),
        textVertexShader = require('text!./text_vertex.glsl');

    return {
        uniforms: function(texture, fontSize, maxZoom, color, maxSmoothing, minSmoothing) {
            if (!maxSmoothing) {
                // XXX(parris): I bet default maxSmoothing might need to be calculated
                maxSmoothing = 8.0;
            }

            if (!minSmoothing) {
                minSmoothing = 1.0;
            }

            return {
                uSampler: {
                    type: 't',
                    value: texture
                },
                uFontSize: {
                    type: 'f',
                    value: fontSize
                },
                uMaxZoom: {
                    type: 'f',
                    value: maxZoom
                },
                uColor: {
                    type: 'c',
                    value: color
                },
                uMaxSmoothing: {
                    type: 'f',
                    value: maxSmoothing
                },
                uMinSmoothing: {
                    type: 'f',
                    value: minSmoothing
                }
            };
        },
        shaders: {
            vertex: textVertexShader,
            fragment: textFragmentShader
        }
    };
});
