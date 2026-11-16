import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/motion/gsap';
import { useFinePointer, useReducedMotion } from '@/motion/useMediaQuery';

const INTERACTIVE = 'a, button, [role="button"], label, summary, select';
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), textarea, [contenteditable="true"]';

/**
 * Cursor da marca: um pequeno losango osso que segue o rato com inércia,
 * em mix-blend-mode: difference (inverte o que está por baixo).
 * Sobre [data-cursor="view|open|go|talk"] cresce e mostra a etiqueta traduzida;
 * sobre outros links/botões só cresce. Desligado em touch e com reduced motion.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  if (!fine || reduced) return null;
  return <CursorInner />;
}

function CursorInner() {
  const { t } = useTranslation();
  const root = useRef(null);
  const label = useRef(null);
  const tRef = useRef(t);
  tRef.current = t;

  useGSAP(() => {
    const el = root.current;
    const html = document.documentElement;
    html.classList.add('has-cursor');
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const qx = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' });
    let shown = false;

    const move = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      qx(e.clientX);
      qy(e.clientY);
    };

    const setState = (target) => {
      const tagged = target?.closest?.('[data-cursor]');
      const text = target?.closest?.(TEXT);
      const interactive = target?.closest?.(INTERACTIVE);
      el.classList.toggle('is-text', Boolean(text));
      el.classList.toggle('is-label', Boolean(tagged) && !text);
      el.classList.toggle('is-hover', !tagged && Boolean(interactive) && !text);
      if (tagged) {
        const key = tagged.getAttribute('data-cursor');
        label.current.textContent = tRef.current(`cursor.${key}`, { defaultValue: key });
      }
    };

    const over = (e) => setState(e.target);
    const down = () => el.classList.add('is-down');
    const up = () => el.classList.remove('is-down');
    const leaveWindow = (e) => {
      if (!e.relatedTarget) { gsap.to(el, { autoAlpha: 0, duration: 0.25 }); shown = false; }
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    document.addEventListener('pointerout', leaveWindow, { passive: true });

    return () => {
      html.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('pointerout', leaveWindow);
    };
  }, []);

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <b className="cursor-mark" />
      <span ref={label} className="cursor-label" />
    </div>
  );
}
