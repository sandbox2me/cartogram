precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 offset;
attribute vec2 scale;
attribute vec4 color;
attribute vec4 stroke;
attribute float strokeWidth;
attribute vec2 uv;

varying vec4 vColor;
varying vec4 vStroke;
varying float vStrokeWidth;
varying vec2 vUv;

void main() {
    vec3 vPosition = position * vec3(scale, 0);
    vColor = color;
    vStroke = stroke;
    vStrokeWidth = strokeWidth;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(offset + vPosition, 1.0);
}
