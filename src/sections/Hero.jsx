import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, SplitText, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { useIntro } from '@/app/providers/IntroProvider';
import LazyCloth from '@/gl/LazyCloth';
import Label from '@/components/Label';
import Magnetic from '@/components/Magnetic';
import TLink from '@/components/TLink';
import { ROUTES } from '@/constants/routes';

/**
 * Hero: "Software com raízes." em Fraunces, revelado carácter a carácter no fim do preloader,
 * por cima de um pano de losangos WebGL que foge do rato.
 * Ao sair com o scroll: o título sobe, encolhe e desvanece; texto e botões sobem;
 * a câmara do pano aproxima-se, a ondulação aumenta e os losangos derivam para cima.
 * video: slot opcional { webm, mp4, poster } (loop gerado no Higgsfield), em blend mode.
 */
export default function Hero({ video }) {
  const { t } = useTranslation();
  const { heroReady } = useIntro();
  const root = useRef(null);
  const title = useRef(null);
  const cloth = useRef({ amp: 1, drift: 0, zoom: 1 }).current;

  // entrada (quando o preloader dá o sinal)
  useGSAP(() => {
    const el = title.current;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      if (!heroReady) {
        gsap.set(el, { autoAlpha: 0 });
        gsap.set('[data-hero-rv]', { autoAlpha: 0, y: 30 });
        return undefined;
      }
      const split = SplitText.create(el, {
        type: 'words,chars', mask: 'chars', charsClass: 'sc', autoSplit: true, aria: 'auto',
        onSplit: (s) => {
          gsap.set(el, { autoAlpha: 1 });
          return gsap.fromTo(s.chars, { yPercent: 115 }, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.025 });
        },
      });
      gsap.to('[data-hero-rv]', { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.1, delay: 0.35 });
      return () => split.revert();
    });
    mm.add(MQ.reduce, () => { gsap.set([el, '[data-hero-rv]'], { autoAlpha: 1, y: 0 }); });
    return () => mm.revert();
  }, { scope: root, dependencies: [heroReady], revertOnUpdate: true });

  // saída com o scroll
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(title.current, { yPercent: -35, scale: 0.92, autoAlpha: 0.1, transformOrigin: '0% 100%', ease: 'none', scrollTrigger: st });
      gsap.to('[data-hero-row]', { y: -120, autoAlpha: 0, ease: 'none', scrollTrigger: { ...st, end: '60% top' } });
      gsap.to(cloth, { amp: 3.2, drift: 6, zoom: 1.25, ease: 'none', scrollTrigger: st });
      if (root.current.querySelector('[data-hero-media]')) gsap.to('[data-hero-media]', { scale: 1.15, ease: 'none', scrollTrigger: st });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="hero wrap" aria-label={t('homepage.hero.label')}>
      <LazyCloth params={cloth} pull={1} className="hero-cloth" />
      {video && (
        <video
          data-hero-media
          className="hero-video"
          autoPlay muted loop playsInline
          preload="metadata"
          poster={video.poster}
          aria-hidden="true"
        >
          {video.webm && <source src={video.webm} type="video/webm" />}
          {video.mp4 && <source src={video.mp4} type="video/mp4" />}
        </video>
      )}
      <div className="hero-veil" aria-hidden="true" />

      <div className="hero-in">
        <Label trigger="manual" play={heroReady} delay={0.4} data-hero-rv="">{t('homepage.hero.label')}</Label>
        <h1 ref={title} className="hero-title t-display">
          {t('homepage.hero.title_a')} <em>{t('homepage.hero.title_b')}</em>
        </h1>
        <div className="hero-row" data-hero-row="">
          <p className="hero-lead" data-hero-rv="">{t('homepage.hero.lead')}</p>
          <div className="hero-ctas" data-hero-rv="">
            <Magnetic><TLink to={ROUTES.contact} className="button button-primary" data-cursor="go">{t('homepage.hero.cta_start')} →</TLink></Magnetic>
            <Magnetic><a href="#trabalho" className="button button-outline" data-cursor="view">{t('homepage.hero.cta_work')}</a></Magnetic>
          </div>
        </div>
        <div className="hero-scroll t-label" data-hero-rv="" data-hero-row="">
          <i className="hero-scroll-dot" aria-hidden="true" />
          {t('homepage.hero.scroll')}
        </div>
      </div>
    </section>
  );
}
