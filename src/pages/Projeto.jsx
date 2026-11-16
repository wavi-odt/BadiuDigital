import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/motion/gsap';
import { MQ } from '@/motion/useMediaQuery';
import { useProject, useProjects } from '@/hooks/useProjects';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PageHero, Reveal, H2, Loading, ErrorView } from '@/components/page';
import Logo from '@/components/Logo';
import Label from '@/components/Label';
import TLink from '@/components/TLink';
import Magnetic from '@/components/Magnetic';
import { ROUTES } from '@/constants/routes';

const STATUS_KEY = { LIVE: 'status_live', CLIENT: 'status_client', IN_DEVELOPMENT: 'status_in_dev', COMING_SOON: 'status_coming' };

/** Estudo de caso: capa grande com parallax, secções que se deslocam a velocidades diferentes e ligação ao próximo projeto. */
export default function Projeto() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { data: p, loading, error, reload } = useProject(slug);
  const { data: all } = useProjects();
  useDocumentTitle(p?.name);
  const root = useRef(null);

  const list = all ?? [];
  const next = p && list.length > 1 ? list[(list.findIndex((x) => x.slug === p.slug) + 1) % list.length] : null;

  useGSAP(() => {
    if (!p) return undefined;
    const mm = gsap.matchMedia();
    mm.add(`${MQ.motion}`, () => {
      const st = (trigger, start = 'top bottom', end = 'bottom top') => ({ trigger, start, end, scrub: true });
      gsap.fromTo('[data-cover-in]', { yPercent: -12, scale: 1.12 }, { yPercent: 12, scale: 1, ease: 'none', scrollTrigger: st('[data-cover]') });
      gsap.fromTo('[data-cover-mark]', { rotate: -20 }, { rotate: 70, ease: 'none', scrollTrigger: st('[data-cover]') });
      gsap.fromTo('[data-col-a]', { y: 60 }, { y: -30, ease: 'none', scrollTrigger: st('[data-about]') });
      gsap.fromTo('[data-col-b]', { y: -20 }, { y: 50, ease: 'none', scrollTrigger: st('[data-about]') });
      gsap.fromTo('[data-year]', { yPercent: 40 }, { yPercent: -40, ease: 'none', scrollTrigger: st('[data-about]') });
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [p?.slug], revertOnUpdate: true });

  if (loading) return <Loading />;
  if (error) return <ErrorView error={error} onRetry={reload} />;

  return (
    <div ref={root}>
      <PageHero label={`${t('project.breadcrumb')} / ${t(`projects.${STATUS_KEY[p.status] ?? 'status_coming'}`)}`} title={p.name} lead={p.summary} />

      <section className="wrap">
        <div className="pcover" data-cover="" style={{ background: p.coverColor, color: p.coverTextColor }}>
          <div className="pcover-in" data-cover-in="">
            {p.coverImageUrl && <img src={p.coverImageUrl} alt="" />}
            <span className="pcover-mark" data-cover-mark=""><Logo variant="symbol" size={420} decorative theme="dark" style={{ color: p.coverTextColor }} /></span>
            <span className="pcover-name">{p.name}</span>
          </div>
        </div>
      </section>

      <section className="about wrap" data-about="">
        <div className="about-a" data-col-a="">
          <Label>{t('project.about_heading')}</Label>
          <H2>{t('project.about_heading')}</H2>
          <Reveal as="p" className="about-desc">{p.description}</Reveal>
          <div className="row">
            {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="button button-primary" data-cursor="open">{t('project.view_live')}</a>}
            {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noreferrer" className="button button-outline" data-cursor="open">{t('project.view_code')}</a>}
          </div>
        </div>
        <div className="about-b" data-col-b="">
          <div>
            <Label>{t('project.stack')}</Label>
            <ul className="tags">{p.tags?.map((tg) => <li key={tg} className="chip">{tg}</li>)}</ul>
          </div>
          {p.team?.length > 0 && (
            <div>
              <Label>{t('project.team')}</Label>
              <ul className="people">
                {p.team.map((m) => (
                  <li key={m.slug}>
                    <TLink to={ROUTES.member(m.slug)} className="person" data-cursor="open"><b>{m.name}</b><span>{m.role}</span></TLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {p.year && <div className="year" data-year=""><Label>{t('project.year')}</Label><span className="year-n" aria-label={String(p.year)}>{p.year}</span></div>}
        </div>
      </section>

      {next && (
        <section className="next wrap">
          <Label>{t('project.next')}</Label>
          <TLink to={ROUTES.project(next.slug)} className="next-link" data-cursor="go">
            <span className="next-name">{next.name}</span><span aria-hidden="true">→</span>
          </TLink>
          <Magnetic><TLink to={ROUTES.projects} className="button button-outline" data-cursor="view">{t('project.breadcrumb')}</TLink></Magnetic>
        </section>
      )}
    </div>
  );
}
