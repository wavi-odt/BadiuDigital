import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import vert from './shaders/cloth.vert.glsl?raw';
import frag from './shaders/cloth.frag.glsl?raw';
import { useMediaQuery } from '@/motion/useMediaQuery';

/**
 * Pano de losangos em WebGL (instancing): uma grelha que ondula com ruído no vertex shader,
 * reage ao rato (foge ou é atraída, cresce perto, alguns losangos aquecem para castanho)
 * e tem luz que segue o cursor.
 *
 * params (objeto mutável, animado por fora com GSAP sem re-render):
 *   amp (1), drift (0), zoom (1), agitation (0)
 * pull: +1 foge do rato (hero), -1 atraído (CTA)
 * Pausa fora do ecrã (IntersectionObserver) e usa dpr [1, 2]. Em mobile, menos losangos.
 */
export default function ClothField({ params, pull = 1, warmRate = 0.16, radius = 4.2, className = '', style, theme = 'dark' }) {
  const host = useRef(null);
  const [visible, setVisible] = useState(true);
  const mobile = useMediaQuery('(max-width: 899px)');

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '80px' });
    io.observe(host.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className={`cloth ${className}`} style={style} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        frameloop={visible ? 'always' : 'never'}
        style={{ pointerEvents: 'none' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}
        camera={{ position: [0, 0, 14], fov: 45, near: 0.1, far: 60 }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        resize={{ debounce: 120 }}
      >
        <Diamonds params={params} pull={pull} warmRate={warmRate} radius={radius} mobile={mobile} theme={theme} />
      </Canvas>
    </div>
  );
}

const COLORS = {
  dark: { color: '#F5F5F2', warm: '#A9714A', bg: '#0A0A0A', baseAlpha: 0.06 },
  light: { color: '#1A1A1A', warm: '#5A3520', bg: '#F5F5F2', baseAlpha: 0.08 },
};

function Diamonds({ params, pull, warmRate, radius, mobile, theme }) {
  const mesh = useRef(null);
  const { viewport, size } = useThree();
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0, on: 0, ton: 0 });

  // grelha: cobre o viewport com folga (o zoom da câmara e a deriva mostram as margens)
  const grid = useMemo(() => {
    const step = mobile ? 0.62 : 0.5;
    const w = viewport.width * 1.35 + 2;
    const h = viewport.height * 1.35 + 2;
    const cols = Math.ceil(w / step);
    const rows = Math.ceil(h / (step * 0.62));
    const n = cols * rows;
    const cell = new Float32Array(n * 2);
    const seed = new Float32Array(n);
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cell[i * 2] = (c + (r % 2) * 0.5) * step - w / 2;
        cell[i * 2 + 1] = r * step * 0.62 - h / 2;
        seed[i] = ((c * 73856093) ^ (r * 19349663)) % 1000 / 1000;
        i++;
      }
    }
    return { n, cell, seed, h };
  }, [viewport.width, viewport.height, mobile]);

  const geometry = useMemo(() => {
    const g = new THREE.InstancedBufferGeometry();
    // losango: 4 vértices, 2 triângulos (semi-diagonal 0.25)
    const d = 0.25;
    g.setAttribute('position', new THREE.Float32BufferAttribute([0, d, 0, d, 0, 0, 0, -d, 0, -d, 0, 0], 3));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    g.setAttribute('aCell', new THREE.InstancedBufferAttribute(grid.cell, 2));
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(grid.seed, 1));
    g.instanceCount = grid.n;
    return g;
  }, [grid]);

  const c = COLORS[theme] || COLORS.dark;
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseOn: { value: 0 },
      uAmp: { value: 1 },
      uDrift: { value: 0 },
      uRadius: { value: radius },
      uPull: { value: pull },
      uAgitation: { value: 0 },
      uWarmRate: { value: warmRate },
      uColor: { value: new THREE.Color(c.color) },
      uWarm: { value: new THREE.Color(c.warm) },
      uBg: { value: new THREE.Color(c.bg) },
      uLight: { value: new THREE.Vector3(0, 0, 1) },
      uBaseAlpha: { value: c.baseAlpha },
    },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    material.uniforms.uColor.value.set(c.color);
    material.uniforms.uWarm.value.set(c.warm);
    material.uniforms.uBg.value.set(c.bg);
    material.uniforms.uBaseAlpha.value = c.baseAlpha;
    material.uniforms.uPull.value = pull;
    material.uniforms.uRadius.value = radius;
    material.uniforms.uWarmRate.value = warmRate;
  }, [material, c, pull, radius, warmRate]);

  useEffect(() => () => { geometry.dispose(); }, [geometry]);
  useEffect(() => () => { material.dispose(); }, [material]);

  // rato: ouvir na secção que contém o canvas (o canvas não recebe eventos: pointer-events none)
  const { gl } = useThree();
  useEffect(() => {
    const section = gl.domElement.closest('section') || gl.domElement.parentElement;
    const toWorld = (e) => {
      const r = gl.domElement.getBoundingClientRect();
      const m = mouse.current;
      m.tx = ((e.clientX - r.left) / r.width - 0.5) * viewport.width;
      m.ty = -((e.clientY - r.top) / r.height - 0.5) * viewport.height;
      m.ton = 1;
    };
    const leave = () => { mouse.current.ton = 0; };
    section.addEventListener('pointermove', toWorld, { passive: true });
    section.addEventListener('pointerleave', leave, { passive: true });
    return () => { section.removeEventListener('pointermove', toWorld); section.removeEventListener('pointerleave', leave); };
  }, [gl, viewport.width, viewport.height]);

  const camZ = useRef(14);
  useFrame(({ clock, camera }) => {
    const u = material.uniforms;
    const m = mouse.current;
    m.x += (m.tx - m.x) * 0.08;
    m.y += (m.ty - m.y) * 0.08;
    m.on += (m.ton - m.on) * 0.08;
    u.uTime.value = clock.elapsedTime;
    u.uMouse.value.set(m.x, m.y);
    u.uMouseOn.value = m.on;
    u.uLight.value.set(m.x, m.y, 1);
    u.uAmp.value = params.amp ?? 1;
    u.uDrift.value = ((params.drift ?? 0) % grid.h);
    u.uAgitation.value = params.agitation ?? 0;
    const z = 14 / (params.zoom ?? 1);
    if (Math.abs(z - camZ.current) > 0.001) { camZ.current = z; camera.position.z = z; }
  });

  return <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} />;
}
