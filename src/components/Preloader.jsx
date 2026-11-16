import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/motion/gsap';
import { useIntro } from '@/app/providers/IntroProvider';
import { useMotion } from '@/app/providers/MotionProvider';
import Logo from '@/components/Logo';

/**
 * Preloader (~5s no primeiro carregamento): o logo monta-se e desmonta-se, e depois abre a landing:
 *  1. os 12 losangos entram de posições dispersas e tecem-se na grelha do logo;
 *  2. o núcleo castanho entra por último e pulsa uma vez;
 *  3. o wordmark revela-se carácter a carácter;
 *  4. pausa com o logo completo; depois o núcleo pulsa, os losangos dispersam-se a rodar e o wordmark sobe;
 *  5. o fundo fecha num losango e abre a landing; o símbolo da navbar monta-se e os links entram um a um.
 * Na segunda visita (sessionStorage) corre a versão curta (~2.6s).
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

    const closeBg = (tl, at, duration) => tl.to(bg, {
      clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)', duration, ease: 'expo.inOut',
    }, at);
    const enterNav = (tl, at) => tl.to(navItems, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06 }, at);
    // desmontar: o núcleo pulsa, os losangos dispersam-se a rodar e o wordmark sobe e desaparece
    const disassemble = (tl, at, scale = 1) => {
      tl.to(core, { scale: 1.7, duration: 0.3 * scale, ease: 'power2.out', transformOrigin: '50% 50%' }, at)
        .to(cells, {
          x: () => gsap.utils.random(-170, 170), y: () => gsap.utils.random(-140, 140), rotation: () => gsap.utils.random(-200, 200),
          scale: 0, opacity: 0, duration: 1.0 * scale, ease: 'power3.in', transformOrigin: '50% 50%', stagger: { each: 0.05 * scale, from: 'center' },
        }, at + 0.2 * scale)
        .to(chars, { yPercent: -115, duration: 0.7 * scale, ease: 'power3.in', stagger: 0.05 * scale }, at + 0.2 * scale)
        .to(core, { scale: 0, duration: 0.5 * scale, ease: 'power3.in', transformOrigin: '50% 50%' }, at + 0.95 * scale);
    };

    const tl = gsap.timeline({ onComplete: end });

    if (mode === 'full') {
      // ~5s: monta-se (0–2.8s), pausa com o logo completo, desmonta-se (3.1–4.4s), abre a landing (4.3–5.2s)
      const counter = { v: 0 };
      tl.from(cells, {
        x: () => gsap.utils.random(-130, 130), y: () => gsap.utils.random(-110, 110), rotation: () => gsap.utils.random(-180, 180),
        scale: 0, opacity: 0, duration: 1.5, ease: 'expo.out', transformOrigin: '50% 50%', stagger: { each: 0.07, from: 'random' },
      }, 0)
        .to(counter, {
          v: 100, duration: 2.6, ease: 'power2.inOut',
          onUpdate: () => { if (count) count.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
        }, 0)
        .from(core, { scale: 0, rotation: 90, duration: 0.8, ease: 'back.out(3)', transformOrigin: '50% 50%' }, 1.4)
        .to(core, { scale: 1.35, duration: 0.22, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 2.3)
        .from(chars, { yPercent: 115, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 1.5)
        .to(q('.pre-count'), { autoAlpha: 0, duration: 0.4 }, 2.7);
      disassemble(tl, 3.1);
      closeBg(tl, 4.3, 0.9);
      tl.call(cueHero, null, 4.55);
      enterNav(tl, 4.9);
    } else {
      // versão curta (2.ª visita): monta-se e desmonta-se depressa (~2.6s)
      tl.from(cells, {
        x: () => gsap.utils.random(-130, 130), y: () => gsap.utils.random(-110, 110), rotation: () => gsap.utils.random(-180, 180),
        scale: 0, opacity: 0, duration: 0.8, ease: 'expo.out', transformOrigin: '50% 50%', stagger: { each: 0.035, from: 'random' },
      }, 0)
        .from(core, { scale: 0, rotation: 90, duration: 0.5, ease: 'back.out(3)', transformOrigin: '50% 50%' }, 0.5)
        .from(chars, { yPercent: 115, duration: 0.6, ease: 'expo.out', stagger: 0.05 }, 0.5);
      disassemble(tl, 1.3, 0.7);
      closeBg(tl, 2.0, 0.7);
      tl.call(cueHero, null, 2.2);
      enterNav(tl, 2.4);
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
