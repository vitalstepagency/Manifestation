/**
 * useOnboardingProgress Hook
 *
 * Manages onboarding progress with automatic saving after EVERY step
 * to localStorage AND Supabase. Ensures users never lose progress.
 *
 * CRITICAL: The failsafe system - if someone drops during onboarding,
 * they can resume exactly where they left off with a "Welcome back" message.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { OnboardingProgress, OnboardingScreen, ArchetypeKey } from '../types/onboarding.types';
import { useManifestStore } from '../store/useManifestStore';
import { db } from '../lib/supabase';
import {
  trackOnboardingScreenView,
  trackOnboardingScreenCompleted,
  trackOnboardingCompleted,
} from '../utils/analyticsTracker';

const SCREENS: OnboardingScreen[] = [
  'portal',
  'archetype',
  'manifestation',
  'energy',
  'sacred_three',
  'habits',
  'ceremony',
  'victory',
];

const AUTOSAVE_DELAY = 500; // ms - debounce autosave

export function useOnboardingProgress() {
  const user = useManifestStore(state => state.user);
  const [progress, setProgress] = useState<OnboardingProgress>(getInitialProgress);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);
  const autosaveTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const screenStartTimeRef = useRef<Date>(new Date());

  // =========================================================================
  // INITIALIZATION - Load saved progress
  // =========================================================================

  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);

      // Try to load from localStorage first (instant)
      const localProgress = loadFromLocalStorage();

      if (localProgress) {
        setProgress(localProgress);
        setHasRestoredProgress(true);
      }

      // Then try to load from Supabase (authoritative)
      if (user) {
        const serverProgress = await loadFromSupabase(user.id);
        if (serverProgress) {
          setProgress(serverProgress);
          setHasRestoredProgress(true);
        }
      }

      setIsLoading(false);
    };

    loadProgress();
  }, [user]);

  // =========================================================================
  // AUTO-SAVE - After every data change
  // =========================================================================

  useEffect(() => {
    // Debounce autosave
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      saveProgress(progress);
    }, AUTOSAVE_DELAY);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [progress]);

  // =========================================================================
  // SCREEN NAVIGATION
  // =========================================================================

  const goToScreen = useCallback((screen: OnboardingScreen) => {
    // Track screen completion for previous screen
    const previousScreenIndex = SCREENS.indexOf(progress.currentScreen);
    const timeOnScreen = Math.floor((Date.now() - screenStartTimeRef.current.getTime()) / 1000);

    if (timeOnScreen > 0) {
      trackOnboardingScreenCompleted(
        previousScreenIndex,
        progress.currentScreen,
        timeOnScreen
      );
    }

    // Update progress
    const screenIndex = SCREENS.indexOf(screen);
    const completedScreens = [...progress.completedScreens];

    if (!completedScreens.includes(progress.currentScreen)) {
      completedScreens.push(progress.currentScreen);
    }

    setProgress(prev => ({
      ...prev,
      currentScreen: screen,
      currentScreenIndex: screenIndex,
      completedScreens,
      percentComplete: Math.floor((completedScreens.length / SCREENS.length) * 100),
      lastSavedAt: new Date(),
    }));

    // Track new screen view
    trackOnboardingScreenView(screenIndex, screen);
    screenStartTimeRef.current = new Date();
  }, [progress]);

  const nextScreen = useCallback(() => {
    const currentIndex = SCREENS.indexOf(progress.currentScreen);
    if (currentIndex < SCREENS.length - 1) {
      goToScreen(SCREENS[currentIndex + 1]);
    }
  }, [progress, goToScreen]);

  const previousScreen = useCallback(() => {
    const currentIndex = SCREENS.indexOf(progress.currentScreen);
    if (currentIndex > 0) {
      goToScreen(SCREENS[currentIndex - 1]);
    }
  }, [progress, goToScreen]);

  // =========================================================================
  // DATA COLLECTION
  // =========================================================================

  const setArchetype = useCallback((archetype: ArchetypeKey) => {
    setProgress(prev => ({
      ...prev,
      archetype,
    }));
  }, []);

  const setManifestationGoal = useCallback((goal: string, keywords?: string[]) => {
    setProgress(prev => ({
      ...prev,
      manifestationGoal: goal,
      goalKeywords: keywords || prev.goalKeywords,
    }));
  }, []);

  const setEnergyLevel = useCallback((level: number) => {
    setProgress(prev => ({
      ...prev,
      energyLevel: level,
    }));
  }, []);

  const setNonNegotiables = useCallback((nonNegotiables: string[]) => {
    setProgress(prev => ({
      ...prev,
      nonNegotiables,
    }));
  }, []);

  const setHabits = useCallback((building: string, breaking: string) => {
    setProgress(prev => ({
      ...prev,
      habitToBuild: building,
      habitToBreak: breaking,
    }));
  }, []);

  // =========================================================================
  // COMPLETION
  // =========================================================================

  const completeOnboarding = useCallback(async () => {
    // Mark all screens as completed
    setProgress(prev => ({
      ...prev,
      completedScreens: SCREENS,
      percentComplete: 100,
      lastSavedAt: new Date(),
    }));

    // Track completion
    trackOnboardingCompleted();

    // Save final state
    await saveProgress({
      ...progress,
      completedScreens: SCREENS,
      percentComplete: 100,
    });

    // Mark onboarding as complete in main store
    if (user) {
      await useManifestStore.getState().completeOnboarding();
    }
  }, [progress, user]);

  // =========================================================================
  // RESET (for testing)
  // =========================================================================

  const resetProgress = useCallback(() => {
    const initialProgress = getInitialProgress();
    setProgress(initialProgress);
    clearLocalStorage();

    if (user) {
      db.profiles.update(user.id, {
        onboarding_progress: initialProgress as any,
        onboarding_completed: false,
      });
    }
  }, [user]);

  // =========================================================================
  // HELPERS
  // =========================================================================

  const getWelcomeBackMessage = useCallback(() => {
    if (!hasRestoredProgress) return null;

    const screenMessages: Record<OnboardingScreen, string> = {
      portal: 'Your transformation is waiting...',
      archetype: 'Let\'s discover your archetype',
      manifestation: 'Your dream is calling',
      energy: 'Let\'s calibrate your energy',
      sacred_three: 'Define your non-negotiables',
      habits: 'Build your transformation habits',
      ceremony: 'The ceremony continues',
      victory: 'Claim your victory',
    };

    return screenMessages[progress.currentScreen] || 'Welcome back. Let\'s continue your transformation.';
  }, [hasRestoredProgress, progress.currentScreen]);

  // =========================================================================
  // RETURN
  // =========================================================================

  return {
    // State
    progress,
    isLoading,
    hasRestoredProgress,

    // Navigation
    goToScreen,
    nextScreen,
    previousScreen,

    // Data collection
    setArchetype,
    setManifestationGoal,
    setEnergyLevel,
    setNonNegotiables,
    setHabits,

    // Completion
    completeOnboarding,

    // Reset
    resetProgress,

    // Helpers
    welcomeBackMessage: getWelcomeBackMessage(),
    canGoNext: true, // Can be enhanced with validation
    canGoPrevious: progress.currentScreenIndex > 0,
    totalScreens: SCREENS.length,
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getInitialProgress(): OnboardingProgress {
  return {
    currentScreen: 'portal',
    currentScreenIndex: 0,
    completedScreens: [],
    totalScreens: SCREENS.length,
    percentComplete: 0,
    startedAt: new Date(),
  };
}

function loadFromLocalStorage(): OnboardingProgress | null {
  try {
    const stored = localStorage.getItem('manifest_onboarding_progress');
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Convert date strings back to Date objects
    return {
      ...parsed,
      startedAt: new Date(parsed.startedAt),
      lastSavedAt: parsed.lastSavedAt ? new Date(parsed.lastSavedAt) : undefined,
    };
  } catch (error) {
    console.error('[useOnboardingProgress] Failed to load from localStorage:', error);
    return null;
  }
}

async function loadFromSupabase(userId: string): Promise<OnboardingProgress | null> {
  try {
    const { data: profile, error } = await db.profiles.get(userId);

    if (error || !profile || !profile.onboarding_progress) {
      return null;
    }

    const progress = profile.onboarding_progress as any;

    // Convert to OnboardingProgress type
    return {
      currentScreen: progress.currentScreen || 'portal',
      currentScreenIndex: SCREENS.indexOf(progress.currentScreen || 'portal'),
      completedScreens: progress.completedScreens || [],
      totalScreens: SCREENS.length,
      percentComplete: progress.percentComplete || 0,
      archetype: progress.archetype,
      manifestationGoal: progress.manifestationGoal,
      goalKeywords: progress.goalKeywords,
      energyLevel: progress.energyLevel,
      nonNegotiables: progress.nonNegotiables,
      habitToBuild: progress.habitToBuild,
      habitToBreak: progress.habitToBreak,
      startedAt: progress.startedAt ? new Date(progress.startedAt) : new Date(),
      lastSavedAt: progress.lastSavedAt ? new Date(progress.lastSavedAt) : undefined,
      resumedCount: (progress.resumedCount || 0) + 1,
    };
  } catch (error) {
    console.error('[useOnboardingProgress] Failed to load from Supabase:', error);
    return null;
  }
}

async function saveProgress(progress: OnboardingProgress) {
  // Save to localStorage immediately
  try {
    localStorage.setItem('manifest_onboarding_progress', JSON.stringify(progress));
  } catch (error) {
    console.error('[useOnboardingProgress] Failed to save to localStorage:', error);
  }

  // Save to Supabase in background
  const userId = useManifestStore.getState().user?.id;
  if (userId) {
    try {
      await db.profiles.update(userId, {
        onboarding_progress: progress as any,
      });
    } catch (error) {
      console.error('[useOnboardingProgress] Failed to save to Supabase:', error);
      // Don't throw - localStorage backup exists
    }
  }
}

function clearLocalStorage() {
  localStorage.removeItem('manifest_onboarding_progress');
}
