import { useRef } from 'react';
import Logo from '@/components/Logo';
import { gsap, useGSAP } from '@/motion/gsap';
import { useMotion } from '@/app/providers/MotionProvider';
import { useTheme } from '@/hooks/useTheme';

const SWATCHES = ['noite', 'grafite', 'pedra', 'nevoa', 'osso', 'castanho', 'castanho-claro', 'cafe'];

/**
 * Folha de marca para testar a Fase 0 (só em desenvolvimento: /_marca).
 * Mostra tokens, tipografia e as variantes do <Logo>, e anima os losangos com o ease "badiu".
 */
export default function BrandSheet() {
  const scope = useRef(null);
  const { reduced, lenis } = useMotion();
  const { theme, toggleTheme } = useTheme();

  const { contextSafe } = useGSAP({ scope });
  const weave = contextSafe(() => {
    if (reduced) return;
    gsap.fromTo(
      '[data-demo] [data-logo-cell]:not([data-role="core"])',
      { x: () => gsap.utils.random(-120, 120), y: () => gsap.utils.random(-90, 90), rotation: () => gsap.utils.random(-180, 180), scale: 0, opacity: 0 },
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.1, ease: 'badiu', stagger: { each: 0.045, from: 'random' } },
    );
    gsap.fromTo('[data-demo] [data-role="core"]', { scale: 0 }, { scale: 1, duration: 0.6, ease: 'back.out(3)', delay: 0.85 });
  });

  return (
    <div ref={scope} className="wrap" style={{ paddingTop: 140, paddingBottom: 120, display: 'grid', gap: 72 }}>
      <header style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="t-label">Fase 0 · folha de marca</span>
        <span className="t-small" style={{ color: 'var(--muted)' }}>
          reduced motion: <b>{String(reduced)}</b> · lenis: <b>{lenis ? 'ativo' : 'desligado'}</b> · tema: <b>{theme}</b>
        </span>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" onClick={toggleTheme} className="t-small" style={btn}>Trocar tema</button>
          <button type="button" onClick={weave} className="t-small" style={{ ...btn, background: 'var(--accent)', color: 'var(--on-accent)', boxShadow: 'none' }}>Tecer o logo</button>
        </div>
      </header>

      <section style={{ display: 'grid', gap: 24 }}>
        <span className="t-label">Tipografia</span>
        <h1 className="t-display">Software com <em>raízes.</em></h1>
        <h2 className="t-h1">Trabalho <em>selecionado.</em></h2>
        <h2 className="t-h2">O que <em>tecemos.</em></h2>
        <h3 className="t-h3">Desenvolvimento</h3>
        <p className="t-body" style={{ maxWidth: '60ch', color: 'var(--fg-soft)', margin: 0 }}>
          Desenhamos e construímos produtos digitais com o cuidado de quem tece um pano: fio a fio, sem pressa de parecer igual aos outros.
        </p>
        <p className="t-small" style={{ margin: 0, color: 'var(--muted)' }}>Texto pequeno · Geist 14px · ação, ç, ã, õ, é, ı</p>
      </section>

      <section style={{ display: 'grid', gap: 24 }}>
        <span className="t-label">Cores</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {SWATCHES.map((s) => (
            <div key={s} style={{ display: 'grid', gap: 8 }}>
              <div style={{ height: 72, borderRadius: 12, background: `var(--${s})`, boxShadow: 'inset 0 0 0 1px var(--line)' }} />
              <span className="t-small" style={{ fontFamily: 'var(--font-mono)' }}>--{s}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 32 }}>
        <span className="t-label">Logo</span>
        <div data-demo style={{ display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
          <Logo variant="vertical" size={150} />
          <Logo variant="horizontal" size={40} />
          <Logo variant="symbol" size={96} />
          <Logo variant="wordmark" size={64} />
          <span style={{ color: 'var(--muted)' }}><Logo variant="mono" size={40} /></span>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ ...tile, background: 'var(--noite)' }}><Logo theme="dark" size={48} /></div>
          <div style={{ ...tile, background: 'var(--osso)' }}><Logo theme="light" size={48} /></div>
          <div style={{ ...tile, background: 'var(--noite)' }}>
            <Logo variant="symbol" size={20} /> <Logo variant="symbol" size={16} />
            <span className="t-small" style={{ color: 'var(--nevoa)' }}>&lt;24px: versão favicon</span>
          </div>
        </div>
      </section>
    </div>
  );
}

const btn = {
  font: 'inherit', fontWeight: 600, padding: '12px 20px', borderRadius: 999, border: 0, cursor: 'pointer',
  background: 'transparent', color: 'var(--fg)', boxShadow: 'inset 0 0 0 1px var(--line-strong)',
};
const tile = { display: 'flex', alignItems: 'center', gap: 16, padding: '28px 32px', borderRadius: 18, boxShadow: 'inset 0 0 0 1px var(--line)' };
