import { useEffect } from 'react';
import { gsap } from '@/motion/gsap';

/**
 * Skew por velocidade: um único ticker (ligado no MotionProvider) lê a velocidade do Lenis,
 * suaviza-a e inclina todos os elementos registados (skewY até ±5°).
 */
const setters = new Map();
const MAX = 5;
let current = 0;

export function startVelocitySkew(lenis) {
  const tick = () => {
    const target = gsap.utils.clamp(-MAX, MAX, -(lenis.velocity || 0) * 0.22);
    current += (target - current) * 0.12;
    if (Math.abs(current) < 0.01 && target === 0) current = 0;
    setters.forEach((set) => set(current));
  };
  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    current = 0;
    setters.forEach((set) => set(0));
  };
}

/** Regista um elemento para inclinar com a velocidade do scroll. */
export function useVelocitySkew(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setters.set(el, gsap.quickSetter(el, 'skewY', 'deg'));
    return () => {
      setters.delete(el);
      gsap.set(el, { skewY: 0 });
    };
  }, [ref]);
}
