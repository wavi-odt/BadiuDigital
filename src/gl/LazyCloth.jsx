import { lazy, Suspense } from 'react';
import { useReducedMotion } from '@/motion/useReducedMotion';
import { useTheme } from '@/hooks/useTheme';

const ClothField = lazy(() => import('./ClothField'));

/**
 * Carrega o pano WebGL num chunk à parte (three só entra aqui).
 * Com reduced motion não monta nada: fica o fundo estático (CSS).
 */
export default function LazyCloth(props) {
  const reduced = useReducedMotion();
  const { theme } = useTheme();
  if (reduced) return null;
  return (
    <Suspense fallback={null}>
      <ClothField theme={theme} {...props} />
    </Suspense>
  );
}
