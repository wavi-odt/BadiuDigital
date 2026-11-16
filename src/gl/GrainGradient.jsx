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
  osso: { bg: '#F5F5F2', a: '#E9DFD3', b: '#D9C3AC', c: '#B98B66' },
};

/**
 * Fundo "gratinado": gradiente orgânico com grão por pixel, em WebGL (um só quad, um shader).
 * O brilho acompanha ligeiramente o rato. Pausa fora do ecrã. Cobre o contentor (position: absolute).
 * props: palette (noite | castanho | osso), grain (0.1–0.5), spread (0.3–1), flow (velocidade)
 */
export default function GrainGradient({ palette = 'noite', grain = 0.22, spread = 0.85, flow = 0.05, className = '' }) {
  const host = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px' });
    io.observe(host.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className={`grainbg ${className}`} aria-hidden="true">
      <Canvas dpr={1} frameloop={visible ? 'always' : 'never'} style={{ pointerEvents: 'none' }} gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }} orthographic camera={{ position: [0, 0, 1] }}>
        <Quad palette={PALETTES[palette] ?? PALETTES.noite} grain={grain} spread={spread} flow={flow} />
      </Canvas>
    </div>
  );
}

function Quad({ palette, grain, spread, flow }) {
  const { size, gl } = useThree();
  const mouse = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: vert, fragmentShader: frag,
    uniforms: {
      uRes: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0.5, 0.5) },
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

  useFrame(({ clock }) => {
    const m = mouse.current, u = material.uniforms;
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
