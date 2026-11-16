import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/motion/gsap';

/** Indicador de progresso de scroll: 2px castanho no topo, animado só com scaleX. */
export default function ScrollProgress() {
  const bar = useRef(null);

  useGSAP(() => {
    const set = gsap.quickSetter(bar.current, 'scaleX');
    set(0);
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => set(self.progress),
      onRefresh: (self) => set(self.progress),
    });
    return () => st.kill();
  }, []);

  return <div ref={bar} className="scroll-progress" aria-hidden="true" />;
}
