/**
 * ScrollReveal - GSAP-powered scroll-triggered animations
 *
 * Features:
 * - Smooth scroll-triggered reveals
 * - Multiple animation presets
 * - Stagger support for lists
 * - Performance-optimized with will-change
 */

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ANIMATION_PRINCIPLES } from '../systems/AnimationEngine';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// TYPES
// ============================================================================

interface ScrollRevealProps {
  /** Child elements to reveal */
  children: ReactNode;

  /** Animation preset */
  animation?:
    | 'fadeIn'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'scaleIn'
    | 'rotateIn'
    | 'custom';

  /** Custom GSAP animation (only used if animation="custom") */
  customAnimation?: gsap.TweenVars;

  /** Animation duration */
  duration?: number;

  /** Delay before animation starts (in seconds) */
  delay?: number;

  /** Animation easing */
  ease?: string;

  /** Stagger delay for child elements (in seconds) */
  stagger?: number;

  /** Trigger point (0-1, where 0.8 = 80% from top) */
  triggerPoint?: number;

  /** Whether to play animation once or every time it enters viewport */
  once?: boolean;

  /** Enable scrub (animation tied to scroll position) */
  scrub?: boolean | number;

  /** Custom className */
  className?: string;

  /** Markers for debugging (shows trigger points) */
  markers?: boolean;
}

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

const ANIMATION_PRESETS: Record<string, gsap.TweenVars> = {
  fadeIn: {
    opacity: 0,
  },

  slideUp: {
    opacity: 0,
    y: ANIMATION_PRINCIPLES.DISTANCE.HUGE,
  },

  slideDown: {
    opacity: 0,
    y: -ANIMATION_PRINCIPLES.DISTANCE.HUGE,
  },

  slideLeft: {
    opacity: 0,
    x: ANIMATION_PRINCIPLES.DISTANCE.HUGE,
  },

  slideRight: {
    opacity: 0,
    x: -ANIMATION_PRINCIPLES.DISTANCE.HUGE,
  },

  scaleIn: {
    opacity: 0,
    scale: 0.5,
  },

  rotateIn: {
    opacity: 0,
    rotation: -45,
    scale: 0.8,
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fadeIn',
  customAnimation,
  duration = ANIMATION_PRINCIPLES.TIMING.SMOOTH,
  delay = 0,
  ease = ANIMATION_PRINCIPLES.EASING.DRAMATIC,
  stagger = 0,
  triggerPoint = 0.8,
  once = true,
  scrub = false,
  className = '',
  markers = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;

    // Get the appropriate animation preset or custom
    const fromVars = animation === 'custom' && customAnimation
      ? customAnimation
      : ANIMATION_PRESETS[animation];

    // Set initial state
    gsap.set(element.children.length > 0 ? element.children : element, fromVars);

    // Create scroll-triggered animation
    const ctx = gsap.context(() => {
      if (element.children.length > 0 && stagger > 0) {
        // Animate children with stagger
        gsap.to(element.children, {
          ...fromVars,
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotation: 0,
          duration,
          delay,
          ease,
          stagger,
          scrollTrigger: {
            trigger: element,
            start: `top ${triggerPoint * 100}%`,
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
            scrub: scrub || false,
            markers: markers,
          },
        });
      } else {
        // Animate single element
        gsap.to(element, {
          ...fromVars,
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotation: 0,
          duration,
          delay,
          ease,
          scrollTrigger: {
            trigger: element,
            start: `top ${triggerPoint * 100}%`,
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
            scrub: scrub || false,
            markers: markers,
          },
        });
      }
    }, element);

    return () => {
      ctx.revert();
    };
  }, [animation, customAnimation, duration, delay, ease, stagger, triggerPoint, once, scrub, markers]);

  return (
    <div ref={containerRef} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
};

// ============================================================================
// CONVENIENCE COMPONENTS
// ============================================================================

/**
 * Fade in on scroll
 */
export const FadeIn: React.FC<Omit<ScrollRevealProps, 'animation'>> = (props) => (
  <ScrollReveal animation="fadeIn" {...props} />
);

/**
 * Slide up on scroll
 */
export const SlideUp: React.FC<Omit<ScrollRevealProps, 'animation'>> = (props) => (
  <ScrollReveal animation="slideUp" {...props} />
);

/**
 * Scale in on scroll
 */
export const ScaleIn: React.FC<Omit<ScrollRevealProps, 'animation'>> = (props) => (
  <ScrollReveal animation="scaleIn" {...props} />
);

/**
 * Stagger reveal for lists
 */
export const StaggerReveal: React.FC<Omit<ScrollRevealProps, 'stagger'>> = (props) => (
  <ScrollReveal stagger={0.1} {...props} />
);

export default ScrollReveal;
