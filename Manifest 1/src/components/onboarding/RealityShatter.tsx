/**
 * Reality Shatter Animation
 *
 * The million-dollar transition from countdown zero to achievement screen.
 * 5 phases of pure cinematic brilliance that makes users feel like reality
 * itself is transforming.
 *
 * PHASE 1: THE SINGULARITY (0-300ms)
 * PHASE 2: THE FRACTURE (300-800ms)
 * PHASE 3: THE COLLAPSE (800-1200ms)
 * PHASE 4: THE BIRTH (1200-2000ms)
 * PHASE 5: THE CELEBRATION (2000-3000ms)
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// ============================================================================
// TYPES
// ============================================================================

interface RealityShatterProps {
  /** Trigger the animation */
  isActive: boolean;

  /** Archetype information for colors */
  archetype: {
    emoji: string;
    gradient: [string, string];
    title: string;
  };

  /** Called when animation completes */
  onComplete: () => void;

  /** Achievement details to display */
  achievement: {
    title: string;
    description: string;
    xp: number;
  };
}

interface Shard {
  id: number;
  vertices: { x: number; y: number }[];
  color: string;
  mass: number;
  rotation: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  angularVelocity: number;
  opacity: number;
  depth: number; // For depth of field blur
}

enum Phase {
  IDLE,
  SINGULARITY,
  FRACTURE,
  COLLAPSE,
  BIRTH,
  CELEBRATION
}

// ============================================================================
// COMPONENT
// ============================================================================

