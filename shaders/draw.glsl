precision highp float;

uniform vec2 resolution;
uniform float time;

void main() {
  vec2 p = gl_FragCoord.xy / resolution;
  p -= 0.5;
  p.x *= resolution.x / resolution.y;
  float f = 0.5*sin(time)+0.5;
  vec3 col = mix(vec3(p.xy+0.5,0.), vec3(p.yx+0.5,0.), f);
  float s = step(0.25 + f * 0.25, length(p));
  col = s * col + (1. - s) * (1. - col);
	gl_FragColor = vec4(col, 1.0);
}