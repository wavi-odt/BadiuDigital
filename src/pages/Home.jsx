import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Hero from '@/sections/Hero';
import Manifesto from '@/sections/Manifesto';
import Services from '@/sections/Services';
import Work from '@/sections/Work';
import Process from '@/sections/Process';
import Team from '@/sections/Team';
import Cta from '@/sections/Cta';
import PhaseRail from '@/components/PhaseRail';
import { usePhasePaging } from '@/motion/usePhasePaging';

/**
 * Home: hero → manifesto → serviços → trabalho → processo → equipa → CTA.
 * Slot de vídeo do hero (Higgsfield): Hero video={{ webm: '/media/hero.webm', mp4: '/media/hero.mp4', poster: '/media/hero.jpg' }}
 */
export default function Home() {
  useDocumentTitle(null);
  usePhasePaging();
  return (
    <>
      <PhaseRail />
      <Hero />
      <Manifesto />
      <Services />
      <Work />
      <Process />
      <Team />
      <Cta />
    </>
  );
}
