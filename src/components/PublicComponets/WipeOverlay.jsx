import { useLocation } from 'react-router-dom';
import { usePageTransition } from '@/context/PageTransitionContext';

export default function WipeOverlay() {
  const { phase, onEnterEnd } = usePageTransition();
  const { key } = useLocation();

  return (
    <div className={`wipe wipe--${phase}`} aria-hidden="true">
      <span
        key={`${key}-${phase}`}
        className="wipe__gem"
        onAnimationEnd={phase === 'enter' ? onEnterEnd : undefined}
      />
    </div>
  );
}
