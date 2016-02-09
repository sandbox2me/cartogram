precision highp float;

uniform sampler2D uSampler;

varying vec4 vColor;
varying vec2 vUv;
varying vec4 vTexOffset;

void main() {
    vec2 uv;

    // Calculate sampler coordinate
    uv.x = vTexOffset.x + (vUv.x * vTexOffset.z);
    uv.y = vTexOffset.y - (vUv.y * vTexOffset.w);

    // vec4 color = mix(texture2D(uSampler, uv), vColor);

    gl_FragColor = texture2D(uSampler, uv);
}
