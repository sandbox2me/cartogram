// varying float vSize;
// varying vec3 vFill;
// varying vec3 vStroke;
// varying float vStrokeWidth;

// attribute vec3 fill;
// attribute vec3 stroke;
// attribute float strokeWidth;

void main() {
    // vFill = fill;
    // vStroke = stroke;
    // vStrokeWidth = strokeWidth;

    gl_PointSize = 20.0; // vSize;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
