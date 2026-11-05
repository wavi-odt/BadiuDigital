import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/PublicComponets/Reveal';
import RiseText from '@/components/PublicComponets/RiseText';
import Spotlight from '@/components/PublicComponets/Spotlight';
import TransitionLink from '@/components/PublicComponets/TransitionLink';
import Loader from '@/components/PublicComponets/Loader';
import ErrorState from '@/components/PublicComponets/ErrorState';
import { useServices } from '@/hooks/useServices';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from '@/components/PublicComponets/ProjectCard';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

/* ------------------------------------------------------------------ */
/*  MarqueeStrip — two rows of infinite-scroll text                   */
/* ------------------------------------------------------------------ */
function repeat(arr, minItems = 10) {
  if (!arr.length) return [];
  const times = Math.ceil(minItems / arr.length) * 2; // ×2 for seamless loop
  return Array.from({ length: times }, () => arr).flat();
}

function MarqueeStrip({ services }) {
  const names = (services ?? []).map(s => s.title);
  const tags  = [...new Set((services ?? []).flatMap(s => s.tags ?? []))];

  const nameItems = repeat(names.length ? names : ['Sites & Marcas', 'Apps & Plataformas', 'Infra & Deploy']);
  const tagItems  = repeat(tags.length  ? tags  : ['Design', 'React', 'SEO', 'Spring Boot', 'MySQL', 'Docker', 'CI/CD']);

  return (
    <div className="marquee-strip" aria-hidden="true">
      <div className="marquee-row">
        <div className="marquee-track">
          {nameItems.map((name, i) => (
            <span key={i} className="marquee-item marquee-item--name">
              {name}<span className="marquee-sep">◆</span>
            </span>
          ))}
        </div>
      </div>
      <div className="marquee-row">
        <div className="marquee-track marquee-track--reverse">
          {tagItems.map((tag, i) => (
            <span key={i} className="marquee-item marquee-item--tag">
              {tag}<span className="marquee-sep">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  StatBanner — big visual statement before CTA                      */
/* ------------------------------------------------------------------ */
function StatBanner() {
  const { t } = useTranslation();
  return (
    <Spotlight as="section" className="stat-banner">
      <div className="container-x py-28 md:py-36">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Reveal variant="clip">
            <h2 className="stat-banner__headline">
              {t('services.stat_headline').split('\n').map((line, i, arr) => (
                <span key={i}>
                  {i === 0 ? <em>{line}</em> : line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="stat-banner__sub">{t('services.stat_sub')}</p>
          </Reveal>
        </div>
      </div>
      <span className="stat-banner__watermark" aria-hidden="true">01</span>
    </Spotlight>
  );
}

/* ------------------------------------------------------------------ */
/*  RecentWork — up to 3 featured projects                            */
/* ------------------------------------------------------------------ */
function RecentWork() {
  const { t } = useTranslation();
  const { data } = useProjects();
  const featured = (data ?? []).filter((p) => p.featured).slice(0, 3);
  if (!featured.length) return null;

  return (
    <section className="container-x py-20">
      <div className="mb-10 flex items-baseline justify-between gap-4">
        <Reveal as="span" className="eyebrow">{t('services.recent_work')}</Reveal>
        <Reveal>
          <TransitionLink to={ROUTES.projects} className="font-mono text-[13px] text-orange hover:opacity-70 transition-opacity">
            {t('services.see_all_projects')}
          </TransitionLink>
        </Reveal>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.1}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ProcessSection — 4 steps revealed on scroll                       */
/* ------------------------------------------------------------------ */
function ProcessSection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const steps = [
    { num: '01', title: t('process.step_01_title'), desc: t('process.step_01_desc') },
    { num: '02', title: t('process.step_02_title'), desc: t('process.step_02_desc') },
    { num: '03', title: t('process.step_03_title'), desc: t('process.step_03_desc') },
    { num: '04', title: t('process.step_04_title'), desc: t('process.step_04_desc') },
  ];

  return (
    <Spotlight as="section" className="process-section">
      <div className="container-x py-28">
        <Reveal as="span" className="eyebrow mb-6 block">{t('process.eyebrow')}</Reveal>
        <h2 className="display-md m-0 mb-20 max-w-[700px]">
          <RiseText text={t('process.heading')} />
        </h2>

        <div
          ref={ref}
          className={cn('process-steps grid gap-10 sm:grid-cols-2 lg:grid-cols-4', visible && 'process-steps--visible')}
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={cn('process-step', visible && 'process-step--visible')}
              style={{ '--step-i': i }}
            >
              <span className="process-step__num">{step.num}</span>
              <h3 className="process-step__title">{step.title}</h3>
              <p className="process-step__desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Spotlight>
  );
}

/* ------------------------------------------------------------------ */
/*  WhySection — 3 differentiator cards                               */
/* ------------------------------------------------------------------ */
function WhySection() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const items = [
    { stat: t('why.item_01_stat'), title: t('why.item_01_title'), desc: t('why.item_01_desc') },
    { stat: t('why.item_02_stat'), title: t('why.item_02_title'), desc: t('why.item_02_desc') },
    { stat: t('why.item_03_stat'), title: t('why.item_03_title'), desc: t('why.item_03_desc') },
  ];

  return (
    <section className="why-section container-x py-28">
      <Reveal as="span" className="eyebrow mb-6 block">{t('why.eyebrow')}</Reveal>
      <h2 className="display-md m-0 mb-16 max-w-[700px]">
        <RiseText text={t('why.heading')} />
      </h2>

      <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className={cn('why-item', visible && 'why-item--visible')}
            style={{ '--why-i': i }}
          >
            <span className="why-item__stat">{item.stat}</span>
            <h3 className="why-item__title">{item.title}</h3>
            <p className="why-item__desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SvcEntry — 3-state: hidden → visible → exited                     */
/*  hidden:  initial, below viewport  (instant reset, no animation)   */
/*  visible: in viewport              (dramatic entrance)              */
/*  exited:  scrolled past, above     (fast exit)                     */
/* ------------------------------------------------------------------ */
function SvcEntry({ service, index }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const [state, setState] = useState('hidden');
  const [expanded, setExpanded] = useState(false);
  const words = service.title.split(' ');
  const flip  = index % 2 === 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let obs;
    // 60 ms grace period so hidden CSS is painted before observer fires
    const timer = setTimeout(() => {
      obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setState('visible');
        } else if (entry.boundingClientRect.top < 0) {
          setState('exited');
        }
        // top > 0 means back below viewport — keep last state so re-scroll is clean
      }, { threshold: 0.06 });
      obs.observe(el);
    }, 60);
    return () => { clearTimeout(timer); obs?.disconnect(); };
  }, []);

  // Parallax: bg number moves opposite to scroll at ~40% speed
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function update() {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      // clamp so the offset stays reasonable even when entry is far off-screen
      const offset = Math.max(-60, Math.min(60, center * 0.18));
      el.style.setProperty('--parallax-y', `${offset}px`);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      ref={ref}
      className={cn('svc-entry', `svc-entry--${state}`, flip && 'svc-entry--flip')}
      style={{ '--svc-i': index }}
    >
      <Spotlight>
        {/* Giant background number */}
        <span className="svc-entry__bg-num" aria-hidden="true">{service.number}</span>

        <div className="container-x relative py-24 md:py-32">
          <div className="grid gap-y-8 md:grid-cols-[1fr_auto] md:items-center md:gap-x-20">

            <div className="flex flex-col gap-6">
              <span className="svc-entry__eyebrow font-mono text-[11px] tracking-[0.2em] text-orange">
                {service.number}
              </span>

              <h2
                className="svc-entry__title m-0 font-extrabold leading-none tracking-[-0.055em]"
                style={{ fontSize: 'clamp(52px, 7.5vw, 110px)' }}
              >
                {words.map((word, i) => (
                  <span key={i} className="svc-word-outer">
                    <span className="svc-word-inner" style={{ '--wi': i }}>
                      {word}{i < words.length - 1 ? ' ' : ''}
                    </span>
                  </span>
                ))}
              </h2>

              <p className="svc-entry__desc m-0 max-w-[500px] text-[18px] leading-relaxed text-muted">
                {service.description}
              </p>

              {service.includes?.length > 0 && (
                <button
                  type="button"
                  className={cn('svc-toggle', expanded && 'svc-toggle--open')}
                  aria-expanded={expanded}
                  onClick={() => setExpanded(v => !v)}
                >
                  <span className="svc-toggle__icon" aria-hidden="true" />
                  {expanded ? t('services.toggle_close') : t('services.toggle_open')}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
              {service.tags?.map((tag, ti) => (
                <TransitionLink
                  key={tag}
                  to={ROUTES.projectsByTag(tag)}
                  className="chip svc-entry__tag"
                  style={{ '--ti': ti }}
                >
                  {tag}
                </TransitionLink>
              ))}
            </div>

          </div>

          {/* ── Expand panel ── */}
          {service.includes?.length > 0 && (
            <div className={cn('svc-expand', expanded && 'svc-expand--open')}>
              <div className="svc-expand__inner">
                <div className="svc-expand__body">
                  <span className="svc-includes__label">{t('services.what_includes')}</span>
                  <ul className="svc-includes__list list-none m-0 p-0">
                    {service.includes.map((item) => (
                      <li key={item} className="svc-includes__item">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </Spotlight>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function ServicesPage() {
  const { t } = useTranslation();
  useDocumentTitle(t('nav.services'));
  const { data: services, loading, error, reload } = useServices();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <Spotlight as="section" className="container-x flex flex-col gap-7 pb-20 pt-40">
        <Reveal as="span" delay={0.7} className="eyebrow">{t('nav.services')}</Reveal>
        <h1 className="display-lg m-0 max-w-[1100px]">
          <RiseText text={t('services.heading')} />
        </h1>
        <Reveal as="p" delay={1.2} className="m-0 max-w-[560px] text-[21px] leading-relaxed text-muted">
          {t('services.description')}
        </Reveal>
      </Spotlight>

      {/* ── Marquee ───────────────────────────────────────────── */}
      <MarqueeStrip services={services} />

      {loading && <div className="container-x pb-16"><Loader /></div>}
      {error   && <div className="container-x pb-16"><ErrorState error={error} onRetry={reload} /></div>}

      {/* ── Entries ───────────────────────────────────────────── */}
      {!loading && !error && services?.length > 0 && (
        <div>
          {services.map((s, i) => <SvcEntry key={s.id} service={s} index={i} />)}
          <div className="border-t border-white/[0.07]" />
        </div>
      )}

      {/* ── Recent work ───────────────────────────────────────── */}
      <RecentWork />

      {/* ── Process ───────────────────────────────────────────── */}
      <ProcessSection />

      {/* ── Why Badiu ─────────────────────────────────────────── */}
      <WhySection />

      {/* ── Stat banner ───────────────────────────────────────── */}
      <StatBanner />

      {/* ── CTA ───────────────────────────────────────────────── */}
      <Spotlight as="section" className="container-x py-28">
        <Reveal variant="clip">
          <div className="flex flex-wrap items-center justify-between gap-8 rounded-[32px] bg-orange p-[clamp(32px,5vw,64px)] text-ink">
            <p className="m-0 max-w-[640px] text-[clamp(26px,3vw,44px)] font-extrabold leading-[1.1] tracking-[-0.03em]">
              {t('home.cta_heading')}
            </p>
            <TransitionLink to={ROUTES.contact} className="btn btn--ink text-nowrap">
              {t('services.contact_cta')}
            </TransitionLink>
          </div>
        </Reveal>
      </Spotlight>
    </>
  );
}
