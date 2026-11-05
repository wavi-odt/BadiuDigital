import { useRef, useEffect } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const isFinePointer =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export default function Magnetic({ children, strength = 0.38, radius = 90 }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !isFinePointer) return;

    const el = ref.current;
    if (!el) return;

    let active = false;

    function onMouseMove(e) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const pull = (1 - dist / radius) * strength;
        el.style.transition = 'transform 0.15s ease-out';
        el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
        active = true;
      } else if (active) {
        el.style.transition = 'transform 0.55s var(--badiu-ease-out)';
        el.style.transform = '';
        active = false;
      }
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      el.style.transform = '';
      el.style.transition = '';
    };
  }, [reduced, strength, radius]);

  return (
    <span ref={ref} style={{ display: 'inline-block' }}>
      {children}
    </span>
  );
}
