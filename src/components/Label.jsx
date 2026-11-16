import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { SCRAMBLE_CHARS } from '@/motion/easings';

const randomize = (text) =>
  text.replace(/\S/g, () => SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0]);

/**
 * Etiqueta mono (Geist Mono 13px, maiúsculas, névoa) que entra "a decifrar":
 * primeiro caracteres aleatórios (◆◇/\_01A–Z), depois resolve da esquerda para a direita.
 *
 * - trigger 'scroll' (por omissão) ou 'manual' com play (ex.: hero, depois do preloader)
 * - leitores de ecrã leem sempre o texto final (sr-only); a parte animada é aria-hidden
 */
export default function Label({ children, as: Tag = 'span', className = '', trigger = 'scroll', play = true, delay = 0, ...rest }) {
  const text = String(children ?? '');
  const visible = useRef(null);
  const root = useRef(null);

  useGSAP(() => {
    const el = visible.current;
    if (!el) return undefined;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      el.textContent = randomize(text);
      const run = () => gsap.to(el, {
        duration: Math.min(1.4, 0.4 + text.length * 0.025),
        delay,
        ease: 'none',
        scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.6, tweenLength: false, revealDelay: 0.1 },
      });
      if (trigger === 'manual') {
        if (play) run();
        return () => { el.textContent = text; };
      }
      const st = ScrollTrigger.create({ trigger: root.current, start: 'top 92%', once: true, onEnter: run });
      return () => { st.kill(); el.textContent = text; };
    });
    return () => mm.revert();
  }, { dependencies: [text, trigger, play, delay], revertOnUpdate: true });

  return (
    <Tag ref={root} className={`t-label ${className}`} {...rest}>
      <span className="sr-only">{text}</span>
      <span key={text} ref={visible} aria-hidden="true">{text}</span>
    </Tag>
  );
}
