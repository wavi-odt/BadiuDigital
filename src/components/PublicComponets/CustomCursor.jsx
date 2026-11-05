import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const LERP = 0.12;
const isFineMouse =
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const INTERACTIVE = 'a, button, [role="button"], .btn, .chip, input, textarea, select, label';

export default function CustomCursor() {
  const wrapRef = useRef(null);
  const dotRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !isFineMouse) return;
    document.body.classList.add('cursor-none');
    return () => document.body.classList.remove('cursor-none');
  }, [reduced]);

  useEffect(() => {
    if (reduced || !isFineMouse) return;

    const wrap = wrapRef.current;
    const dot = dotRef.current;
    if (!wrap || !dot) return;

    let mouseX = -200;
    let mouseY = -200;
    let curX = -200;
    let curY = -200;
    let rafId;

    function onMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      wrap.style.opacity = '1';
    }

    function onMouseOver(e) {
      if (e.target.closest(INTERACTIVE)) {
        dot.classList.add('cursor-dot--hover');
      }
    }

    function onMouseOut(e) {
      if (e.target.closest(INTERACTIVE)) {
        dot.classList.remove('cursor-dot--hover');
      }
    }

    let tone = 'dark';

    function detectTone() {
      const el = document.elementFromPoint(curX, curY);
      if (!el) return 'dark';
      const contact = el.closest('#contacto');
      if (contact) {
        const p = parseFloat(contact.style.getPropertyValue('--p') || '0');
        return p > 0.3 ? 'orange' : 'dark';
      }
      return 'dark';
    }

    function applyTone(next) {
      if (next === tone) return;
      tone = next;
      if (next === 'orange') {
        wrap.style.setProperty('--cursor-color',       '#8B1A1A');
        wrap.style.setProperty('--cursor-hover-color', '#6B0A0A');
      } else {
        wrap.style.removeProperty('--cursor-color');
        wrap.style.removeProperty('--cursor-hover-color');
      }
    }

    function tick() {
      curX += (mouseX - curX) * LERP;
      curY += (mouseY - curY) * LERP;
      wrap.style.transform = `translate(${curX}px, ${curY}px)`;
      applyTone(detectTone());
      rafId = requestAnimationFrame(tick);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  if (reduced || !isFineMouse) return null;

  return (
    <div ref={wrapRef} aria-hidden="true" className="cursor-wrap">
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
