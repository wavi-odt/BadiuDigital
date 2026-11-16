import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import frag from './shaders/preview.frag.glsl?raw';

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

/**
 * Imagem do cartão de preview dos projetos com shader de distorção RGB + ondulação
 * que dependem da velocidade do rato. `state` é mutável: { src, color, velocity, dirX, dirY }.
 */
export default function PreviewCard({ state }) {
  return (
    <Canvas dpr={[1, 2]} frameloop="always" style={{ pointerEvents: 'none' }} gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }} orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
      <Plane state={state} />
    </Canvas>
  );
}

function Plane({ state }) {
  const { viewport } = useThree();
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: vert, fragmentShader: frag,
    uniforms: {
      uMap: { value: null }, uTime: { value: 0 }, uVelocity: { value: 0 }, uDir: { value: new THREE.Vector2(1, 0) },
      uHasMap: { value: 0 }, uColor: { value: new THREE.Color('#1A1A1A') },
    },
  }), []);
  const loader = useMemo(() => new THREE.TextureLoader(), []);
  const cache = useRef(new Map());
  const current = useRef(null);

  useEffect(() => () => { cache.current.forEach((tx) => tx.dispose()); material.dispose(); }, [material]);

  useFrame(({ clock }) => {
    const u = material.uniforms;
    u.uTime.value = clock.elapsedTime;
    u.uVelocity.value += (state.velocity - u.uVelocity.value) * 0.1;
    u.uDir.value.set(state.dirX, state.dirY);
    u.uColor.value.set(state.color || '#1A1A1A');

    if (state.src !== current.current) {
      current.current = state.src;
      if (!state.src) { u.uMap.value = null; u.uHasMap.value = 0; return; }
      const tx = cache.current.get(state.src);
      if (tx) { u.uMap.value = tx; u.uHasMap.value = 1; return; }
      u.uHasMap.value = 0;
      loader.load(state.src, (loaded) => {
        loaded.colorSpace = THREE.SRGBColorSpace;
        cache.current.set(state.src, loaded);
        if (current.current === state.src) { u.uMap.value = loaded; u.uHasMap.value = 1; }
      });
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
