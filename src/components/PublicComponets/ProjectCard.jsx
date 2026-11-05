import TransitionLink from './TransitionLink';
import ProjectCover from './ProjectCover';
import StatusBadge from './StatusBadge';
import TiltCard from './TiltCard';
import { ROUTES } from '@/constants/routes';

export default function ProjectCard({ project }) {
  return (
    <TiltCard radius="28px">
    <TransitionLink to={ROUTES.project(project.slug)} className="project-card flex h-full flex-col rounded-[28px] bg-[#F3D8A8] text-ink-text overflow-hidden">
      <ProjectCover project={project} className="h-60 w-full flex-shrink-0 p-6" textClassName="text-6xl" />
      <div className="flex flex-1 flex-col gap-3 p-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[28px] font-extrabold tracking-[-0.03em]">{project.name}</span>
          <StatusBadge status={project.status} />
        </div>
        <p className="m-0 text-base leading-relaxed text-[#2E4E54]">{project.summary}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="font-mono text-[13px] text-[#3B5A60]">{project.tags?.join(' · ')}</span>
          <span className="arrow-nudge text-2xl text-petrol">↗</span>
        </div>
      </div>
    </TransitionLink>
    </TiltCard>
  );
}
