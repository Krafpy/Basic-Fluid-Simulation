precision highp float;
precision highp sampler2D;

uniform vec2 resolution;
uniform float deltaTime;
uniform sampler2D velocity;
uniform sampler2D field;
uniform bool bndContinuity;

vec2 bnd() {
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    return vec2(
        x <= 1. ? 1. : x >= resolution.x - 1. ? -1. : 0.,
        y <= 1. ? 1. : y >= resolution.y - 1. ? -1. : 0.
    );
}

vec3 get(vec2 p) {
    return texture2D(field, p / resolution).xyz;
}

void main() {
    vec3 new = vec3(0.);
    vec2 coord = gl_FragCoord.xy / resolution;

    if(gl_FragCoord.x <= 1. || gl_FragCoord.x >= resolution.x - 1. ||
       gl_FragCoord.y <= 1. || gl_FragCoord.y >= resolution.y - 1.) {
        new = bndContinuity ? get(coord + bnd()) : vec3(bnd(), 0.);
    } else {
        vec2 v = texture2D(velocity, coord).xy;
        vec2 uv = gl_FragCoord.xy - v * deltaTime;
        vec2 st = uv - 0.5;

        vec2 i = floor(st);
        vec2 f = fract(st);

        vec2 h = vec2(1.5, 0.5);
        vec3 a = get(i + h.yy);
        vec3 b = get(i + h.xy);
        vec3 c = get(i + h.yx);
        vec3 d = get(i + h.xx);

        new = mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    gl_FragColor = vec4(new, 1.);
}