precision highp float;
precision highp sampler2D;

uniform vec2 resolution;
uniform float deltaTime;
uniform sampler2D velocity;
uniform sampler2D field;

vec3 bilerp(sampler2D sam, vec2 p) {
    vec2 st = p - 0.5;

    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 h = vec2(1.5, 0.5);
    vec3 a = texture2D(sam, (i + h.yy) / resolution).xyz;
    vec3 b = texture2D(sam, (i + h.xy) / resolution).xyz;
    vec3 c = texture2D(sam, (i + h.yx) / resolution).xyz;
    vec3 d = texture2D(sam, (i + h.xx) / resolution).xyz;

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
    vec2 v = bilerp(velocity, gl_FragCoord.xy).xy;
    vec2 p = gl_FragCoord.xy - v * deltaTime;
    vec3 new = bilerp(field, p);

    gl_FragColor = vec4(new, 1.);
}