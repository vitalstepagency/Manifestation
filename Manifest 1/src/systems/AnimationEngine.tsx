/**
 * Manifest Animation Engine
 *
 * World-class animation system with principles that surpass Apple/Google/Palantir
 * Every animation reinforces transformation and manifestation
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// ============================================================================
// ANIMATION PRINCIPLES
// ============================================================================

/**
 * Core animation principles for the Manifest app
 * These ensure consistent, premium feel across all interactions
 */
export const ANIMATION_PRINCIPLES = {
  // Timing - Apple-inspired but more purposeful
  TIMING: {
    INSTANT: 0.15,        // Instant feedback (button presses)
    QUICK: 0.3,           // Quick transitions (hover states)
    SMOOTH: 0.5,          // Smooth page transitions
    DRAMATIC: 0.8,        // Dramatic reveals (manifestations appearing)
    CINEMATIC: 1.2,       // Cinematic moments (portal transitions)
    MEDITATION: 2.0,      // Meditative, transformative moments
  },

  // Easing - Custom curves for emotional impact
  EASING: {
    // Smooth, natural feeling (most UI interactions)
    NATURAL: 'power2.out',

    // Snappy, responsive (button clicks, immediate feedback)
    SNAPPY: 'power3.out',

    // Elastic, playful (success states, celebrations)
    ELASTIC: 'elastic.out(1, 0.5)',

    // Bounce, joyful (manifestation completions)
    BOUNCE: 'bounce.out',

    // Smooth both ways (loading states, continuous animations)
    SMOOTH: 'power2.inOut',

    // Dramatic entrance (modals, important reveals)
    DRAMATIC: 'power4.out',

    // Exponential (fast start, slow end - feels "magical")
    MAGICAL: 'expo.out',
  },

  // Scale transforms for emphasis
  SCALE: {
    SUBTLE: 1.02,         // Subtle hover effect
    HOVER: 1.05,          // Standard hover state
    PRESS: 0.95,          // Button press feedback
    EMPHASIS: 1.1,        // Draw attention
    DRAMATIC: 1.2,        // Major reveal
    EXPLOSIVE: 1.5,       // Celebration moments
  },

  // Opacity for smooth appearances
  OPACITY: {
    HIDDEN: 0,
    SUBTLE: 0.3,
    MEDIUM: 0.6,
    VISIBLE: 1,
  },

  // Transform distances (in pixels)
  DISTANCE: {
    TINY: 4,
    SMALL: 8,
    MEDIUM: 16,
    LARGE: 32,
    HUGE: 64,
    DRAMATIC: 128,
  },
} as const;

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

/**
 * Pre-configured animations for common use cases
 */
