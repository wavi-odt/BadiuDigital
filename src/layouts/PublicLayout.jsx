import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/PublicComponets/Header';
import Footer from '@/components/PublicComponets/Footer';
import WipeOverlay from '@/components/PublicComponets/WipeOverlay';
import CustomCursor from '@/components/PublicComponets/CustomCursor';
import SplashScreen from '@/components/PublicComponets/SplashScreen';
import CommandPalette, { CommandPaletteProvider } from '@/components/PublicComponets/CommandPalette';
import BottomNav from '@/components/PublicComponets/BottomNav';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useTheme } from '@/hooks/useTheme';

/**
 * Layout das páginas públicas.
 * As páginas podem mudar a cor do header via useOutletContext().setHeaderTone
 */
export default function PublicLayout() {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const [headerTone, setHeaderTone] = useState(() => theme === 'light' ? 'light' : 'dark');
  const lenisRef = useSmoothScroll();

  /* scroll para o topo apenas na mudança de rota */
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    setHeaderTone(theme === 'light' ? 'light' : 'dark');
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  /* tone do header atualiza com o tema sem tocar no scroll */
  useEffect(() => {
    setHeaderTone(theme === 'light' ? 'light' : 'dark');
  }, [theme]);

  return (
    <CommandPaletteProvider>
      <SplashScreen />
      <CustomCursor />
      <WipeOverlay />
      <Header tone={headerTone} />
      <main className="main-content">
        <Outlet context={{ setHeaderTone }} />
      </main>
      <Footer />
      <BottomNav />
      <CommandPalette />
    </CommandPaletteProvider>
  );
}
