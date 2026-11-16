precision highp float;

uniform sampler2D uMap;
uniform float uTime;
uniform float uVelocity;   // velocidade do rato (0..1)
uniform vec2 uDir;         // direção do movimento
uniform float uHasMap;
uniform vec3 uColor;       // cor de fundo quando não há imagem

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  // ondulação que depende da velocidade
  float w = sin(uv.y * 9.0 + uTime * 3.0) * 0.012 * uVelocity;
  uv.x += w;
  uv.y += cos(uv.x * 7.0 - uTime * 2.0) * 0.008 * uVelocity;

  // distorção RGB na direção do movimento
  vec2 shift = uDir * 0.02 * uVelocity;
  vec3 col;
  if (uHasMap > 0.5) {
    col.r = texture2D(uMap, uv + shift).r;
    col.g = texture2D(uMap, uv).g;
    col.b = texture2D(uMap, uv - shift).b;
  } else {
    // sem imagem: losangos da marca em relevo
    vec2 g = fract((uv + shift) * vec2(14.0, 10.0)) - 0.5;
    float dmd = step(abs(g.x) + abs(g.y), 0.33);
    col = mix(uColor, uColor * 1.18 + 0.03, dmd * 0.35);
  }
  gl_FragColor = vec4(col, 1.0);
}
