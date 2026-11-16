import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMotion } from '@/app/providers/MotionProvider';
import { getPhases } from '@/motion/usePhasePaging';

/** Indicador lateral de fases: losango ativo em castanho; clicar salta para a fase. Só desktop com rato (CSS). */
export default function PhaseRail() {
  const { t } = useTranslation();
  const { lenis } = useMotion();
  const labels = t('homepage.phases', { returnObjects: true });
  const [active, setActive] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!lenis) return undefined;
    const update = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const ps = getPhases();
        let i = 0;
        ps.forEach((p, k) => { if (p.start <= lenis.scroll + 6) i = k; });
        setActive(i);
      });
    };
    update();
    lenis.on('scroll', update);
    return () => { cancelAnimationFrame(raf.current); lenis.off('scroll', update); };
  }, [lenis]);

  const go = (i) => {
    const p = getPhases()[i];
    if (p) lenis?.scrollTo(p.stops ? p.stops[0] : p.start, { duration: 1.2, force: true });
  };

  return (
    <nav className="prail" aria-label={t('homepage.phases_label')}>
      {Array.isArray(labels) && labels.map((label, i) => (
        <button key={label} type="button" className={i === active ? 'is-on' : ''} aria-label={label} aria-current={i === active ? 'true' : undefined} onClick={() => go(i)} data-cursor="view">
          <span aria-hidden="true">{label}</span>
        </button>
      ))}
    </nav>
  );
}
