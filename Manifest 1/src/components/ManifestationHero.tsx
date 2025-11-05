/**
 * Manifestation Hero Card
 *
 * The centerpiece of the dashboard - user's manifestation goal
 * with progress tracking and motivational visualization.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface ManifestationHeroProps {
  /** User's manifestation goal */
  goal: string;

  /** Progress percentage (0-100) */
  progress: number;

  /** Days remaining in transformation period */
  daysRemaining: number;

  /** Total days in transformation period */
  totalDays?: number;

  /** Archetype gradient colors */
  gradient?: string[];

  /** Show on first visit */
  isFirstVisit?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ManifestationHero: React.FC<ManifestationHeroProps> = ({
  goal,
  progress,
  daysRemaining,
  totalDays = 90,
  gradient = ['#9333ea', '#a855f7'],
  isFirstVisit = false,
}) => {
  const [color1, color2] = gradient;
  const daysElapsed = totalDays - daysRemaining;
  const percentComplete = ((daysElapsed / totalDays) * 100).toFixed(1);

  return (
    <motion.div
      initial={isFirstVisit ? { opacity: 0, y: 20, scale: 0.95 } : false}
      animate={isFirstVisit ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={
        isFirstVisit
          ? {
              duration: 0.8,
              delay: 0.3,
              type: 'spring',
              bounce: 0.4,
            }
          : {}
      }
      className="relative w-full rounded-[20px] p-8 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color1}15 0%, ${color2}10 100%)`,
        border: `1px solid ${color1}30`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Animated gradient orb background */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${color1} 0%, transparent 70%)`,
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-3 rounded-[12px]"
            style={{
              background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
            }}
          >
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-white/60 uppercase tracking-wide font-medium">
              Your Manifestation
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              Day {daysElapsed} of {totalDays}
            </p>
          </div>
        </div>

        {/* Goal Statement */}
        <motion.h2
          initial={isFirstVisit ? { opacity: 0 } : false}
          animate={isFirstVisit ? { opacity: 1 } : {}}
          transition={isFirstVisit ? { delay: 0.5 } : {}}
          className="text-3xl font-light text-white mb-6 leading-tight"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          "{goal}"
        </motion.h2>

        {/* Progress Visualization */}
        <div className="space-y-4">
          {/* Liquid Progress Bar */}
          <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: 1.5,
                delay: isFirstVisit ? 0.7 : 0,
                ease: 'easeOut',
              }}
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${color1} 0%, ${color2} 100%)`,
                boxShadow: `0 0 20px ${color1}50`,
              }}
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: ['0%', '200%'] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 w-1/2"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                }}
              />
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Progress Percentage */}
            <motion.div
              initial={isFirstVisit ? { opacity: 0, y: 10 } : false}
              animate={isFirstVisit ? { opacity: 1, y: 0 } : {}}
              transition={isFirstVisit ? { delay: 0.9 } : {}}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-white/60" />
              <div>
                <p className="text-2xl font-light text-white">
                  {percentComplete}%
                </p>
                <p className="text-xs text-white/50">Progress</p>
              </div>
            </motion.div>

            {/* Days Remaining */}
            <motion.div
              initial={isFirstVisit ? { opacity: 0, y: 10 } : false}
              animate={isFirstVisit ? { opacity: 1, y: 0 } : {}}
              transition={isFirstVisit ? { delay: 1 } : {}}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-white/60" />
              <div>
                <p className="text-2xl font-light text-white">
                  {daysRemaining}
                </p>
                <p className="text-xs text-white/50">Days Left</p>
              </div>
            </motion.div>

            {/* Momentum Indicator */}
            <motion.div
              initial={isFirstVisit ? { opacity: 0, y: 10 } : false}
              animate={isFirstVisit ? { opacity: 1, y: 0 } : {}}
              transition={isFirstVisit ? { delay: 1.1 } : {}}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: color1, filter: 'blur(8px)' }}
                />
                <div className="relative text-xl">🔥</div>
              </div>
              <div>
                <p className="text-2xl font-light text-white">
                  {daysElapsed}
                </p>
                <p className="text-xs text-white/50">Day Streak</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Motivational Message - First Visit Only */}
        {isFirstVisit && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-6 text-sm text-white/70 text-center italic"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            The journey begins with a single step. You've taken yours.
          </motion.p>
        )}
      </div>

      {/* Float animation CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(-10px) translateX(-10px); }
        }
      `}</style>
    </motion.div>
  );
};

export default ManifestationHero;
