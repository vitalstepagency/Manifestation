/**
 * CountdownCeremony Component
 *
 * The dramatic 10-second countdown before the portal transition.
 * This builds anticipation and creates a memorable ceremony moment
 * that marks the transformation from "thinking about it" to "doing it."
 *
 * CRITICAL: This is the climax of the onboarding ceremony.
 * The moment before they step through the portal into their new reality.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPRING_CONFIGS } from '../../utils/animationPresets';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { trackCountdownStarted, trackCountdownCompleted } from '../../utils/analyticsTracker';
import { audioManager } from '../../utils/audioManager';

// ============================================================================
// TYPES
// ============================================================================

interface CountdownCeremonyProps {
  /** Callback when countdown reaches zero */
  onComplete: () => void;

  /** Countdown duration in seconds (default: 10) */
  duration?: number;

  /** Whether countdown starts automatically (default: false) */
  autoStart?: boolean;

  /** Custom title text */
  title?: string;

  /** Custom subtitle text */
  subtitle?: string;

  /** Whether to show preparation message before countdown */
  showPreparation?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PREPARATION_MESSAGES = [
  'Take a deep breath...',
  'Center yourself...',
  'Feel the energy...',
  'Your transformation begins now.',
];

// ============================================================================
// COMPONENT
// ============================================================================

export const CountdownCeremony: React.FC<CountdownCeremonyProps> = ({
  onComplete,
  duration = 10,
  autoStart = false,
  title = 'Your Transformation Begins',
  subtitle = 'Prepare to enter your new reality',
  showPreparation = true,
}) => {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState<'ready' | 'preparing' | 'counting' | 'complete'>('ready');
  const [countdown, setCountdown] = useState(duration);
  const [preparationIndex, setPreparationIndex] = useState(0);

  // Start countdown
  const startCountdown = useCallback(() => {
    if (stage !== 'ready') return;

    trackCountdownStarted();

    // Start 528Hz frequency for ceremony
    audioManager.start528Hz();

    if (showPreparation) {
      // Show preparation messages first
      setStage('preparing');

      // Cycle through preparation messages
      let index = 0;
      const preparationInterval = setInterval(() => {
        index++;
        if (index < PREPARATION_MESSAGES.length) {
          setPreparationIndex(index);
        } else {
          clearInterval(preparationInterval);
          // Start counting after preparation
          setStage('counting');
        }
      }, 1500);
    } else {
      // Start counting immediately
      setStage('counting');
    }
  }, [stage, showPreparation]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      startCountdown();
    }
  }, [autoStart, startCountdown]);

  // Countdown logic
  useEffect(() => {
    if (stage !== 'counting') return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        const next = prev - 1;

        // Play tick sound
        if (next > 0) {
          audioManager.play('habit_complete_click', { volume: 0.15 });
        }

        // Completion
        if (next === 0) {
          clearInterval(interval);
          setTimeout(() => {
            setStage('complete');
            trackCountdownCompleted();
            audioManager.play('portal_whoosh');

            // Complete after brief pause
            setTimeout(() => {
              onComplete();
            }, 1000);
          }, 1000); // Hold on 0 for 1 second
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, onComplete]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: SPRING_CONFIGS.smooth,
    },
  };

  const countdownNumberVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 100 : -100,
      scale: 0.5,
      opacity: 0,
      rotate: direction > 0 ? 180 : -180,
    }),
    center: {
      y: 0,
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: SPRING_CONFIGS.smooth,
    },
    exit: (direction: number) => ({
      y: direction > 0 ? -100 : 100,
      scale: 1.5,
      opacity: 0,
      rotate: direction > 0 ? -180 : 180,
      transition: SPRING_CONFIGS.fast,
    }),
  };

  const pulseRingVariants = {
    pulse: {
      scale: [1, 2.5],
      opacity: [0.5, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: [0, 0, 0.2, 1] as any,
      },
    },
  };

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 p-6">
      <AnimatePresence mode="wait">
        {/* Ready State */}
        {stage === 'ready' && (
          <motion.div
            key="ready"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="text-center space-y-8 max-w-2xl"
          >
            <motion.h1
              variants={headingVariants}
              className="text-5xl md:text-6xl font-bold text-white leading-tight"
            >
              {title}
            </motion.h1>

            <motion.p
              variants={headingVariants}
              className="text-xl text-purple-200"
            >
              {subtitle}
            </motion.p>

            <motion.button
              variants={headingVariants}
              onClick={startCountdown}
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              className="px-12 py-6 bg-white text-purple-900 text-xl font-bold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-shadow"
            >
              Begin Transformation ✨
            </motion.button>
          </motion.div>
        )}

        {/* Preparation State */}
        {stage === 'preparing' && (
          <motion.div
            key="preparing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={SPRING_CONFIGS.smooth}
            className="text-center"
          >
            <motion.p
              key={preparationIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-3xl md:text-4xl font-semibold text-white"
            >
              {PREPARATION_MESSAGES[preparationIndex]}
            </motion.p>
          </motion.div>
        )}

        {/* Counting State */}
        {stage === 'counting' && (
          <motion.div
            key="counting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex flex-col items-center justify-center"
          >
            {/* Background glow */}
            {!reducedMotion && (
              <motion.div
                className="absolute inset-0 bg-white/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.2, 1] as any,
                }}
                style={{ width: '400px', height: '400px' }}
              />
            )}

            {/* Countdown number */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Pulse rings */}
              {!reducedMotion && countdown > 0 && (
                <>
                  <motion.div
                    variants={pulseRingVariants}
                    animate="pulse"
                    className="absolute inset-0 border-4 border-white rounded-full"
                  />
                  <motion.div
                    variants={pulseRingVariants}
                    animate="pulse"
                    transition={{ delay: 0.3 }}
                    className="absolute inset-0 border-4 border-purple-300 rounded-full"
                  />
                </>
              )}

              {/* Number display */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={countdown}
                  custom={-1}
                  variants={reducedMotion ? {} : countdownNumberVariants}
                  initial={reducedMotion ? { opacity: 1 } : 'enter'}
                  animate="center"
                  exit={reducedMotion ? { opacity: 0 } : 'exit'}
                  className="text-9xl font-black text-white"
                >
                  {countdown}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="mt-12 w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{
                  duration: duration,
                  ease: 'linear',
                }}
              />
            </div>

            {/* Motivational text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-xl text-purple-200 text-center max-w-md"
            >
              {countdown > 7 && 'Your new reality awaits...'}
              {countdown <= 7 && countdown > 3 && 'Feel the transformation energy...'}
              {countdown <= 3 && countdown > 0 && 'Almost there...'}
            </motion.p>
          </motion.div>
        )}

        {/* Complete State */}
        {stage === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={SPRING_CONFIGS.bouncy}
            className="text-center space-y-6"
          >
            {/* Portal opening animation */}
            {!reducedMotion && (
              <motion.div
                className="relative w-48 h-48 mx-auto"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  ease: 'easeInOut',
                }}
              >
                {/* Multiple spinning rings */}
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-4 border-white rounded-full"
                    style={{
                      borderStyle: 'dashed',
                    }}
                    animate={{
                      scale: [1, 1.5, 2],
                      opacity: [1, 0.5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </motion.div>
            )}

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold text-white"
            >
              The Portal Opens
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountdownCeremony;
