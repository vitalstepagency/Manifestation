import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

/**
 * StarfieldBackground - Immersive deep space environment
 *
 * Features:
 * - 5000 stars with realistic distribution
 * - Slow rotation for depth perception
 * - Nebula fog for atmosphere
 * - Performance-optimized rendering
 */
export default function StarfieldBackground() {
  const starsRef = useRef<THREE.Points>(null);

  // Slow rotation for subtle movement
  useFrame((state, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.x += delta * 0.01;
      starsRef.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <>
      {/* Main starfield - dense and immersive */}
      <Stars
        ref={starsRef}
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade={true}
        speed={0.5}
      />

      {/* Atmospheric fog for depth */}
      <fog attach="fog" args={['#0a0a1a', 30, 100]} />

      {/* Ambient purple glow */}
      <ambientLight intensity={0.2} color="#8b5cf6" />

      {/* Directional light for dream spheres */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        color="#ffffff"
      />

      {/* Fill light from opposite side */}
      <directionalLight
        position={[-10, -10, -5]}
        intensity={0.2}
        color="#a78bfa"
      />
    </>
  );
}
