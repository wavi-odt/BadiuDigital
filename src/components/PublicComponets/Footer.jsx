import { useTranslation } from 'react-i18next';
import PanuLogo from './PanuLogo';
import TransitionLink from './TransitionLink';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useServices } from '@/hooks/useServices';
import { ROUTES } from '@/constants/routes';

export default function Footer() {
  const { t } = useTranslation();
  const { data: settings } = useSiteSettings();
  const { data: services } = useServices();

  const NAV = [
    { to: ROUTES.projects, label: t('nav.projects') },
    { to: ROUTES.team,     label: t('nav.team')     },
    { to: ROUTES.contact,  label: t('nav.contact')  },
  ];

  return (
    <footer className="site-footer bg-ink text-sand">
      <div className="container-x py-16">

        {/* Grelha principal */}
        <div className="flex flex-wrap gap-x-16 gap-y-10 pb-14">

          {/* Coluna de marca */}
          <div className="flex min-w-0 flex-[2_1_260px] flex-col gap-5">
            <TransitionLink to={ROUTES.home} className="flex items-center gap-2.5">
              <PanuLogo size={28} />
              <span className="text-[22px] font-extrabold tracking-[-0.05em]">badiu</span>
            </TransitionLink>
            <p className="m-0 max-w-[300px] text-[15px] leading-relaxed text-muted">
              {t('home.tagline')}
            </p>
            <div className="flex flex-wrap gap-5 text-[14px] text-muted-2">
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="link-underline py-1">
                  {settings.email}
                </a>
              )}
              {settings?.socials?.instagram && (
                <a href={settings.socials.instagram} target="_blank" rel="noreferrer" className="link-underline py-1">
                  Instagram
                </a>
              )}
            </div>
          </div>

          {/* Coluna de navegação */}
          <div className="flex min-w-0 flex-[1_1_120px] flex-col gap-4">
            <span className="eyebrow text-muted-2">{t('footer.nav')}</span>
            <nav className="flex flex-col gap-3 text-[15px] text-muted">
              {NAV.map(({ to, label }) => (
                <TransitionLink key={to} to={to} className="link-underline py-0.5 transition-colors hover:text-sand">
                  {label}
                </TransitionLink>
              ))}
            </nav>
          </div>

          {/* Coluna de serviços */}
          <div className="flex min-w-0 flex-[1_1_160px] flex-col gap-4">
            <span className="eyebrow text-muted-2">{t('footer.services')}</span>
            <div className="flex flex-col gap-3 text-[15px] text-muted">
              {(services ?? []).map((s) => (
                <TransitionLink key={s.id} to={ROUTES.contact} className="link-underline py-0.5 transition-colors hover:text-sand">
                  {s.title}
                </TransitionLink>
              ))}
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-line pt-8 text-[13px] text-muted-2">
          © {new Date().getFullYear()} Badiu Digital
        </div>
      </div>
    </footer>
  );
}
