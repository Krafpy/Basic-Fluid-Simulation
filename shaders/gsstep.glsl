/* Gausse-Seidel solving step, must be used as a part of Gauss-Seidel
relaxation. */

precision highp float;
precision highp sampler2D;

uniform vec2 resolution;
uniform float k;
uniform sampler2D field;
uniform sampler2D compute;

void main() {
    vec3 new = vec3(0.);
    vec2 coord = gl_FragCoord.xy;

    vec3 h = vec3(1., 0., -1.);
    vec3 top    = texture2D(compute, (coord + h.yx) / resolution).xyz;
    vec3 bottom = texture2D(compute, (coord + h.yz) / resolution).xyz;
    vec3 left   = texture2D(compute, (coord + h.xy) / resolution).xyz;
    vec3 right  = texture2D(compute, (coord + h.zy) / resolution).xyz;

    vec3 current = texture2D(field, coord / resolution).xyz;

    new = (current + k*(top + bottom + right + left)) / (1. + 4.*k);

    gl_FragColor = vec4(new, 1.);
}