precision mediump float;

varying vec2 vUv;
varying float vDepth;

varying sampler2D vSampler;
varying float vFontSize;
varying float vMaxZoom;
varying vec3 vColor;
varying float vMaxSmoothing;
varying float vMinSmoothing;

const float cBuffer = 0.5;

void main(void) {
    float smoothing = vDepth / vMaxZoom * (vMaxSmoothing - vMinSmoothing) + vMinSmoothing;
    float gamma = (smoothing * 1.4142) / vFontSize;

    float dist = texture2D(vSampler, vUv).a;
    float alpha = smoothstep(cBuffer - gamma, cBuffer + gamma, dist);
    // gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
    gl_FragColor = vec4(vColor.rgb, alpha);
}
