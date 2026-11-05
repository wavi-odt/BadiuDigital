import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/PublicComponets/Reveal';
import Spotlight from '@/components/PublicComponets/Spotlight';
import TiltCard from '@/components/PublicComponets/TiltCard';
import PanuLogo from '@/components/PublicComponets/PanuLogo';
import TransitionLink from '@/components/PublicComponets/TransitionLink';
import SectionHeading from '@/components/PublicComponets/SectionHeading';
import WorkRow from '@/components/PublicComponets/WorkRow';
import Loader from '@/components/PublicComponets/Loader';
import ErrorState from '@/components/PublicComponets/ErrorState';
import { useMember } from '@/hooks/useMembers';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ROUTES } from '@/constants/routes';
import { pad2 } from '@/utils/format';
import { cn } from '@/utils/cn';

function buildLinks(links = {}, t) {
  return [
    links.cv        && { label: t('member.link_cv'),        href: links.cv,                   primary: true },
    links.portfolio && { label: t('member.link_portfolio'), href: links.portfolio,             primary: true },
    links.github    && { label: 'GitHub',                   href: links.github },
    links.linkedin  && { label: 'LinkedIn',                 href: links.linkedin },
    links.email     && { label: links.email,                href: `mailto:${links.email}` },
  ].filter(Boolean);
}

