/**
 * Símbolo Panu da Badiu Digital.
 * variant "tile" = quadrado com cantos; "gem" = só o losango (sem fundo)
 */
const PALETTES = {
  petrol: { bg: '#0D4B57', fg: '#F1E4C3', core: '#F08A4B' },
  sand: { bg: '#F1E4C3', fg: '#0D4B57', core: '#F08A4B' },
};

export default function PanuLogo({ size = 40, variant = 'tile', tone = 'petrol', className, title }) {
  const c = PALETTES[tone] ?? PALETTES.petrol;
  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };

  if (variant === 'gem') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className} {...a11y}>
        <polygon points="50,0 100,50 50,100 0,50" fill={c.fg} />
        <polygon points="50,24 76,50 50,76 24,50" fill={c.bg} />
        <polygon points="50,40 60,50 50,60 40,50" fill={c.core} />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} {...a11y}>
      <rect width="100" height="100" rx="22" fill={c.bg} />
      <polygon points="50,12 88,50 50,88 12,50" fill={c.fg} />
      <polygon points="50,28 72,50 50,72 28,50" fill={c.bg} />
      <polygon points="50,40 60,50 50,60 40,50" fill={c.core} />
      <polygon points="10,10 30,10 10,30" fill={c.core} />
      <polygon points="90,90 70,90 90,70" fill={c.core} />
    </svg>
  );
}
