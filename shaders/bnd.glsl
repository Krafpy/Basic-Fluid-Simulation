precision highp float;
precision highp sampler2D;

#define BND_WIDTH 1.

uniform vec2 resolution;
uniform sampler2D field;
uniform float factor;

vec2 bnd() {
    float x = gl_FragCoord.x;
    float y = gl_FragCoord.y;
    return vec2(
        x <= BND_WIDTH ? 1. : x >= resolution.x - BND_WIDTH ? -1. : 0.,
        y <= BND_WIDTH ? 1. : y >= resolution.y - BND_WIDTH ? -1. : 0.
    ) * BND_WIDTH;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;

    vec2 s = step(vec2(BND_WIDTH), gl_FragCoord.xy) * step(gl_FragCoord.xy, resolution - vec2(BND_WIDTH));
    float inside = s.x * s.y;
    float corner = 1. - dot(s, s);

    vec3 neigh = factor * texture2D(field, uv + bnd() / resolution).xyz;
    vec3 new = texture2D(field, uv).xyz * inside + neigh * (1. - inside);

    gl_FragColor = vec4(new, 1.);
}