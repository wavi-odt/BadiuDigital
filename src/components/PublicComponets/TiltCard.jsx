import { useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import TransitionLink from './TransitionLink';

const isFinePointer =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const MAX  = 8;   // graus máximos de inclinação
const LERP = 0.1; // suavidade do movimento

/**
 * Envolve um cartão e aplica efeito tilt 3D + brilho.
 * Props:
 *   radius   — border-radius do conteúdo (ex: "28px") para clipar o brilho
 *   className — passada ao wrapper externo
 */
export default function TiltCard({ children, className, radius, to, ariaLabel }) {
  const wrapRef  = useRef(null);
  const innerRef = useRef(null);
  const reduced  = usePrefersReducedMotion();
  const active   = !reduced && isFinePointer;

  useEffect(() => {
    if (!active) return;
    const wrap  = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    // alvos e valores correntes
    let trx = 0, try_ = 0;
    let crx = 0, cry  = 0;
    let tgx = 50, tgy = 50;
    let cgx = 50, cgy = 50;
    let tgo = 0,  cgo = 0;   // glare opacity
    let rafId;

    function onMouseMove(e) {
      const r  = wrap.getBoundingClientRect();
      const nx = (e.clientX - r.left)  / r.width;   // 0 → 1
      const ny = (e.clientY - r.top)   / r.height;  // 0 → 1
      trx  = (0.5 - ny) * MAX * 2;   // positivo = topo inclina para o viewer
      try_ = (nx - 0.5) * MAX * 2;   // positivo = direita inclina para longe
      tgx  = nx * 100;
      tgy  = ny * 100;
      tgo  = 1;
    }
    function onMouseLeave() { trx = 0; try_ = 0; tgo = 0; }

    function tick() {
      crx  += (trx  - crx)  * LERP;
      cry  += (try_ - cry)  * LERP;
      cgx  += (tgx  - cgx)  * LERP;
      cgy  += (tgy  - cgy)  * LERP;
      cgo  += (tgo  - cgo)  * LERP;

      inner.style.setProperty('--rx',      `${crx.toFixed(3)}deg`);
      inner.style.setProperty('--ry',      `${cry.toFixed(3)}deg`);
      inner.style.setProperty('--gx',      `${cgx.toFixed(2)}%`);
      inner.style.setProperty('--gy',      `${cgy.toFixed(2)}%`);
      inner.style.setProperty('--glare-o', cgo.toFixed(3));

      rafId = requestAnimationFrame(tick);
    }

    wrap.addEventListener('mousemove',  onMouseMove,  { passive: true });
    wrap.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      wrap.removeEventListener('mousemove',  onMouseMove);
      wrap.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [active]);

  return (
    <div ref={wrapRef} className={cn('tilt-wrap', className)}>
      <div
        ref={innerRef}
        className="tilt-inner"
        style={radius ? { borderRadius: radius, overflow: 'hidden' } : undefined}
      >
        {children}
      </div>
      {to && (
        <TransitionLink
          to={to}
          aria-label={ariaLabel}
          className="absolute inset-0"
          style={{ zIndex: 1 }}
          tabIndex={0}
        />
      )}
    </div>
  );
}
