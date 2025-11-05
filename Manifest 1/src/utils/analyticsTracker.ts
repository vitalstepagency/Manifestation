/**
 * Analytics Tracker
 *
 * Comprehensive event tracking for optimization of the onboarding ceremony
 * and dashboard awakening experience. Tracks every interaction to identify
 * friction points and optimize conversion rates.
 *
 * CRITICAL: This data determines if we hit 85% onboarding→first action conversion.
 */

import type {
  AnalyticsEvent,
  OnboardingEventData,
  PortalEventData,
  DashboardEventData,
  AchievementEventData,
  ConversionFunnel,
  PerformanceMetric,
} from '../types/analytics.types';

// ============================================================================
// ANALYTICS CONFIGURATION
// ============================================================================

const ANALYTICS_CONFIG = {
  enabled: true,
  debugMode: import.meta.env.DEV,
  batchEvents: true,
  batchSize: 10,
  flushInterval: 5000, // 5 seconds
  trackPerformance: true,
  trackErrors: true,
};

// ============================================================================
// EVENT QUEUE
// ============================================================================

class EventQueue {
  private queue: AnalyticsEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  add(event: AnalyticsEvent) {
    this.queue.push(event);

    // Log in dev mode
    if (ANALYTICS_CONFIG.debugMode) {
      console.log('[Analytics]', event);
    }

    // Store in localStorage for later sync
    this.persistEvent(event);

    // Auto-flush if batch size reached
    if (this.queue.length >= ANALYTICS_CONFIG.batchSize) {
      this.flush();
    } else {
      // Schedule flush
      this.scheduleFlush();
    }
  }

  private scheduleFlush() {
    if (this.flushTimer) return;

    this.flushTimer = setTimeout(() => {
      this.flush();
      this.flushTimer = null;
    }, ANALYTICS_CONFIG.flushInterval);
  }

  private async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      // In production, send to analytics service (PostHog, Mixpanel, etc.)
      await this.sendToAnalyticsService(events);
    } catch (error) {
      console.error('[Analytics] Failed to flush events:', error);
      // Re-queue events for retry
      this.queue.unshift(...events);
    }
  }

  private async sendToAnalyticsService(events: AnalyticsEvent[]) {
    // TODO: Integrate with PostHog or Mixpanel
    // For now, just store in localStorage
    const existingEvents = this.getStoredEvents();
    const allEvents = [...existingEvents, ...events];

    // Keep last 1000 events
    const trimmedEvents = allEvents.slice(-1000);
    localStorage.setItem('manifest_analytics_events', JSON.stringify(trimmedEvents));
  }

  private persistEvent(event: AnalyticsEvent) {
    const key = `manifest_event_${Date.now()}_${Math.random()}`;
    localStorage.setItem(key, JSON.stringify(event));

    // Clean up old events (older than 7 days)
    this.cleanupOldEvents();
  }

  private cleanupOldEvents() {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('manifest_event_')) {
        const timestamp = parseInt(key.split('_')[2]);
        if (timestamp < sevenDaysAgo) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  private getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem('manifest_analytics_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}

const eventQueue = new EventQueue();

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('manifest_session_id');

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('manifest_session_id', sessionId);
  }

  return sessionId;
}

function getUserId(): string | undefined {
  // Get from store or localStorage
  const stored = localStorage.getItem('manifest-store');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return parsed.state?.user?.id;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

// ============================================================================
// ONBOARDING EVENTS
// ============================================================================

export const trackOnboardingStarted = () => {
  const event: OnboardingEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'onboarding',
    event: 'onboarding_started',
  };
  eventQueue.add(event);
};

export const trackOnboardingScreenView = (screen: number, screenName: string) => {
  const event: OnboardingEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'onboarding',
    event: 'onboarding_screen_view',
    screen,
    screenName,
  };
  eventQueue.add(event);
};

export const trackOnboardingScreenCompleted = (
  screen: number,
  screenName: string,
  timeOnScreen: number
) => {
  const event: OnboardingEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'onboarding',
    event: 'onboarding_screen_completed',
    screen,
    screenName,
    timeOnScreen,
  };
  eventQueue.add(event);
};

