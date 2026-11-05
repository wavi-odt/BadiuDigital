import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import Spotlight from '../Spotlight';
import TransitionLink from '../TransitionLink';
import ProjectCover from '../ProjectCover';
import StatusBadge from '../StatusBadge';
import { ROUTES } from '@/constants/routes';
import { pad2 } from '@/utils/format';
import { cn } from '@/utils/cn';

const ProjectsPhase = forwardRef(function ProjectsPhase({ projects, current }, ref) {
  const { t } = useTranslation();
  const n = Math.max(projects.length, 1);
  return (
    <section id="projetos" ref={ref} data-tone="dark" className="phase bg-ink" style={{ height: `${70 * n + 70}vh`, '--n': n }}>
      <Spotlight className="phase__stage text-sand">
        <div className="absolute inset-x-[clamp(24px,7vw,120px)] top-24 z-10 flex items-baseline justify-between gap-4">
          <h2 className="m-0 text-[clamp(36px,4.4vw,64px)] font-extrabold tracking-[-0.05em]">{t('home.phase_work')}</h2>
          <span className="font-mono text-[15px] text-muted">{pad2(current)} / {pad2(projects.length)}</span>
        </div>

        {projects.length === 0 && (
          <p className="absolute inset-x-0 top-1/2 m-0 -translate-y-1/2 text-center text-xl text-muted">
            {t('home.no_projects')}
          </p>
        )}

        {projects.map((p, i) => (
          <TransitionLink
            key={p.id}
            to={ROUTES.project(p.slug)}
            className={cn(
              'stack-card flex flex-wrap gap-6 rounded-[32px] bg-sand-light p-4 text-ink-text shadow-[0_40px_80px_rgba(0,0,0,.4)]',
              i === 0 && 'stack-card--first',
            )}
            style={{ '--i': i, zIndex: i + 1 }}
          >
            <ProjectCover
              project={p}
              className="min-h-[clamp(220px,36vh,380px)] min-w-0 flex-[1.3_1_360px] rounded-[22px] p-7"
              textClassName="text-[clamp(56px,7vw,110px)]"
            />
            <div className="flex min-w-0 flex-[1_1_300px] flex-col justify-between gap-4.5 p-2">
              <div className="flex flex-col gap-3.5">
                <StatusBadge status={p.status} />
                <span className="text-[clamp(30px,3vw,44px)] font-extrabold leading-none tracking-[-0.04em]">{p.name}</span>
                <span className="text-lg leading-relaxed text-[#2E4E54]">{p.summary}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[13px] text-[#3B5A60]">{p.tags?.join(' · ')}</span>
                <span className="text-3xl text-petrol">↗</span>
              </div>
            </div>
          </TransitionLink>
        ))}
      </Spotlight>
    </section>
  );
});

export default ProjectsPhase;
