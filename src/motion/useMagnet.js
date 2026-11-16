import { gsap, useGSAP } from '@/motion/gsap';
import { EASE } from '@/motion/easings';
import { MQ } from '@/motion/useMediaQuery';

/**
 * Efeito magnético: o elemento segue o rato dentro da sua área e volta com retorno elástico.
 * Só com rato/trackpad e sem reduced motion.
 */
export function useMagnet(ref, { strength = 0.35, strengthY = 0.45 } = {}) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return undefined;
    const mm = gsap.matchMedia();
    mm.add(`${MQ.fine} and ${MQ.motion}`, () => {
      const qx = gsap.quickTo(el, 'x', { duration: 0.6, ease: EASE.elastic });
      const qy = gsap.quickTo(el, 'y', { duration: 0.6, ease: EASE.elastic });
      const move = (e) => {
        const r = el.getBoundingClientRect();
        qx((e.clientX - r.left - r.width / 2) * strength);
        qy((e.clientY - r.top - r.height / 2) * strengthY);
      };
      const leave = () => { qx(0); qy(0); };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      return () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
        gsap.set(el, { x: 0, y: 0 });
      };
    });
    return () => mm.revert();
  }, { dependencies: [strength, strengthY] });
}
