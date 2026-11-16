// Pano de losangos: cada instância é um losango plano numa grelha.
// A ondulação (ruído no vertex shader) dá profundidade; o rato empurra (ou atrai) e faz crescer.
attribute vec2 aCell;      // posição da célula na grelha (x, y) em unidades de mundo
attribute float aSeed;     // 0..1, fixo por célula

uniform float uTime;
uniform vec2 uMouse;       // em unidades de mundo (plano z=0)
uniform float uMouseOn;    // 0 fora, 1 dentro
uniform float uAmp;        // amplitude da ondulação (sobe quando o hero sai)
uniform float uDrift;      // deriva vertical (scroll)
uniform float uRadius;     // raio de influência do rato
uniform float uPull;       // +1 foge do rato, -1 é atraído
uniform float uAgitation;  // 0 calmo, 1 agitado (CTA começa agitado)
uniform float uWarmRate;   // fração de losangos que aquecem (ex.: 0.16)

varying float vZ;
varying float vNear;
varying float vWarm;
varying float vFade;
varying vec3 vNormal;

// ruído simples e barato (value noise com suavização)
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

void main() {
  vec2 cell = aCell;
  cell.y += uDrift;

  // ondulação do pano
  float t = uTime * (0.18 + uAgitation * 0.5);
  float amp = uAmp * (1.0 + uAgitation * 2.2);
  float z = (noise(cell * 0.35 + t) - 0.5) * 2.0;
  z += (noise(cell * 0.9 - t * 0.7) - 0.5) * 0.6;
  z *= amp;

  // influência do rato
  vec2 d = cell - uMouse;
  float dist = length(d);
  float k = clamp(1.0 - dist / uRadius, 0.0, 1.0) * uMouseOn;
  float kk = k * k;
  vec2 push = (dist > 0.0001 ? d / dist : vec2(0.0)) * kk * uPull * (uPull > 0.0 ? 0.9 : min(dist * 0.55, 1.4));
  cell += push;
  z += kk * 0.9 * uPull;

  // escala: pequeno ao longe, cresce perto do rato
  float s = 0.42 + (z / max(amp, 0.001) + 1.0) * 0.12 + kk * 1.1;

  // normal aproximada pela inclinação do ruído (luz)
  float e = 0.25;
  float zx = (noise((aCell + vec2(e, 0.0)) * 0.35 + t) - noise((aCell - vec2(e, 0.0)) * 0.35 + t)) * amp;
  float zy = (noise((aCell + vec2(0.0, e)) * 0.35 + t) - noise((aCell - vec2(0.0, e)) * 0.35 + t)) * amp;
  vNormal = normalize(vec3(-zx, -zy, 0.6));

  vec3 pos = vec3(position.xy * s + cell, z);
  vZ = z / max(amp, 0.001);
  vNear = kk;
  vWarm = step(1.0 - uWarmRate, aSeed) * smoothstep(0.25, 0.7, k);
  vFade = 1.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
