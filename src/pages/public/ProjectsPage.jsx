import { useMemo, useState } from 'react';
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
  const [filter, setFilter] = useState(null);

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

  const visible   = useMemo(() => (data ?? []).filter((p) => !filter || p.status === filter), [data, filter]);
  const available = useMemo(() => new Set((data ?? []).map((p) => p.status)), [data]);

  return (
    <>
      <Spotlight as="section" className="container-x flex flex-col gap-7 pb-14 pt-40">
        <Reveal as="span" delay={0.7} className="eyebrow">{t('projects.eyebrow')}</Reveal>
        <h1 className="display-lg m-0 max-w-[1100px]">
          <RiseText text={t('projects.heading')} accent={[t('projects.heading').split(' ').at(-1)]} />
        </h1>
        <Reveal delay={1.1} className="flex flex-wrap gap-2 pt-2" role="group" aria-label={t('ui.filter_by_status')}>
          {FILTERS.filter((f) => f.value === null || available.has(f.value)).map((f) => (
            <button key={f.value ?? 'all'} type="button" className="chip" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)}>
              {f.label}
            </button>
          ))}
        </Reveal>
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
