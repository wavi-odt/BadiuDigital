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
import Preloader from '@/components/Preloader';
// TEMPORÁRIO: peças antigas que ainda não têm versão nova (footer → Fase 2, navegação mobile e pesquisa)
import Footer from '@/components/PublicComponets/Footer';
import BottomNav from '@/components/PublicComponets/BottomNav';
import CommandPalette, { CommandPaletteProvider } from '@/components/PublicComponets/CommandPalette';

export default function Layout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { scrollTo } = useMotion();
  const intro = useIntro();
  const first = useRef(true);

  // Voltar/avançar no browser (sem cortina): ir para o topo e recalcular os triggers
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (location.state?.viaTransition) return;
    scrollTo(0, { immediate: true, force: true });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CommandPaletteProvider>
      <a href="#conteudo" className="skip-link">{t('ui.skip_to_content')}</a>
      <Preloader />
      <ScrollProgress />
      <Navbar />
      {/* useOutletContext().setHeaderTone: mantido para as páginas antigas (sem efeito) */}
      <main id="conteudo" tabIndex={-1} className="main-content">
        <Outlet context={{ setHeaderTone: () => {}, intro }} />
      </main>
      <Footer />
      <BottomNav />
      <CommandPalette />
      <Cursor />
      <Grain />
    </CommandPaletteProvider>
  );
}
