precision highp float;
precision highp sampler2D;

uniform vec2 resolution;
uniform sampler2D velocity;
uniform sampler2D compute;

void main(){
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 h = vec3(1./resolution, 0.);
    
    float divV = 0.;
    divV += texture2D(velocity, uv + h.xz).x;
    divV -= texture2D(velocity, uv - h.xz).x;
    divV += texture2D(velocity, uv + h.zy).y;
    divV -= texture2D(velocity, uv - h.zy).y;
    divV *= 0.5;

    float sumP = 0.;
    sumP += texture2D(compute, uv + h.xz).x;
    sumP += texture2D(compute, uv - h.xz).x;
    sumP += texture2D(compute, uv + h.zy).x;
    sumP += texture2D(compute, uv - h.zy).x;

    float p = 0.25 * (sumP - divV);

    gl_FragColor = vec4(p, 0., 0., 1.);
}