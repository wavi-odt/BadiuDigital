import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import Spotlight from '../Spotlight';
import TransitionLink from '../TransitionLink';
import Magnetic from '../Magnetic';
import { ROUTES } from '@/constants/routes';

const FinalPhase = forwardRef(function FinalPhase({ email }, ref) {
  const { t } = useTranslation();
  return (
    <section id="contacto" ref={ref} data-tone="dark" className="phase bg-ink" style={{ height: '220vh' }}>
      <Spotlight className="phase__stage flex items-center justify-center">
        <div className="final__gem" aria-hidden="true" />
        <div className="final__content relative flex flex-col items-center gap-7 px-6 text-ink-text">
          <span className="font-mono text-sm">{t('home.phase_contact')}</span>
          <h2 className="m-0 text-center text-[clamp(64px,11vw,176px)] font-extrabold leading-[0.86] tracking-[-0.06em]">
            {t('home.cta_heading')}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Magnetic>
              <TransitionLink to={ROUTES.contact} className="btn btn--ink !px-7 !py-4.5 text-lg">{t('home.cta_start')}</TransitionLink>
            </Magnetic>
            {email && (
              <Magnetic>
                <a href={`mailto:${email}`} className="btn bg-sand-light text-ink-text !px-6 !py-4.5 text-lg">{email}</a>
              </Magnetic>
            )}
            <Magnetic>
              <TransitionLink to={ROUTES.team} className="btn bg-sand-light text-ink-text !px-6 !py-4.5 text-lg">{t('home.cta_team')}</TransitionLink>
            </Magnetic>
          </div>
        </div>
      </Spotlight>
    </section>
  );
});

export default FinalPhase;
