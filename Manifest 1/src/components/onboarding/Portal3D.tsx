/**
 * Portal3D - Manifestation Portal
 *
 * Their words literally becoming reality
 * Text explodes into particles that form their universe
 */

import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Center, Environment, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

interface Portal3DProps {
  onComplete?: () => void;
  archetype: {
    emoji: string;
    gradient: string[];
    title: string;
  };
  duration?: number;
  manifestationGoal?: string;
}

// The user's manifestation text that explodes into reality
const ManifestationText = ({ text, onExplode }: { text: string; onExplode: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    // After 1 second, explode the text
    const timer = setTimeout(() => {
      setExploded(true);
      onExplode();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onExplode]);

  useFrame((state) => {
    if (meshRef.current && !exploded) {
      // Gentle floating before explosion
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  if (exploded) return null;

  return (
    <Center>
      <Text
        ref={meshRef}
        fontSize={0.8}
        maxWidth={8}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {text}
        <meshStandardMaterial
          color="white"
          emissive="#fbbf24"
          emissiveIntensity={0.5}
          toneMapped={false}
        />
      </Text>
    </Center>
  );
};

// Particles that form into dream shapes
const DreamParticles = ({ active, stage }: { active: boolean; stage: number }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const [phase, setPhase] = useState<'scattered' | 'forming' | 'formed'>('scattered');
  const [finalFormation, setFinalFormation] = useState(false);

  useEffect(() => {
    if (active) {
      console.log('🦋 Particles activated - forming butterfly');
      setTimeout(() => {
        console.log('🦋 Phase: forming');
        setPhase('forming');
      }, 200);
      setTimeout(() => {
        console.log('🦋 Phase: formed - butterfly complete');
        setPhase('formed');
      }, 1000); // Butterfly fully formed by 1s
    }
  }, [active]);

  // Lock particles when stage 2 is reached
  useEffect(() => {
    if (stage === 2 && phase === 'formed') {
      console.log('🔒 Locking butterfly in final formation');
      setFinalFormation(true);
    }
  }, [stage, phase]);

  const particleCount = 5000;

  const { positions, targetPositions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const target = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Random scatter (explosion)
      pos[i] = (Math.random() - 0.5) * 20;
      pos[i + 1] = (Math.random() - 0.5) * 20;
      pos[i + 2] = (Math.random() - 0.5) * 20;

      // Form into spherical dream cloud
      const angle = (i / 3) * 0.01;
      const radius = 3 + Math.sin(angle * 5) * 2;
      target[i] = Math.cos(angle) * radius;
      target[i + 1] = Math.sin(angle * 3) * 2;
      target[i + 2] = Math.sin(angle) * radius;

      // Golden colors
      col[i] = 1;
      col[i + 1] = 0.7 + Math.random() * 0.3;
      col[i + 2] = 0.1;
    }

    return { positions: pos, targetPositions: target, colors: col };
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;

    // STOP all position updates when locked in final formation
    if (finalFormation) {
      return;
    }

    const posAttribute = particlesRef.current.geometry.attributes.position;

    if (phase === 'forming') {
      // Lerp to target positions
      for (let i = 0; i < particleCount * 3; i++) {
        posAttribute.array[i] += (targetPositions[i] - posAttribute.array[i]) * 0.05;
      }
      posAttribute.needsUpdate = true;
    } else if (phase === 'formed') {
      // Gentle pulsing rotation (but will be locked when finalFormation is true)
      const time = Date.now() * 0.0001;
      for (let i = 0; i < particleCount * 3; i += 3) {
        const x = posAttribute.array[i];
        const z = posAttribute.array[i + 2];
        const angle = 0.005;
        posAttribute.array[i] = x * Math.cos(angle) - z * Math.sin(angle);
        posAttribute.array[i + 2] = x * Math.sin(angle) + z * Math.cos(angle);

        // Gentle pulsing
        const scale = 1 + Math.sin(time + i * 0.01) * 0.05;
        posAttribute.array[i] *= scale;
        posAttribute.array[i + 1] *= scale;
        posAttribute.array[i + 2] *= scale;
      }
      posAttribute.needsUpdate = true;
    }
  });

  if (!active) return null;

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// The universe being born - stars appearing
const UniverseFormation = ({ active }: { active: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [stars] = useState(() => {
    return [...Array(200)].map(() => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      ] as [number, number, number],
      size: Math.random() * 0.1 + 0.05
    }));
  });

  useFrame((state) => {
    if (groupRef.current && active) {
      groupRef.current.rotation.y += 0.001;
      // Subtle breathing
      const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.02;
      groupRef.current.scale.set(scale, scale, scale);
    }
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {stars.map((star, i) => (
        <Sphere key={i} position={star.position} args={[star.size, 8, 8]}>
          <meshBasicMaterial color="white" toneMapped={false} />
        </Sphere>
      ))}
    </group>
  );
};

export const Portal3D = ({
  archetype,
  duration = 4000,
  onComplete,
  manifestationGoal = "I will manifest my dreams"
}: Portal3DProps) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [isComplete, setIsComplete] = useState(false);

  // Shorten text if too long for display
  const displayText = manifestationGoal.length > 60
    ? manifestationGoal.slice(0, 57) + "..."
    : manifestationGoal;

  // Main animation sequence
  useEffect(() => {
    if (isComplete) return; // Prevent re-running

    console.log('🌟 PORTAL MOUNTED - Starting manifestation sequence');
    console.log('💭 Goal:', manifestationGoal);
    console.log('⏱️  Total duration: 4000ms');

    const timers = [];

    // Stage 0: Show text (1.25s)
    timers.push(setTimeout(() => {
      console.log('Stage 0→1: Text fading (1.25s)');
      setStage(1);
    }, 1250));

    // Stage 1: Particles form butterfly (at 1.5s total)
    timers.push(setTimeout(() => {
      console.log('Stage 1→2: Butterfly forming (1.5s)');
      setStage(2);
    }, 1500));

    // Stage 2: Butterfly STAYS visible, navigate after delay
    timers.push(setTimeout(() => {
      setIsComplete(true);
      console.log('🦋 BUTTERFLY ANIMATION COMPLETE (4s)');

      if (onComplete) {
        console.log('🎯 Portal: onComplete callback provided - calling it now');
        try {
          onComplete();
          console.log('✅ Portal: onComplete callback executed successfully');
        } catch (error) {
          console.error('❌ Portal: onComplete callback threw error:', error);
        }
      } else {
        console.log('🎯 Portal: No onComplete callback - using internal navigation');
        navigate('/dashboard', {
          replace: true,
          state: {
            manifestationGoal,
            archetype,
            firstTime: true
          }
        });
        console.log('✅ Portal: Internal navigation to dashboard called');
      }
    }, duration));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isComplete, duration, onComplete, navigate, manifestationGoal, archetype]);

  // Safety fallback - force navigate after 6 seconds no matter what
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!isComplete) {
        console.warn('⚠️ FALLBACK NAVIGATION TRIGGERED (6s) - redirecting to dashboard');
        setIsComplete(true);
        navigate('/dashboard', { replace: true });
      }
    }, 6000);

    return () => clearTimeout(fallback);
  }, [isComplete, navigate]);

  return (
    <div className="fixed inset-0 bg-black">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Environment preset="night" />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#fbbf24" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />

        {/* Particles form butterfly */}
        <DreamParticles active={stage === 1 || stage === 2} stage={stage} />

        {/* Post-processing for magic */}
        <EffectComposer>
          <Bloom
            intensity={2}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>

      {/* Overlay UI - Text only rendered here (not in 3D) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Stage 0: ONLY manifestation goal with clean golden gradient */}
        {stage === 0 && (
          <h1
            key="manifestation-text"
            className="font-bold text-white text-center leading-tight px-8 max-w-4xl"
            style={{
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              padding: '0 20px'
            }}
          >
            {displayText}
          </h1>
        )}

        {/* Stage 2: Butterfly with "Manifest creates reality" text */}
        {stage === 2 && (
          <div className="text-center animate-fadeIn">
            <h2 className="text-4xl font-light text-white">
              Manifest creates reality
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portal3D;
