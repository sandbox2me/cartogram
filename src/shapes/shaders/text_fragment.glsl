#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
varying float vDepth;

uniform sampler2D uSampler;
uniform float uFontSize;
uniform float uMaxZoom;
uniform vec3 uColor;
uniform float uMaxSmoothing;
uniform float uMinSmoothing;

const float cBuffer = 0.5;

void main(void) {
    float smoothing = vDepth / uMaxZoom * (uMaxSmoothing - uMinSmoothing) + uMinSmoothing;
    float gamma = (smoothing * 1.4142) / uFontSize;

    float dist = texture2D(uSampler, vUv).a;
    float alpha = smoothstep(cBuffer - gamma, cBuffer + gamma, dist);
    // gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
    gl_FragColor = vec4(uColor.rgb, alpha);
}
