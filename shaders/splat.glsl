/* Density source */

precision highp float;
precision highp sampler2D;

uniform vec2 resolution;
uniform vec3 mouse; // (x, y, isPressed)
uniform float radius;
uniform sampler2D density;

void main() {
    float r = resolution.x / resolution.y;
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 p = uv; p.x *= r;
    vec2 m = mouse.xy / resolution; m.x *= r;

    vec3 oldDensity = texture2D(density, uv).rgb;
    float splat = smoothstep(1., 0., length(p - m) / radius) * mouse.z;
    vec3 newDensity = clamp(oldDensity + splat, 0., 1.);

    gl_FragColor = vec4(newDensity, 1.);
}