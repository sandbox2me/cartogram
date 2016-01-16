precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

// varying float vSize;
// varying vec3 vFill;
// varying vec3 vStroke;
// varying float vStrokeWidth;

attribute vec3 position;
attribute vec4 fill;
attribute float size;

varying vec4 vFill;

// attribute vec3 stroke;
// attribute float strokeWidth;

void main() {
    vFill = fill;
    // vStroke = stroke;
    // vStrokeWidth = strokeWidth;


    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / length(mvPosition.xyz));
    gl_Position = projectionMatrix * mvPosition;
}
