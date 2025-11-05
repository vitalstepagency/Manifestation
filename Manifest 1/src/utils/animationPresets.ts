/**
 * Animation Presets Library
 *
 * Comprehensive Framer Motion variants for all animations in the
 * onboarding ceremony and dashboard awakening experience.
 *
 * ALL animations must be <300ms except ceremony moments.
 * ALL animations must have spring physics (no linear tweens).
 */

import type { Variant, Transition } from 'framer-motion';
import type { AnimationPreset, SpringConfig } from '../types/animation.types';

// ============================================================================
// SPRING CONFIGURATIONS
// ============================================================================

export const SPRING_CONFIGS: Record<string, SpringConfig> = {
  smooth: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 20,
  },
  slow: {
    type: 'spring',
    stiffness: 100,
    damping: 20,
  },
  snappy: {
    type: 'spring',
    stiffness: 500,
    damping: 35,
  },
};

// ============================================================================
// TIMING CONSTANTS
// ============================================================================

export const TIMING = {
  instant: 50,      // Perceived as instant
  fast: 150,        // Micro-interactions
  normal: 300,      // Standard transitions
  smooth: 500,      // Page transitions
  dramatic: 1000,   // Ceremony moments
} as const;

// ============================================================================
// MICRO-INTERACTIONS (<300ms)
// ============================================================================

export const BUTTON_HOVER: AnimationPreset = {
  initial: {},
  animate: {},
  transition: SPRING_CONFIGS.smooth,
};

export const BUTTON_PRESS: AnimationPreset = {
  initial: { scale: 1 },
  animate: { scale: 0.95 },
  transition: {
    ...SPRING_CONFIGS.snappy,
    duration: 0.1,
  },
};

export const CHECKBOX_CHECK: AnimationPreset = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: SPRING_CONFIGS.smooth,
};

export const HABIT_COMPLETE: AnimationPreset = {
  initial: {},
  animate: {
    scale: [1, 1.2, 0.9, 1],
    rotate: [0, 15, -15, 0],
  },
  transition: {
    duration: 0.4,
    ease: 'easeInOut',
  },
};

// ============================================================================
// ONBOARDING CEREMONY ANIMATIONS
// ============================================================================

// Say It Out Loud
export const SAY_IT_OUT_LOUD: AnimationPreset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export const PULSING_TEXT: AnimationPreset = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const BUTTON_REVEAL: AnimationPreset = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    ...SPRING_CONFIGS.bouncy,
    duration: 0.5,
  },
};

// Countdown Ceremony
export const COUNTDOWN_NUMBER: AnimationPreset = {
  initial: { scale: 0.5, opacity: 0, rotate: -180 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  exit: { scale: 1.5, opacity: 0, rotate: 180 },
  transition: {
    ...SPRING_CONFIGS.smooth,
    duration: 0.6,
  },
};

export const COUNTDOWN_MESSAGE: AnimationPreset = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 },
  transition: {
    duration: 0.5,
    ease: 'easeOut',
  },
};

export const ARCHETYPE_EMOJI_SPIN: AnimationPreset = {
  initial: { scale: 0, rotate: 0 },
  animate: { scale: 1, rotate: 360 },
  transition: {
    ...SPRING_CONFIGS.bouncy,
    duration: 0.8,
  },
};

// First Achievement
export const ACHIEVEMENT_CARD: AnimationPreset = {
  initial: { y: 100, opacity: 0, scale: 0.8 },
  animate: { y: 0, opacity: 1, scale: 1 },
  exit: { y: -100, opacity: 0, scale: 0.8 },
  transition: {
    ...SPRING_CONFIGS.smooth,
    duration: 0.8,
  },
};

export const TROPHY_SHAKE: AnimationPreset = {
  initial: { rotate: 0 },
  animate: {
    rotate: [0, -10, 10, -10, 0],
  },
  transition: {
    duration: 0.5,
    delay: 1,
  },
};

export const SHIMMER_EFFECT: AnimationPreset = {
  initial: { x: '-100%' },
  animate: { x: '200%' },
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatDelay: 3,
    ease: 'easeInOut',
  },
};

export const XP_BADGE_REVEAL: AnimationPreset = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: {
    ...SPRING_CONFIGS.bouncy,
    delay: 1.5,
  },
};

// ============================================================================
// PORTAL TRANSITION ANIMATIONS
// ============================================================================

export const LETTER_PARTICLE: AnimationPreset = {
  initial: { x: 0, y: 0, opacity: 1 },
  animate: (i: number) => ({
    x: [0, Math.cos(i) * 200, 0],
    y: [0, Math.sin(i) * 200, 0],
    opacity: [1, 0.5, 0],
    scale: [1, 1.5, 0],
  }),
  transition: {
    duration: 1,
    ease: 'easeInOut',
  },
};

export const VORTEX_SPIN: AnimationPreset = {
  initial: { scale: 0, rotate: 0, opacity: 0 },
  animate: { scale: 1, rotate: 720, opacity: 1 },
  exit: { scale: 3, rotate: 1080, opacity: 0 },
  transition: {
    duration: 2,
    ease: 'easeInOut',
  },
};

export const VORTEX_PARTICLE = (angle: number, radius: number): AnimationPreset => ({
  initial: { x: '50%', y: '50%', scale: 1 },
  animate: {
    x: `calc(50% + ${Math.cos(angle) * radius}px)`,
    y: `calc(50% + ${Math.sin(angle) * radius}px)`,
    scale: [1, 0.5, 0],
    rotate: [0, 360],
  },
  transition: {
    duration: 1,
    ease: 'easeIn',
  },
});

