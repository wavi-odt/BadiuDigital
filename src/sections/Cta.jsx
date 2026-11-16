import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import LazyCloth from '@/gl/LazyCloth';
import Label from '@/components/Label';
import SplitHeading from '@/components/SplitHeading';
import Magnetic from '@/components/Magnetic';

/**
 * CTA: "Vamos tecer algo juntos?" carácter a carácter + botão com o email, magnético.
 * Por trás, um segundo pano de losangos, atraído pelo rato, que começa agitado e acalma ao entrar.
 */
export default function Cta() {
  const { t } = useTranslation();
  const { data: settings } = useSiteSettings();
  const email = settings?.email ?? 'ola@badiudigital.com';
  const root = useRef(null);
  const cloth = useRef({ amp: 1, drift: 0, zoom: 1, agitation: 1 }).current;

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.fromTo(cloth, { agitation: 1 }, { agitation: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: true } });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} id="contacto" className="cta wrap" aria-labelledby="cta-title">
      <LazyCloth params={cloth} pull={-1} radius={5} warmRate={0.25} className="cta-cloth" />
      <div className="cta-veil" aria-hidden="true" />
      <div className="cta-in">
        <Label>{t('homepage.cta.label')}</Label>
        <SplitHeading id="cta-title" className="t-display cta-title" skew={false}>
          {t('homepage.cta.title_a')} <em>{t('homepage.cta.title_b')}</em>
        </SplitHeading>
        <Magnetic>
          <a href={`mailto:${email}`} className="button button-primary cta-button" data-cursor="go">{email} →</a>
        </Magnetic>
      </div>
    </section>
  );
}
