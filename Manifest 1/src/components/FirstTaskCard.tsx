/**
 * First Task Card
 *
 * AI-generated first action based on manifestation goal and archetype.
 * Designed to create immediate engagement and momentum.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, Trophy, Check } from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// TYPES
// ============================================================================

interface FirstTaskCardProps {
  /** The AI-generated task */
  task: string;

  /** Task category (from archetype focus area) */
  category: string;

  /** Estimated time in minutes */
  estimatedTime: number;

  /** XP reward for completion */
  xpReward: number;

  /** Archetype gradient colors */
  gradient?: string[];

  /** Callback when task is completed */
  onComplete?: () => void;

  /** Show on first visit */
  isFirstVisit?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const FirstTaskCard: React.FC<FirstTaskCardProps> = ({
  task,
  category,
  estimatedTime,
  xpReward,
  gradient = ['#9333ea', '#a855f7'],
  onComplete,
  isFirstVisit = false,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [color1, color2] = gradient;

  const handleComplete = () => {
    setIsCompleted(true);
    setShowXP(true);

    // Toast notification with streak emoji
    toast.success('🎯 First action complete!', {
      description: `+${xpReward} XP earned`,
      duration: 3000,
    });

    // Hide XP indicator after animation
    setTimeout(() => setShowXP(false), 2000);

    // Call callback
    if (onComplete) {
      setTimeout(onComplete, 500);
    }
  };

  return (
    <motion.div
      initial={isFirstVisit ? { opacity: 0, y: 20, scale: 0.95 } : false}
      animate={isFirstVisit ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={
        isFirstVisit
          ? {
              duration: 0.8,
              delay: 0.6,
              type: 'spring',
              bounce: 0.4,
            }
          : {}
      }
      className="relative w-full rounded-[20px] p-6 overflow-hidden"
      style={{
        background: isCompleted
          ? `linear-gradient(135deg, ${color1}20 0%, ${color2}15 100%)`
          : `linear-gradient(135deg, ${color1}10 0%, ${color2}05 100%)`,
        border: `1px solid ${isCompleted ? color1 + '50' : color1 + '20'}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Gradient orb background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${color1} 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={
                !isCompleted
                  ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }
                  : {}
              }
              transition={
                !isCompleted
                  ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : {}
              }
              className="p-2.5 rounded-[10px]"
              style={{
                background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <p className="text-sm text-white/60 uppercase tracking-wide font-medium">
                Your First Action
              </p>
              <p className="text-xs text-white/40 mt-0.5">{category}</p>
            </div>
          </div>

          {/* XP Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px]"
            style={{
              background: `${color1}20`,
              border: `1px solid ${color1}40`,
            }}
          >
            <Trophy className="w-4 h-4" style={{ color: color1 }} />
            <span className="text-sm font-medium text-white">
              +{xpReward} XP
            </span>
          </motion.div>
        </div>

        {/* Task Description */}
        <motion.p
          initial={isFirstVisit ? { opacity: 0 } : false}
          animate={isFirstVisit ? { opacity: 1 } : {}}
          transition={isFirstVisit ? { delay: 0.8 } : {}}
          className={`text-lg font-normal leading-relaxed mb-4 ${
            isCompleted ? 'line-through text-white/50' : 'text-white'
          }`}
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          {task}
        </motion.p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Time Estimate */}
          <motion.div
            initial={isFirstVisit ? { opacity: 0 } : false}
            animate={isFirstVisit ? { opacity: 1 } : {}}
            transition={isFirstVisit ? { delay: 1 } : {}}
            className="flex items-center gap-2 text-white/60"
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm">{estimatedTime} min</span>
          </motion.div>

          {/* Action Button */}
          <motion.button
            initial={isFirstVisit ? { opacity: 0, x: 20 } : false}
            animate={isFirstVisit ? { opacity: 1, x: 0 } : {}}
            transition={isFirstVisit ? { delay: 1.1 } : {}}
            whileHover={{ scale: isCompleted ? 1 : 1.05 }}
            whileTap={{ scale: isCompleted ? 1 : 0.95 }}
            onClick={handleComplete}
            disabled={isCompleted}
            className={`px-6 py-2.5 rounded-[10px] font-medium text-sm transition-all ${
              isCompleted
                ? 'cursor-not-allowed'
                : 'cursor-pointer hover:shadow-lg'
            }`}
            style={{
              background: isCompleted
                ? `${color1}30`
                : `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
              color: 'white',
              border: `1px solid ${isCompleted ? color1 + '40' : 'transparent'}`,
            }}
          >
            {isCompleted ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Completed
              </span>
            ) : (
              'Mark as Done'
            )}
          </motion.button>
        </div>
      </div>

      {/* Flying XP Animation */}
      <AnimatePresence>
        {showXP && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -80, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: color1,
              textShadow: `0 0 20px ${color1}`,
            }}
          >
            +{xpReward} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Confetti */}
      {isCompleted && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              initial={{
                x: '50%',
                y: '50%',
                opacity: 1,
                scale: 1,
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 1,
                delay: i * 0.05,
                ease: 'easeOut',
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? color1 : color2,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default FirstTaskCard;