export const trackOnboardingDropout = (
  screen: number,
  screenName: string,
  reason?: string
) => {
  const event: OnboardingEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'onboarding',
    event: 'onboarding_dropout',
    screen,
    screenName,
    dropoffReason: reason,
  };
  eventQueue.add(event);
};

export const trackArchetypeSelected = (archetype: string) => {
  const event: OnboardingEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'onboarding',
    event: 'archetype_selected',
    archetype,
  };
  eventQueue.add(event);
};

export const trackSayItOutLoudCompleted = () => {
  const event: OnboardingEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'onboarding',
    event: 'say_it_out_loud_completed',
  };
  eventQueue.add(event);
};

export const trackCountdownStarted = () => {
  const event: OnboardingEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'onboarding',
    event: 'countdown_started',
  };
  eventQueue.add(event);
};

export const trackCountdownCompleted = () => {
  const event: OnboardingEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'onboarding',
    event: 'countdown_completed',
  };
  eventQueue.add(event);
};

export const trackFirstAchievementClaimed = () => {
  const event: OnboardingEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'onboarding',
    event: 'first_achievement_claimed',
  };
  eventQueue.add(event);
};

export const trackOnboardingCompleted = () => {
  const event: OnboardingEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'onboarding',
    event: 'onboarding_completed',
  };
  eventQueue.add(event);
};

// ============================================================================
// PORTAL TRANSITION EVENTS
// ============================================================================

export const trackPortalTransitionStarted = () => {
  const event: PortalEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'portal',
    event: 'portal_transition_started',
  };
  eventQueue.add(event);
};

export const trackPortalTransitionCompleted = (duration: number, fps: number) => {
  const event: PortalEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'portal',
    event: 'portal_transition_completed',
    duration,
    fps,
  };
  eventQueue.add(event);
};

export const trackPortalPreloadCompleted = (duration: number, dataPreloaded: string[]) => {
  const event: PortalEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'portal',
    event: 'portal_preload_completed',
    preloadDuration: duration,
    dataPreloaded,
  };
  eventQueue.add(event);
};

export const trackPortalFPS = (fps: number) => {
  const event: PortalEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'portal',
    event: 'portal_fps_measured',
    fps,
  };
  eventQueue.add(event);
};

// ============================================================================
// DASHBOARD AWAKENING EVENTS
// ============================================================================

export const trackDashboardFirstVisit = () => {
  const event: DashboardEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'dashboard_awakening',
    event: 'dashboard_first_visit',
  };
  eventQueue.add(event);
};

export const trackEnergyCheckCompleted = (energyLevel: number, timeToComplete: number) => {
  const event: DashboardEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'dashboard_awakening',
    event: 'energy_check_completed',
    energyLevel,
    timeToComplete,
  };
  eventQueue.add(event);
};

export const trackEnergyCheckSkipped = () => {
  const event: DashboardEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'dashboard_awakening',
    event: 'energy_check_skipped',
  };
  eventQueue.add(event);
};

export const trackFirstTaskViewed = (task: string) => {
  const event: DashboardEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'dashboard_awakening',
    event: 'first_task_viewed',
    firstTask: task,
  };
  eventQueue.add(event);
};

export const trackFirstTaskCompleted = (task: string, timeToComplete: number) => {
  const event: DashboardEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'dashboard_awakening',
    event: 'first_task_completed',
    firstTask: task,
    timeToComplete,
  };
  eventQueue.add(event);
};

export const trackTutorialHighlightShown = (step: string) => {
  const event: DashboardEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'dashboard_awakening',
    event: 'tutorial_highlight_shown',
    tutorialStep: step,
  };
  eventQueue.add(event);
};

export const trackDashboardAwakeningCompleted = () => {
  const event: DashboardEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'dashboard_awakening',
    event: 'dashboard_awakening_completed',
  };
  eventQueue.add(event);
};

// ============================================================================
// ACHIEVEMENT EVENTS
// ============================================================================

export const trackAchievementUnlocked = (achievementId: string, achievementTitle: string, xpAmount: number) => {
  const event: AchievementEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'achievement',
    event: 'achievement_unlocked',
    achievementId,
    achievementTitle,
    xpAmount,
  };
  eventQueue.add(event);
};

