precision highp float;

uniform sampler2D uSampler;
uniform int uLoaded;

varying vec2 vUv;

void main(void) {
  vec2 test = vUv * 100.0;
  gl_FragColor = texture2D(uSampler, test);
}
