import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TransitionLink from './TransitionLink';
import { ROUTES } from '@/constants/routes';

export default function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const navRef       = useRef(null);
  const itemRefs     = useRef([]);
  const indicatorRef = useRef(null);
  const isFirst      = useRef(true);

  const ITEMS = [
    { to: ROUTES.home,     label: t('nav.home')     },
    { to: ROUTES.projects, label: t('nav.projects') },
    { to: ROUTES.services, label: t('nav.services') },
    { to: ROUTES.team,     label: t('nav.team')     },
    { to: ROUTES.contact,  label: t('nav.contact')  },
  ];

  const activeIndex = ITEMS.findIndex(({ to }) =>
    to === ROUTES.home ? pathname === to : pathname.startsWith(to),
  );

  useLayoutEffect(() => {
    const nav       = navRef.current;
    const indicator = indicatorRef.current;
    const item      = itemRefs.current[activeIndex];
    if (!nav || !indicator || !item) return;

    const navRect  = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    if (isFirst.current) {
      indicator.style.transition = 'none';
      isFirst.current = false;
      void indicator.offsetWidth;
    } else {
      indicator.style.transition = '';
    }

    indicator.style.left  = `${itemRect.left - navRect.left}px`;
    indicator.style.width = `${itemRect.width}px`;
  }, [activeIndex]);

  return (
    <nav ref={navRef} className="bottom-nav" aria-label={t('ui.main_nav')}>
      <span ref={indicatorRef} className="bottom-nav__indicator" aria-hidden="true" />
      {ITEMS.map(({ to, label }, i) => {
        const active = to === ROUTES.home ? pathname === to : pathname.startsWith(to);
        return (
          <span key={to} ref={(el) => { itemRefs.current[i] = el; }} className="bottom-nav__slot">
            <TransitionLink
              to={to}
              aria-current={active ? 'page' : undefined}
              className="bottom-nav__item"
            >
              {label}
            </TransitionLink>
          </span>
        );
      })}
    </nav>
  );
}
