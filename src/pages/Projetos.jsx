import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap, Flip } from '@/motion/gsap';
import { useReducedMotion } from '@/motion/useReducedMotion';
import { useProjects } from '@/hooks/useProjects';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PROJECT_STATUS } from '@/constants/projectStatus';
import { PageHero, Loading, ErrorView } from '@/components/page';
import ProjectCard from '@/components/ProjectCard';

const STATUS_KEY = { LIVE: 'status_live', CLIENT: 'status_client', IN_DEVELOPMENT: 'status_in_dev', COMING_SOON: 'status_coming' };

/** Projetos: filtros por estado e tecnologia; os cartões reorganizam-se com Flip (todos ficam no DOM, só mudam de display). */
export default function Projetos() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.projects'));
  const reduced = useReducedMotion();
  const { data, loading, error, reload } = useProjects();
  const [params, setParams] = useSearchParams();
  const tag = params.get('tag');
  const [status, setStatus] = useState(null);
  const grid = useRef(null);
  const flip = useRef(null);

  const projects = data ?? [];
  const tags = useMemo(() => [...new Set(projects.flatMap((p) => p.tags ?? []))].sort(), [projects]);
  const statuses = useMemo(() => new Set(projects.map((p) => p.status)), [projects]);
  const visible = (p) => (!status || p.status === status) && (!tag || p.tags?.includes(tag));

  const capture = () => { if (!reduced && grid.current) flip.current = Flip.getState(grid.current.children, { props: 'opacity' }); };
  const pickStatus = (v) => { capture(); setStatus(v); };
  const pickTag = (v) => { capture(); setParams(v && v !== tag ? { tag: v } : {}, { replace: true }); };

  useLayoutEffect(() => {
    if (!flip.current) return;
    const state = flip.current;
    flip.current = null;
    Flip.from(state, {
      duration: 0.8, ease: 'badiu', absolute: true, scale: true, nested: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'expo.out', delay: 0.25 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.7, duration: 0.4, ease: 'power3.in' }),
    });
  }, [status, tag]);

  // chegar com ?tag=… (vindo dos serviços): voltar a mostrar tudo se o filtro de estado esconder
  useEffect(() => { if (tag) setStatus(null); }, [tag]);

  const shown = projects.filter(visible).length;

  return (
    <>
      <PageHero label={t('projects.eyebrow')} title={t('projects.heading')}>
        <div className="filters" role="group" aria-label={t('ui.filter_by_status')}>
          {[null, ...Object.keys(PROJECT_STATUS)].filter((v) => v === null || statuses.has(v)).map((v) => (
            <button key={v ?? 'all'} type="button" className="chip" aria-pressed={status === v} onClick={() => pickStatus(v)} data-cursor="view">
              {v === null ? t('projects.filter_all') : t(`projects.${STATUS_KEY[v]}`)}
            </button>
          ))}
        </div>
        {tags.length > 0 && (
          <div className="filters" role="group" aria-label={t('ui.filter_by_tag')}>
            {tags.map((tg) => (
              <button key={tg} type="button" className="chip" aria-pressed={tag === tg} onClick={() => pickTag(tg)}>{tg}</button>
            ))}
          </div>
        )}
      </PageHero>

      <section className="wrap pgrid-wrap" aria-live="polite">
        {loading && <Loading />}
        {error && <ErrorView error={error} onRetry={reload} />}
        {!loading && !error && (
          <>
            <div ref={grid} className="pgrid">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} hidden={!visible(p)} className={`pcard${visible(p) ? '' : ' is-hidden'}`} />
              ))}
            </div>
            {shown === 0 && <p className="phero-lead">{t('projects.empty')}</p>}
          </>
        )}
      </section>
    </>
  );
}
