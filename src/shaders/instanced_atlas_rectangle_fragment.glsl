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

    vec4 color = texture2D(uSampler, uv) + vec4(vColor.rgb, 0.0);

    if (vColor.a > 0.0) {
        color.a *= vColor.a;
    }

    gl_FragColor = color;
}
