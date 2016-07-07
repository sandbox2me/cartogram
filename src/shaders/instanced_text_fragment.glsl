precision highp float;

uniform int uLoaded;
uniform sampler2D uSampler;
uniform float uMaxZoom;
uniform float uMaxSmoothing;
uniform float uMinSmoothing;
uniform vec2 texSize;

varying vec4 vColor;
varying float vFontSize;
varying vec4 vTexOffset;

varying vec2 vUv;
varying float vDepth;

const float cBuffer = 0.5;

void main(void) {
    vec2 uv;
    float fLoaded = float(uLoaded);

    // Calculate sampler coordinate
    uv.x = vTexOffset.x + (vUv.x * vTexOffset.z);
    uv.y = vTexOffset.y - (vUv.y * vTexOffset.w);

    float smoothing = vDepth / uMaxZoom * (uMaxSmoothing - uMinSmoothing) + uMinSmoothing;
    float gamma = (smoothing * 1.4142) / vFontSize;

    float dist = texture2D(uSampler, uv).a;
    float alpha = smoothstep(cBuffer - gamma, cBuffer + gamma, dist);

    gl_FragColor = vec4(vColor.xyz * fLoaded, alpha * fLoaded);
}
