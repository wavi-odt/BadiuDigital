import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { useMotion } from '@/app/providers/MotionProvider';
import { useServices } from '@/hooks/useServices';
import { CELLS, STROKE, TIGHT_VIEWBOX } from '@/components/Logo';
import Label from '@/components/Label';
import SplitHeading from '@/components/SplitHeading';

/** Padrão de destaque por serviço: quais os losangos castanhos (índice da célula → módulo/resto). */
export const HIGHLIGHT = [{ mod: 4, rem: 0 }, { mod: 3, rem: 1 }, { mod: 5, rem: 2 }, { mod: 2, rem: 0 }];

export function PanelVisual({ pattern }) {
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
 * Serviços: secção pinned onde o scroll mostra um card de cada vez (desktop). Cada painel entra rodado em 3D
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
  const stRef = useRef(null);
  const { scrollTo, lenis } = useMotion();
  const goTo = (i) => {
    const st = stRef.current?.tl.scrollTrigger;
    if (st) scrollTo(st.start + stRef.current.rest[i] * (st.end - st.start), { duration: 1.2 });
  };

  useGSAP(() => {
    if (!services.length) return undefined;
    const mm = gsap.matchMedia();
    const panels = () => gsap.utils.toArray('[data-panel]', track.current);

    mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
      // Um card de cada vez: a secção fica pinned e o scroll avança uma timeline em que
      // o card atual sai (sobe, roda ligeiramente e desvanece) enquanto o seguinte entra.
      const ps = panels();
      const n = ps.length;
      // pontos de repouso (em tempo da timeline): o scroll assenta sempre num card inteiro
      const rest = ps.map((_, k) => (k === 0 ? 0 : k === n - 1 ? k + 0.6 : k + 0.45) / n);
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current, start: 'top 6%', end: () => `+=${n * window.innerHeight * 0.85}`,
          pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 2,
          onUpdate: (self) => {
            const cur = rest.reduce((best, r, i) => (Math.abs(r - self.progress) < Math.abs(rest[best] - self.progress) ? i : best), 0);
            root.current.querySelectorAll('[data-dot]').forEach((d, i) => d.classList.toggle('is-on', i === cur));
          },
        },
      });
      ps.forEach((p, k) => {
        if (k > 0) {
          const at = k - 0.15;
          tl.fromTo(p, { autoAlpha: 0, y: 90, rotateX: -8, scale: 0.94 }, { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, ease: 'power3.out', duration: 0.35 }, at)
            .fromTo(p.querySelectorAll('[data-txt] > *'), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.3, ease: 'power3.out' }, at + 0.05)
            .fromTo(p.querySelectorAll('[data-svc-cell]'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, stagger: { each: 0.01, from: 'center' }, duration: 0.3, ease: 'back.out(1.6)' }, at + 0.08);
        }
        if (k < n - 1) tl.to(p, { autoAlpha: 0, y: -90, rotateX: 8, scale: 0.94, ease: 'power3.in', duration: 0.3 }, k + 0.7);
      });
      tl.set({}, {}, n); // duração total = n
      stRef.current = { tl, rest };
      const host = root.current;
      host.__phase = () => {
        const st = tl.scrollTrigger;
        return { start: st.start, end: st.end, stops: rest.map((r) => st.start + r * (st.end - st.start)), duration: 1.9 };
      };

      // Snap próprio (o snap do ScrollTrigger luta com o scroll suave): quando o scroll pára,
      // assenta no card seguinte se foste para baixo, ou no anterior se foste para cima.
      let last = 0;
      let timer;
      const gap = 1 / n;
      const settle = () => {
        const st = tl.scrollTrigger;
        if (!st || st.progress <= 0 || st.progress >= 1) return;
        const pr = st.progress;
        const near = rest.reduce((b, r, i) => (Math.abs(r - pr) < Math.abs(rest[b] - pr) ? i : b), 0);
        let target = near;
        if (Math.abs(pr - rest[last]) < gap * 1.3) {
          if (pr > rest[last] + 0.015) target = Math.min(last + 1, n - 1);
          else if (pr < rest[last] - 0.015) target = Math.max(last - 1, 0);
          else target = last;
        }
        last = target;
        if (Math.abs(rest[target] - pr) > 0.004) scrollTo(st.start + rest[target] * (st.end - st.start), { duration: 0.9 });
      };
      const onScroll = () => { clearTimeout(timer); timer = setTimeout(settle, 140); };
      lenis?.on('scroll', onScroll);
      return () => { clearTimeout(timer); lenis?.off('scroll', onScroll); delete host.__phase; };
    });

    mm.add(`${MQ.mobile} and ${MQ.motion}`, () => {
      panels().forEach((p) => {
        gsap.from(p, { y: 90, scale: 0.94, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 88%', once: true } });
        gsap.from(p.querySelectorAll('li'), { x: -30, autoAlpha: 0, stagger: 0.07, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 70%', once: true } });
        gsap.from(p.querySelectorAll('[data-svc-cell]'), { scale: 0, transformOrigin: '50% 50%', stagger: { each: 0.03, from: 'center' }, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: p, start: 'top 75%', once: true } });
      });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [services.length, lenis], revertOnUpdate: true });

  return (
    <section ref={root} id="servicos" data-phase="" className="svc" aria-labelledby="svc-title">
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
            </article>
          ))}
        </div>
        <div className="svc-dots" role="group" aria-label={t('homepage.services.title_a') + ' ' + t('homepage.services.title_b')}>
          {services.map((sv, i) => (
            <button key={sv.id} type="button" data-dot="" className={i === 0 ? 'svc-dot is-on' : 'svc-dot'} aria-label={sv.title} onClick={() => goTo(i)} data-cursor="view" />
          ))}
        </div>
      </div>
    </section>
  );
}
