precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 offset;
attribute vec2 scale;
attribute vec4 color;
attribute float fontSize;
attribute vec4 texOffset;

varying vec4 vColor;
varying float vFontSize;
varying vec4 vTexOffset;
varying vec2 vUv;
varying float vDepth;

void main() {
    vec3 vPosition = position * vec3(scale, 0);

    vColor = color;
    vFontSize = fontSize;
    vTexOffset = texOffset;
    vUv = uv;
    vDepth = 10.0; //cameraPosition.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(offset + vPosition, 1.0);
}
