/* Gausse-Seidel solving step, must be used as a part of Gauss-Seidel
relaxation. */

precision highp float;
precision highp sampler2D;

uniform vec2 resolution;
uniform float k;
uniform sampler2D field;

vec2 uv(float ox, float oy) {
    return (gl_FragCoord.xy + vec2(ox, oy)) / resolution;
}

void main() {
    vec3 top    = texture2D(field, uv( 0., 1.)).rgb;
    vec3 bottom = texture2D(field, uv( 0.,-1.)).rgb;
    vec3 left   = texture2D(field, uv( 1., 0.)).rgb;
    vec3 right  = texture2D(field, uv(-1., 0.)).rgb;

    vec3 current = texture2D(field, uv(0., 0.)).rgb;

    vec3 new = (current + k*(top + bottom + right + left)) / (1. + 4.*k);

    gl_FragColor = vec4(new, 1.);
}