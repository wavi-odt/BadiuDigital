import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import Logo from '@/components/Logo';
import Label from '@/components/Label';

/** "*palavra*" marca as palavras-chave (itálico castanho-claro + explosão de losangos). */
function parse(text) {
  return text.split(/\s+/).filter(Boolean).map((w, i) => {
    const key = /\*[^*]+\*/.test(w) || (w.startsWith('*') && w.endsWith('*'));
    return { id: i, key, text: w.replace(/\*/g, '') };
  });
}

function burst(el) {
  for (let i = 0; i < 10; i++) {
    const b = document.createElement('span');
    b.className = 'burst';
    el.appendChild(b);
    const a = Math.random() * Math.PI * 2;
    const r = 40 + Math.random() * 60;
    gsap.fromTo(b, { x: 0, y: 0, scale: 1, opacity: 1, rotation: 45 }, {
      x: Math.cos(a) * r, y: Math.sin(a) * r, scale: 0, rotation: 225, opacity: 0,
      duration: 0.9 + Math.random() * 0.4, ease: 'expo.out', onComplete: () => b.remove(),
    });
  }
}

/**
 * Manifesto: parágrafo grande em Fraunces em que cada palavra passa de pedra a osso com o scroll;
 * as palavras-chave acendem em itálico castanho-claro e soltam losangos.
 * À esquerda, sticky: etiqueta + símbolo que se monta ao entrar e roda 360° ao longo da secção.
 */
export default function Manifesto() {
  const { t } = useTranslation();
  const root = useRef(null);
  const para = useRef(null);
  const words = useMemo(() => parse(t('homepage.manifesto.text')), [t]);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const ws = gsap.utils.toArray('[data-word]', para.current);
      gsap.to(ws, {
        color: (i, el) => (el.dataset.key ? 'var(--accent-em)' : 'var(--fg)'),
        stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: para.current, start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
      });
      ws.forEach((w, i) => {
        if (!w.dataset.key) return;
        ScrollTrigger.create({
          trigger: para.current, once: true,
          start: () => `top+=${(i / ws.length) * para.current.offsetHeight} 78%`,
          onEnter: () => burst(w),
        });
      });
      gsap.from(para.current, { y: 80, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 30%', scrub: true } });
      gsap.from('[data-spin] [data-logo-cell]', {
        scale: 0, transformOrigin: '50% 50%', stagger: { each: 0.04, from: 'random' }, duration: 0.8, ease: 'back.out(2)',
        scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
      });
      gsap.to('[data-spin] svg', { rotate: 360, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    mm.add(MQ.reduce, () => {
      gsap.set('[data-word]', { color: (i, el) => (el.dataset.key ? 'var(--accent-em)' : 'var(--fg)') });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [words], revertOnUpdate: true });

  return (
    <section ref={root} className="mani wrap" aria-label={t('homepage.manifesto.label')}>
      <div className="mani-side">
        <Label>{t('homepage.manifesto.label')}</Label>
        <div className="mani-spin" data-spin="">
          <Logo variant="symbol" size={120} decorative />
        </div>
      </div>
      <p ref={para} className="mani-text">
        {words.map((w, i) => (
          <span key={w.id}>
            <span className={`mani-word${w.key ? ' is-key' : ''}`} data-word="" data-key={w.key || undefined}>{w.text}</span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
    </section>
  );
}