export default function MemberPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { data: member, loading, error, reload } = useMember(slug);
  useDocumentTitle(member?.name);

  if (loading) return <div className="pt-32"><Loader /></div>;
  if (error)   return <div className="pt-20"><ErrorState error={error} onRetry={reload} /></div>;

  const [first, ...rest] = member.name.split(' ');
  const links = buildLinks(member.links, t);
  const sand  = member.theme === 'SAND';

  return (
    <>
      {/* Hero */}
      <section className="container-x pt-28">
        <Reveal delay={0.7} className="flex gap-2 text-[15px] text-muted-2">
          <TransitionLink to={ROUTES.team} className="link-underline py-2">{t('member.breadcrumb')}</TransitionLink>
          <span className="py-2">/</span>
          <span className="py-2 font-semibold text-sand">{member.name}</span>
        </Reveal>
      </section>

      <Spotlight as="section" className="container-x flex flex-wrap items-stretch gap-14 pb-28 pt-10">
        <Reveal variant="clip" delay={0.8} className="aspect-[4/5] min-w-0 max-w-[440px] flex-[1_1_320px]">
          <div className={cn('relative flex h-full flex-col justify-between overflow-hidden rounded-[32px] p-5.5', sand ? 'bg-sand' : 'bg-petrol')}>
            {member.photoUrl && <img src={member.photoUrl} alt={member.name} className="absolute inset-0 h-full w-full object-cover" />}
            <PanuLogo variant="gem" tone={sand ? 'petrol' : 'sand'} size={360} className="spin-slow absolute -bottom-30 -right-30 opacity-25" />
            <span className={cn('badge relative', sand ? 'badge--petrol' : 'badge--orange')}>{member.role}</span>
            {!member.photoUrl && <span className="relative self-center font-mono text-sm text-muted-2">{t('ui.photo_placeholder')}</span>}
            <span className="relative font-mono text-[13px] text-muted-2">{member.location}</span>
          </div>
        </Reveal>

        <div className="flex min-w-0 flex-[999_1_520px] flex-col justify-center gap-7">
          {member.availability && (
            <Reveal delay={1.4} className="flex items-center gap-3 text-base font-medium text-muted">
              <span className="pulse-dot" aria-hidden="true" />
              {member.availability}
            </Reveal>
          )}
          <h1 className="display-xl m-0">
            <span className="block"><span className="rise-mask"><span className="rise" style={{ animationDelay: '.75s' }}>{first}</span></span></span>
            <span className="block">
              <span className="rise-mask">
                <span className="rise" style={{ animationDelay: '.87s' }}>{rest.join(' ')}<span className="text-orange">.</span></span>
              </span>
            </span>
          </h1>
          <Reveal as="p" delay={1.15} className="m-0 max-w-[640px] text-[clamp(22px,2.4vw,30px)] font-semibold leading-tight tracking-[-0.02em]">
            {member.headline}
          </Reveal>
          <Reveal as="p" delay={1.25} className="m-0 max-w-[620px] text-lg leading-relaxed text-muted">{member.bio}</Reveal>
          <div className="flex flex-wrap gap-2.5">
            {links.map((l, i) => (
              <Reveal key={l.label} delay={1.35 + i * 0.08}>
                <a
                  href={l.href}
                  target={l.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  className={cn('btn', l.primary ? 'btn--sand' : 'btn--petrol')}
                >
                  {l.label}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </Spotlight>

      {/* Projetos */}
      {member.projects?.length > 0 && (
        <Spotlight as="section" className="container-x pb-30">
          <SectionHeading title={t('member.projects_heading')} aside={`(${pad2(member.projects.length)})`} />
          <div className="flex flex-col">
            {member.projects.map((item, i) => <WorkRow key={item.slug} item={item} index={i} />)}
          </div>
        </Spotlight>
      )}

      {/* Stack */}
      {member.skills?.length > 0 && (
        <Spotlight as="section" className="container-x flex flex-wrap gap-12 pb-30">
          <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-4">
            <Reveal as="h2" className="display-md m-0">{t('member.stack_heading')}</Reveal>
            <Reveal as="p" delay={0.1} className="m-0 text-lg leading-relaxed text-muted">{t('member.stack_description')}</Reveal>
          </div>
          <div className="grid min-w-0 flex-[2_1_560px] grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-4">
            {member.skills.map((group, i) => (
              <Reveal key={group.group} delay={i * 0.12}>
                <TiltCard radius="24px">
                  <div className="tile flex h-full flex-col gap-4.5 rounded-3xl bg-petrol p-6.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[22px] font-bold text-orange">{group.group}</span>
                      <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,0 100,50 50,100 0,50" fill="#F1E4C3" /></svg>
                    </div>
                    <ul className="m-0 flex list-none flex-col gap-2 p-0 text-lg">
                      {group.items.map((it) => <li key={it}>{it}</li>)}
                    </ul>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </Spotlight>
      )}

      {/* Percurso */}
      {member.timeline?.length > 0 && (
        <Spotlight as="section" className="container-x flex flex-wrap gap-12 pb-30">
          <Reveal as="h2" className="display-md m-0 flex-[1_1_280px]">{t('member.timeline_heading')}</Reveal>
          <div className="relative min-w-0 flex-[2_1_560px] pl-9">
            <Reveal variant="vline" className="absolute bottom-2.5 left-2 top-2.5 w-0.5 bg-line" />
            {member.timeline.map((tl, i) => (
              <Reveal key={`${tl.title}-${i}`} delay={0.3 + i * 0.18}>
                <div className="relative pb-11">
                  <svg width="18" height="18" viewBox="0 0 100 100" aria-hidden="true" className="absolute -left-[37px] top-1.5">
                    <polygon points="50,0 100,50 50,100 0,50" fill={i === 0 ? '#F08A4B' : '#F1E4C3'} />
                  </svg>
                  <span className="font-mono text-sm text-orange">{tl.period}</span>
                  <p className="mb-1 mt-2 text-[26px] font-bold tracking-[-0.02em]">{tl.title}</p>
                  <p className="m-0 text-[17px] text-muted">{tl.place}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Spotlight>
      )}

      {/* CTA */}
      <section className="container-x pb-16">
        <Reveal variant="clip">
          <div className="flex flex-wrap items-end justify-between gap-8 rounded-[32px] bg-orange p-[clamp(32px,6vw,80px)] text-ink-text">
            <h2 className="m-0 text-[clamp(52px,7.5vw,112px)] font-extrabold leading-[0.88] tracking-[-0.06em]">{t('member.cta_heading')}</h2>
            <div className="flex flex-wrap gap-3">
              {member.links?.email && <a href={`mailto:${member.links.email}`} className="btn btn--ink">{member.links.email} →</a>}
              <TransitionLink to={ROUTES.team} className="btn bg-sand-light text-ink-text">{t('member.cta_back')}</TransitionLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
