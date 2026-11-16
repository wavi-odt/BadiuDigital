import { lazy, Suspense } from 'react';
import { useReducedMotion } from '@/motion/useReducedMotion';

const GrainGradient = lazy(() => import('./GrainGradient'));

/**
 * Fundo gratinado carregado sob pedido. Por baixo fica sempre um gradiente CSS + grão SVG
 * (primeiro pintar, sem JS e em reduced motion); o WebGL só entra por cima quando há movimento.
 */
export default function LazyGrainGradient({ className = '', ...props }) {
  const reduced = useReducedMotion();
  return (
    <div className={`grainbg-wrap ${className}`} aria-hidden="true">
      <div className="grainbg-static" />
      {!reduced && (
        <Suspense fallback={null}>
          <GrainGradient {...props} />
        </Suspense>
      )}
    </div>
  );
}
