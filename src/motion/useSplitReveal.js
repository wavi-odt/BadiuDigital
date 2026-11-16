import { gsap, SplitText, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { EASE } from '@/motion/easings';

const PRESETS = {
  // títulos H2: carácter a carácter, com máscara e ligeira rotação
  chars: {
    split: { type: 'words,chars', mask: 'chars', charsClass: 'sc' },
    targets: (s) => s.chars,
    from: { yPercent: 120, rotate: 8 },
    to: { yPercent: 0, rotate: 0, stagger: 0.02, duration: 1.2, ease: EASE.enter },
  },
  // texto corrido: linha a linha com máscara
  lines: {
    split: { type: 'lines', mask: 'lines', linesClass: 'sl' },
    targets: (s) => s.lines,
    from: { yPercent: 110 },
    to: { yPercent: 0, stagger: 0.08, duration: 1.1, ease: EASE.enter },
  },
};

/**
 * Revela um título com SplitText (máscara + stagger).
 * - trigger: 'scroll' (ao entrar no ecrã) | 'manual' (corre quando play passa a true)
 * - o split refaz-se sozinho quando as fontes carregam ou a largura muda (autoSplit)
 * - acessível: o SplitText põe aria-label no elemento e esconde os fragmentos
 * - reduced motion: sem split, só um fade curto
 */
export function useSplitReveal(ref, { preset = 'chars', trigger = 'scroll', play = true, start = 'top 88%', delay = 0 } = {}) {
  useGSAP(() => {
    const el = ref.current;
    if (!el) return undefined;
    const cfg = PRESETS[preset];
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      if (trigger === 'manual' && !play) {
        // ainda à espera (ex.: preloader): esconder sem layout shift
        gsap.set(el, { autoAlpha: 0 });
        return undefined;
      }
      const split = SplitText.create(el, {
        ...cfg.split,
        autoSplit: true,
        aria: 'auto',
        onSplit(self) {
          gsap.set(el, { autoAlpha: 1 });
          return gsap.fromTo(cfg.targets(self), cfg.from, {
            ...cfg.to,
            delay,
            ...(trigger === 'scroll' && { scrollTrigger: { trigger: el, start, once: true } }),
          });
        },
      });
      return () => split.revert();
    });

    mm.add(MQ.reduce, () => {
      if (trigger === 'manual' && !play) return;
      gsap.fromTo(el, { autoAlpha: 0 }, {
        autoAlpha: 1, duration: 0.4, ease: 'power1.out', delay: trigger === 'manual' ? 0 : 0,
        ...(trigger === 'scroll' && { scrollTrigger: { trigger: el, start, once: true } }),
      });
    });

    return () => mm.revert();
  }, { dependencies: [preset, trigger, play, start, delay], revertOnUpdate: true });
}
