import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TLink from '@/components/TLink';
import { ROUTES } from '@/constants/routes';

/** Navegação de baixo (só em ecrãs pequenos): pílula de vidro com o item ativo marcado por um losango. */
export default function BottomNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const items = [
    [ROUTES.home, t('nav.home')],
    [ROUTES.projects, t('nav.projects')],
    [ROUTES.services, t('nav.services')],
    [ROUTES.team, t('nav.team')],
    [ROUTES.contact, t('nav.contact')],
  ];
  return (
    <nav className="bnav" aria-label={t('ui.main_nav')}>
      {items.map(([to, label]) => {
        const on = to === ROUTES.home ? pathname === to : pathname.startsWith(to);
        return (
          <TLink key={to} to={to} className="bnav-item" aria-current={on ? 'page' : undefined}>
            <span>{label}</span>
          </TLink>
        );
      })}
    </nav>
  );
}
