/* Gausse-Seidel solving step, must be used as a part of Gauss-Seidel
relaxation. */

precision highp float;
precision highp sampler2D;

uniform vec2 resolution;
uniform float k;
uniform sampler2D field;
uniform sampler2D compute;
uniform bool bndContinuity;

vec2 uv(vec2 o) {
    return (gl_FragCoord.xy + o) / resolution;
}

vec2 uv(float ox, float oy) {
    return uv(vec2(ox, oy));
}

vec2 bnd() {
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    return vec2(
        x <= 1. ? 1. : x >= resolution.x - 1. ? -1. : 0.,
        y <= 1. ? 1. : y >= resolution.y - 1. ? -1. : 0.
    );
}

void main() {
    vec3 new = vec3(0.);

    if(gl_FragCoord.x <= 1. || gl_FragCoord.x >= resolution.x - 1. ||
       gl_FragCoord.y <= 1. || gl_FragCoord.y >= resolution.y - 1.) {
        new = bndContinuity ? texture2D(field, uv(bnd())).xyz : vec3(bnd(), 0.);
    } else {
        float h = 1.;
        vec3 top    = texture2D(compute, uv( 0., h)).xyz;
        vec3 bottom = texture2D(compute, uv( 0.,-h)).xyz;
        vec3 left   = texture2D(compute, uv( h, 0.)).xyz;
        vec3 right  = texture2D(compute, uv(-h, 0.)).xyz;

        vec3 current = texture2D(field, uv(0.,0.)).xyz;

        new = (current + k*(top + bottom + right + left)) / (1. + 4.*k);
    }

    gl_FragColor = vec4(new, 1.);
}