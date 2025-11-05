/**
 * Analytics & Tracking Type Definitions
 *
 * Defines event tracking for optimization of the onboarding ceremony
 * and dashboard awakening experience.
 */

// Event categories
export type EventCategory =
  | 'onboarding'
  | 'portal'
  | 'dashboard_awakening'
  | 'achievement'
  | 'habit'
  | 'engagement'
  | 'performance';

// Onboarding events
export type OnboardingEvent =
  | 'onboarding_started'
  | 'onboarding_screen_view'
  | 'onboarding_screen_completed'
  | 'onboarding_screen_time'
  | 'onboarding_dropout'
  | 'archetype_selected'
  | 'manifestation_typed'
  | 'manifestation_submitted'
  | 'say_it_out_loud_shown'
  | 'say_it_out_loud_completed'
  | 'keyword_orb_generated'
  | 'countdown_started'
  | 'countdown_completed'
  | 'first_achievement_claimed'
  | 'onboarding_completed';

// Portal events
export type PortalEvent =
  | 'portal_transition_started'
  | 'portal_letters_animated'
  | 'portal_vortex_animated'
  | 'portal_dashboard_reformed'
  | 'portal_transition_completed'
  | 'portal_preload_started'
  | 'portal_preload_completed'
  | 'portal_fps_measured';

// Dashboard awakening events
export type DashboardEvent =
  | 'dashboard_first_visit'
  | 'dashboard_greeting_shown'
  | 'energy_check_shown'
  | 'energy_check_completed'
  | 'energy_check_skipped'
  | 'tutorial_highlight_shown'
  | 'tutorial_highlight_clicked'
  | 'tutorial_highlight_dismissed'
  | 'first_task_generated'
  | 'first_task_viewed'
  | 'first_task_completed'
  | 'perfect_day_progress_updated'
  | 'dashboard_awakening_completed';

// Achievement events
export type AchievementEvent =
  | 'achievement_unlocked'
  | 'achievement_viewed'
  | 'achievement_claimed'
  | 'achievement_celebrated'
  | 'xp_gained'
  | 'level_up';

// Generic event data
export interface BaseEventData {
  timestamp: Date;
  userId?: string;
  sessionId: string;
  category: EventCategory;
}

// Onboarding event data
export interface OnboardingEventData extends BaseEventData {
  event: OnboardingEvent;
  screen?: number;
  screenName?: string;
  timeOnScreen?: number; // seconds
  archetype?: string;
  dropoffReason?: string;
  context?: Record<string, any>;
}

// Portal event data
export interface PortalEventData extends BaseEventData {
  event: PortalEvent;
  phase?: string;
  duration?: number; // milliseconds
  fps?: number;
  preloadDuration?: number;
  dataPreloaded?: string[];
}

// Dashboard event data
export interface DashboardEventData extends BaseEventData {
  event: DashboardEvent;
  phase?: string;
  energyLevel?: number;
  tutorialStep?: string;
  firstTask?: string;
  timeToComplete?: number;
  perfectDayProgress?: number;
}

// Achievement event data
export interface AchievementEventData extends BaseEventData {
  event: AchievementEvent;
  achievementId: string;
  achievementTitle: string;
  xpAmount?: number;
  level?: number;
  timeToClaim?: number;
}

// Union type for all events
export type AnalyticsEvent =
  | OnboardingEventData
  | PortalEventData
  | DashboardEventData
  | AchievementEventData;

// Conversion funnel
export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  averageTime?: number;
  dropoffCount?: number;
  dropoffRate?: number;
}

export interface ConversionFunnel {
  name: string;
  stages: FunnelStage[];
  totalStarted: number;
  totalCompleted: number;
  conversionRate: number;
  averageDuration: number;
}

// Performance tracking
export interface PerformanceMetric {
  metric: string;
  value: number;
  timestamp: Date;
  context?: Record<string, any>;
}

export interface PerformanceSnapshot {
  fps: number;
  loadTime: number;
  memoryUsage?: number;
  networkLatency?: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
}

// A/B testing
export interface ABTestVariant {
  testName: string;
  variant: string;
  assignedAt: Date;
}

export interface ABTestResult {
  testName: string;
  variant: string;
  metric: string;
  value: number;
  sampleSize: number;
}

// Analytics configuration
export interface AnalyticsConfig {
  enabled: boolean;
  debugMode: boolean;
  batchEvents: boolean;
  batchSize: number;
  flushInterval: number; // milliseconds
  trackPerformance: boolean;
  trackErrors: boolean;
}
