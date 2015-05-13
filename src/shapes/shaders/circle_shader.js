define(function(require) {
    'use strict';

    var three = require('three'),

        circleFragmentShader = require('text!./circle_fragment.glsl'),
        shapeVertexShader = require('text!./shape_vertex.glsl');

    return {
        uniforms: function() {
            return {
                fill: {
                    type: 'v4',
                    value: new three.Vector4(1, 1, 1, 1)
                },
                stroke: {
                    type: 'v4',
                    value: new three.Vector4(0, 0, 0, 1)
                },
                strokeWidth: {
                    type: 'f',
                    value: 0.066
                }
            };
        },
        shaders: {
            // XXX: GLSL loader/parser instead of RequireJS text importer?
            vertex: shapeVertexShader,
            fragment: circleFragmentShader
        }
    };
});
