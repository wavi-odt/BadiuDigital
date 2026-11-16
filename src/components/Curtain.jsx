import { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '@/motion/gsap';

/**
 * Cortina de losangos da transição entre páginas.
 * Os losangos formam uma malha que cobre o ecrã sem falhas; escalam em diagonal
 * (do canto superior esquerdo para o inferior direito) para cobrir e voltam a abrir
 * na mesma direção. Um losango castanho marca o centro enquanto está tapado.
 *
 * API imperativa: ref.current.cover() / ref.current.reveal() → Promise
 */
function buildGrid(w, h) {
  const s = Math.round(Math.min(180, Math.max(96, w / 9))); // diagonal de cada losango
  const half = s / 2;
  const cells = [];
  const rows = Math.ceil(h / half) + 2;
  const cols = Math.ceil(w / s) + 2;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const cx = (i + (j % 2) / 2) * s - half;
      const cy = j * half - half;
      // ordem diagonal 0..1 (+ uma pitada de ruído para parecer tecido à mão)
      const d = Math.min(1, Math.max(0, (cx / w + cy / h) / 2 + (((i * 73 + j * 37) % 11) / 11 - 0.5) * 0.06));
      cells.push({ key: `${i}-${j}`, d, points: `${cx},${cy - half} ${cx + half},${cy} ${cx},${cy + half} ${cx - half},${cy}` });
    }
  }
  return { w, h, cells };
}

const SPREAD = 0.38; // tempo entre o primeiro e o último losango
const COVER = 0.5;
const REVEAL = 0.6;

const Curtain = forwardRef(function Curtain(_, ref) {
  const root = useRef(null);
  const [grid, setGrid] = useState(() =>
    typeof window === 'undefined' ? { w: 0, h: 0, cells: [] } : buildGrid(window.innerWidth, window.innerHeight),
  );

  useLayoutEffect(() => {
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setGrid(buildGrid(window.innerWidth, window.innerHeight)), 150);
    };
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); };
  }, []);

  const els = () => ({
    svg: root.current,
    cells: root.current.querySelectorAll('[data-c]'),
    mark: root.current.querySelector('[data-mark]'),
  });

  const cover = useCallback(() => {
    const { svg, cells, mark } = els();
    gsap.killTweensOf([cells, mark]);
    const tl = gsap.timeline();
    tl.set(svg, { visibility: 'visible', pointerEvents: 'auto' })
      .fromTo(cells, { scale: 0 }, {
        scale: 1.04, duration: COVER, ease: 'power3.out', transformOrigin: '50% 50%',
        stagger: (i, el) => Number(el.dataset.d) * SPREAD,
      })
      .fromTo(mark, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(3)', transformOrigin: '50% 50%' }, '-=0.3');
    return tl.then();
  }, []);

  const reveal = useCallback(() => {
    const { svg, cells, mark } = els();
    const tl = gsap.timeline();
    tl.to(mark, { scale: 0, duration: 0.25, ease: 'power3.in', transformOrigin: '50% 50%' })
      .to(cells, {
        scale: 0, duration: REVEAL, ease: 'badiu', transformOrigin: '50% 50%',
        stagger: (i, el) => Number(el.dataset.d) * SPREAD,
      }, 0.1)
      .set(svg, { visibility: 'hidden', pointerEvents: 'none' });
    return tl.then();
  }, []);

  useImperativeHandle(ref, () => ({ cover, reveal }), [cover, reveal]);

  return (
    <svg
      ref={root}
      className="curtain"
      width={grid.w}
      height={grid.h}
      viewBox={`0 0 ${grid.w} ${grid.h}`}
      aria-hidden="true"
      focusable="false"
    >
      {grid.cells.map((c) => (
        <polygon key={c.key} data-c="" data-d={c.d.toFixed(3)} points={c.points} />
      ))}
      <polygon
        data-mark=""
        className="curtain-mark"
        points={`${grid.w / 2},${grid.h / 2 - 9} ${grid.w / 2 + 9},${grid.h / 2} ${grid.w / 2},${grid.h / 2 + 9} ${grid.w / 2 - 9},${grid.h / 2}`}
      />
    </svg>
  );
});

export default Curtain;
