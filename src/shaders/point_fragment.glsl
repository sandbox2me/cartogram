#extension GL_OES_standard_derivatives : enable
// varying vec3 vFill;

// uniform vec4 fill;
// uniform vec4 stroke;
// uniform float strokeWidth;

varying vec2 vUv;

void main() {
    vec4 fill = vec4(1.0, 0.5, 0.0, 1.0);
    vec4 stroke = vec4(1.0, 0.5, 0.0, 1.0);
    float strokeWidth = 0.0;
    float inset = 0.01;
    float radius = 0.5; // - inset;
    float distance = distance(gl_PointCoord, vec2(0.5, 0.5));

    float afwidth = 0.9 * length(vec2(dFdx(distance), dFdy(distance)));
    float outerStep = smoothstep(radius - afwidth, radius + afwidth, distance);
    float innerStep = smoothstep(radius - inset, radius, distance + strokeWidth);

    if (distance > (radius - strokeWidth)) {
        gl_FragColor = mix(stroke, vec4(1, 1, 1, 0.0), outerStep);
    } else {
        gl_FragColor = mix(fill, stroke, innerStep);
    }
}
