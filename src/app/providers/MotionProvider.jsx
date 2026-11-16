import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/motion/gsap';
import { useReducedMotion } from '@/motion/useReducedMotion';
import { startVelocitySkew } from '@/motion/velocitySkew';

const MotionContext = createContext({ lenis: null, reduced: false, scrollTo: () => {} });

/**
 * Lenis (scroll suave) ligado ao ticker do GSAP + estado de reduced motion.
 * Com prefers-reduced-motion o Lenis não arranca: o scroll fica nativo.
 */
export function MotionProvider({ children }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('motion-reduced', reduced);
    if (reduced) return undefined;

    const instance = new Lenis({ autoRaf: false, lerp: 0.09, smoothWheel: true });
    instance.on('scroll', ScrollTrigger.update);

    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const stopSkew = startVelocitySkew(instance);
    setLenis(instance);

    return () => {
      stopSkew();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // As fontes mudam a altura do texto: recalcular os triggers quando acabam de carregar
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());
    return () => { alive = false; };
  }, []);

  const scrollTo = useCallback(
    (target, opts = {}) => {
      if (lenis) return lenis.scrollTo(target, opts);
      const top = typeof target === 'number'
        ? target
        : (typeof target === 'string' ? document.querySelector(target) : target)?.getBoundingClientRect().top + window.scrollY + (opts.offset || 0);
      window.scrollTo({ top: top || 0, behavior: opts.immediate || reduced ? 'auto' : 'smooth' });
      return undefined;
    },
    [lenis, reduced],
  );

  const value = useMemo(() => ({ lenis, reduced, scrollTo }), [lenis, reduced, scrollTo]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export const useMotion = () => useContext(MotionContext);
export const useLenis = () => useContext(MotionContext).lenis;
