import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DreamPlatformProps {
  progress: number; // 0-100
  color: string;
  size: number; // base radius
  position: [number, number, number];
  isSelected?: boolean;
  isHovered?: boolean;
}

/**
 * DreamPlatform - Glowing cylindrical base with progress ring
 *
 * Features:
 * - Glowing cylinder base that pulses
 * - Progress ring (torus) that fills around base (0-100%)
 * - Rising particle emitter
 * - Scales with progress (0.8x → 1.3x)
 * - Color-coded by category
 */
export default function DreamPlatform({
  progress,
  color,
  size,
  position,
  isSelected = false,
  isHovered = false
}: DreamPlatformProps) {
  const platformRef = useRef<THREE.Mesh>(null);
  const progressRingRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Group>(null);

  // Calculate scale based on progress (0.8x at 0%, 1.3x at 100%)
  const progressScale = useMemo(() => {
    return 0.8 + (progress / 100) * 0.5;
  }, [progress]);

  // Create particles for rising effect
  const particles = useMemo(() => {
    const particleCount = 12;
    const positions: [number, number, number][] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = size * 0.7;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (i / particleCount) * 3; // Stagger heights
      positions.push([x, y, z]);
    }

    return positions;
  }, [size]);

  // Progress ring geometry (only show filled portion)
  const progressAngle = useMemo(() => {
    return (progress / 100) * Math.PI * 2;
  }, [progress]);

  // Animation loop
  useFrame((state) => {
    if (!platformRef.current || !progressRingRef.current || !particlesRef.current) return;

    const time = state.clock.elapsedTime;

    // Pulsing glow effect
    const pulseFactor = 1 + Math.sin(time * 2) * 0.15;
    if (platformRef.current.material && 'emissiveIntensity' in platformRef.current.material) {
      const baseIntensity = (isHovered || isSelected) ? 2 : 1;
      platformRef.current.material.emissiveIntensity = baseIntensity * pulseFactor;
    }

    // Progress ring pulse
    if (progressRingRef.current.material && 'emissiveIntensity' in progressRingRef.current.material) {
      progressRingRef.current.material.emissiveIntensity = 1.5 * pulseFactor;
    }

    // Rising particles animation
    particlesRef.current.children.forEach((particle, i) => {
      const offset = i * 0.3;
      const yOffset = ((time * 0.5 + offset) % 3);
      particle.position.y = yOffset;

      // Fade out as particles rise
      if (particle instanceof THREE.Mesh && particle.material instanceof THREE.Material) {
        const opacity = 1 - (yOffset / 3);
        if ('opacity' in particle.material) {
          particle.material.opacity = opacity * 0.6;
        }
      }
    });
  });

  return (
    <group position={position}>
      {/* Glowing cylindrical base - taller and more visible */}
      <mesh ref={platformRef} scale={[progressScale, 1, progressScale]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[size, size * 1.1, 0.4, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          metalness={0.8}
          roughness={0.2}
          transparent={false}
          opacity={1}
        />
      </mesh>

      {/* Progress ring (torus around base) */}
      {progress > 0 && (
        <mesh
          ref={progressRingRef}
          position={[0, 0.11, 0]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          scale={[progressScale, progressScale, 1]}
        >
          <torusGeometry
            args={[
              size * 1.15, // radius
              0.04, // tube thickness
              16, // radial segments
              100, // tubular segments
              progressAngle // arc length (progress)
            ]}
          />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Progress percentage indicator (ring light) */}
      {progress > 0 && (
        <mesh position={[0, 0.11, 0]}>
          <ringGeometry args={[size * 1.1, size * 1.2, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1 + (progress / 100) * 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Point light for glow effect */}
      <pointLight
        position={[0, 0.2, 0]}
        color={color}
        intensity={1.5 * progressScale}
        distance={size * 8}
        decay={2}
      />

      {/* Rising particles */}
      <group ref={particlesRef}>
        {particles.map((pos, index) => (
          <mesh key={index} position={pos}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.6}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