export const trackAchievementClaimed = (achievementId: string, achievementTitle: string, timeToClaim: number) => {
  const event: AchievementEventData = {
    timestamp: new Date(),
    userId: getUserId(),
    sessionId: getSessionId(),
    category: 'achievement',
    event: 'achievement_claimed',
    achievementId,
    achievementTitle,
    timeToClaim,
  };
  eventQueue.add(event);
};

// ============================================================================
// PERFORMANCE TRACKING
// ============================================================================

export const trackPerformance = (metric: string, value: number, context?: Record<string, any>) => {
  if (!ANALYTICS_CONFIG.trackPerformance) return;

  const performanceMetric: PerformanceMetric = {
    metric,
    value,
    timestamp: new Date(),
    context,
  };

  // Store performance metrics separately
  const metrics = getPerformanceMetrics();
  metrics.push(performanceMetric);

  // Keep last 100 metrics
  const trimmed = metrics.slice(-100);
  localStorage.setItem('manifest_performance_metrics', JSON.stringify(trimmed));
};

function getPerformanceMetrics(): PerformanceMetric[] {
  try {
    const stored = localStorage.getItem('manifest_performance_metrics');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// ============================================================================
// CONVERSION FUNNEL ANALYSIS
// ============================================================================

export function getConversionFunnel(): ConversionFunnel {
  const events = eventQueue['getStoredEvents']();

  const onboardingStarted = events.filter(
    e => 'event' in e && e.event === 'onboarding_started'
  ).length;

  const onboardingCompleted = events.filter(
    e => 'event' in e && e.event === 'onboarding_completed'
  ).length;

  const portalCompleted = events.filter(
    e => 'event' in e && e.event === 'portal_transition_completed'
  ).length;

  const dashboardVisited = events.filter(
    e => 'event' in e && e.event === 'dashboard_first_visit'
  ).length;

  const energyChecked = events.filter(
    e => 'event' in e && e.event === 'energy_check_completed'
  ).length;

  const firstTaskCompleted = events.filter(
    e => 'event' in e && e.event === 'first_task_completed'
  ).length;

  return {
    name: 'Onboarding to First Action',
    stages: [
      {
        stage: 'Started Onboarding',
        count: onboardingStarted,
        percentage: 100,
      },
      {
        stage: 'Completed Onboarding',
        count: onboardingCompleted,
        percentage: (onboardingCompleted / onboardingStarted) * 100,
        dropoffCount: onboardingStarted - onboardingCompleted,
        dropoffRate: ((onboardingStarted - onboardingCompleted) / onboardingStarted) * 100,
      },
      {
        stage: 'Portal Transition',
        count: portalCompleted,
        percentage: (portalCompleted / onboardingStarted) * 100,
      },
      {
        stage: 'Dashboard Entry',
        count: dashboardVisited,
        percentage: (dashboardVisited / onboardingStarted) * 100,
      },
      {
        stage: 'Energy Check',
        count: energyChecked,
        percentage: (energyChecked / onboardingStarted) * 100,
      },
      {
        stage: 'First Action Complete',
        count: firstTaskCompleted,
        percentage: (firstTaskCompleted / onboardingStarted) * 100,
      },
    ],
    totalStarted: onboardingStarted,
    totalCompleted: firstTaskCompleted,
    conversionRate: (firstTaskCompleted / onboardingStarted) * 100,
    averageDuration: 0, // TODO: Calculate from timestamps
  };
}

// ============================================================================
// DEBUG UTILITIES
// ============================================================================

export function getAnalyticsDebugInfo() {
  return {
    config: ANALYTICS_CONFIG,
    queueSize: eventQueue['queue'].length,
    storedEvents: eventQueue['getStoredEvents']().length,
    performanceMetrics: getPerformanceMetrics().length,
    conversionFunnel: getConversionFunnel(),
  };
}

export function clearAnalyticsData() {
  localStorage.removeItem('manifest_analytics_events');
  localStorage.removeItem('manifest_performance_metrics');

  // Clear individual events
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith('manifest_event_')) {
      localStorage.removeItem(key);
    }
  }
}
