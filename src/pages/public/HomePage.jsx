import { useCallback, useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import IntroPhase from '@/components/PublicComponets/home/IntroPhase';
import ManifestoPhase from '@/components/PublicComponets/home/ManifestoPhase';
import ServicesPhase from '@/components/PublicComponets/home/ServicesPhase';
import ProjectsPhase from '@/components/PublicComponets/home/ProjectsPhase';
import FinalPhase from '@/components/PublicComponets/home/FinalPhase';
import PhaseRail from '@/components/PublicComponets/PhaseRail';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useServices } from '@/hooks/useServices';
import { useProjects } from '@/hooks/useProjects';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function HomePage() {
  const { t } = useTranslation();
  useDocumentTitle(null);
  const { setHeaderTone } = useOutletContext();
  const { theme } = useTheme();
  const { data: settings } = useSiteSettings();
  const { data: services } = useServices();
  const { data: projects } = useProjects({ featured: true });

  const phaseLabels = t('home.phases', { returnObjects: true });
  const PHASES = [
    { id: 'inicio',    label: phaseLabels[0] },
    { id: 'manifesto', label: phaseLabels[1] },
    { id: 'servicos',  label: phaseLabels[2] },
    { id: 'projetos',  label: phaseLabels[3] },
    { id: 'contacto',  label: phaseLabels[4] },
  ];

  const SERVICE_PLACEHOLDERS = [1, 2, 3].map((id) => ({ id, number: `0${id}`, title: '', description: '', tags: [] }));

  const [phase, setPhase] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [currentProject, setCurrentProject] = useState(1);
  const [finalLight, setFinalLight] = useState(false);

  const projectList = projects ?? [];
  const serviceList = services?.length ? services : SERVICE_PLACEHOLDERS;

  const introRef      = useScrollProgress();
  const manifestoRef  = useScrollProgress();
  const servicesRef   = useScrollProgress(
    useCallback((p) => setActiveService(Math.min(serviceList.length - 1, Math.floor(p * serviceList.length))), [serviceList.length]),
  );
  const projectsRef   = useScrollProgress(
    useCallback((p) => setCurrentProject(Math.min(projectList.length, Math.round(p * (projectList.length - 1)) + 1)), [projectList.length]),
  );
  const finalRef      = useScrollProgress(useCallback((p) => setFinalLight(p > 0.35), []));
  const sectionRefs   = [introRef, manifestoRef, servicesRef, projectsRef, finalRef];

  const sectionsRef = useRef(sectionRefs);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setPhase(sectionsRef.current.findIndex((r) => r.current === entry.target));
        });
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    sectionsRef.current.forEach((r) => r.current && observer.observe(r.current));
    return () => observer.disconnect();
  }, []);

  const lightHeader = theme === 'light'
    ? phase !== 2
    : phase === 2 || (phase === 4 && finalLight);
  useEffect(() => {
    setHeaderTone(lightHeader ? 'light' : 'dark');
  }, [lightHeader, setHeaderTone]);

  const goToPhase = (i) => {
    const el = sectionRefs[i].current;
    if (!el) return;
    const offset = i === 0 ? 0 : i === 4 ? window.innerHeight * 1.1 : window.innerHeight * 0.15;
    window.scrollTo({ top: el.offsetTop + offset, behavior: 'smooth' });
  };

  const manifesto = t('home.manifesto');
  const accents   = t('home.manifesto_accents', { returnObjects: true });
  const tagline   = t('home.tagline');

  return (
    <>
      <PhaseRail phases={PHASES} active={phase} tone={lightHeader ? 'light' : 'dark'} onSelect={goToPhase} />
      <IntroPhase ref={introRef} tagline={tagline} />
      <ManifestoPhase ref={manifestoRef} text={manifesto} accents={accents} />
      <ServicesPhase ref={servicesRef} services={serviceList} active={activeService} />
      <ProjectsPhase ref={projectsRef} projects={projectList} current={currentProject} />
      <FinalPhase ref={finalRef} email={settings?.email} />
    </>
  );
}
