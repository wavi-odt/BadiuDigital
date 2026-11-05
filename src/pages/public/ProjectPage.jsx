import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/PublicComponets/Reveal';
import RiseText from '@/components/PublicComponets/RiseText';
import Spotlight from '@/components/PublicComponets/Spotlight';
import TiltCard from '@/components/PublicComponets/TiltCard';
import ProjectCover from '@/components/PublicComponets/ProjectCover';
import StatusBadge from '@/components/PublicComponets/StatusBadge';
import TransitionLink from '@/components/PublicComponets/TransitionLink';
import Loader from '@/components/PublicComponets/Loader';
import ErrorState from '@/components/PublicComponets/ErrorState';
import { useProject } from '@/hooks/useProjects';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ROUTES } from '@/constants/routes';

export default function ProjectPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { data: project, loading, error, reload } = useProject(slug);
  useDocumentTitle(project?.name);

  if (loading) return <div className="pt-32"><Loader /></div>;
  if (error)   return <div className="pt-20"><ErrorState error={error} onRetry={reload} /></div>;

  return (
    <>
      <Spotlight as="section" className="container-x flex flex-col gap-7 pb-16 pt-36">
        <Reveal delay={0.6} className="flex gap-2 text-[15px] text-muted-2">
          <TransitionLink to={ROUTES.projects} className="link-underline py-2">{t('project.breadcrumb')}</TransitionLink>
          <span className="py-2">/</span>
          <span className="py-2 font-semibold text-sand">{project.name}</span>
        </Reveal>
        <Reveal delay={0.7}><StatusBadge status={project.status} /></Reveal>
        <h1 className="display-xl m-0"><RiseText text={project.name} delay={0.75} /></h1>
        <Reveal as="p" delay={1.1} className="m-0 max-w-[720px] text-[clamp(22px,2.4vw,30px)] font-semibold leading-tight tracking-[-0.02em]">
          {project.summary}
        </Reveal>
      </Spotlight>

      <section className="container-x pb-24">
        <Reveal variant="clip" delay={0.9}>
          <ProjectCover project={project} className="min-h-[clamp(320px,55vh,620px)] w-full rounded-[32px] p-[clamp(24px,4vw,56px)]" textClassName="text-[clamp(80px,14vw,220px)]" />
        </Reveal>
      </section>

      <Spotlight as="section" className="container-x flex flex-wrap gap-12 pb-32">
        <div className="flex min-w-0 flex-[2_1_520px] flex-col gap-6">
          <Reveal as="h2" className="display-md m-0">{t('project.about_heading')}</Reveal>
          <Reveal as="p" delay={0.1} className="m-0 max-w-[680px] text-xl leading-relaxed text-muted">{project.description}</Reveal>
          <Reveal delay={0.2} className="flex flex-wrap gap-3 pt-2">
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn--orange">{t('project.view_live')}</a>}
            {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn btn--petrol">{t('project.view_code')}</a>}
          </Reveal>
        </div>

        <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-8">
          <Reveal delay={0.15} className="flex flex-col gap-3">
            <span className="eyebrow">{t('project.stack')}</span>
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag) => <span key={tag} className="badge badge--petrol">{tag}</span>)}
            </div>
          </Reveal>
          {project.team?.length > 0 && (
            <Reveal delay={0.25} className="flex flex-col gap-3">
              <span className="eyebrow">{t('project.team')}</span>
              {project.team.map((m) => (
                <TiltCard key={m.slug} radius="20px">
                  <TransitionLink to={ROUTES.member(m.slug)} className="tile flex flex-col gap-1 rounded-[20px] bg-petrol p-5">
                    <span className="text-xl font-bold">{m.name}</span>
                    <span className="text-[15px] text-muted">{m.role}</span>
                  </TransitionLink>
                </TiltCard>
              ))}
            </Reveal>
          )}
          {project.year && (
            <Reveal delay={0.35} className="flex flex-col gap-1">
              <span className="eyebrow">{t('project.year')}</span>
              <span className="text-2xl font-bold">{project.year}</span>
            </Reveal>
          )}
        </div>
      </Spotlight>
    </>
  );
}
