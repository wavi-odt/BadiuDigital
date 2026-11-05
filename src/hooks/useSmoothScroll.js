import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Inicializa Lenis e devolve um ref ao instância para que o chamador
 * possa chamar lenis.scrollTo(0, { immediate: true }) em mudanças de rota.
 */
export function useSmoothScroll() {
  const lenisRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.1,         // inércia: 0 = máximo, 1 = imediato
      smoothWheel: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    });
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  return lenisRef;
}
