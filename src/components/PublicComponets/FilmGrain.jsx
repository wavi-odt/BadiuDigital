import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export default function FilmGrain() {
  const reduced = usePrefersReducedMotion();
  return (
    <div className={reduced ? 'film-grain film-grain--static' : 'film-grain'} aria-hidden="true">
      <svg className="film-grain__svg" xmlns="http://www.w3.org/2000/svg">
        <filter id="film-grain-filter" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65 0.65" numOctaves="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain-filter)" />
      </svg>
    </div>
  );
}
