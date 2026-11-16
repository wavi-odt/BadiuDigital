// Geometria do símbolo Badiu: a grelha do pano di terra.
// 13 losangos num losango maior (linhas com 1, 3, 5, 3, 1), num viewBox 100×100.
// Usado pelo <Logo>, pelo preloader, pela cortina de transição e pelas cenas WebGL.

export const ROWS = [1, 3, 5, 3, 1];
export const SPACING = 14;     // distância entre centros
export const HALF_DIAGONAL = 6.2;
export const STROKE = 1.5;

/** Células do "b" escondido. A 2-2 é o núcleo e mantém a cor de núcleo. */
const B_CELLS = new Set(['1-0', '2-1', '3-0', '2-2', '3-1']);
const CORE = '2-2';

export const diamondPoints = (cx, cy, d = HALF_DIAGONAL) =>
  `${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`;

/** @type {{ id: string, r: number, k: number, cx: number, cy: number, role: 'core'|'b'|'rest', points: string, dist: number }[]} */
export const CELLS = ROWS.flatMap((n, r) =>
  Array.from({ length: n }, (_, k) => {
    const cx = 50 + (k - (n - 1) / 2) * SPACING;
    const cy = 22 + r * SPACING;
    const id = `${r}-${k}`;
    const role = id === CORE ? 'core' : B_CELLS.has(id) ? 'b' : 'rest';
    return {
      id, r, k, cx, cy, role,
      points: diamondPoints(cx, cy),
      dist: Math.hypot(cx - 50, cy - 50) / SPACING, // distância ao centro, em "losangos"
    };
  }),
);

/** viewBox justo ao símbolo (inclui metade do stroke) */
const PAD = HALF_DIAGONAL + STROKE / 2;
const SPAN = SPACING * 4 + PAD * 2; // 4 intervalos de largura e de altura
export const TIGHT_VIEWBOX = `${50 - SPACING * 2 - PAD} ${22 - PAD} ${SPAN} ${SPAN}`;

/** Cores por tema. "auto" segue as variáveis CSS do tema do site. */
export const PALETTES = {
  dark: { core: '#8A5636', b: '#3A3A3A', rest: '#F5F5F2' },
  light: { core: '#5A3520', b: '#D2D2D0', rest: '#0E0E0E' },
  // abaixo de 24px: sem o "b", losangos osso e núcleo castanho-claro
  favicon: { core: '#A9714A', b: '#F5F5F2', rest: '#F5F5F2' },
  auto: { core: 'var(--logo-core)', b: 'var(--logo-b)', rest: 'var(--logo-rest)' },
  mono: { core: 'currentColor', b: 'currentColor', rest: 'currentColor' },
};
