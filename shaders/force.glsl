/* Density source */

precision highp float;
precision highp sampler2D;

uniform vec2 resolution;
uniform vec3 mouse; // (x, y, isPressed)
uniform vec2 force;
uniform float radius;
uniform sampler2D velocity;
uniform float decay;
uniform float deltaTime;

void main() {
    float r = resolution.x / resolution.y;
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 p = uv; p.x *= r;
    vec2 m = mouse.xy / resolution; m.x *= r;

    vec2 vel = texture2D(velocity, uv).xy;
    vel += force * smoothstep(1., 0., length(p - m) / radius) * mouse.z;

    //vec2 vel = normalize(gl_FragCoord.xy - resolution / 2.) * 100.;

    gl_FragColor = vec4(vel, 0., 1.);
}