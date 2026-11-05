import { useEffect, useRef, useState } from 'react';
import TransitionLink from './TransitionLink';
import ProjectCover from './ProjectCover';
import Reveal from './Reveal';
import StatusBadge from './StatusBadge';
import { ROUTES } from '@/constants/routes';
import { pad2 } from '@/utils/format';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const PREVIEW_W = 320;
const PREVIEW_H = 210;
const LERP = 0.09;

const isFinePointer =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export default function ProjectHoverList({ projects }) {
  const [active, setActive] = useState(null);
  const wrapRef = useRef(null);   // elemento que JS move
  const reduced = usePrefersReducedMotion();

  const posRef = useRef({ x: -999, y: -999 });
  const curRef = useRef({ x: -999, y: -999 });

  const showPreview = !reduced && isFinePointer;

  useEffect(() => {
    if (!showPreview) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    let rafId;
    function tick() {
      curRef.current.x += (posRef.current.x - curRef.current.x) * LERP;
      curRef.current.y += (posRef.current.y - curRef.current.y) * LERP;
      wrap.style.transform = `translate(${curRef.current.x - PREVIEW_W / 2}px, ${curRef.current.y - PREVIEW_H - 24}px)`;
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [showPreview]);

  function onMouseMove(e) {
    posRef.current = { x: e.clientX, y: e.clientY };
  }

  return (
    <div onMouseMove={showPreview ? onMouseMove : undefined} onMouseLeave={() => setActive(null)}>

      {/* linhas de projeto */}
      {projects.map((p, i) => (
        <Reveal key={p.id} delay={0.05 + i * 0.07}>
          <div>
            <div className="h-px bg-line" />
            <TransitionLink
              to={ROUTES.project(p.slug)}
              className="proj-row"
              onMouseEnter={() => showPreview && setActive(p)}
              onMouseLeave={() => showPreview && setActive(null)}
            >
              <span className="proj-row__num font-mono text-sm text-muted-2">{pad2(i + 1)}</span>
              <span className="proj-row__name">{p.name}</span>
              <span className="proj-row__tags font-mono text-sm text-muted-2 hidden sm:block">
                {p.tags?.join(' · ')}
              </span>
              <div className="proj-row__right">
                <StatusBadge status={p.status} />
                <span className="arrow-nudge text-2xl">↗</span>
              </div>
            </TransitionLink>
          </div>
        </Reveal>
      ))}
      <div className="h-px bg-line" />

      {/* preview flutuante — wrapper externo movido por JS, inner controla visibilidade */}
      {showPreview && (
        <div ref={wrapRef} className="proj-preview-wrap" aria-hidden="true">
          <div className={`proj-preview${active ? ' proj-preview--on' : ''}`}>
            {active && (
              <ProjectCover
                project={active}
                className="h-full w-full rounded-[22px] object-cover"
                textClassName="text-5xl p-6"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
