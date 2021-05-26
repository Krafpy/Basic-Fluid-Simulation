precision highp float;
precision highp sampler2D;

uniform vec2 resolution;
uniform float k;
uniform sampler2D field;
uniform sampler2D compute;
uniform float decay;

void main() {
    vec3 new = vec3(0.);
    vec2 coord = gl_FragCoord.xy;

    vec3 h = vec3(1., 0., -1.);
    vec3 sum = vec3(0.);
    sum += texture2D(compute, (coord + h.yx) / resolution).xyz;
    sum += texture2D(compute, (coord + h.yz) / resolution).xyz;
    sum += texture2D(compute, (coord + h.xy) / resolution).xyz;
    sum += texture2D(compute, (coord + h.zy) / resolution).xyz;

    vec3 current = texture2D(field, coord / resolution).xyz;
    current *= (1. - decay);

    new = (current + k*sum) / (1. + 4.*k);

    gl_FragColor = vec4(new, 1.);
}