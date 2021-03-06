#ifndef GL_FRAGMENT_PRECISION_HIGH
  precision mediump float;

#else
  precision highp float;
#endif

float fade (float t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec2 fade (vec2 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec3 fade (vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec4 fade (vec4 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
