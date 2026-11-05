import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'badiu_splash';

export default function SplashScreen() {
  const [phase, setPhase] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) ? 'gone' : 'in',
  );
  const started = useRef(false);

  useEffect(() => {
    if (phase === 'gone' || started.current) return;
    started.current = true;

    localStorage.setItem(STORAGE_KEY, '1');
    document.body.style.overflow = 'hidden';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // reveal animation: delay 1.5s + duration 2s = ends at 3.5s
    // fade-out transition: 1.6s
    const holdMs = reduced ? 300  : 3800;
    const doneMs = reduced ? 450  : 5600;

    setTimeout(() => {
      setPhase('out');
      document.body.classList.add('splash-out');
    }, holdMs);
    setTimeout(() => {
      setPhase('gone');
      document.body.classList.remove('splash-out');
      document.body.style.overflow = '';
    }, doneMs);

    return () => {
      document.body.classList.remove('splash-out');
      document.body.style.overflow = '';
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'gone') return null;

  return (
    <div className={`splash${phase === 'out' ? ' splash--out' : ''}`} aria-hidden="true">
      <svg width="160" height="160" viewBox="0 0 100 100">
        <rect    className="panu-p panu-p--bg"    width="100" height="100" rx="22" fill="#0D4B57" />
        <polygon className="panu-p panu-p--outer"  points="50,12 88,50 50,88 12,50" fill="#F1E4C3" />
        <polygon className="panu-p panu-p--mid"    points="50,28 72,50 50,72 28,50" fill="#0D4B57" />
        <polygon className="panu-p panu-p--core"   points="50,40 60,50 50,60 40,50" fill="#F08A4B" />
        <polygon className="panu-p panu-p--tl"     points="10,10 30,10 10,30"       fill="#F08A4B" />
        <polygon className="panu-p panu-p--br"     points="90,90 70,90 90,70"       fill="#F08A4B" />
      </svg>
      <span className="splash__word">
        <span className="splash__word-text">badiu</span>
        <span className="splash__word-bar" aria-hidden="true" />
      </span>
    </div>
  );
}
