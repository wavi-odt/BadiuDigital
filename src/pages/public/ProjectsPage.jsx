import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/PublicComponets/Reveal';
import RiseText from '@/components/PublicComponets/RiseText';
import Spotlight from '@/components/PublicComponets/Spotlight';
import ProjectCard from '@/components/PublicComponets/ProjectCard';
import Loader from '@/components/PublicComponets/Loader';
import ErrorState from '@/components/PublicComponets/ErrorState';
import { useProjects } from '@/hooks/useProjects';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { PROJECT_STATUS } from '@/constants/projectStatus';

export default function ProjectsPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.projects'));
  const { data, loading, error, reload } = useProjects();
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(null);
  const tagFromUrl = searchParams.get('tag');
  const [tagFilter, setTagFilter] = useState(tagFromUrl ?? null);
  const tagRowRef = useRef(null);

  // When URL ?tag changes (e.g. navigating from services page), sync state
  useEffect(() => {
    setTagFilter(tagFromUrl ?? null);
    if (tagFromUrl) setStatusFilter(null);
  }, [tagFromUrl]);

  // Scroll tag row into view when arriving via ?tag link
  useEffect(() => {
    if (tagFromUrl && tagRowRef.current) {
      setTimeout(() => tagRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 600);
    }
  }, [tagFromUrl]);

  const STATUS_LABELS = {
    LIVE:           t('projects.status_live'),
    CLIENT:         t('projects.status_client'),
    IN_DEVELOPMENT: t('projects.status_in_dev'),
    COMING_SOON:    t('projects.status_coming'),
  };

  const FILTERS = [
    { value: null, label: t('projects.filter_all') },
    ...Object.keys(PROJECT_STATUS).map((value) => ({ value, label: STATUS_LABELS[value] })),
  ];

  const allTags = useMemo(() => {
    const set = new Set();
    (data ?? []).forEach((p) => p.tags?.forEach((tag) => set.add(tag)));
    return [...set].sort();
  }, [data]);

  const visible = useMemo(() => (data ?? []).filter((p) => {
    if (statusFilter && p.status !== statusFilter) return false;
    if (tagFilter && !p.tags?.includes(tagFilter)) return false;
    return true;
  }), [data, statusFilter, tagFilter]);

  const available = useMemo(() => new Set((data ?? []).map((p) => p.status)), [data]);

  function selectStatus(value) {
    setStatusFilter(value);
    if (tagFromUrl) setSearchParams({}, { replace: true });
  }

  function selectTag(tag) {
    const next = tagFilter === tag ? null : tag;
    setTagFilter(next);
    if (next) {
      setSearchParams({ tag: next }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }

  return (
    <>
      <Spotlight as="section" className="container-x flex flex-col gap-7 pb-14 pt-40">
        <Reveal as="span" delay={0.7} className="eyebrow">{t('projects.eyebrow')}</Reveal>
        <h1 className="display-lg m-0 max-w-[1100px]">
          <RiseText text={t('projects.heading')} accent={[t('projects.heading').split(' ').at(-1)]} />
        </h1>
        <Reveal delay={1.1} className="flex flex-wrap gap-2 pt-2" role="group" aria-label={t('ui.filter_by_status')}>
          {FILTERS.filter((f) => f.value === null || available.has(f.value)).map((f) => (
            <button key={f.value ?? 'all'} type="button" className="chip" aria-pressed={statusFilter === f.value} onClick={() => selectStatus(f.value)}>
              {f.label}
            </button>
          ))}
        </Reveal>
        {allTags.length > 0 && (
          <div ref={tagRowRef}>
            <Reveal delay={1.3} className="flex flex-wrap gap-2" role="group" aria-label={t('ui.filter_by_tag')}>
              {allTags.map((tag) => (
                <button key={tag} type="button" className="chip" aria-pressed={tagFilter === tag} onClick={() => selectTag(tag)}>
                  {tag}
                </button>
              ))}
            </Reveal>
          </div>
        )}
      </Spotlight>

      <Spotlight as="section" className="container-x pb-32">
        {loading && <Loader />}
        {error && <ErrorState error={error} onRetry={reload} />}
        {!loading && !error && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-6">
            {visible.map((p, i) => (
              <Reveal key={p.id} delay={0.1 + i * 0.08}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
      </Spotlight>
    </>
  );
}
