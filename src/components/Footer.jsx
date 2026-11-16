import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, SplitText, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import Logo from '@/components/Logo';
import TLink from '@/components/TLink';
import { ROUTES } from '@/constants/routes';

const fmt = new Intl.DateTimeFormat('pt-PT', { timeZone: 'Atlantic/Cape_Verde', hour: '2-digit', minute: '2-digit', second: '2-digit' });

function Clock() {
  const [time, setTime] = useState(() => fmt.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(fmt.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return <time className="foot-clock" dateTime={new Date().toISOString()}>{time}</time>;
}

/** Rodapé: estúdio, hora local de Santiago, redes, contacto, navegação e wordmark gigante com as letras a subir com o scroll. */
export default function Footer() {
  const { t } = useTranslation();
  const { data: settings } = useSiteSettings();
  const root = useRef(null);
  const giant = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const chars = giant.current.querySelectorAll('[data-wm-char]');
      // y: 0 explícito: evita que o GSAP herde um translate em px de uma montagem anterior (StrictMode)
      gsap.fromTo(chars, { yPercent: 105, y: 0 }, { yPercent: 0, y: 0, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: giant.current, start: 'top bottom', end: 'max', scrub: 0.6 } });
      gsap.from('[data-foot-col]', { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } });
    });
    return () => mm.revert();
  }, { scope: root });

  const socials = Object.entries(settings?.socials ?? {});
  const NAV = [
    { to: ROUTES.projects, label: t('nav.projects') },
    { to: ROUTES.services, label: t('nav.services') },
    { to: ROUTES.team, label: t('nav.team') },
    { to: ROUTES.contact, label: t('nav.contact') },
  ];

  return (
    <footer ref={root} className="foot">
      <div className="foot-grid wrap">
        <div data-foot-col="">
          <b className="t-label">{t('footer2.studio')}</b>
          {t('footer2.studio_place')}<br />{t('footer2.studio_country')}
        </div>
        <div data-foot-col="">
          <b className="t-label">{t('footer2.clock')}</b>
          <Clock />
        </div>
        <div data-foot-col="">
          <b className="t-label">{t('footer2.socials')}</b>
          {socials.map(([k, url]) => (
            <a key={k} href={url} target="_blank" rel="noreferrer" className="foot-link" data-cursor="open">{k[0].toUpperCase() + k.slice(1)}</a>
          ))}
        </div>
        <div data-foot-col="">
          <b className="t-label">{t('footer2.contact')}</b>
          {settings?.email && <a href={`mailto:${settings.email}`} className="foot-link" data-cursor="talk">{settings.email}</a>}
          <span>badiudigital.com</span>
        </div>
        <nav data-foot-col="" aria-label={t('footer2.nav')}>
          <b className="t-label">{t('footer2.nav')}</b>
          {NAV.map((n) => <TLink key={n.to} to={n.to} className="foot-link">{n.label}</TLink>)}
        </nav>
      </div>
      <div ref={giant} className="foot-giant wrap" aria-hidden="true">
        <Logo variant="wordmark" size={1} decorative className="foot-wm" />
      </div>
      <div className="foot-bottom wrap t-small">
        <span>© {new Date().getFullYear()} Badiu Digital · {t('footer2.rights')}</span>
      </div>
    </footer>
  );
}
