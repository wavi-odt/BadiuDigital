import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { useServices } from '@/hooks/useServices';
import { CELLS, STROKE, TIGHT_VIEWBOX } from '@/components/Logo';
import Label from '@/components/Label';
import SplitHeading from '@/components/SplitHeading';

/** Padrão de destaque por serviço: quais os losangos castanhos (índice da célula → módulo/resto). */
const HIGHLIGHT = [{ mod: 4, rem: 0 }, { mod: 3, rem: 1 }, { mod: 5, rem: 2 }, { mod: 2, rem: 0 }];

function PanelVisual({ pattern }) {
  return (
    <svg viewBox={TIGHT_VIEWBOX} className="svc-grid" aria-hidden="true" overflow="visible">
      {CELLS.map((c, i) => {
        const hot = i % pattern.mod === pattern.rem;
        const fill = hot ? 'var(--accent)' : c.role === 'core' ? 'var(--accent-em)' : 'var(--line-strong)';
        return <polygon key={c.id} data-svc-cell="" data-dist={c.dist.toFixed(2)} points={c.points} fill={fill} stroke={fill} strokeWidth={STROKE} strokeLinejoin="round" />;
      })}
    </svg>
  );
}

/**
 * Serviços: secção pinned com scroll horizontal (desktop). Cada painel entra rodado em 3D
 * (rotateY −14°, escala 0.9), endireita-se ao centro e volta a rodar ao sair; o texto
 * entra em cascata; o visual abre com clip-path em losango e os losangos montam-se do centro.
 * Em mobile: sem pin, os painéis empilham-se e sobem ao entrar.
 */
export default function Services() {
  const { t } = useTranslation();
  const { data } = useServices();
  const services = data ?? [];
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(() => {
    if (!services.length) return undefined;
    const mm = gsap.matchMedia();
    const panels = () => gsap.utils.toArray('[data-panel]', track.current);

    mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
      const dist = () => track.current.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 8%', end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      panels().forEach((p) => {
        const st = (start, end) => ({ containerAnimation: tween, trigger: p, start, end, scrub: true });
        gsap.fromTo(p, { rotateY: -14, scale: 0.9, transformOrigin: '0% 50%' }, { rotateY: 0, scale: 1, ease: 'none', scrollTrigger: st('left right', 'left 30%') });
        gsap.to(p, { rotateY: 8, scale: 0.94, transformOrigin: '100% 50%', ease: 'none', immediateRender: false, scrollTrigger: st('right 45%', 'right left') });
        gsap.from(p.querySelectorAll('[data-txt] > *'), { y: 70, autoAlpha: 0, stagger: 0.12, ease: 'none', scrollTrigger: st('left 85%', 'left 25%') });
        gsap.from(p.querySelector('[data-num]'), { xPercent: 60, ease: 'none', scrollTrigger: st('left right', 'right left') });
        gsap.fromTo(p.querySelector('[data-vis]'), { clipPath: 'polygon(50% 45%, 55% 50%, 50% 55%, 45% 50%)' }, { clipPath: 'polygon(50% -10%, 110% 50%, 50% 110%, -10% 50%)', ease: 'none', scrollTrigger: st('left 95%', 'left 35%') });
        gsap.from(p.querySelectorAll('[data-svc-cell]'), { scale: 0, transformOrigin: '50% 50%', ease: 'none', stagger: { each: 0.02, from: 'center' }, scrollTrigger: st('left 90%', 'left 30%') });
      });
    });

    mm.add(`${MQ.mobile} and ${MQ.motion}`, () => {
      panels().forEach((p) => {
        gsap.from(p, { y: 90, scale: 0.94, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 88%', once: true } });
        gsap.from(p.querySelectorAll('li'), { x: -30, autoAlpha: 0, stagger: 0.07, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 70%', once: true } });
        gsap.from(p.querySelectorAll('[data-svc-cell]'), { scale: 0, transformOrigin: '50% 50%', stagger: { each: 0.03, from: 'center' }, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: p, start: 'top 75%', once: true } });
      });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [services.length], revertOnUpdate: true });

  return (
    <section ref={root} id="servicos" className="svc" aria-labelledby="svc-title">
      <div className="svc-head wrap">
        <SplitHeading id="svc-title" className="t-h2 svc-title">
          {t('homepage.services.title_a')} <em>{t('homepage.services.title_b')}</em>
        </SplitHeading>
        <Label className="svc-hint">{t('homepage.services.label', { count: services.length })}</Label>
        <Label className="svc-hint-mobile">{t('homepage.services.label_mobile', { count: services.length })}</Label>
      </div>
      <div className="svc-viewport">
        <div ref={track} className="svc-track wrap">
          {services.map((s, i) => (
            <article key={s.id} className="svc-panel" data-panel="">
              <div className="svc-txt" data-txt="">
                <span className="t-label">{t('homepage.services.panel', { n: i + 1, total: services.length })}</span>
                <h3 className="svc-name">{s.title}</h3>
                <p className="svc-desc">{s.description}</p>
                <ul className="svc-list">
                  {(s.includes ?? s.tags ?? []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="svc-vis" data-vis=""><PanelVisual pattern={HIGHLIGHT[i % HIGHLIGHT.length]} /></div>
              <span className="svc-num" data-num="" aria-hidden="true">{s.number ?? String(i + 1).padStart(2, '0')}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
