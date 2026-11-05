import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PanuLogo from './PanuLogo';
import TransitionLink from './TransitionLink';
import Magnetic from './Magnetic';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useCommandPalette, isMac } from './CommandPalette';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

/** tone: "dark" (fundo escuro, texto claro) | "light" (fundo claro, texto escuro) */
export default function Header({ tone = 'dark' }) {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const { openPalette } = useCommandPalette();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = pathname === ROUTES.home;

  const NAV = [
    { to: ROUTES.projects, label: t('nav.projects') },
    { to: ROUTES.services, label: t('nav.services') },
    { to: ROUTES.team,     label: t('nav.team')     },
  ];

  return (
    <header
      className={cn(
        'site-header fixed inset-x-0 top-0 z-40',
        `site-header--${tone}`,
        scrolled && !isHome && 'site-header--solid',
      )}
    >
      <div className="container-x flex items-center justify-between gap-2 py-4">
        <TransitionLink to={ROUTES.home} className="flex items-center gap-2.5 py-1.5" aria-label="Badiu Digital">
          <PanuLogo size={36} />
          <span className="text-[26px] font-extrabold tracking-[-0.05em]">badiu</span>
        </TransitionLink>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label={t('ui.header_nav')} className="hidden sm:flex items-center gap-0.5 text-base font-medium">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <TransitionLink
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={cn('link-underline px-3.5 py-3', active && 'font-bold text-orange')}
                >
                  {item.label}
                </TransitionLink>
              );
            })}
          </nav>

          <LanguageSwitcher />
          <ThemeToggle />

          <button
            onClick={openPalette}
            className="cmd-icon-btn"
            aria-label={t('ui.search', { shortcut: isMac ? '⌘K' : 'Ctrl+K' })}
          >
            <svg width="13" height="13" viewBox="0 0 100 100" aria-hidden="true">
              <polygon points="50,0 100,50 50,100 0,50" fill="currentColor" />
            </svg>
          </button>

          <Magnetic>
            <TransitionLink to={ROUTES.contact} className="btn btn--orange hidden sm:inline-flex !px-5 !py-3">
              {t('nav.contact')}
            </TransitionLink>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
