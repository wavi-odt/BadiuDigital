import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import Label from '@/components/Label';
import SplitHeading from '@/components/SplitHeading';

const PATH = 'M7 7 C 120 7, 160 46, 260 40 S 420 4, 507 7 S 660 50, 760 40 S 900 6, 1000 7';

/**
 * Processo "fio a fio": uma linha castanha ondulada desenha-se com o scroll e liga as 4 etapas;
 * o losango de cada etapa acende e pulsa (2.4 → 1) quando a linha lá chega. Em mobile: grelha 2 colunas, sem linha.
 */
export default function Process() {
  const { t } = useTranslation();
  const steps = t('homepage.process.steps', { returnObjects: true });
  const root = useRef(null);
  const path = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const items = () => gsap.utils.toArray('[data-step]', root.current);
    mm.add(MQ.motion, () => {
      gsap.from(items(), { y: 40, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } });
    });
    mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
      const el = path.current;
      const len = el.getTotalLength();
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
      let lit = 0;
      const tw = gsap.to(el, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: () => `+=${window.innerHeight * 1.1}`, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 1,
          onUpdate: (self) => {
            const list = items();
            const n = list.filter((s, i) => self.progress >= i / list.length + 0.02).length;
            list.forEach((s, i) => s.classList.toggle('is-on', i < n));
            if (n > lit) gsap.fromTo(list[n - 1].querySelector('[data-dot]'), { scale: 2.4 }, { scale: 1, duration: 0.7, ease: 'expo.out' });
            lit = n;
          },
        },
      });
      const host = root.current;
      host.__phase = () => { const st = tw.scrollTrigger; return { start: st.start, end: st.end, stops: [st.start, st.end], duration: 3.2 }; };
      return () => { delete host.__phase; };
    });
    mm.add(`${MQ.mobile}, ${MQ.reduce}`, () => { items().forEach((s) => s.classList.add('is-on')); });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} id="processo" data-phase="" className="proc wrap" aria-labelledby="proc-title">
      <Label>{t('homepage.process.label')}</Label>
      <SplitHeading id="proc-title" className="t-h2 proc-title">
        {t('homepage.process.title_a')} <em>{t('homepage.process.title_b')}</em>
      </SplitHeading>
      <ol className="proc-steps" data-steps="">
        <svg className="proc-line" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
          <path ref={path} d={PATH} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        {steps.map((s, i) => (
          <li key={s.t} className="proc-step" data-step="">
            <span className="proc-dot" data-dot="" aria-hidden="true" />
            <span className="t-label">{t('homepage.process.step', { n: i + 1 })}</span>
            <h3 className="proc-name">{s.t}</h3>
            <p className="proc-desc">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
