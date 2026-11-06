import { useEffect, useState } from 'react';
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
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

/* ------------------------------------------------------------------ */
/*  RecentWork — scroll phase                                          */
/* ------------------------------------------------------------------ */
function RecentWorkPhase({ featured }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const sectionRef = useScrollProgress((p) => {
    setVisible(p > 0.1 && p < 0.9);
  });

  return (
    <div ref={sectionRef} className="recent-work-phase">
      <section className={cn('recent-work-phase__stage container-x', visible && 'recent-work-phase--visible')}>
        <div className="w-full">
          <div className="mb-10 flex items-baseline justify-between gap-4 recent-work__header">
            <span className="eyebrow">{t('services.recent_work')}</span>
            <TransitionLink to={ROUTES.projects} className="font-mono text-[13px] text-orange hover:opacity-70 transition-opacity">
              {t('services.see_all_projects')}
            </TransitionLink>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <div key={p.id} className="recent-work__card" style={{ '--card-i': i }}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function RecentWork() {
  const { data } = useProjects();
  const featured = (data ?? []).filter((p) => p.featured).slice(0, 3);
  if (!featured.length) return null;
  return <RecentWorkPhase featured={featured} />;
}

/* ------------------------------------------------------------------ */
/*  ProcessSection — scroll phase                                      */
/* ------------------------------------------------------------------ */
function ProcessSection() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const sectionRef = useScrollProgress((p) => {
    setVisible(p > 0.1 && p < 0.9);
  });

  const steps = [
    { num: '01', title: t('process.step_01_title'), desc: t('process.step_01_desc') },
    { num: '02', title: t('process.step_02_title'), desc: t('process.step_02_desc') },
    { num: '03', title: t('process.step_03_title'), desc: t('process.step_03_desc') },
    { num: '04', title: t('process.step_04_title'), desc: t('process.step_04_desc') },
  ];

  return (
    <div ref={sectionRef} className="process-phase">
      <Spotlight as="section" className="process-section">
        <div className="container-x py-16">
          <Reveal as="span" className="eyebrow mb-6 block">{t('process.eyebrow')}</Reveal>
          <h2 className="display-md m-0 mb-16 max-w-[700px]">
            <RiseText text={t('process.heading')} />
          </h2>
          <div
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  WhySection — scroll phase                                          */
/* ------------------------------------------------------------------ */
function WhySection() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const sectionRef = useScrollProgress((p) => {
    setVisible(p > 0.1 && p < 0.9);
  });

  const items = [
    { stat: t('why.item_01_stat'), title: t('why.item_01_title'), desc: t('why.item_01_desc') },
    { stat: t('why.item_02_stat'), title: t('why.item_02_title'), desc: t('why.item_02_desc') },
    { stat: t('why.item_03_stat'), title: t('why.item_03_title'), desc: t('why.item_03_desc') },
  ];

  return (
    <div ref={sectionRef} className="why-phase">
      <section className={cn('why-section', visible && 'why-section--visible')}>
        <div className="container-x py-16">
          <span className="why-section__eyebrow eyebrow mb-6 block">{t('why.eyebrow')}</span>
          <h2 className="why-section__heading display-md m-0 mb-12 max-w-[700px]">
            {t('why.heading')}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <div
                key={i}
                className={cn('why-item', visible && 'why-item--visible')}
                style={{ '--why-i': i }}
              >
                <svg width="18" height="18" viewBox="0 0 100 100" aria-hidden="true" className="mb-5 opacity-40 text-orange">
                  <polygon points="50,0 100,50 50,100 0,50" fill="none" stroke="currentColor" strokeWidth="6" />
                  <polygon points="50,28 72,50 50,72 28,50" fill="currentColor" fillOpacity="0.45" />
                </svg>
                <span className="why-item__stat">{item.stat}</span>
                <h3 className="why-item__title">{item.title}</h3>
                <p className="why-item__desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CTASection — scroll phase                                          */
/* ------------------------------------------------------------------ */
function CTASection() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const sectionRef = useScrollProgress((p) => {
    setVisible(p > 0.1 && p < 0.9);
  });

  return (
    <div ref={sectionRef} className="cta-phase">
      <section className={cn('cta-phase__stage', visible && 'cta-phase--visible')}>
        <div className="cta-phase__bg" aria-hidden="true" />

        <div className="container-x cta-phase__inner">
          <span className="cta-phase__eyebrow eyebrow">{t('contact.eyebrow')}</span>
          <h2 className="cta-phase__heading">
            <span className="cta-phase__heading-line1">{t('services.cta_line1')}</span>
            <span className="cta-phase__heading-line2">{t('services.cta_line2')}</span>
          </h2>
          <p className="cta-phase__sub">{t('services.cta_sub')}</p>
          <div className="cta-phase__actions">
            <TransitionLink to={ROUTES.contact} className="btn btn--orange">
              {t('services.contact_cta')}
            </TransitionLink>
            <TransitionLink to={ROUTES.team} className="cta-phase__team-link">
              {t('home.cta_team')} →
            </TransitionLink>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CosmosWrapper — single sticky stage, all services inside          */
/* ------------------------------------------------------------------ */
const GLOW_COLORS = [
  'var(--badiu-petrol)',
  'var(--badiu-orange)',
  'var(--badiu-muted)',
];

function CosmosWrapper({ services }) {
  const { t } = useTranslation();
  const n = services.length;
  const [active, setActive] = useState(0);
  const [navVisible, setNavVisible] = useState(false);

  /* useScrollProgress sets --p on this ref; onChange fires on every scroll */
  const sectionRef = useScrollProgress((p) => {
    setActive(Math.min(Math.floor(p * n), n - 1));
  });

  /* Show/hide nav dots based on section visibility */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setNavVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="cosmos-wrapper"
      /* Height = n scroll slots + 1 viewport so the last panel lingers */
      style={{ height: `${n * 150 + 100}vh` }}
      aria-label={t('nav.services')}
    >
      <div className="cosmos-stage">
        <nav
          className={cn('cosmos-nav', navVisible && 'cosmos-nav--visible')}
          aria-hidden="true"
        >
          {services.map((_, i) => (
            <span
              key={i}
              className={cn('cosmos-nav__dot', i === active && 'cosmos-nav__dot--active')}
            />
          ))}
        </nav>

        {services.map((s, i) => (
          <div
            key={s.id}
            className={cn('cosmos-panel', i === active && 'cosmos-panel--active')}
            aria-hidden={i !== active}
            style={{
              '--svc-glow':     GLOW_COLORS[i % GLOW_COLORS.length],
              '--svc-i-panel':  i,
              '--svc-n':        n,
            }}
          >
            <div className="cosmos-panel__glow" aria-hidden="true" />

            <div className="cosmos-panel__inner container-x">
              <span className="cosmos-panel__bg-num" aria-hidden="true">{s.number}</span>

              <div className="cosmos-panel__content">
                <span className="cosmos-panel__eyebrow">{s.number}</span>
                <h2 className="cosmos-panel__title">{s.title}</h2>
                <p className="cosmos-panel__desc">{s.description}</p>

                {s.includes?.length > 0 && (
                  <div className="cosmos-panel__includes">
                    <span className="cosmos-panel__includes-label">{t('services.what_includes')}</span>
                    <ul className="cosmos-panel__includes-list">
                      {s.includes.map((item, idx) => (
                        <li key={idx} className="cosmos-panel__includes-item">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="cosmos-panel__footer">
                  <div className="cosmos-panel__tags">
                    {s.tags?.map(tag => (
                      <TransitionLink
                        key={tag}
                        to={ROUTES.projectsByTag(tag)}
                        className="chip"
                      >
                        {tag}
                      </TransitionLink>
                    ))}
                  </div>
                  <TransitionLink to={ROUTES.contact} className="btn btn--orange">
                    {t('services.contact_cta')}
                  </TransitionLink>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
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
      {/* ── Hero phase ────────────────────────────────────────── */}
      <Spotlight as="section" className="services-hero">
        <div className="services-hero__stage">
          <div className="services-hero__backdrop" aria-hidden="true">
            <div className="services-hero__backdrop-nums">
              <span>01</span>
              <span>02</span>
              <span>03</span>
            </div>
          </div>
          <div className="services-hero__inner container-x flex flex-col gap-7 pt-40 pb-32">
            <Reveal as="span" delay={0.7} className="eyebrow">{t('nav.services')}</Reveal>
            <h1 className="display-lg m-0 max-w-[1100px]">
              <RiseText text={t('services.heading')} />
            </h1>
            <Reveal as="p" delay={1.2} className="m-0 max-w-[560px] text-[21px] leading-relaxed text-muted">
              {t('services.description')}
            </Reveal>
          </div>
          <div className="services-hero__scroll-cue" aria-hidden="true">
            <span className="services-hero__scroll-label">scroll</span>
            <span className="services-hero__scroll-bar" />
          </div>
        </div>
      </Spotlight>

      {/* ── Cosmos scroll ─────────────────────────────────────── */}
      {loading && <div className="container-x py-16"><Loader /></div>}
      {error   && <div className="container-x py-16"><ErrorState error={error} onRetry={reload} /></div>}

      {!loading && !error && services?.length > 0 && (
        <CosmosWrapper services={services} />
      )}

      {/* ── Why Badiu phase ───────────────────────────────────── */}
      <WhySection />

      {/* ── Process phase ─────────────────────────────────────── */}
      <ProcessSection />

      {/* ── Recent work ───────────────────────────────────────── */}
      <RecentWork />

      {/* ── CTA phase ─────────────────────────────────────────── */}
      <CTASection />
    </>
  );
}
