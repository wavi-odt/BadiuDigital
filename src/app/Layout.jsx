import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ScrollTrigger } from '@/motion/gsap';
import { useMotion } from '@/app/providers/MotionProvider';
import { useIntro } from '@/app/providers/IntroProvider';
import Navbar from '@/components/Navbar';
import ScrollProgress from '@/components/ScrollProgress';
import Cursor from '@/components/Cursor';
import Grain from '@/components/Grain';
import SiteBackground from '@/components/SiteBackground';
import Preloader from '@/components/Preloader';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import Search, { SearchProvider } from '@/components/Search';

export default function Layout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { scrollTo } = useMotion();
  const intro = useIntro();
  const first = useRef(true);

  // O conteúdo muda de altura (páginas lazy, dados da API, imagens): recalcular os ScrollTriggers
  useEffect(() => {
    let t;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 120);
    });
    ro.observe(document.body);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, []);

  // Voltar/avançar no browser (sem cortina): ir para o topo e recalcular os triggers
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (location.state?.viaTransition) return;
    scrollTo(0, { immediate: true, force: true });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SearchProvider>
      <a href="#conteudo" className="skip-link">{t('ui.skip_to_content')}</a>
      <SiteBackground />
      <Preloader />
      <ScrollProgress />
      <Navbar />
      <main id="conteudo" tabIndex={-1}>
        <Outlet context={{ intro }} />
      </main>
      <Footer />
      <BottomNav />
      <Search />
      <Cursor />
      <Grain />
    </SearchProvider>
  );
}
