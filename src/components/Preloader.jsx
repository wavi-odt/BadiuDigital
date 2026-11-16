import { useEffect, useRef, useState } from 'react';
import { gsap, Flip, useGSAP } from '@/motion/gsap';
import { useIntro } from '@/app/providers/IntroProvider';
import { useMotion } from '@/app/providers/MotionProvider';
import Logo from '@/components/Logo';

/**
 * Preloader (~4s no primeiro carregamento, ritmo calmo):
 *  1. os 12 losangos entram de posições dispersas e tecem-se na grelha do logo;
 *  2. o núcleo castanho entra por último e pulsa uma vez;
 *  3. o wordmark revela-se carácter a carácter;
 *  4. símbolo e wordmark encolhem e voam (Flip.fit) para o logo da navbar,
 *     enquanto o fundo fecha num losango e o hero começa a entrar;
 *  5. o símbolo da navbar "monta-se" losango a losango e os links entram um a um.
 * Na segunda visita (sessionStorage) corre a versão curta (~1s).
 */
export default function Preloader() {
  const { mode, done } = useIntro();
  if (mode === 'none' || done) return null;
  return <PreloaderInner mode={mode} />;
}

function PreloaderInner({ mode }) {
  const { cueHero, finish } = useIntro();
  const { lenis } = useMotion();
  const root = useRef(null);
  // o Lenis é criado depois do primeiro paint: guardar sempre a instância mais recente
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;
  const running = useRef(true);
  useEffect(() => { if (lenis && running.current) lenis.stop(); }, [lenis]);
  const [symbolSize] = useState(() => Math.round(Math.min(150, Math.max(96, window.innerWidth * 0.3))));

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const navLogo = document.querySelector('[data-nav-logo]');
    const navItems = document.querySelectorAll('[data-nav-item]');
    const navSymbol = navLogo?.querySelector('.logo-symbol');
    const navWm = navLogo?.querySelector('.logo-wm');
    const symbol = q('.pre-symbol .logo-symbol')[0];
    const wm = q('.pre-wm .logo-wm')[0];
    const cells = q('.pre-symbol [data-logo-cell]:not([data-role="core"])');
    const core = q('.pre-symbol [data-role="core"]');
    const chars = q('.pre-wm [data-wm-char]');
    const bg = q('.pre-bg');
    const count = q('.pre-count span')[0];

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    running.current = true;
    lenisRef.current?.stop();

    // estado inicial da navbar (antes do primeiro paint: sem flash)
    gsap.set(navLogo, { autoAlpha: 0 });
    gsap.set(navItems, { autoAlpha: 0, y: -24 });

    let finished = false;
    const end = () => {
      if (finished) return;
      finished = true;
      running.current = false;
      gsap.set(navLogo, { autoAlpha: 1 });
      lenisRef.current?.start();
      finish();
      // o símbolo da navbar monta-se losango a losango, e os links entram um a um
      gsap.fromTo(navLogo?.querySelectorAll('[data-logo-cell]') ?? [], { scale: 0.35 }, {
        scale: 1, duration: 0.6, ease: 'back.out(2.2)', transformOrigin: '50% 50%', stagger: { each: 0.03, from: 'center' },
      });
    };

    const fly = (tl, at, duration) => {
      tl.set(q('.pre-wm'), { overflow: 'visible' }, at);
      if (navSymbol && symbol) tl.add(Flip.fit(symbol, navSymbol, { scale: true, duration, ease: 'badiu' }), at);
      if (navWm && wm) tl.add(Flip.fit(wm, navWm, { scale: true, duration, ease: 'badiu' }), at + 0.04);
    };
    const closeBg = (tl, at, duration) => tl.to(bg, {
      clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)', duration, ease: 'expo.inOut',
    }, at);
    const enterNav = (tl, at) => tl.to(navItems, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06 }, at);

    const tl = gsap.timeline({ onComplete: end });

    if (mode === 'full') {
      const counter = { v: 0 };
      tl.from(cells, {
        x: () => gsap.utils.random(-110, 110),
        y: () => gsap.utils.random(-90, 90),
        rotation: () => gsap.utils.random(-180, 180),
        scale: 0, opacity: 0, duration: 1.1, ease: 'expo.out', transformOrigin: '50% 50%',
        stagger: { each: 0.045, from: 'random' },
      }, 0)
        .to(counter, {
          v: 100, duration: 1.6, ease: 'power2.inOut',
          onUpdate: () => { if (count) count.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
        }, 0)
        .from(core, { scale: 0, rotation: 90, duration: 0.6, ease: 'back.out(3)', transformOrigin: '50% 50%' }, 0.85)
        .to(core, { scale: 1.35, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 1.4)
        .from(chars, { yPercent: 110, duration: 0.7, ease: 'expo.out', stagger: 0.05 }, 1.1)
        .to(q('.pre-count'), { autoAlpha: 0, duration: 0.3 }, 1.65);
      // pausa de ~0.4s com o logo completo antes de voar para a navbar
      fly(tl, 2.15, 0.9);
      closeBg(tl, 2.2, 0.85);
      tl.call(cueHero, null, 2.45);
      enterNav(tl, 2.65);
      tl.timeScale(0.75); // ritmo mais calmo: ~4s até o fundo abrir
    } else {
      // versão curta: o logo já está montado, só pulsa e voa
      tl.to(core, { scale: 1.35, duration: 0.16, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 0.05);
      fly(tl, 0.3, 0.8);
      closeBg(tl, 0.3, 0.75);
      tl.call(cueHero, null, 0.5);
      enterNav(tl, 0.7);
      tl.timeScale(0.85);
    }

    // segurança: nunca deixar o site preso atrás do preloader
    const safety = setTimeout(() => { tl.progress(1); end(); }, 9000);
    return () => { clearTimeout(safety); running.current = false; lenisRef.current?.start(); };
  }, { scope: root });

  return (
    <div ref={root} className="pre" aria-hidden="true">
      <div className="pre-bg" />
      <div className="pre-stage">
        <div className="pre-symbol">
          <Logo variant="symbol" size={symbolSize} theme="auto" decorative />
        </div>
        <div className="pre-wm">
          <Logo variant="wordmark" size={Math.round(symbolSize * 0.48)} decorative />
        </div>
      </div>
      {mode === 'full' && <div className="pre-count t-label"><span>000</span></div>}
    </div>
  );
}
