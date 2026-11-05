import { useTranslation } from 'react-i18next';
import Reveal from '@/components/PublicComponets/Reveal';
import RiseText from '@/components/PublicComponets/RiseText';
import Spotlight from '@/components/PublicComponets/Spotlight';
import MemberCard from '@/components/PublicComponets/MemberCard';
import PanuLogo from '@/components/PublicComponets/PanuLogo';
import TransitionLink from '@/components/PublicComponets/TransitionLink';
import Loader from '@/components/PublicComponets/Loader';
import ErrorState from '@/components/PublicComponets/ErrorState';
import { useMembers } from '@/hooks/useMembers';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ROUTES } from '@/constants/routes';

export default function TeamPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.team'));
  const { data: members, loading, error, reload } = useMembers();

  return (
    <>
      <Spotlight as="section" className="container-x flex flex-col gap-7 pb-18 pt-40">
        <Reveal as="span" delay={0.7} className="eyebrow">{t('nav.team')}</Reveal>
        <h1 className="display-lg m-0 max-w-[1100px]">
          <RiseText text={t('team.heading')} accent={['Badiu.']} />
        </h1>
        <Reveal as="p" delay={1.2} className="m-0 max-w-[620px] text-[21px] leading-relaxed text-muted">
          {t('team.description')}
        </Reveal>
      </Spotlight>

      <section className="container-x pb-30">
        {loading && <Loader />}
        {error && <ErrorState error={error} onRetry={reload} />}
        {!loading && !error && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-6">
            {members.map((m, i) => (
              <Reveal key={m.id} delay={1.3 + i * 0.15}>
                <MemberCard member={m} />
              </Reveal>
            ))}
            <Reveal delay={1.3 + members.length * 0.15}>
              <TransitionLink
                to={ROUTES.contact}
                className="join-card flex aspect-[4/5] flex-col justify-between gap-6 rounded-[28px] border-2 border-dashed border-orange p-8"
              >
                <svg className="join-card__plus" width="72" height="72" viewBox="0 0 100 100" aria-hidden="true">
                  <polygon points="50,6 94,50 50,94 6,50" fill="none" stroke="currentColor" strokeWidth="5" />
                  <path d="M50 34 V66 M34 50 H66" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                </svg>
                <div className="flex flex-col gap-3">
                  <span className="text-[38px] font-extrabold leading-none tracking-[-0.04em]">{t('team.join_heading')}</span>
                  <span className="text-[17px] leading-normal opacity-85">{t('team.join_description')}</span>
                  <span className="pt-1.5 text-[17px] font-bold">{t('team.join_cta')}</span>
                </div>
              </TransitionLink>
            </Reveal>
          </div>
        )}
      </section>

      <Spotlight as="section" className="container-x pb-30">
        <Reveal variant="clip">
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-[32px] bg-petrol p-[clamp(32px,5vw,64px)]">
            <p className="m-0 max-w-[760px] text-[clamp(28px,3.4vw,48px)] font-bold leading-[1.1] tracking-[-0.03em]">
              {t('team.banner')}
            </p>
            <PanuLogo variant="gem" size={140} />
          </div>
        </Reveal>
      </Spotlight>
    </>
  );
}
