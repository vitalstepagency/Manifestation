/**
 * Perfect Day Tracker
 *
 * Fixed bottom-right card showing daily action completion.
 * Celebrates when all tasks are done with confetti explosion.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface PerfectDayTrackerProps {
  /** Number of actions completed */
  completed: number;

  /** Total actions for a perfect day */
  total?: number;

  /** Archetype gradient colors */
  gradient?: string[];

  /** Delay before showing (ms) */
  delay?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const PerfectDayTracker: React.FC<PerfectDayTrackerProps> = ({
  completed,
  total = 3,
  gradient = ['#9333ea', '#a855f7'],
  delay = 3000,
}) => {
  const [show, setShow] = useState(false);
  const [prevCompleted, setPrevCompleted] = useState(completed);
  const [justCompleted, setJustCompleted] = useState(false);
  const [color1, color2] = gradient;

  const isPerfect = completed >= total;
  const progress = (completed / total) * 100;

  // Show after delay
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Detect when a new action is completed
  useEffect(() => {
    if (completed > prevCompleted) {
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 1000);
    }
    setPrevCompleted(completed);
  }, [completed, prevCompleted]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <motion.div
            animate={
              justCompleted
                ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, -5, 5, 0],
                  }
                : {}
            }
            transition={
              justCompleted
                ? { duration: 0.5, ease: 'easeOut' }
                : {}
            }
            className="relative rounded-[16px] p-5 min-w-[240px] overflow-hidden"
            style={{
              background: isPerfect
                ? `linear-gradient(135deg, ${color1}30 0%, ${color2}25 100%)`
                : 'rgba(0, 0, 0, 0.6)',
              border: `1px solid ${isPerfect ? color1 + '60' : 'rgba(255, 255, 255, 0.1)'}`,
              backdropFilter: 'blur(20px)',
              boxShadow: isPerfect
                ? `0 8px 32px ${color1}40, 0 0 60px ${color1}20`
                : '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Gradient orb background for perfect day */}
            {isPerfect && (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full blur-2xl"
                style={{
                  background: `radial-gradient(circle, ${color1} 0%, transparent 70%)`,
                }}
              />
            )}

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isPerfect && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: 'spring',
                        bounce: 0.6,
                        duration: 0.8,
                      }}
                    >
                      <Sparkles
                        className="w-5 h-5"
                        style={{ color: color1 }}
                      />
                    </motion.div>
                  )}
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                    {isPerfect ? 'Perfect Day!' : "Today's Progress"}
                  </h3>
                </div>

                {/* Count Badge */}
                <motion.div
                  key={completed}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold"
                  style={{
                    color: isPerfect ? color1 : 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  {completed}/{total}
                </motion.div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`,
                    boxShadow: `0 0 10px ${color1}80`,
                  }}
                />
              </div>

              {/* Action Checklist */}
              <div className="space-y-2">
                {Array.from({ length: total }, (_, i) => {
                  const isComplete = i < completed;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={
                          isComplete && i === completed - 1
                            ? {
                                scale: [1, 1.3, 1],
                                rotate: [0, 360],
                              }
                            : {}
                        }
                        transition={{ duration: 0.5 }}
                      >
                        {isComplete ? (
                          <CheckCircle2
                            className="w-5 h-5"
                            style={{ color: color1 }}
                          />
                        ) : (
                          <Circle className="w-5 h-5 text-white/30" />
                        )}
                      </motion.div>
                      <span
                        className={`text-sm ${
                          isComplete
                            ? 'text-white font-medium'
                            : 'text-white/50'
                        }`}
                      >
                        Action {i + 1}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Perfect Day Message */}
              {isPerfect && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 text-xs text-white/70 text-center"
                >
                  🎉 You just did what 99% won't do
                </motion.p>
              )}
            </div>

            {/* Perfect Day Confetti */}
            {isPerfect && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 30 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: '50%',
                      y: '50%',
                      opacity: 1,
                      scale: 1,
                    }}
                    animate={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.03,
                      ease: 'easeOut',
                    }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background:
                        i % 3 === 0
                          ? color1
                          : i % 3 === 1
                          ? color2
                          : '#ffffff',
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PerfectDayTracker;
