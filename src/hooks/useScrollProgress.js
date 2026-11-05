import { useEffect, useRef } from 'react';

/**
 * Mede o progresso (0 → 1) do scroll dentro de uma secção alta com conteúdo sticky.
 * Escreve o valor na variável CSS --p da secção (sem re-render) e chama onChange(p).
 */
export function useScrollProgress(onChange) {
  const ref = useRef(null);
  const callback = useRef(onChange);
  callback.current = onChange;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      el.style.setProperty('--p', p.toFixed(4));
      callback.current?.(p);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
