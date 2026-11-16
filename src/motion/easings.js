// Easings e durações da marca (ver "Princípios de motion" no CLAUDE.md)
export const EASE = {
  enter: 'expo.out',     // entradas
  enterSoft: 'power4.out',
  exit: 'power3.in',     // saídas, mais curtas
  brand: 'badiu',        // CustomEase "badiu" = M0,0 C0.7,0 0.2,1 1,1
  elastic: 'elastic.out(1, 0.4)',
};

export const DUR = {
  enter: 1.2,  // 0.9 – 1.4s
  enterShort: 0.9,
  exit: 0.6,
};

export const SCRUB = 0.8; // 0.6 – 1

// Glifos do efeito "decifrar" das etiquetas mono
export const SCRAMBLE_CHARS = '◆◇/\\_01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
