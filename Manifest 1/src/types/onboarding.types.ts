/**
 * Onboarding System Type Definitions
 *
 * Defines types for the 8-screen onboarding ceremony that creates
 * the identity transformation experience.
 */

export type OnboardingScreen =
  | 'portal'           // 0: The awakening
  | 'archetype'        // 1: Identity selection
  | 'manifestation'    // 2: Goal setting
  | 'energy'           // 3: Energy calibration
  | 'sacred_three'     // 4: Non-negotiables
  | 'habits'           // 5: Habit alchemy
  | 'ceremony'         // 6: Transformation countdown
  | 'victory';         // 7: First achievement

export type ArchetypeKey = 'builder' | 'optimizer' | 'phoenix' | 'accelerator' | 'visionary' | 'emperor';

export interface Archetype {
  id: ArchetypeKey;
  emoji: string;
  title: string;
  subtitle: string;
  gradient: [string, string]; // Start and end colors
  glow: string;
  aiPersonality: string;
  defaultHabits: string[];
  description: string;
}

export interface OnboardingStep {
  screen: OnboardingScreen;
  index: number;
  completed: boolean;
  data?: Record<string, any>;
  startedAt?: Date;
  completedAt?: Date;
  timeSpent?: number; // seconds
}

export interface OnboardingProgress {
  currentScreen: OnboardingScreen;
  currentScreenIndex: number;
  completedScreens: OnboardingScreen[];
  totalScreens: number;
  percentComplete: number;

  // Collected data
  archetype?: ArchetypeKey;
  manifestationGoal?: string;
  goalKeywords?: string[];
  energyLevel?: number;
  nonNegotiables?: string[];
  habitToBuild?: string;
  habitToBreak?: string;

  // Metadata
  startedAt?: Date;
  lastSavedAt?: Date;
  resumedCount?: number;
}

export interface OnboardingState {
  isActive: boolean;
  progress: OnboardingProgress;

  // Ceremony states
  sayItOutLoud: {
    shown: boolean;
    spokenAt?: Date;
  };

  countdown: {
    started: boolean;
    currentCount?: number;
    messagesShown: string[];
  };

  achievement: {
    unlocked: boolean;
    claimed: boolean;
    claimedAt?: Date;
  };
}

// Manifestation data
export interface ManifestationData {
  goal: string;
  keywords: string[];
  emotionalWords: string[];
  deadline?: Date;
  category?: string;
}

// Keyword orb
export interface KeywordOrb {
  word: string;
  emotion?: string;
  color: string;
  position: { x: number; y: number };
  size: number;
  importance: number; // 0-1 based on TF-IDF score
}

// Non-negotiable
export interface NonNegotiable {
  id: string;
  title: string;
  order: number;
  category?: string;
}

// Habit selection
export interface HabitSelection {
  building?: {
    title: string;
    frequency: 'daily' | 'weekly';
    category?: string;
  };
  breaking?: {
    title: string;
    frequency: 'daily' | 'weekly';
    category?: string;
  };
}

// Countdown ceremony
export interface CountdownCeremony {
  duration: number; // Total seconds
  currentCount: number;
  messages: Record<number, string>; // Count -> message mapping
  archetypeReveal: number; // At which count to show archetype
  goalReveal: number; // At which count to show goal
}

// First achievement
export interface FirstAchievement {
  title: string;
  description: string;
  icon: string;
  xp: number;
  confetti: boolean;
  shimmer: boolean;
}

// Onboarding analytics
export interface OnboardingAnalytics {
  totalTime: number; // seconds
  dropoffScreen?: OnboardingScreen;
  dropoffReason?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  completedAt?: Date;
  resumedCount: number;
}

// Failsafe system
export interface OnboardingFailsafe {
  hasBackup: boolean;
  backupData?: OnboardingProgress;
  lastBackupAt?: Date;
  recoveryNeeded: boolean;
  welcomeBackMessage?: string;
}

// Onboarding completion result
export interface OnboardingResult {
  success: boolean;
  archetype: ArchetypeKey;
  manifestationGoal: string;
  nonNegotiables: string[];
  habits: HabitSelection;
  energyLevel: number;
  totalTime: number;
  analytics: OnboardingAnalytics;
}
