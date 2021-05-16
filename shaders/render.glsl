precision highp float;

uniform vec2 resolution;
uniform sampler2D renderTexture;

void main() {;
    gl_FragColor = texture2D(renderTexture, gl_FragCoord.xy / resolution);
}