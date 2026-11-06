import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

const ServicesPhase = forwardRef(function ServicesPhase({ services, active }, ref) {
  const { t } = useTranslation();
  return (
    <section id="servicos" ref={ref} data-tone="light" className="phase bg-sand" style={{ height: '300vh' }}>
      <div className="phase__stage flex flex-col justify-center gap-10 px-[clamp(24px,7vw,120px)] pb-14 pt-24 text-ink-text">
        <svg width="620" height="620" viewBox="0 0 100 100" aria-hidden="true" className="services__deco absolute right-[-340px] top-1/2 -mt-[310px] opacity-30 pointer-events-none">
          <polygon points="50,2 98,50 50,98 2,50" fill="none" stroke="#0D4B57" strokeWidth="0.6" />
          <polygon points="50,18 82,50 50,82 18,50" fill="none" stroke="#0D4B57" strokeWidth="0.6" />
          <polygon points="50,34 66,50 50,66 34,50" fill="#F08A4B" />
        </svg>

        <span className="relative font-mono text-sm text-[#8A3D12]">{t('home.phase_services')}</span>

        <div className="relative flex flex-wrap items-center gap-x-16 gap-y-6">
          <div className="relative h-[clamp(160px,20vw,300px)] w-[clamp(200px,26vw,380px)] flex-none" aria-hidden="true">
            {services.map((s, i) => (
              <span
                key={s.id}
                className="services__slide absolute inset-0 flex items-center text-[clamp(170px,22vw,330px)] font-extrabold leading-none tracking-[-0.07em] text-petrol"
                style={{ opacity: i === active ? 1 : 0, transform: `translateY(${i === active ? 0 : (i < active ? -60 : 60)}px)` }}
              >
                {s.number}
              </span>
            ))}
          </div>

          <div className="relative min-h-[260px] min-w-0 flex-[1_1_380px]">
            {services.map((s, i) => (
              <div
                key={s.id}
                aria-hidden={i !== active}
                className={cn('services__slide absolute inset-0 flex flex-col justify-center gap-5', i !== active && 'pointer-events-none')}
                style={{ opacity: i === active ? 1 : 0, transform: `translateY(${i === active ? 0 : (i < active ? -40 : 40)}px)` }}
              >
                <h2 className="m-0 text-[clamp(40px,5vw,76px)] font-extrabold leading-[0.95] tracking-[-0.05em]">{s.title}</h2>
                <p className="m-0 max-w-[520px] text-xl leading-relaxed text-[#2E4E54]">{s.description}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags?.map((tag) => (
                    <span key={tag} className="badge badge--petrol">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex max-w-[520px] gap-2.5" aria-hidden="true">
          {services.map((s, i) => (
            <div key={s.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-petrol/20">
              <div className="services__bar h-full bg-orange" style={{ '--i': i }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default ServicesPhase;
