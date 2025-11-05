/**
 * Animation System Type Definitions
 *
 * Defines types for Framer Motion animations, transitions, and effects
 * used throughout the onboarding and dashboard awakening experience.
 */

import { Transition, Variant } from 'framer-motion';

export type AnimationSpeed = 'instant' | 'fast' | 'normal' | 'smooth' | 'slow' | 'dramatic';

export type AnimationType =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'rotate'
  | 'spring'
  | 'pulse'
  | 'glow'
  | 'shimmer'
  | 'float';

export interface AnimationPreset {
  initial: Variant;
  animate: Variant;
  exit?: Variant;
  transition?: Transition;
}

export interface SpringConfig {
  type: 'spring';
  stiffness: number;
  damping: number;
  mass?: number;
}

export const SPRING_CONFIGS = {
  smooth: { stiffness: 300, damping: 30 },
  bouncy: { stiffness: 400, damping: 20 },
  slow: { stiffness: 100, damping: 20 },
  snappy: { stiffness: 500, damping: 35 },
} as const;

export type SpringPreset = keyof typeof SPRING_CONFIGS;

// Particle system
export interface Particle {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number };
  lifetime: number;
  maxLifetime: number;
  size: number;
  color: string;
  opacity: number;
}

export interface ParticleConfig {
  count: number;
  origin: { x: number; y: number };
  spread: number;
  velocity: { min: number; max: number };
  lifetime: { min: number; max: number };
  size: { min: number; max: number };
  colors: string[];
  gravity?: number;
}

export interface VortexConfig {
  particleCount: number;
  radius: number;
  rotationSpeed: number;
  colors: string[];
  centerPull: number;
}

// Confetti
export interface ConfettiConfig {
  particleCount: number;
  spread: number;
  origin: { x: number; y: number };
  colors: string[];
  gravity: number;
  drift: number;
  ticks: number;
}

// Portal transition
export interface PortalPhase {
  phase: 'letters' | 'vortex' | 'reform' | 'complete';
  duration: number;
  delay?: number;
}

export interface PortalConfig {
  phases: PortalPhase[];
  totalDuration: number;
  archetypeColors: string[];
  letterCount: number;
  vortexParticles: number;
}

// Timing sequences
export interface TimingSequence {
  name: string;
  steps: Array<{
    action: string;
    delay: number;
    duration?: number;
  }>;
  totalDuration: number;
}

// Animation performance
export interface AnimationPerformance {
  fps: number;
  frameTime: number;
  droppedFrames: number;
  averageFPS: number;
}

// Reduced motion
export type ReducedMotionPreference = 'no-preference' | 'reduce';

export interface AccessibilityAnimationConfig {
  reducedMotion: boolean;
  disableParticles: boolean;
  simplifyTransitions: boolean;
  skipCeremonies: boolean;
}
