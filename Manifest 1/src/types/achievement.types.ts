/**
 * Achievement System Type Definitions
 *
 * Defines the structure for the gamification and achievement system
 * that drives user engagement and celebrates transformation milestones.
 */

export type AchievementTrigger =
  | 'onboarding_complete'
  | 'first_habit_complete'
  | 'perfect_day_1'
  | 'week_warrior'
  | 'month_master'
  | 'streak_7'
  | 'streak_30'
  | 'streak_100'
  | 'first_journal'
  | 'manifestation_achieved'
  | 'energy_tracked_7_days'
  | 'all_nonnegotiables_complete';

export type AchievementCategory =
  | 'onboarding'
  | 'habits'
  | 'streaks'
  | 'manifestation'
  | 'consistency'
  | 'transformation';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or icon identifier
  category: AchievementCategory;
  xp: number;
  trigger: AchievementTrigger;

  // Optional requirements
  requirement?: {
    type: 'count' | 'streak' | 'completion';
    value: number;
  };

  // Archetype-specific achievements
  archetypeSpecific?: boolean;
  archetypes?: string[];

  // Unlock state (populated from database)
  unlocked?: boolean;
  unlocked_at?: Date;
  celebrated?: boolean;
}

export interface AchievementUnlock {
  achievement: Achievement;
  timestamp: Date;
  context?: Record<string, any>;
}

export interface UserAchievementProgress {
  total_xp: number;
  level: number;
  achievements_unlocked: Achievement[];
  achievements_pending: Achievement[];
  next_achievement?: Achievement;
}

// Achievement definitions (will be populated in constants)
export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  xp: number;
  trigger: AchievementTrigger;
  requirement?: {
    type: 'count' | 'streak' | 'completion';
    value: number;
  };
}

// XP and level system
export interface XPGain {
  amount: number;
  source: string;
  timestamp: Date;
  context?: Record<string, any>;
}

export interface LevelUp {
  previousLevel: number;
  newLevel: number;
  xpRequired: number;
  rewards?: string[];
}

// Achievement notification
export interface AchievementNotification {
  achievement: Achievement;
  xpGain: XPGain;
  showConfetti: boolean;
  celebrationDuration: number; // milliseconds
  sound?: string;
}
