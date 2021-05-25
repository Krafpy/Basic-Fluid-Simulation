precision highp float;
precision highp sampler2D;

uniform vec2 resolution;
uniform sampler2D velocity;
uniform sampler2D divergent;

void main(){
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 h = vec3(1./resolution, 0.);

    float left   = texture2D(divergent, uv - h.xz).x;
    float right  = texture2D(divergent, uv + h.xz).x;
    float top    = texture2D(divergent, uv + h.zy).x;
    float bottom = texture2D(divergent, uv - h.zy).x;

    vec2 v = texture2D(velocity, uv).xy;
    v -= vec2(right - left, top - bottom);

    gl_FragColor = vec4(v, 0., 1.);
}