export const ANIMATION_PRESETS = {
  // Fade in from invisible to visible
  fadeIn: (element: gsap.TweenTarget, duration = ANIMATION_PRINCIPLES.TIMING.SMOOTH) => {
    return gsap.fromTo(
      element,
      { opacity: 0 },
      { opacity: 1, duration, ease: ANIMATION_PRINCIPLES.EASING.NATURAL }
    );
  },

  // Slide in from bottom with fade
  slideInFromBottom: (element: gsap.TweenTarget, duration = ANIMATION_PRINCIPLES.TIMING.SMOOTH) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: ANIMATION_PRINCIPLES.DISTANCE.LARGE },
      { opacity: 1, y: 0, duration, ease: ANIMATION_PRINCIPLES.EASING.DRAMATIC }
    );
  },

  // Slide in from top with fade
  slideInFromTop: (element: gsap.TweenTarget, duration = ANIMATION_PRINCIPLES.TIMING.SMOOTH) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: -ANIMATION_PRINCIPLES.DISTANCE.LARGE },
      { opacity: 1, y: 0, duration, ease: ANIMATION_PRINCIPLES.EASING.DRAMATIC }
    );
  },

  // Scale in (pop effect)
  scaleIn: (element: gsap.TweenTarget, duration = ANIMATION_PRINCIPLES.TIMING.QUICK) => {
    return gsap.fromTo(
      element,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration, ease: ANIMATION_PRINCIPLES.EASING.ELASTIC }
    );
  },

  // Celebration burst (for manifestation completions)
  celebrationBurst: (element: gsap.TweenTarget) => {
    return gsap.timeline()
      .fromTo(
        element,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1.2,
          opacity: 1,
          duration: ANIMATION_PRINCIPLES.TIMING.QUICK,
          ease: ANIMATION_PRINCIPLES.EASING.DRAMATIC
        }
      )
      .to(element, {
        scale: 1,
        duration: ANIMATION_PRINCIPLES.TIMING.SMOOTH,
        ease: ANIMATION_PRINCIPLES.EASING.ELASTIC,
      });
  },

  // Gentle hover effect
  hoverLift: (element: gsap.TweenTarget) => {
    return gsap.to(element, {
      y: -ANIMATION_PRINCIPLES.DISTANCE.SMALL,
      scale: ANIMATION_PRINCIPLES.SCALE.HOVER,
      duration: ANIMATION_PRINCIPLES.TIMING.QUICK,
      ease: ANIMATION_PRINCIPLES.EASING.NATURAL,
    });
  },

  // Reset hover effect
  hoverReset: (element: gsap.TweenTarget) => {
    return gsap.to(element, {
      y: 0,
      scale: 1,
      duration: ANIMATION_PRINCIPLES.TIMING.QUICK,
      ease: ANIMATION_PRINCIPLES.EASING.NATURAL,
    });
  },

  // Button press feedback
  buttonPress: (element: gsap.TweenTarget) => {
    return gsap.timeline()
      .to(element, {
        scale: ANIMATION_PRINCIPLES.SCALE.PRESS,
        duration: ANIMATION_PRINCIPLES.TIMING.INSTANT,
        ease: ANIMATION_PRINCIPLES.EASING.SNAPPY,
      })
      .to(element, {
        scale: 1,
        duration: ANIMATION_PRINCIPLES.TIMING.QUICK,
        ease: ANIMATION_PRINCIPLES.EASING.ELASTIC,
      });
  },

  // Stagger children animation (for lists, grids)
  staggerChildren: (
    container: string,
    childSelector: string,
    animation: gsap.TweenVars,
    stagger = 0.1
  ) => {
    return gsap.fromTo(
      `${container} ${childSelector}`,
      { opacity: 0, y: ANIMATION_PRINCIPLES.DISTANCE.MEDIUM },
      {
        ...animation,
        stagger,
        ease: ANIMATION_PRINCIPLES.EASING.DRAMATIC,
      }
    );
  },
} as const;

// ============================================================================
// REACT HOOKS
// ============================================================================

/**
 * Hook to run an animation on mount
 */
export const useAnimateOnMount = (
  animationFn: () => gsap.core.Tween | gsap.core.Timeline,
  deps: React.DependencyList = []
) => {
  useEffect(() => {
    const animation = animationFn();
    return () => {
      animation.kill();
    };
  }, deps);
};

/**
 * Hook to create ref-based animations
 */
export const useAnimatedRef = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  const animate = (vars: gsap.TweenVars) => {
    if (ref.current) {
      return gsap.to(ref.current, vars);
    }
    return null;
  };

  const animateFrom = (from: gsap.TweenVars, to: gsap.TweenVars) => {
    if (ref.current) {
      return gsap.fromTo(ref.current, from, to);
    }
    return null;
  };

  return { ref, animate, animateFrom };
};

/**
 * Hook for hover animations
 */
export const useHoverAnimation = <T extends HTMLElement>(
  hoverVars: gsap.TweenVars,
  resetVars: gsap.TweenVars
) => {
  const ref = useRef<T>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      gsap.to(ref.current, {
        ...hoverVars,
        duration: ANIMATION_PRINCIPLES.TIMING.QUICK,
        ease: ANIMATION_PRINCIPLES.EASING.NATURAL,
      });
    }
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      gsap.to(ref.current, {
        ...resetVars,
        duration: ANIMATION_PRINCIPLES.TIMING.QUICK,
        ease: ANIMATION_PRINCIPLES.EASING.NATURAL,
      });
    }
  };

  return {
    ref,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };
};

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Mark animation performance for monitoring
 */
export const markAnimation = (name: string, start: boolean = true) => {
  if (start) {
    performance.mark(`${name}-start`);
  } else {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }
};

/**
 * Enable GSAP performance optimizations
 */
export const enablePerformanceMode = () => {
  // Force hardware acceleration
  gsap.config({
    force3D: true,
    nullTargetWarn: false,
  });

  // Set default ease for performance
  gsap.defaults({
    ease: ANIMATION_PRINCIPLES.EASING.NATURAL,
    duration: ANIMATION_PRINCIPLES.TIMING.SMOOTH,
  });
};

// Initialize on import
enablePerformanceMode();

export default {
  PRINCIPLES: ANIMATION_PRINCIPLES,
  PRESETS: ANIMATION_PRESETS,
  markAnimation,
  enablePerformanceMode,
};
