/**
 * FirstAchievement Component
 *
 * Celebrates the user's first achievement: "The Initiator"
 * This is earned for completing onboarding and creates positive
 * reinforcement for the gamification system.
 *
 * CRITICAL: This is their first dopamine hit from Manifest.
 * Make it memorable with confetti, sound, and celebration.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPRING_CONFIGS } from '../../utils/animationPresets';
import { useReducedMotion, useParticlesEnabled } from '../../hooks/useReducedMotion';
import {
  trackAchievementUnlocked,
  trackAchievementClaimed,
  trackFirstAchievementClaimed,
} from '../../utils/analyticsTracker';
import { audioManager } from '../../utils/audioManager';
import type { Achievement } from '../../types/achievement.types';

// ============================================================================
// TYPES
// ============================================================================

interface FirstAchievementProps {
  /** Callback when user claims achievement */
  onClaim: () => void;

  /** Whether to auto-show on mount (default: true) */
  autoShow?: boolean;

  /** Delay before showing (ms, default: 500) */
  showDelay?: number;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  delay: number;
}

// ============================================================================
// THE INITIATOR ACHIEVEMENT
// ============================================================================

const THE_INITIATOR: Achievement = {
  id: 'initiator',
  title: 'The Initiator',
  description: 'You took the first step. Your transformation has begun.',
  icon: '🌟',
  category: 'onboarding',
  xp: 100,
  trigger: 'onboarding_complete',
  unlocked: true,
  unlocked_at: new Date(),
  celebrated: false,
};

// ============================================================================
// CONFETTI COLORS
// ============================================================================

const CONFETTI_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Cyan
  '#FFD93D', // Yellow
  '#6BCF7F', // Green
  '#C77DFF', // Purple
  '#FF8FA3', // Pink
  '#4EA8DE', // Blue
  '#F9A826', // Orange
];

// ============================================================================
// COMPONENT
// ============================================================================

export const FirstAchievement: React.FC<FirstAchievementProps> = ({
  onClaim,
  autoShow = true,
  showDelay = 500,
}) => {
  const reducedMotion = useReducedMotion();
  const particlesEnabled = useParticlesEnabled();

  const [isVisible, setIsVisible] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);
  const [showXpFlyup, setShowXpFlyup] = useState(false);

  // Auto-show achievement
  useEffect(() => {
    if (autoShow) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        trackAchievementUnlocked(THE_INITIATOR.id, THE_INITIATOR.title, THE_INITIATOR.xp);

        // Play achievement sound
        audioManager.play('achievement_chime');

        // Generate confetti
        if (particlesEnabled) {
          generateConfetti();
        }
      }, showDelay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, showDelay, particlesEnabled]);

  // Generate confetti particles
  const generateConfetti = () => {
    const particles: ConfettiParticle[] = [];
    const count = 50;

    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100, // 0-100%
        y: -10, // Start above viewport
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 720 - 360,
        delay: Math.random() * 0.5,
      });
    }

    setConfettiParticles(particles);

    // Clear confetti after animation
    setTimeout(() => {
      setConfettiParticles([]);
    }, 3000);
  };

  // Handle claim
  const handleClaim = () => {
    const startTime = Date.now();

    setIsClaimed(true);
    setShowXpFlyup(true);

    // Track analytics
    trackAchievementClaimed(
      THE_INITIATOR.id,
      THE_INITIATOR.title,
      Math.floor((Date.now() - startTime) / 1000)
    );
    trackFirstAchievementClaimed();

    // Play celebration sound
    audioManager.play('confetti_pop');

    // Burst of confetti
    if (particlesEnabled) {
      generateConfetti();
    }

    // Complete after animation
    setTimeout(() => {
      onClaim();
    }, 2000);
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const cardVariants = {
    hidden: {
      scale: 0,
      opacity: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        ...SPRING_CONFIGS.bouncy,
        delay: 0.2,
      },
    },
    claimed: {
      scale: 0.9,
      opacity: 0,
      y: -100,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as any,
      },
    },
  };

  const xpFlyupVariants = {
    hidden: {
      y: 0,
      opacity: 1,
    },
    visible: {
      y: -150,
      opacity: 0,
      transition: {
        duration: 1.5,
        ease: [0, 0, 0.2, 1] as any,
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
        >
          {/* Confetti particles */}
          {particlesEnabled && confettiParticles.length > 0 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {confettiParticles.map(particle => (
                <motion.div
                  key={particle.id}
                  initial={{
                    x: `${particle.x}vw`,
                    y: `${particle.y}vh`,
                    rotate: 0,
                    opacity: 1,
                  }}
                  animate={{
                    y: '120vh',
                    rotate: particle.rotation,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: particle.delay,
                    ease: [0.4, 0, 1, 1] as any,
                  }}
                  style={{
                    position: 'absolute',
                    width: '10px',
                    height: '10px',
                    backgroundColor: particle.color,
                    borderRadius: Math.random() > 0.5 ? '50%' : '0',
                  }}
                />
              ))}
            </div>
          )}

          {/* Achievement card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={isClaimed ? 'claimed' : 'visible'}
            className="relative max-w-md w-full"
          >
            {/* Glow effect */}
            {!reducedMotion && (
              <motion.div
                className="absolute -inset-6 bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-yellow-400/30 rounded-3xl blur-2xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1] as any,
                }}
              />
            )}

            {/* Card content */}
            <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-8 shadow-2xl border-2 border-yellow-400/50">
              {/* Badge ribbon */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-yellow-400 rounded-full shadow-lg">
                <span className="text-sm font-bold text-gray-900">ACHIEVEMENT UNLOCKED</span>
              </div>

              {/* Content */}
              <div className="mt-4 space-y-6">
                {/* Icon */}
                <motion.div
                  className="flex justify-center"
                  animate={
                    reducedMotion
                      ? {}
                      : {
                          rotate: [0, 10, -10, 10, 0],
                          scale: [1, 1.1, 1],
                        }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.5,
                  }}
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-5xl">{THE_INITIATOR.icon}</span>
                  </div>
                </motion.div>

                {/* Title */}
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-white">{THE_INITIATOR.title}</h2>
                  <p className="text-base text-gray-300">{THE_INITIATOR.description}</p>
                </div>

                {/* XP badge */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                      <span className="text-lg font-bold text-white">+{THE_INITIATOR.xp} XP</span>
                    </div>

                    {/* XP fly-up animation */}
                    <AnimatePresence>
                      {showXpFlyup && (
                        <motion.div
                          variants={xpFlyupVariants}
                          initial="hidden"
                          animate="visible"
                          className="absolute left-1/2 -translate-x-1/2 top-0"
                        >
                          <span className="text-3xl font-bold text-yellow-400">
                            +{THE_INITIATOR.xp}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Claim button */}
                {!isClaimed && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={handleClaim}
                    whileHover={reducedMotion ? {} : { scale: 1.05 }}
                    whileTap={reducedMotion ? {} : { scale: 0.95 }}
                    className="w-full py-4 bg-white text-gray-900 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Claim Achievement 🎉
                  </motion.button>
                )}

                {/* Claimed state */}
                {isClaimed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <span className="text-2xl font-bold text-green-400">✓ Claimed!</span>
                  </motion.div>
                )}
              </div>

              {/* Tier badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-600/20 border border-yellow-500/50 rounded-full">
                <span className="text-xs font-semibold text-yellow-400 uppercase">
                  Bronze
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FirstAchievement;
