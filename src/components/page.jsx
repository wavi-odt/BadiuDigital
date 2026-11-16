import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { useSplitReveal } from '@/motion/useSplitReveal';
import { useVelocitySkew } from '@/motion/velocitySkew';
import { useIntro } from '@/app/providers/IntroProvider';
import Label from '@/components/Label';
import TLink from '@/components/TLink';
import Magnetic from '@/components/Magnetic';
import { ROUTES } from '@/constants/routes';

/** Entrada ao aparecer: o próprio bloco (ou os filhos diretos, com stagger) sobe e desvanece. */
export function Reveal({ as: Tag = 'div', y = 40, delay = 0, stagger = 0, children, ...rest }) {
  const ref = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const targets = stagger ? ref.current.children : ref.current;
      gsap.from(targets, { y, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay, stagger, scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true } });
    });
    return () => mm.revert();
  }, { scope: ref });
  return <Tag ref={ref} {...rest}>{children}</Tag>;
}

/** Cabeçalho de página: etiqueta a decifrar + título carácter a carácter + texto de apoio. */
export function PageHero({ label, title, lead, children, size = 'display' }) {
  const ref = useRef(null);
  const { heroReady } = useIntro();
  useSplitReveal(ref, { trigger: 'manual', play: heroReady, delay: 0.1 });
  return (
    <header className="phero wrap">
      {label && <Label trigger="manual" play={heroReady}>{label}</Label>}
      <h1 ref={ref} className={size === 'display' ? 't-display phero-title' : 't-h1 phero-title'}>{title}</h1>
      {lead && <Reveal as="p" className="phero-lead" delay={0.5} y={24}>{lead}</Reveal>}
      {children}
    </header>
  );
}

/** Título de secção (H2) com a entrada da marca. */
export function H2({ children, className = '', ...rest }) {
  const ref = useRef(null);
  useSplitReveal(ref);
  useVelocitySkew(ref);
  return <h2 ref={ref} className={`t-h2 ${className}`} {...rest}>{children}</h2>;
}

export function Loading() {
  const { t } = useTranslation();
  return (
    <div className="state wrap" role="status" aria-live="polite">
      <i className="state-dot" aria-hidden="true" />
      <span className="t-label">{t('ui.loading_page')}</span>
    </div>
  );
}

export function ErrorView({ error, onRetry }) {
  const { t } = useTranslation();
  const notFound = error?.status === 404;
  return (
    <div className="state state--error wrap">
      <Label>{notFound ? '404' : t('error.label')}</Label>
      <h1 className="t-display state-title">{notFound ? t('error.not_found') : t('error.generic')}</h1>
      <p className="phero-lead">{error?.message}</p>
      <div className="row">
        {!notFound && onRetry && <button type="button" className="button button-outline" onClick={onRetry}>{t('error.retry')}</button>}
        <Magnetic><TLink to={ROUTES.home} className="button button-primary" data-cursor="go">{t('error.back_home')}</TLink></Magnetic>
      </div>
    </div>
  );
}

/** Bloco final de página, com o mesmo CTA. */
export function PageCta({ title, to = ROUTES.contact, button }) {
  return (
    <section className="pcta wrap">
      <Reveal className="pcta-in">
        <H2 className="pcta-title">{title}</H2>
        <Magnetic><TLink to={to} className="button button-primary" data-cursor="go">{button} →</TLink></Magnetic>
      </Reveal>
    </section>
  );
}
