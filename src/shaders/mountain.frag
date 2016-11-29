uniform float maxheight;
uniform vec3 colorTop;
uniform vec3 colorBottom;

varying float vHeight;

void main() {
  float ratioHeight = vHeight / maxheight;
  vec3 gradient = mix(colorBottom, colorTop, ratioHeight - 0.3);

  gl_FragColor = vec4( gradient, 1.0 );
}
