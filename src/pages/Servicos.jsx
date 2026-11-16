import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { useServices } from '@/hooks/useServices';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PanelVisual, HIGHLIGHT } from '@/sections/Services';
import { PageHero, Reveal, H2, Loading, ErrorView, PageCta } from '@/components/page';
import Label from '@/components/Label';
import TLink from '@/components/TLink';
import { ROUTES } from '@/constants/routes';

export default function Servicos() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.services'));
  const { data: services, loading, error, reload } = useServices();
  const root = useRef(null);
  const why = [1, 2, 3].map((n) => ({ stat: t(`why.item_0${n}_stat`), title: t(`why.item_0${n}_title`), desc: t(`why.item_0${n}_desc`) }));

  useGSAP(() => {
    if (!services) return undefined;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.utils.toArray('[data-srv]', root.current).forEach((row) => {
        gsap.from(row.querySelector('[data-line]'), { scaleX: 0, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: row, start: 'top 85%', once: true } });
        gsap.from(row.querySelectorAll('[data-srv-in] > *'), { y: 40, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 80%', once: true } });
        gsap.from(row.querySelectorAll('[data-svc-cell]'), { scale: 0, transformOrigin: '50% 50%', stagger: { each: 0.03, from: 'center' }, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: row, start: 'top 75%', once: true } });
        gsap.fromTo(row.querySelector('[data-srv-num]'), { yPercent: 30 }, { yPercent: -30, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
      });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [services?.length], revertOnUpdate: true });

  return (
    <div ref={root}>
      <PageHero label={t('nav.services')} title={t('services.heading')} lead={t('services.description')} />
      {loading && <Loading />}
      {error && <ErrorView error={error} onRetry={reload} />}
      {services && (
        <section className="srv wrap" aria-label={t('nav.services')}>
          {services.map((s, i) => (
            <article key={s.id} className="srv-row" data-srv="">
              <span className="srv-line" data-line="" aria-hidden="true" />
              <span className="srv-num" data-srv-num="" aria-hidden="true">{s.number}</span>
              <div className="srv-txt" data-srv-in="">
                <Label>{t('homepage.services.panel', { n: i + 1, total: services.length })}</Label>
                <h2 className="srv-name">{s.title}</h2>
                <p className="srv-desc">{s.description}</p>
                <span className="t-label">{t('services.what_includes')}</span>
                <ul className="svc-list">{s.includes?.map((it) => <li key={it}>{it}</li>)}</ul>
                <div className="srv-tags">
                  {s.tags?.map((tag) => <TLink key={tag} to={ROUTES.projectsByTag(tag)} className="chip" data-cursor="view">{tag}</TLink>)}
                </div>
              </div>
              <div className="srv-vis"><PanelVisual pattern={HIGHLIGHT[i % HIGHLIGHT.length]} /></div>
            </article>
          ))}
        </section>
      )}

      <section className="why wrap" aria-labelledby="why-title">
        <Label>{t('why.eyebrow')}</Label>
        <H2 id="why-title" className="why-title">{t('why.heading')}</H2>
        <Reveal as="ul" className="why-grid" stagger={0.12}>
          {why.map((w) => (
            <li key={w.title} className="why-item">
              <span className="t-label why-stat">{w.stat}</span>
              <h3 className="t-h3">{w.title}</h3>
              <p>{w.desc}</p>
            </li>
          ))}
        </Reveal>
      </section>

      <PageCta title={t('services.cta_line1') + ' ' + t('services.cta_line2')} button={t('services.contact_cta').replace(' →', '')} />
    </div>
  );
}
