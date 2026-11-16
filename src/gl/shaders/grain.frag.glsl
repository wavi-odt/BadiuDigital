precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;       // 0..1
uniform vec3 uBg;          // cor de base (noite)
uniform vec3 uA;           // castanho escuro (sombra do brilho)
uniform vec3 uB;           // castanho (núcleo do brilho)
uniform vec3 uC;           // castanho-claro (pico, usado com muita parcimónia)
uniform float uGrain;      // intensidade do grão (0.1 - 0.5)
uniform float uSpread;     // quanto o brilho ocupa (0.3 - 1.0)
uniform float uFlow;       // velocidade do movimento

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.02 + 7.3; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = vUv;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  float t = uTime * uFlow;

  // domínio deformado: dá o movimento orgânico de "tinta" a fluir
  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, -t * 0.8)));
  vec2 r = vec2(fbm(p * 1.6 + 3.0 * q + vec2(1.7, 9.2) + t * 0.6), fbm(p * 1.6 + 3.0 * q + vec2(8.3, 2.8) - t * 0.5));
  float f = fbm(p * 1.1 + 3.2 * r);

  // brilho principal: um foco que segue levemente o rato
  vec2 c = vec2(0.28 + (uMouse.x - 0.5) * 0.12, 0.2 + (uMouse.y - 0.5) * 0.12);
  float d = length((uv - c) * vec2(asp, 1.0));
  float glow = smoothstep(uSpread, 0.0, d);
  float field = glow * (0.55 + 0.9 * f) + (f - 0.5) * 0.25 * glow;

  // grão: ruído por pixel (muda a ~12 fps para parecer película) somado ANTES dos limiares,
  // por isso as transições entre cores ficam "gratinadas" em vez de suaves
  float frame = floor(uTime * 12.0);
  float g = hash(gl_FragCoord.xy + frame * 17.0) - 0.5;
  float g2 = hash(gl_FragCoord.xy * 0.5 + frame * 31.0) - 0.5;
  float n = field + (g + g2 * 0.6) * uGrain * 0.55;

  vec3 col = uBg;
  col = mix(col, uA, smoothstep(0.14, 0.26, n));
  col = mix(col, uB, smoothstep(0.36, 0.50, n));
  col = mix(col, uC, smoothstep(0.78, 0.92, n) * 0.6);

  // grão fino por cima de tudo (luminância), para dar textura mesmo nas zonas escuras
  col += (hash(gl_FragCoord.xy + frame * 7.0) - 0.5) * 0.02;

  // as cores chegam em linear (three converte do hex): voltar a sRGB para bater certo com o design
  col = pow(max(col, 0.0), vec3(1.0 / 2.2));

  gl_FragColor = vec4(col, 1.0);
}
