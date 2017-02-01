precision highp float;

uniform sampler2D uSampler;
uniform int uLoaded;

varying float vMultiplier;
varying vec2 vTextureOffset;
varying vec2 vUv;

void main(void) {
  vec2 coord = vUv * vMultiplier + vTextureOffset;
  gl_FragColor = texture2D(uSampler, coord);
}
