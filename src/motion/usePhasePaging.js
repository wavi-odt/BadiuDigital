import { useEffect } from 'react';
import { useMotion } from '@/app/providers/MotionProvider';

/**
 * Landing por fases: o ecrã fica "travado" e cada gesto de scroll muda de fase.
 *
 * Cada fase é um elemento com [data-phase]. Tipos (decididos em runtime):
 *  - fase simples (≈ 1 ecrã): um gesto salta para a seguinte/anterior;
 *  - fase alta (conteúdo > 1 ecrã) ou pinned: o scroll corre livremente lá dentro e só
 *    muda de fase quando chega à borda (um segundo gesto);
 *  - fase com passos (el.__phase().stops, ex.: serviços): cada gesto avança um passo.
undefined
 *
 * Só no desktop com rato e sem reduced motion; em touch e mobile o scroll continua normal.
 * Rato: ignora a "cauda" de inércia (só gestos novos mudam de fase). Teclado: ↑ ↓ PgUp PgDn Espaço Home End.
 */
const EASE = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2); // easeInOutQuart
const QUERY = '(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const E = 6; // tolerância em px

export function getPhases() {
  const maxS = document.documentElement.scrollHeight - window.innerHeight;
  const els = [...document.querySelectorAll('[data-phase]')];
  return els.map((el, i) => {
    if (el.__phase) {
      const r = el.__phase();
      return { el, ...r, end: i === els.length - 1 ? Math.max(r.end, maxS) : r.end };
    }
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const bottom = rect.bottom + window.scrollY;
    const start = Math.min(top, maxS);
    let end = i === els.length - 1 ? maxS : Math.min(Math.max(start, bottom - window.innerHeight), maxS);
    // quase 1 ecrã (ex.: o hero é um pouco mais alto que a janela): conta como fase simples
    if (i !== els.length - 1 && end - start < window.innerHeight * 0.4) end = start;
    return { el, start, end };
  });
}

export function usePhasePaging() {
  const { lenis } = useMotion();

  useEffect(() => {
    if (!lenis) return undefined;
    const mq = window.matchMedia(QUERY);
    let stop = null;
    const sync = () => { stop?.(); stop = mq.matches ? start(lenis) : null; };
    sync();
    mq.addEventListener('change', sync);
    return () => { mq.removeEventListener('change', sync); stop?.(); };
  }, [lenis]);
}

function start(lenis) {
  let busy = false;
  let unlockTimer = 0;
  let lastWheel = 0;
  let lastAbs = 0;
  let cooldown = 0;

  const maxS = () => document.documentElement.scrollHeight - window.innerHeight;

  const go = (to, duration) => {
    to = Math.min(Math.max(to, 0), maxS());
    const dist = Math.abs(to - lenis.scroll);
    if (dist < 2) return;
    // distâncias longas demoram mais (animações pinned correm sozinhas), curtas assentam depressa
    duration ??= Math.min(3, Math.max(1.2, (dist / window.innerHeight) * 1.1));
    busy = true;
    clearTimeout(unlockTimer);
    const unlock = () => { busy = false; cooldown = performance.now() + 250; };
    unlockTimer = setTimeout(unlock, (duration + 0.6) * 1000); // segurança
    lenis.scrollTo(to, { duration, easing: EASE, force: true, lock: true, onComplete: () => { clearTimeout(unlockTimer); unlock(); } });
  };

  /** O que fazer para a direção dir (+1 baixo, -1 cima): { to } salta, { free, limit } scroll livre, null nada. */
  const decide = (dir) => {
    const pos = lenis.scroll;
    const ps = getPhases();
    let i = 0;
    ps.forEach((p, k) => { if (p.start <= pos + E) i = k; });
    const p = ps[i];
    if (!p) return null;

    if (dir > 0) {
      if (p.stops) {
        const next = p.stops.find((s) => s > pos + E);
        if (next !== undefined) return { to: next, duration: p.duration };
      } else if (pos < p.end - E) {
        return { free: true, limit: p.end };
      }
      const nxt = ps[i + 1];
      return nxt ? { to: nxt.start } : null;
    }

    if (p.stops) {
      const prev = [...p.stops].reverse().find((s) => s < pos - E);
      if (prev !== undefined) return { to: prev, duration: p.duration };
    } else if (pos > p.start + E) {
      return pos <= p.end + E ? { free: true, limit: p.start } : { to: p.end };
    }
    const prv = ps[i - 1];
    if (!prv) return null;
    return { to: prv.stops ? prv.stops[prv.stops.length - 1] : prv.end };
  };

  const onWheel = (e) => {
    if (e.ctrlKey || lenis.isStopped) return;
    if (e.target.closest?.('[data-lenis-prevent]')) return;
    const now = performance.now();
    const abs = Math.abs(e.deltaY);
    const gap = now - lastWheel;
    const prevAbs = lastAbs;
    lastWheel = now;
    lastAbs = abs;
    if (abs < 2) return;
    const dir = Math.sign(e.deltaY);
    const d = decide(dir);

    if (d?.free) {
      // scroll livre dentro da fase, mas sem ultrapassar a borda (assenta nela)
      const predicted = lenis.targetScroll + e.deltaY;
      if ((dir > 0 && predicted > d.limit) || (dir < 0 && predicted < d.limit)) {
        e.preventDefault();
        e.stopPropagation();
        if (!busy && Math.abs(d.limit - lenis.scroll) > 2) go(d.limit, 0.55);
      }
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    if (busy || now < cooldown || !d) return;
    const fresh = gap > 140 || abs > prevAbs * 1.8; // gesto novo, não a cauda da inércia
    if (fresh) go(d.to, d.duration);
  };

  const onKey = (e) => {
    if (lenis.isStopped || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target;
    if (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable) return;
    if (e.key === ' ' && /BUTTON|A/.test(t.tagName)) return;
    let dir = 0;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) dir = 1;
    else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) dir = -1;
    else if (e.key === 'Home') { e.preventDefault(); if (!busy) go(0); return; }
    else if (e.key === 'End') { e.preventDefault(); if (!busy) go(maxS()); return; }
    else return;
    e.preventDefault();
    if (busy) return;
    const d = decide(dir);
    if (d) go(d.free ? d.limit : d.to, d.duration);
  };

  window.addEventListener('wheel', onWheel, { passive: false, capture: true });
  window.addEventListener('keydown', onKey);
  document.documentElement.classList.add('phased');
  return () => {
    clearTimeout(unlockTimer);
    window.removeEventListener('wheel', onWheel, { capture: true });
    window.removeEventListener('keydown', onKey);
    document.documentElement.classList.remove('phased');
  };
}
