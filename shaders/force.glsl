/* Density source */

precision highp float;
precision highp sampler2D;

uniform vec2 resolution;
uniform vec3 mouse; // (x, y, isPressed)
uniform vec2 force;
uniform float radius;
uniform sampler2D velocity;
uniform float deltaTime;

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Gradient Noise by Inigo Quilez
// https://www.shadertoy.com/view/XdXGW8
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main() {
    float r = resolution.x / resolution.y;
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 p = uv; p.x *= r;
    vec2 m = mouse.xy / resolution; m.x *= r;

    vec2 vel = texture2D(velocity, uv).xy;
    float s = 15.;
    vec2 rand = vec2(noise(uv * s), noise(uv * s + 1.)) * length(force);
    float d = length(p - (m + 0.1 * force / resolution));
    float mag = smoothstep(1., 0., d / radius);
    vel += (force + rand) * mag * mouse.z;

    gl_FragColor = vec4(vel, 0., 1.);
}