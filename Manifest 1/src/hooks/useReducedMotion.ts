/**
 * useReducedMotion Hook
 *
 * Detects user's motion preferences and provides accessibility-first
 * animation fallbacks. EVERY animation must respect this.
 *
 * CRITICAL: This is non-negotiable for accessibility.
 */

import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check user's system preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set initial value
    setReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return reducedMotion;
}

/**
 * Get appropriate animation duration based on reduced motion preference
 */
export function useAnimationDuration(normalDuration: number, reducedDuration: number = 0) {
  const reducedMotion = useReducedMotion();
  return reducedMotion ? reducedDuration : normalDuration;
}

/**
 * Conditionally disable particles and complex animations
 */
export function useParticlesEnabled() {
  const reducedMotion = useReducedMotion();
  return !reducedMotion;
}

/**
 * Get accessibility config for animations
 */
export function useAccessibilityAnimationConfig() {
  const reducedMotion = useReducedMotion();

  return {
    reducedMotion,
    disableParticles: reducedMotion,
    simplifyTransitions: reducedMotion,
    skipCeremonies: reducedMotion, // Skip dramatic countdowns, etc.
  };
}