export const RealityShatter: React.FC<RealityShatterProps> = ({
  isActive,
  archetype,
  onComplete,
  achievement
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [phase, setPhase] = useState<Phase>(Phase.IDLE);
  const [shards, setShards] = useState<Shard[]>([]);
  const shardsRef = useRef<Shard[]>([]);
  const reducedMotion = useReducedMotion();

  // Generate shards when animation becomes active
  useEffect(() => {
    console.log('🎬 RealityShatter useEffect - isActive:', isActive, 'shards.length:', shards.length);
    if (isActive && shards.length === 0) {
      console.log('✨ GENERATING SHARDS AND STARTING SINGULARITY PHASE');
      const generated = generateShards(archetype.gradient);
      setShards(generated);
      shardsRef.current = generated;
      setPhase(Phase.SINGULARITY);
    }
  }, [isActive, archetype.gradient, shards.length]);

  // Phase progression
  useEffect(() => {
    if (!isActive || phase === Phase.IDLE) return;

    console.log('🎭 Phase progression - current phase:', phase);

    const phaseDurations: Record<Phase, number> = {
      [Phase.IDLE]: 0,
      [Phase.SINGULARITY]: 300,
      [Phase.FRACTURE]: 500,
      [Phase.COLLAPSE]: 400,
      [Phase.BIRTH]: 800,
      [Phase.CELEBRATION]: 1000
    };

    const duration = phaseDurations[phase];
    console.log(`⏱️ Phase ${phase} will last ${duration}ms`);

    if (phase === Phase.CELEBRATION) {
      // Final phase - call onComplete after duration
      console.log('🎉 CELEBRATION phase - will call onComplete in', duration, 'ms');
      const timer = setTimeout(() => {
        console.log('✅ Animation complete - calling onComplete()');
        onComplete();
      }, duration);
      return () => clearTimeout(timer);
    } else if (phase !== Phase.IDLE) {
      // Progress to next phase
      const timer = setTimeout(() => {
        console.log(`⏭️ Moving from phase ${phase} to phase ${phase + 1}`);
        setPhase(prev => prev + 1);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [phase, isActive, onComplete]);

  // Canvas animation loop
  useEffect(() => {
    if (!isActive || !canvasRef.current || phase === Phase.IDLE) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - startTime) / 1000; // Convert to seconds
      startTime = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render based on phase
      switch (phase) {
        case Phase.SINGULARITY:
          renderSingularity(ctx, canvas.width, canvas.height);
          break;
        case Phase.FRACTURE:
          renderFracture(ctx, canvas.width, canvas.height, shardsRef.current);
          break;
        case Phase.COLLAPSE:
          updateShardPhysics(shardsRef.current, deltaTime, canvas.height);
          renderCollapse(ctx, shardsRef.current);
          break;
        default:
          break;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, isActive]);

  // Reduced motion fallback
  if (reducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      >
        <AchievementCard archetype={archetype} achievement={achievement} />
      </motion.div>
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Canvas layer for shard rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: [Phase.FRACTURE, Phase.COLLAPSE].includes(phase) ? 1 : 0 }}
      />

      {/* Black background (behind shards) */}
      <div className="absolute inset-0 bg-black" />

      {/* White void (behind falling shards) */}
      <AnimatePresence>
        {phase === Phase.COLLAPSE && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white"
          />
        )}
      </AnimatePresence>

      {/* Achievement card (birth phase) */}
      <AnimatePresence>
        {phase >= Phase.BIRTH && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <AchievementCard
              archetype={archetype}
              achievement={achievement}
              phase={phase}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Singularity effect */}
      {phase === Phase.SINGULARITY && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 0.1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-64 h-64 bg-white rounded-full blur-3xl"
            style={{
              boxShadow: '0 0 200px 100px rgba(255, 255, 255, 0.8)'
            }}
          />
        </div>
      )}

      {/* Camera shake effect */}
      {phase === Phase.SINGULARITY && (
        <motion.div
          animate={{
            x: [0, 2, -2, 2, -2, 0],
            y: [0, 2, -2, -2, 2, 0]
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut'
          }}
          className="absolute inset-0 pointer-events-none"
        />
      )}
    </div>
  );
};

// ============================================================================
// ACHIEVEMENT CARD COMPONENT
// ============================================================================

interface AchievementCardProps {
  archetype: {
    emoji: string;
    gradient: [string, string];
    title: string;
  };
  achievement: {
    title: string;
    description: string;
    xp: number;
  };
  phase?: Phase;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  archetype,
  achievement,
  phase = Phase.BIRTH
}) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1] // Overshoot ease
      }}
      className="relative"
    >
      {/* Wireframe effect (birth phase) */}
      {phase === Phase.BIRTH && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="absolute inset-0 border-4 border-white rounded-3xl"
          style={{
            background: 'transparent'
          }}
        />
      )}

      {/* Main card */}
      <div
        className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 shadow-2xl border border-white/20 backdrop-blur-xl"
        style={{
          background: `linear-gradient(135deg, ${archetype.gradient[0]}22, ${archetype.gradient[1]}22)`
        }}
      >
        {/* Aurora glow */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-0 rounded-3xl blur-3xl"
          style={{
            background: `radial-gradient(circle, ${archetype.gradient[0]}44, ${archetype.gradient[1]}44)`
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Trophy with scale animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="text-9xl"
          >
            🏆
          </motion.div>

          {/* XP gain (handwriting effect) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.5
            }}
            className="text-4xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${archetype.gradient[0]}, ${archetype.gradient[1]})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            +{achievement.xp} XP
          </motion.div>

          {/* Title (word by word) */}
          <div className="flex gap-3 text-4xl font-bold text-white">
            {achievement.title.split(' ').map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.7 + index * 0.1
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="text-gray-300 text-lg text-center max-w-md"
          >
            {achievement.description}
          </motion.p>

          {/* Archetype badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.4 }}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <span className="text-3xl">{archetype.emoji}</span>
            <span className="text-white font-medium">{archetype.title}</span>
          </motion.div>
        </div>

        {/* Orbiting particles (celebration phase) */}
        {phase === Phase.CELEBRATION && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  rotate: {
                    duration: 4,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.2
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }
                }}
                className="absolute w-3 h-3 rounded-full bg-white"
                style={{
                  top: '50%',
                  left: '50%',
                  marginTop: '-6px',
                  marginLeft: '-6px',
                  transformOrigin: `${150 * Math.cos((i / 8) * Math.PI * 2)}px ${150 * Math.sin((i / 8) * Math.PI * 2)}px`
                }}
              />
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// SHARD GENERATION
// ============================================================================

function generateShards(gradient: [string, string]): Shard[] {
  const shards: Shard[] = [];
  const rows = 12;
  const cols = 16;
  const width = window.innerWidth;
  const height = window.innerHeight;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = (j / cols) * width;
      const y = (i / rows) * height;
      const w = width / cols;
      const h = height / rows;

      // Create triangular shard vertices
      const vertices = [
        { x: x + Math.random() * 20 - 10, y: y + Math.random() * 20 - 10 },
        { x: x + w + Math.random() * 20 - 10, y: y + Math.random() * 20 - 10 },
        { x: x + w / 2 + Math.random() * 20 - 10, y: y + h + Math.random() * 20 - 10 }
      ];

      // Color interpolation based on position
      const colorMix = (i * cols + j) / (rows * cols);
      const color = interpolateColor(gradient[0], gradient[1], colorMix);

      // Physics properties
      const mass = 0.5 + Math.random() * 0.5;
      const centerX = (vertices[0].x + vertices[1].x + vertices[2].x) / 3;
      const centerY = (vertices[0].y + vertices[1].y + vertices[2].y) / 3;

      shards.push({
        id: i * cols + j,
        vertices,
        color,
        mass,
        rotation: 0,
        position: { x: centerX, y: centerY },
        velocity: { x: 0, y: 0 },
        angularVelocity: (Math.random() - 0.5) * 0.2,
        opacity: 1,
        depth: Math.random() // For depth of field
      });
    }
  }

  return shards;
}

// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

function renderSingularity(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Draw contracting light
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, 300);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function renderFracture(ctx: CanvasRenderingContext2D, width: number, height: number, shards: Shard[]) {
  // Draw black background
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  // Draw cracks (golden light seeping through)
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#FFD700';

  shards.forEach(shard => {
    ctx.beginPath();
    ctx.moveTo(shard.vertices[0].x, shard.vertices[0].y);
    shard.vertices.forEach(v => {
      ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();
    ctx.stroke();
  });

  ctx.shadowBlur = 0;
}

function renderCollapse(ctx: CanvasRenderingContext2D, shards: Shard[]) {
  shards.forEach(shard => {
    if (shard.opacity <= 0) return;

    ctx.save();

    // Apply depth of field blur
    if (shard.depth > 0.7) {
      ctx.filter = 'blur(3px)';
    }

    // Translate to shard position
    ctx.translate(shard.position.x, shard.position.y);
    ctx.rotate(shard.rotation);

    // Draw shard
    ctx.globalAlpha = shard.opacity;
    ctx.fillStyle = shard.color;
    ctx.beginPath();
    ctx.moveTo(
      shard.vertices[0].x - shard.position.x,
      shard.vertices[0].y - shard.position.y
    );
    shard.vertices.forEach(v => {
      ctx.lineTo(v.x - shard.position.x, v.y - shard.position.y);
    });
    ctx.closePath();
    ctx.fill();

    // Add sparkle on some pieces
    if (shard.depth < 0.3 && Math.random() > 0.95) {
      ctx.fillStyle = '#FFF';
      ctx.globalAlpha = shard.opacity * 0.8;
      ctx.fillRect(-2, -2, 4, 4);
    }

    ctx.restore();
  });
}

// ============================================================================
// PHYSICS SIMULATION
// ============================================================================

function updateShardPhysics(shards: Shard[], deltaTime: number, canvasHeight: number) {
  shards.forEach(shard => {
    // Apply gravity
    shard.velocity.y += 980 * shard.mass * deltaTime; // pixels/s^2

    // Air resistance
    shard.velocity.x *= 0.99;
    shard.velocity.y *= 0.99;

    // Update position
    shard.position.x += shard.velocity.x * deltaTime;
    shard.position.y += shard.velocity.y * deltaTime;

    // Update rotation
    shard.rotation += shard.angularVelocity;

    // Fade based on distance fallen
    const distanceFallen = shard.position.y - shard.vertices[0].y;
    shard.opacity = Math.max(0, 1 - distanceFallen / 1000);
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function interpolateColor(color1: string, color2: string, factor: number): string {
  // Simple color interpolation (assumes hex colors)
  // In production, you'd use a proper color library
  return factor < 0.5 ? color1 : color2;
}
