import { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger, useGSAP } from '@/motion/gsap';
import Logo from '@/components/Logo';
import TLink from '@/components/TLink';
import Magnetic from '@/components/Magnetic';
import LanguageMenu from './LanguageMenu';
import ThemeButton from './ThemeButton';
import SearchButton from './SearchButton';
import { ROUTES } from '@/constants/routes';

/**
 * Barra de topo: logo, Projetos · Serviços · Equipa, idioma, tema, pesquisa e Contacto.
 * Esconde-se no scroll para baixo e volta a aparecer no scroll para cima.
 * Alvos do preloader: [data-nav-logo] (Flip) e [data-nav-item] (entram um a um).
 */
export default function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const header = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false); // menu de idioma aberto: não esconder
  const lock = useRef(false);
  lock.current = menuOpen;

  const NAV = [
    { to: ROUTES.projects, label: t('nav.projects') },
    { to: ROUTES.services, label: t('nav.services') },
    { to: ROUTES.team, label: t('nav.team') },
  ];

  useGSAP(() => {
    const el = header.current;
    let hidden = false;
    const show = (state) => {
      if (state === hidden) return;
      hidden = state;
      gsap.to(el, state
        ? { yPercent: -110, duration: 0.5, ease: 'power3.in', overwrite: true }
        : { yPercent: 0, duration: 0.8, ease: 'expo.out', overwrite: true });
    };
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const focusInside = el.contains(document.activeElement);
        show(self.direction === 1 && self.scroll() > 200 && !lock.current && !focusInside);
      },
    });
    const onFocus = () => show(false);
    el.addEventListener('focusin', onFocus);
    return () => { st.kill(); el.removeEventListener('focusin', onFocus); };
  }, { scope: header });

  return (
    <header ref={header} className="navbar">
      <div className="navbar-in wrap">
        <TLink to={ROUTES.home} className="navbar-brand" aria-label={t('ui.home_link')} data-nav-logo="">
          <Logo variant="horizontal" size={30} decorative />
        </TLink>

        <div className="navbar-right">
          <nav aria-label={t('ui.header_nav')} className="navbar-links">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <TLink
                  key={item.to}
                  to={item.to}
                  data-nav-item=""
                  data-cursor="view"
                  aria-current={active ? 'page' : undefined}
                  className="navbar-link"
                >
                  <span className="navbar-link-text"><span className="navbar-link-roll" data-text={item.label}>{item.label}</span></span>
                </TLink>
              );
            })}
          </nav>

          <div className="navbar-tools">
            <span data-nav-item=""><LanguageMenu onOpenChange={setMenuOpen} /></span>
            <span data-nav-item=""><ThemeButton /></span>
            <span data-nav-item=""><SearchButton /></span>
          </div>

          <span data-nav-item="" className="navbar-cta">
            <Magnetic>
              <TLink to={ROUTES.contact} className="button button-light button-sm" data-cursor="talk">
                {t('nav.contact')}
              </TLink>
            </Magnetic>
          </span>
        </div>
      </div>
    </header>
  );
}
