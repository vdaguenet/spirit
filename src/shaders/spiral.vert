attribute float size;
attribute float theta;
attribute float radius;

uniform float alpha;
uniform float maxHeight;

varying float vOpacity;

void main()
{
  gl_PointSize = size;

  vec3 newPos = position;
  newPos.x = radius * cos(theta);
  newPos.y = radius * sin(theta);
  newPos.z = radius * theta * tan(alpha);

  vOpacity = abs(newPos.y / maxHeight);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
}
