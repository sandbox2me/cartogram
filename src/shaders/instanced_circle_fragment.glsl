#extension GL_OES_standard_derivatives : enable
precision highp float;

varying vec4 vColor;
varying vec4 vStroke;
varying float vStrokeWidth;
varying vec2 vUv;

void main() {
    float inset = 0.01;
    float radius = 0.5; // - inset;
    float distance = distance(vUv, vec2(0.5, 0.5));

    float afwidth = 0.9 * length(vec2(dFdx(distance), dFdy(distance)));
    float outerStep = smoothstep(radius - afwidth, radius + afwidth, distance);
    float innerStep = smoothstep(radius - inset, radius, distance + vStrokeWidth);

    // if (vStrokeWidth < 0.01) {
    //     stroke = vColor;
    // }

    if (distance > (radius - vStrokeWidth)) {
        gl_FragColor = mix(vStroke, vec4(vStroke.rgb, 0.0), outerStep);
    } else {
        gl_FragColor = mix(vColor, vStroke, innerStep);
    }
}
