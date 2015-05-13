varying vec2 vUv;
varying float vDepth;

void main() {
    vUv = uv;
    vDepth = cameraPosition.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
