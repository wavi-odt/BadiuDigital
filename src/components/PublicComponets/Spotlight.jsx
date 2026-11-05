import { useEffect, useId, useRef } from 'react';
import { cn } from '@/utils/cn';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const isFinePointer =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const LERP = 0.07;

/**
 * Envolve uma secção escura com um spotlight laranja/areia que segue o rato
 * e revela um padrão pano di terra (losangos Panu) por baixo.
 *
 * Props:
 *   as       — tag a renderizar (default "div")
 *   className, ...props — passados diretamente ao elemento raiz
 */
export default function Spotlight({ children, as: Tag = 'div', className, ...props }) {
  const uid       = useId();
  const patternId = `panu${uid.replace(/:/g, '')}`;
  const hostRef   = useRef(null);
  const layerRef  = useRef(null);
  const reduced   = usePrefersReducedMotion();
  const active    = !reduced && isFinePointer;

  useEffect(() => {
    if (!active) return;
    const host  = hostRef.current;
    const layer = layerRef.current;
    if (!host || !layer) return;

    let tx = -9999, ty = -9999;
    let cx = -9999, cy = -9999;
    let opacity = 0, inside = false;
    let rafId;

    function onMouseMove(e) {
      const r = host.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      inside = true;
    }
    function onMouseLeave() { inside = false; }

    function tick() {
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;
      opacity = inside
        ? Math.min(1, opacity + 0.05)
        : Math.max(0, opacity - 0.03);

      host.style.setProperty('--mx', `${cx}px`);
      host.style.setProperty('--my', `${cy}px`);
      layer.style.opacity = opacity.toFixed(3);
      rafId = requestAnimationFrame(tick);
    }

    host.addEventListener('mousemove', onMouseMove, { passive: true });
    host.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      host.removeEventListener('mousemove', onMouseMove);
      host.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [active]);

  return (
    <Tag ref={hostRef} className={cn('spotlight-host', className)} {...props}>

      {/* camada de luz + padrão — fica atrás do conteúdo via z-index: -1 */}
      {active && (
        <div ref={layerRef} className="spotlight-layer" aria-hidden="true">

          {/* luz radial laranja/areia */}
          <div className="spotlight-glow" />

          {/* padrão pano di terra revelado pela mask */}
          <svg className="spotlight-pattern">
            <defs>
              <pattern id={patternId} patternUnits="userSpaceOnUse" width="40" height="40">
                {/* losango exterior — referência ao símbolo Panu */}
                <polygon
                  points="20,2 38,20 20,38 2,20"
                  fill="none" stroke="#BFD3CF"
                  strokeWidth="0.8" strokeOpacity="0.55"
                />
                {/* losango interior */}
                <polygon
                  points="20,11 29,20 20,29 11,20"
                  fill="none" stroke="#BFD3CF"
                  strokeWidth="0.5" strokeOpacity="0.35"
                />
                {/* núcleo laranja */}
                <circle cx="20" cy="20" r="1.5" fill="#F08A4B" fillOpacity="0.45" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>

        </div>
      )}

      {children}
    </Tag>
  );
}
