import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, Vignette } from '@react-three/postprocessing';
import { Environment, Float, Sparkles, MeshTransmissionMaterial, useTexture } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicTransitionProps {
  from?: string;
  to?: string;
  onComplete?: () => void;
  duration?: number;
  archetype?: {
    emoji: string;
    title: string;
    gradient: string[];
  };
}

/**
 * Animated 3D Geometry Orb
 * Cinema-quality morphing sphere with distortion effects
 */
function AnimatedOrb({ archetype }: { archetype?: { gradient: string[] } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth rotation
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.005;

      // Pulsing scale
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[2.5, 5]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={5}
          thickness={2}
          roughness={0}
          transmission={0.95}
          ior={1.5}
          chromaticAberration={0.8}
          anisotropy={1}
          distortion={0.5}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color={archetype?.gradient?.[0] || '#8B5CF6'}
        />
      </mesh>
    </Float>
  );
}

/**
 * Orbiting Particles System
 * High-performance particle field with custom behaviors
 */
function ParticleOrbit() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Cinema-Quality Page Transition Component
 * Rivals production-quality animation studios with post-processing effects
 */
export function CinematicTransition({
  from,
  to,
  onComplete,
  duration = 3000,
  archetype
}: CinematicTransitionProps) {
  const [exiting, setExiting] = useState(false);

  // Auto-complete after duration
  useState(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, duration);
    return () => clearTimeout(timer);
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50"
      >
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          {/* Volumetric atmospheric fog */}
          <fog attach="fog" args={['#0a0a0a', 5, 30]} />

          {/* Dynamic lighting setup */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#8B5CF6" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#EC4899" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={2}
            castShadow
            color="#ffffff"
          />

          {/* Main animated geometry */}
          <AnimatedOrb archetype={archetype} />

          {/* Particle system orbiting the main orb */}
          <ParticleOrbit />

          {/* Additional sparkles for depth */}
          <Sparkles
            count={200}
            scale={15}
            size={1.5}
            speed={0.4}
            opacity={0.6}
            color="#ffffff"
          />

          {/* HDR Environment for realistic reflections */}
          <Environment preset="sunset" blur={0.8} />

          {/* Cinema-quality post-processing effects */}
          <EffectComposer>
            {/* Bloom for glowing effects */}
            <Bloom
              luminanceThreshold={0.2}
              intensity={2.5}
              levels={9}
              mipmapBlur
            />

            {/* Chromatic aberration for cinematic feel */}
            <ChromaticAberration
              offset={[0.002, 0.001]}
              radialModulation
              modulationOffset={0.5}
            />

            {/* Depth of field for focus effects */}
            <DepthOfField
              focusDistance={0.01}
              focalLength={0.05}
              bokehScale={3}
              height={700}
            />

            {/* Vignette for cinematic framing */}
            <Vignette
              offset={0.3}
              darkness={0.9}
              eskil={false}
            />
          </EffectComposer>
        </Canvas>

        {/* Overlay UI */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {archetype && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="text-8xl mb-6"
              >
                {archetype.emoji}
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-4xl font-bold text-white mb-2"
                style={{
                  textShadow: '0 0 30px rgba(139, 92, 246, 0.8)'
                }}
              >
                {archetype.title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-xl text-purple-200 tracking-widest uppercase"
              >
                ENTERING YOUR NEW REALITY
              </motion.p>
            </motion.div>
          )}

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-20"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
              style={{
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Page Transition Wrapper
 * Use this to wrap route changes for cinematic transitions
 */
export function PageTransition({
  children,
  show = true,
  archetype
}: {
  children: React.ReactNode;
  show?: boolean;
  archetype?: CinematicTransitionProps['archetype'];
}) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CinematicTransition;
