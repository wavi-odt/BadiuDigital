import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import frag from './shaders/grain.frag.glsl?raw';

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const PALETTES = {
  // castanho raro: o fundo continua a ser noite, só um foco quente e granulado
  noite: { bg: '#0A0A0A', a: '#2A1A10', b: '#5A3520', c: '#A9714A' },
  castanho: { bg: '#120C08', a: '#3A2315', b: '#8A5636', c: '#C99468' },
  // fundo do site: foco muito escuro para manter o contraste do texto (castanho só no pico)
  site: { bg: '#0A0A0A', a: '#1D120B', b: '#2B1A12', c: '#35211A' },
  siteLight: { bg: '#F5F5F2', a: '#EFE7DD', b: '#E6D6C4', c: '#D2B79B' },
  osso: { bg: '#F5F5F2', a: '#E9DFD3', b: '#D9C3AC', c: '#B98B66' },
};

/**
 * Fundo "gratinado": gradiente orgânico com grão por pixel, em WebGL (um só quad, um shader).
 * O brilho acompanha ligeiramente o rato. Pausa fora do ecrã. Cobre o contentor (position: absolute).
 * props: palette (noite | castanho | osso), grain (0.1–0.5), spread (0.3–1), flow (velocidade)
 */
export default function GrainGradient({ palette = 'noite', grain = 0.22, spread = 0.85, flow = 0.05, follow = false, dpr = 1, adaptive = false, center = [0.28, 0.8], className = '' }) {
  const host = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px' });
    io.observe(host.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className={`grainbg ${className}`} aria-hidden="true">
      <Canvas dpr={dpr} frameloop={visible ? 'always' : 'never'} style={{ pointerEvents: 'none' }} gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }} orthographic camera={{ position: [0, 0, 1] }}>
        <Quad palette={PALETTES[palette] ?? PALETTES.noite} grain={grain} spread={spread} flow={flow} follow={follow} center={center} adaptive={adaptive} dprBase={dpr} />
      </Canvas>
    </div>
  );
}

function Quad({ palette, grain, spread, flow, follow, center, adaptive, dprBase }) {
  const { size, gl, setDpr } = useThree();
  const perf = useRef({ t: 0, n: 0, slow: 0, level: 0 });
  const mouse = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const pos = useRef({ x: center[0], y: center[1] });

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: vert, fragmentShader: frag,
    uniforms: {
      uRes: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0.5, 0.5) }, uCenter: { value: new THREE.Vector2(center[0], center[1]) },
      uBg: { value: new THREE.Color() }, uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uC: { value: new THREE.Color() },
      uGrain: { value: grain }, uSpread: { value: spread }, uFlow: { value: flow },
    },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const u = material.uniforms;
    u.uBg.value.set(palette.bg); u.uA.value.set(palette.a); u.uB.value.set(palette.b); u.uC.value.set(palette.c);
    u.uGrain.value = grain; u.uSpread.value = spread; u.uFlow.value = flow;
  }, [material, palette, grain, spread, flow]);

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    const el = gl.domElement.closest('section') || gl.domElement.parentElement;
    const move = (e) => {
      const r = gl.domElement.getBoundingClientRect();
      mouse.current.tx = (e.clientX - r.left) / r.width;
      mouse.current.ty = 1 - (e.clientY - r.top) / r.height;
    };
    el.addEventListener('pointermove', move, { passive: true });
    return () => el.removeEventListener('pointermove', move);
  }, [gl]);

  useFrame(({ clock }, delta) => {
    const m = mouse.current, u = material.uniforms;
    // resolução adaptativa: se a média de 90 frames passar de ~26 ms (< 38 fps), baixa a resolução
    // (até 2 níveis). Ignora os primeiros frames (arranque) e frames muito longos (separador em 2.º plano).
    if (adaptive && delta < 0.25 && clock.elapsedTime > 1.5) {
      const q = perf.current;
      q.t += delta; q.n += 1;
      if (q.n === 90) {
        q.slow = q.t / q.n > 0.026 ? q.slow + 1 : 0;
        if (q.slow >= 2 && q.level < 2) { q.level += 1; q.slow = 0; setDpr(Math.max(0.35, dprBase * (q.level === 1 ? 0.7 : 0.5))); }
        q.t = 0; q.n = 0;
      }
    }
    if (follow) {
      // o foco desce pela página (e passeia em x) conforme o scroll
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pr = Math.min(1, Math.max(0, window.scrollY / max));
      const tx = 0.22 + 0.56 * (0.5 + 0.5 * Math.sin(pr * Math.PI * 3.2));
      const ty = 0.86 - 0.72 * pr;
      pos.current.x += (tx - pos.current.x) * 0.05; pos.current.y += (ty - pos.current.y) * 0.05;
      u.uCenter.value.set(pos.current.x, pos.current.y);
    }
    m.x += (m.tx - m.x) * 0.04; m.y += (m.ty - m.y) * 0.04;
    u.uTime.value = clock.elapsedTime;
    u.uMouse.value.set(m.x, m.y);
    u.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
