/**
 * ParticleField - Interactive 3D Particle System for Manifestations
 *
 * Features:
 * - Beautiful particle system using Three.js
 * - Mouse interaction (particles react to cursor)
 * - Color-coded by manifestation energy
 * - Smooth, performant animations
 */

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================================================
// TYPES
// ============================================================================

interface ParticleFieldProps {
  /** Number of particles (default: 1000) */
  particleCount?: number;

  /** Particle color */
  color?: string;

  /** Secondary color for gradient effect */
  color2?: string;

  /** Particle size */
  size?: number;

  /** Enable mouse interaction */
  interactive?: boolean;

  /** Animation speed multiplier */
  speed?: number;

  /** Canvas height */
  height?: string;

  /** className for wrapper */
  className?: string;
}

// ============================================================================
// PARTICLE SYSTEM COMPONENT
// ============================================================================

const Particles: React.FC<{
  count: number;
  color: string;
  color2: string;
  size: number;
  interactive: boolean;
  speed: number;
}> = ({ count, color, color2, size, interactive, speed }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  // Generate particle positions
  const particlesGeometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    const color1 = new THREE.Color(color);
    const color2obj = new THREE.Color(color2);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random positions in a sphere
      const radius = 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

      // Gradient colors
      const mixRatio = Math.random();
      const mixedColor = color1.clone().lerp(color2obj, mixRatio);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    return geometry;
  }, [count, color, color2]);

  // Animation loop
  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position;
    const velocities = pointsRef.current.geometry.attributes.velocity as THREE.BufferAttribute;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Apply velocity
      positions.array[i3] += velocities.array[i3] * speed;
      positions.array[i3 + 1] += velocities.array[i3 + 1] * speed;
      positions.array[i3 + 2] += velocities.array[i3 + 2] * speed;

      // Mouse interaction
      if (interactive) {
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;

        const dx = positions.array[i3] - mouseX;
        const dy = positions.array[i3 + 1] - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Repel from mouse
        if (distance < 2) {
          const force = (2 - distance) * 0.01;
          velocities.array[i3] += (dx / distance) * force;
          velocities.array[i3 + 1] += (dy / distance) * force;
        }
      }

      // Apply drag
      velocities.array[i3] *= 0.98;
      velocities.array[i3 + 1] *= 0.98;
      velocities.array[i3 + 2] *= 0.98;

      // Keep particles in bounds
      const radius = 5;
      const distanceFromCenter = Math.sqrt(
        positions.array[i3] ** 2 +
        positions.array[i3 + 1] ** 2 +
        positions.array[i3 + 2] ** 2
      );

      if (distanceFromCenter > radius) {
        velocities.array[i3] *= -0.5;
        velocities.array[i3 + 1] *= -0.5;
        velocities.array[i3 + 2] *= -0.5;
      }
    }

    positions.needsUpdate = true;

    // Rotate the entire system slowly
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05 * speed;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03 * speed) * 0.2;
  });

  return (
    <points ref={pointsRef} geometry={particlesGeometry}>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ParticleField: React.FC<ParticleFieldProps> = ({
  particleCount = 1000,
  color = '#8B5CF6',
  color2 = '#EC4899',
  size = 0.05,
  interactive = true,
  speed = 1,
  height = '400px',
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Ambient light */}
        <ambientLight intensity={0.5} />

        {/* Particle system */}
        <Particles
          count={particleCount}
          color={color}
          color2={color2}
          size={size}
          interactive={interactive}
          speed={speed}
        />
      </Canvas>
    </div>
  );
};

// ============================================================================
// PRESET VARIANTS
// ============================================================================

/**
 * Manifestation energy visualization
 */
export const ManifestationParticles: React.FC<{
  energy?: 'low' | 'medium' | 'high';
  className?: string;
}> = ({ energy = 'medium', className }) => {
  const configs = {
    low: {
      particleCount: 500,
      color: '#6366F1',
      color2: '#8B5CF6',
      speed: 0.5,
    },
    medium: {
      particleCount: 1000,
      color: '#8B5CF6',
      color2: '#EC4899',
      speed: 1,
    },
    high: {
      particleCount: 2000,
      color: '#EC4899',
      color2: '#F59E0B',
      speed: 1.5,
    },
  };

  const config = configs[energy];

  return <ParticleField {...config} className={className} />;
};

export default ParticleField;
