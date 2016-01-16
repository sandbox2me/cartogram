#extension GL_OES_standard_derivatives : enable
precision highp float;

// uniform vec4 fill;
// uniform vec4 stroke;
// uniform float strokeWidth;

varying vec4 vColor;
varying vec2 vUv;

void main() {
    vec4 stroke = vec4(1.0, 0.5, 0.0, 1.0);
    float strokeWidth = 0.0;
    float inset = 0.01;
    float radius = 0.5; // - inset;
    float distance = distance(vUv, vec2(0.5, 0.5));

    float afwidth = 0.9 * length(vec2(dFdx(distance), dFdy(distance)));
    float outerStep = smoothstep(radius - afwidth, radius + afwidth, distance);
    float innerStep = smoothstep(radius - inset, radius, distance + strokeWidth);

    // if (strokeWidth < 0.01) {
    //     stroke = vColor;
    // }

    if (distance > (radius - strokeWidth)) {
        gl_FragColor = mix(stroke, vec4(1, 1, 1, 0.0), outerStep);
    } else {
        gl_FragColor = mix(vColor, stroke, innerStep);
    }
}
