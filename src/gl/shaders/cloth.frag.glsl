precision highp float;

uniform vec3 uColor;       // osso
uniform vec3 uWarm;        // castanho-claro
uniform vec3 uBg;          // cor de fundo (névoa de profundidade)
uniform vec3 uLight;       // posição da luz (segue o rato), em unidades de mundo
uniform float uBaseAlpha;  // opacidade base dos losangos ao longe

varying float vZ;
varying float vNear;
varying float vWarm;
varying vec3 vNormal;

void main() {
  // luz: difusa simples a partir da normal do pano + brilho perto do rato
  vec3 l = normalize(vec3(uLight.xy * 0.15, 1.0));
  float diff = 0.55 + 0.45 * max(dot(vNormal, l), 0.0);

  float alpha = uBaseAlpha + (vZ + 1.0) * 0.12 + vNear * 0.8;
  alpha = clamp(alpha * diff, 0.0, 1.0);

  vec3 col = mix(uColor, uWarm, vWarm);
  // os losangos mais fundos afundam para a cor do fundo (profundidade)
  col = mix(uBg, col, clamp(0.35 + (vZ + 1.0) * 0.4 + vNear, 0.0, 1.0));

  gl_FragColor = vec4(col, alpha);
}
