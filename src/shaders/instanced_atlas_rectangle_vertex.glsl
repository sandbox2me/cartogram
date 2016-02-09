precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 offset;
attribute float angle;
attribute vec2 scale;
attribute vec4 color;
attribute vec2 uv;
attribute vec4 texOffset;

varying vec4 vColor;
varying vec2 vUv;
varying vec4 vTexOffset;

void main() {
    float angleCos = cos(angle);
    float angleSin = sin(angle);

    vec3 scaledPosition = position * vec3(scale, 0);

    vec3 vPosition = vec3(
        (scaledPosition.x * angleCos) - (scaledPosition.y * angleSin),
        (scaledPosition.x * angleSin) + (scaledPosition.y * angleCos),
        scaledPosition.z
    );

    vColor = color;
    vTexOffset = texOffset;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(offset + vPosition, 1.0);
}