export const DASHBOARD_ELEMENT_REFORM: AnimationPreset = {
  initial: { scale: 0, opacity: 0, rotate: -45 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
  transition: {
    ...SPRING_CONFIGS.bouncy,
    duration: 0.6,
  },
};

// ============================================================================
// DASHBOARD AWAKENING ANIMATIONS
// ============================================================================

export const MANIFESTATION_HERO: AnimationPreset = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: {
    delay: 0.5,
    ...SPRING_CONFIGS.smooth,
  },
};

export const ENERGY_MODAL_SLIDE: AnimationPreset = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: {
    ...SPRING_CONFIGS.smooth,
  },
};

export const FIRST_TASK_CARD: AnimationPreset = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  transition: {
    delay: 1.5,
    ...SPRING_CONFIGS.smooth,
  },
};

export const GLOW_PULSE: AnimationPreset = {
  initial: { opacity: 0.3 },
  animate: {
    opacity: [0.3, 0.8, 0.3],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const TUTORIAL_HIGHLIGHT: AnimationPreset = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    boxShadow: [
      '0 0 0 0 rgba(168, 85, 247, 0)',
      '0 0 30px 10px rgba(168, 85, 247, 0.5)',
      '0 0 0 0 rgba(168, 85, 247, 0)',
    ],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
  },
};

export const PERFECT_DAY_TRACKER: AnimationPreset = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: SPRING_CONFIGS.smooth,
};

// ============================================================================
// CELEBRATION ANIMATIONS
// ============================================================================

export const CONFETTI_PIECE: AnimationPreset = {
  initial: { y: -10, rotate: 0, opacity: 1 },
  animate: (() => {
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    return {
      y: windowHeight + 10,
      rotate: Math.random() * 360,
      x: Math.random() * windowWidth,
      opacity: [1, 1, 0],
    };
  }) as any,
  transition: {
    duration: 2 + Math.random(),
    ease: 'easeOut',
  },
};

export const XP_FLY_UP: AnimationPreset = {
  initial: { y: 0, opacity: 1, scale: 1 },
  animate: { y: -100, opacity: 0, scale: 1.5 },
  transition: {
    duration: 1,
    ease: 'easeOut',
  },
};

export const STREAK_COUNTER_UPDATE: AnimationPreset = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.3, 1],
  },
  transition: {
    duration: 0.4,
    ease: 'easeInOut',
  },
};

export const FIRE_EMOJI_APPEAR: AnimationPreset = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: {
    ...SPRING_CONFIGS.bouncy,
    delay: 0.2,
  },
};

export const PERFECT_DAY_CELEBRATION: AnimationPreset = {
  initial: { scale: 0, rotate: 0 },
  animate: {
    scale: [0, 1.2, 1],
    rotate: [0, 360, 360],
  },
  transition: {
    duration: 0.8,
    ease: 'easeOut',
  },
};

// ============================================================================
// LIQUID PROGRESS ANIMATION
// ============================================================================

export const LIQUID_FILL: AnimationPreset = {
  initial: { width: 0 },
  animate: { width: '100%' },
  transition: {
    duration: 1,
    ease: 'easeOut',
  },
};

export const LIQUID_WAVE: AnimationPreset = {
  initial: { x: 0 },
  animate: {
    x: [0, 50, 0],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// ============================================================================
// FLOATING KEYWORD ORBS
// ============================================================================

export const ORB_ENTER: AnimationPreset = {
  initial: { opacity: 0, scale: 0, x: 0, y: 0 },
  animate: (position: { x: number; y: number }) => ({
    opacity: 1,
    scale: 1,
    x: position.x,
    y: position.y,
  }),
  exit: (position: { x: number; y: number }) => ({
    opacity: 0,
    scale: 2,
    x: position.x * 3,
    y: position.y * 3,
  }),
  transition: {
    duration: 2,
    ease: 'easeOut',
  },
};

export const ORB_FLOAT = (index: number): AnimationPreset => ({
  initial: {},
  animate: {
    y: [0, -20, 0],
  },
  transition: {
    duration: 3 + index * 0.3,
    repeat: Infinity,
    ease: 'easeInOut',
  },
});

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

export const PAGE_FADE: AnimationPreset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export const PAGE_SLIDE: AnimationPreset = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
  transition: SPRING_CONFIGS.smooth,
};

export const PAGE_SCALE: AnimationPreset = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 1.1, opacity: 0 },
  transition: { duration: 0.3 },
};

// ============================================================================
// REDUCED MOTION FALLBACKS
// ============================================================================

export const REDUCED_MOTION_FADE: AnimationPreset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const REDUCED_MOTION_NONE: AnimationPreset = {
  initial: {},
  animate: {},
  exit: {},
  transition: { duration: 0 },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get animation preset based on reduced motion preference
 */
export function getAccessibleAnimation(
  normalPreset: AnimationPreset,
  reducedMotion: boolean
): AnimationPreset {
  return reducedMotion ? REDUCED_MOTION_FADE : normalPreset;
}

/**
 * Create staggered animation for lists
 */
export function createStagger(
  baseDelay: number = 0,
  staggerDelay: number = 0.1
): (index: number) => number {
  return (index: number) => baseDelay + index * staggerDelay;
}

/**
 * Generate random confetti position
 */
export function randomConfettiPosition(): { x: number; y: number } {
  return {
    x: Math.random() * window.innerWidth,
    y: -10,
  };
}

/**
 * Get spring config by name
 */
export function getSpringConfig(name: keyof typeof SPRING_CONFIGS): SpringConfig {
  return SPRING_CONFIGS[name];
}
