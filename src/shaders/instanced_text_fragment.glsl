precision highp float;

uniform sampler2D uSampler;
uniform float uMaxZoom;
uniform float uMaxSmoothing;
uniform float uMinSmoothing;
uniform vec2 texSize;

varying vec3 vColor;
varying float vFontSize;
varying vec4 vTexOffset;

varying vec2 vUv;
varying float vDepth;

const float cBuffer = 0.5;

void main(void) {
    vec2 uv;

    // Calculate sampler coordinate
    uv.x = ((vTexOffset.x + vTexOffset.z) * uv.x) / texSize.x;
    uv.y = ((vTexOffset.y + vTexOffset.w) * uv.y) / texSize.y;

    float smoothing = vDepth / uMaxZoom * (uMaxSmoothing - uMinSmoothing) + uMinSmoothing;
    float gamma = (smoothing * 1.4142) / vFontSize;

    float dist = texture2D(uSampler, uv).a;
    float alpha = smoothstep(cBuffer - gamma, cBuffer + gamma, dist);

    // gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
    gl_FragColor = vec4(vColor, alpha);
}
