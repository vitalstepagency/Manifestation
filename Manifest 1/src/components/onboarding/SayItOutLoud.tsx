/**
 * SayItOutLoud Component
 *
 * The commitment moment - user must SAY their manifestation out loud.
 * This creates a powerful psychological anchor and transforms passive
 * thinking into active declaration.
 *
 * CRITICAL: This 3-second pause is where transformation begins.
 * The goal shifts from "nice idea" to "committed action."
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPRING_CONFIGS, TIMING } from '../../utils/animationPresets';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { trackSayItOutLoudCompleted } from '../../utils/analyticsTracker';
import { audioManager } from '../../utils/audioManager';

// ============================================================================
// TYPES
// ============================================================================

interface SayItOutLoudProps {
  /** The manifestation goal to display */
  manifestationGoal: string;

  /** User's archetype for personalized messaging */
  archetype?: string;

  /** Callback when ceremony completes */
  onComplete: () => void;

  /** Optional custom duration (default: 3000ms) */
  ceremonyDuration?: number;

  /** Whether to auto-advance after ceremony (default: false) */
  autoAdvance?: boolean;
}

// ============================================================================
// ARCHETYPE-SPECIFIC MESSAGES
// ============================================================================

const ARCHETYPE_MESSAGES: Record<string, string> = {
  builder: 'Say it like you\'re about to build it.',
  optimizer: 'Say it with precision and clarity.',
  phoenix: 'Say it like the old you is already gone.',
  accelerator: 'Say it with urgency and conviction.',
  visionary: 'Say it like it\'s already real in your mind.',
  emperor: 'Say it like a command to the universe.',
  default: 'Say it like you mean it.',
};

// ============================================================================
// COMPONENT
// ============================================================================

export const SayItOutLoud: React.FC<SayItOutLoudProps> = ({
  manifestationGoal,
  archetype = 'default',
  onComplete,
  ceremonyDuration = 3000,
  autoAdvance = false,
}) => {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState<'ready' | 'speaking' | 'complete'>('ready');
  const [countdown, setCountdown] = useState(3);

  // Get archetype-specific message
  const archetypeMessage = ARCHETYPE_MESSAGES[archetype] || ARCHETYPE_MESSAGES.default;

  // Handle say it out loud button click
  const handleSayItOutLoud = useCallback(() => {
    if (stage !== 'ready') return;

    // Play subtle chime
    audioManager.play('achievement_chime', { volume: 0.2 });

    // Move to speaking stage
    setStage('speaking');

    // Start countdown
    let count = 3;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);

      if (count <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    // Complete after duration
    setTimeout(() => {
      setStage('complete');
      trackSayItOutLoudCompleted();

      // Play completion sound
      audioManager.play('achievement_chime', { volume: 0.3 });

      // Auto-advance if enabled
      if (autoAdvance) {
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    }, ceremonyDuration);
  }, [stage, ceremonyDuration, autoAdvance, onComplete]);

  // Animation variants
  const goalVariants = {
    ready: {
      scale: 1,
      opacity: 1,
    },
    speaking: {
      scale: reducedMotion ? 1 : 1.1,
      opacity: 1,
      transition: {
        scale: {
          duration: ceremonyDuration / 1000,
          ease: [0.4, 0, 0.2, 1] as any,
        },
      },
    },
    complete: {
      scale: 1,
      opacity: 1,
    },
  };

  const buttonVariants = {
    ready: {
      scale: 1,
      opacity: 1,
    },
    hidden: {
      scale: 0.8,
      opacity: 0,
      transition: SPRING_CONFIGS.fast,
    },
  };

  const ceremonyVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: SPRING_CONFIGS.smooth,
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: SPRING_CONFIGS.fast,
    },
  };

  const checkmarkVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        ...SPRING_CONFIGS.bouncy,
        delay: 0.2,
      },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_CONFIGS.smooth}
        className="text-center space-y-3"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Make Your Commitment
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400">
          {archetypeMessage}
        </p>
      </motion.div>

      {/* Manifestation Goal Display */}
      <motion.div
        variants={goalVariants}
        animate={stage}
        className="relative"
      >
        {/* Glow effect during speaking */}
        <AnimatePresence>
          {stage === 'speaking' && !reducedMotion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute -inset-6 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20 rounded-3xl blur-2xl"
            />
          )}
        </AnimatePresence>

        {/* Goal card */}
        <div
          className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 transition-colors duration-300 ${
            stage === 'speaking'
              ? 'border-purple-400 dark:border-purple-500'
              : stage === 'complete'
              ? 'border-green-400 dark:border-green-500'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <p className="text-2xl font-semibold text-gray-900 dark:text-white text-center leading-relaxed">
            "{manifestationGoal}"
          </p>

          {/* Checkmark for completed */}
          <AnimatePresence>
            {stage === 'complete' && (
              <motion.div
                variants={checkmarkVariants}
                initial="hidden"
                animate="visible"
                className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Action Area */}
      <div className="flex flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          {/* Ready state: Show button */}
          {stage === 'ready' && (
            <motion.button
              key="button"
              variants={buttonVariants}
              initial="ready"
              exit="hidden"
              onClick={handleSayItOutLoud}
              whileHover={reducedMotion ? {} : { scale: 1.05 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
              className="px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              Say It Out Loud 📣
            </motion.button>
          )}

          {/* Speaking state: Show ceremony */}
          {stage === 'speaking' && (
            <motion.div
              key="ceremony"
              variants={ceremonyVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center gap-6"
            >
              {/* Countdown */}
              <div className="relative w-32 h-32">
                {/* Circular progress */}
                {!reducedMotion && (
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="text-purple-500"
                      initial={{ pathLength: 1 }}
                      animate={{ pathLength: 0 }}
                      transition={{ duration: ceremonyDuration / 1000, ease: 'linear' }}
                      style={{
                        strokeDasharray: '283',
                        strokeDashoffset: '0',
                      }}
                    />
                  </svg>
                )}

                {/* Number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    key={countdown}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    className="text-5xl font-bold text-purple-500"
                  >
                    {countdown}
                  </motion.span>
                </div>
              </div>

              {/* Message */}
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Speak your truth...
              </p>
            </motion.div>
          )}

          {/* Complete state: Show success */}
          {stage === 'complete' && (
            <motion.div
              key="complete"
              variants={ceremonyVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-6"
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={SPRING_CONFIGS.bouncy}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-4xl">✨</span>
              </motion.div>

              {/* Message */}
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  It Is Spoken
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Your manifestation has been declared to the universe.
                </p>
              </div>

              {/* Continue button (if not auto-advancing) */}
              {!autoAdvance && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={onComplete}
                  className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-base font-semibold rounded-full hover:shadow-lg transition-shadow"
                >
                  Continue →
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper text */}
      <AnimatePresence>
        {stage === 'ready' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-500 dark:text-gray-500 text-center max-w-md mx-auto"
          >
            Speaking your goal out loud creates a powerful commitment.
            When you're ready, press the button and declare your manifestation.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SayItOutLoud;
