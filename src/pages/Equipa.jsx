import { useTranslation } from 'react-i18next';
import { useMembers } from '@/hooks/useMembers';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PageHero, Reveal, Loading, ErrorView } from '@/components/page';
import MemberCard from '@/components/MemberCard';
import TLink from '@/components/TLink';
import { ROUTES } from '@/constants/routes';

export default function Equipa() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.team'));
  const { data: members, loading, error, reload } = useMembers();

  return (
    <>
      <PageHero label={t('nav.team')} title={t('team.heading')} lead={t('team.description')} />
      <section className="wrap team-page">
        {loading && <Loading />}
        {error && <ErrorView error={error} onRetry={reload} />}
        {members && (
          <ul className="team-grid">
            {members.map((m) => <li key={m.id}><MemberCard member={m} /></li>)}
            <li>
              <TLink to={ROUTES.contact} className="join-card" data-cursor="talk">
                <svg width="64" height="64" viewBox="0 0 100 100" aria-hidden="true">
                  <polygon points="50,6 94,50 50,94 6,50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                  <path d="M50 34 V66 M34 50 H66" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                </svg>
                <span className="team-name">{t('team.join_heading')}</span>
                <span className="t-small">{t('team.join_description')}</span>
                <span className="t-label team-link">{t('team.join_cta')}</span>
              </TLink>
            </li>
          </ul>
        )}
      </section>
      <Reveal as="section" className="wrap pcta-banner"><p className="t-h2">{t('team.banner')}</p></Reveal>
    </>
  );
}
