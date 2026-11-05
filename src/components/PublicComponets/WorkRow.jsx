import TransitionLink from './TransitionLink';
import ProjectCover from './ProjectCover';
import Reveal from './Reveal';
import { ROUTES } from '@/constants/routes';

/** Linha de projeto no portefólio de um membro */
export default function WorkRow({ item, index = 0 }) {
  return (
    <div>
      <Reveal variant="line" delay={index * 0.06} className="h-px bg-line" />
      <Reveal delay={0.1 + index * 0.06}>
        <TransitionLink to={ROUTES.project(item.slug)} className="work-row flex flex-wrap items-center gap-6 rounded-[22px] px-4 py-4.5">
          <ProjectCover project={item} label={item.shortName} className="work-row__thumb h-24 w-24 shrink-0 rounded-[18px] p-3" textClassName="text-3xl" />
          <div className="flex min-w-0 flex-[999_1_320px] flex-col gap-1.5">
            <span className="text-[clamp(26px,2.6vw,36px)] font-extrabold leading-none tracking-[-0.035em]">{item.name}</span>
            <span className="text-base leading-normal text-muted">{item.role}</span>
          </div>
          <div className="flex min-w-0 flex-[1_1_220px] items-center justify-between gap-4 pr-2">
            <span className="font-mono text-[13px] text-muted-2">{item.tags?.join(' · ')}</span>
            <span className="arrow-nudge text-3xl">↗</span>
          </div>
        </TransitionLink>
      </Reveal>
    </div>
  );
}
