import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import Spotlight from '../Spotlight';

const LETTERS = 'badiu'.split('');

const IntroPhase = forwardRef(function IntroPhase({ tagline }, ref) {
  const { t } = useTranslation();
  return (
    <section id="inicio" ref={ref} data-tone="dark" className="phase bg-ink" style={{ height: '300vh' }}>
      <Spotlight className="phase__stage flex flex-col items-center justify-center text-sand">
        <div className="intro__light" aria-hidden="true" />
        <div className="intro__gem-shadow" aria-hidden="true" />
        <div className="intro__gem" aria-hidden="true">
          <svg width="300" height="300" viewBox="0 0 100 100" className="overflow-visible">
            <polygon points="50,0 100,50 50,100 0,50" fill="#F1E4C3" />
            <polygon points="50,22 78,50 50,78 22,50" fill="#0D4B57" />
            <polygon points="50,40 60,50 50,60 40,50" fill="#F08A4B" className="intro__core" />
          </svg>
        </div>

        <div className="intro__text relative mt-[300px] flex flex-col items-center gap-3.5">
          <h1 className="m-0 flex overflow-hidden pb-2.5 text-[clamp(72px,13vw,200px)] font-extrabold leading-[0.9] tracking-[-0.06em]">
            {LETTERS.map((ch, i) => (
              <span key={i} className="rise" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>{ch}</span>
            ))}
          </h1>
          <p className="fade-in-late m-0 text-center text-[clamp(18px,1.8vw,24px)] font-medium text-muted">{tagline}</p>
        </div>

        <div className="intro__hint absolute bottom-9 left-1/2 -translate-x-1/2">
          <div className="fade-in-late flex flex-col items-center gap-1 text-[15px] text-muted">
            <span>{t('home.scroll_hint')}</span>
            <span className="bob text-[22px]" aria-hidden="true">↓</span>
          </div>
        </div>
      </Spotlight>
    </section>
  );
});

export default IntroPhase;
