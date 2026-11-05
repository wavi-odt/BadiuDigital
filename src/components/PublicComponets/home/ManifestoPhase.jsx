import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import Spotlight from '../Spotlight';

const ManifestoPhase = forwardRef(function ManifestoPhase({ text, accents }, ref) {
  const { t } = useTranslation();
  const words = text.split(' ');
  return (
    <section id="manifesto" ref={ref} data-tone="dark" className="phase bg-petrol" style={{ height: '300vh', '--n': words.length }}>
      <Spotlight className="phase__stage flex flex-col justify-center gap-8 px-[clamp(24px,7vw,120px)] text-sand">
        <span className="eyebrow">{t('home.phase_manifesto')}</span>
        <p className="m-0 flex max-w-[1180px] flex-wrap gap-x-[0.26em] text-[clamp(34px,5.2vw,84px)] font-extrabold leading-[1.04] tracking-[-0.04em]">
          {words.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className={accents.includes(word) ? 'manifesto__word text-orange' : 'manifesto__word'}
              style={{ '--i': i }}
            >
              {word}
            </span>
          ))}
        </p>
      </Spotlight>
    </section>
  );
});

export default ManifestoPhase;
