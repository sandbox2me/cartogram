precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 offset;
attribute vec2 scale;
attribute vec4 color;
attribute vec2 uv;

varying vec4 vColor;
varying vec2 vUv;

void main() {
    vec3 vPosition = position * vec3(scale, 0);
    vColor = color;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(offset + vPosition, 1.0);
}
