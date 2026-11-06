import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import Spotlight from '../Spotlight';
import { cn } from '@/utils/cn';

const EXPLOSIONS = [
  { trigger: 0.22, x: '22%', y: '40%' },
  { trigger: 0.46, x: '50%', y: '56%' },
  { trigger: 0.70, x: '70%', y: '42%' },
  { trigger: 0.93, x: '82%', y: '62%' },
];

const ManifestoPhase = forwardRef(function ManifestoPhase({ text, accents }, ref) {
  const { t } = useTranslation();
  const words = text.split(' ');

  let charCount = 0;
  const wordData = words.map((word) => {
    const start = charCount;
    charCount += word.length;
    return { word, start, chars: word.split('') };
  });

  return (
    <section
      id="manifesto"
      ref={ref}
      data-tone="dark"
      className="phase bg-petrol"
      style={{ height: '300vh', '--n': words.length, '--n-chars': charCount }}
    >
      <Spotlight className="phase__stage flex flex-col justify-center gap-8 px-[clamp(24px,7vw,120px)] text-sand">
        <span className="eyebrow">{t('home.phase_manifesto')}</span>
        <p className="m-0 flex max-w-[1180px] flex-wrap gap-x-[0.26em] text-[clamp(34px,5.2vw,84px)] font-extrabold leading-[1.04] tracking-[-0.04em]">
          {wordData.map(({ word, start, chars }) => (
            <span
              key={`${word}-${start}`}
              className={cn('manifesto__word', accents.includes(word) && 'text-orange')}
            >
              {chars.map((ch, j) => (
                <span key={j} className="manifesto__char" style={{ '--i-char': start + j }}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </p>

        {EXPLOSIONS.map(({ trigger, x, y }, ei) => (
          <div
            key={ei}
            className="manifesto__explosion"
            style={{ '--exp-t': trigger, left: x, top: y }}
            aria-hidden="true"
          >
            {Array.from({ length: 12 }, (_, pi) => (
              <span
                key={pi}
                className="manifesto__particle"
                style={{
                  '--angle': `${pi * 30}deg`,
                  '--pcolor': pi % 2 === 0 ? 'var(--badiu-orange)' : 'var(--badiu-sand)',
                }}
              />
            ))}
          </div>
        ))}
      </Spotlight>
    </section>
  );
});

export default ManifestoPhase;
