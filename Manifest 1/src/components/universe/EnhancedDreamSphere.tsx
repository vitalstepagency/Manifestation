import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text, Trail } from '@react-three/drei';
import * as THREE from 'three';

interface EnhancedDreamSphereProps {
  position: [number, number, number];
  size: number;
  color: string;
  glow: number;
  progress: number; // 0-100
  title: string;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}

/**
 * EnhancedDreamSphere - A visually stunning 3D dream sphere
 *
 * Features:
 * - Orbiting particle trails that respond to progress
 * - Dynamic glow intensity based on progress
 * - Pulsing animation synchronized with progress
 * - Progress-based visual evolution
 * - Bloom effect for extra luminosity
 * - Smooth transitions
 */
export default function EnhancedDreamSphere({
  position,
  size,
  color,
  glow,
  progress,
  title,
  isSelected,
  isHovered,
  onClick,
  onPointerOver,
  onPointerOut
}: EnhancedDreamSphereProps) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Group>(null);

  // Calculate visual properties based on progress
  const visualState = useMemo(() => {
    const normalizedProgress = progress / 100;

    return {
      // Size grows slightly with progress
      sizeMultiplier: 1 + (normalizedProgress * 0.3),

      // Glow intensifies with progress
      glowMultiplier: 1 + (normalizedProgress * 1.5),

      // Pulse speed increases with progress
      pulseSpeed: 1 + (normalizedProgress * 2),

      // Particle count based on progress
      particleCount: Math.floor(8 + (normalizedProgress * 12)), // 8-20 particles

      // Rotation speed based on progress
      rotationSpeed: 0.5 + (normalizedProgress * 1),

      // Color intensity
      emissiveIntensity: glow * (1 + normalizedProgress * 0.5)
    };
  }, [progress, glow]);

  // Create particle positions in orbit
  const particlePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const radius = size * 1.5;

    for (let i = 0; i < visualState.particleCount; i++) {
      const angle = (i / visualState.particleCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle * 0.5) * radius * 0.5;
      const z = Math.sin(angle) * radius;
      positions.push([x, y, z]);
    }

    return positions;
  }, [size, visualState.particleCount]);

  // Animation loop
  useFrame((state) => {
    if (!sphereRef.current || !particlesRef.current) return;

    const time = state.clock.elapsedTime;

    // Gentle pulsing based on progress
    const pulseFactor = 1 + Math.sin(time * visualState.pulseSpeed) * 0.08;
    sphereRef.current.scale.setScalar(pulseFactor * visualState.sizeMultiplier);

    // Rotate particles around sphere
    particlesRef.current.rotation.y = time * visualState.rotationSpeed * 0.3;
    particlesRef.current.rotation.x = Math.sin(time * 0.2) * 0.3;

    // Enhanced glow when hovered or selected
    if (sphereRef.current.material && 'emissiveIntensity' in sphereRef.current.material) {
      const targetIntensity = (isHovered || isSelected)
        ? visualState.emissiveIntensity * 2
        : visualState.emissiveIntensity;

      sphereRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        sphereRef.current.material.emissiveIntensity as number,
        targetIntensity as number,
        0.1
      );
    }
  });

  return (
    <group position={position}>
      {/* Main dream sphere */}
      <Sphere
        ref={sphereRef}
        args={[size, 64, 64]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={visualState.emissiveIntensity}
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </Sphere>

      {/* Dynamic point light for glow */}
      <pointLight
        position={[0, 0, 0]}
        color={color}
        intensity={visualState.glowMultiplier * 3}
        distance={size * 8}
        decay={2}
      />

      {/* Orbiting particles with trails */}
      <group ref={particlesRef}>
        {particlePositions.map((pos, index) => (
          <Trail
            key={index}
            width={0.1}
            length={3}
            color={color}
            attenuation={(t) => t * t}
          >
            <mesh position={pos}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={2}
                toneMapped={false}
              />
            </mesh>
          </Trail>
        ))}
      </group>

      {/* Outer glow ring (appears more at higher progress) */}
      {progress > 25 && (
        <mesh>
          <ringGeometry args={[size * 1.2, size * 1.4, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1 + (progress / 100) * 0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Label when hovered or selected */}
      {(isHovered || isSelected) && (
        <Text
          position={[0, size + 0.6, 0]}
          fontSize={0.35}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {title}
        </Text>
      )}

      {/* Progress percentage indicator */}
      {(isHovered || isSelected) && progress > 0 && (
        <Text
          position={[0, size + 1.0, 0]}
          fontSize={0.25}
          color={color}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {progress}%
        </Text>
      )}
    </group>
  );
}
