/**
 * First Action Generator
 *
 * AI-powered first task generation based on manifestation goal
 * and user archetype to create immediate engagement on dashboard entry.
 */

import type { ArchetypeKey } from '../types/onboarding.types';

export interface FirstAction {
  task: string;
  category: string;
  estimatedTime: number; // minutes
  xpReward: number;
  archetype: ArchetypeKey;
}

// Archetype-specific task templates
const ARCHETYPE_TEMPLATES: Record<ArchetypeKey, {
  templates: string[];
  style: string;
  focusArea: string;
}> = {
  builder: {
    templates: [
      'Define your MVP: What\'s the smallest version of {goal} you can ship?',
      'List the first 3 features your {goal} absolutely needs',
      'Write a one-sentence pitch for {goal}',
      'Identify the #1 blocker preventing {goal} and write how to overcome it',
      'Break down {goal} into 5 concrete milestones',
    ],
    style: 'action-oriented, shipping-focused',
    focusArea: 'Building and creating',
  },

  optimizer: {
    templates: [
      'Time-block your next 90 minutes for focused work on {goal}',
      'Identify the 20% of actions that will drive 80% of {goal} results',
      'Create a prioritization matrix for all {goal} tasks',
      'Eliminate one time-waster that\'s blocking {goal}',
      'Set up a tracking system to measure {goal} progress daily',
    ],
    style: 'efficiency-focused, metrics-driven',
    focusArea: 'Optimization and measurement',
  },

  phoenix: {
    templates: [
      'Write down the #1 fear holding you back from {goal}, then burn/destroy the paper',
      'List 3 limiting beliefs about {goal} and replace them with empowering ones',
      'Declare your commitment to {goal} out loud right now',
      'Identify what version of yourself you\'re leaving behind to achieve {goal}',
      'Write a letter from your future self who achieved {goal}',
    ],
    style: 'transformation-focused, identity-based',
    focusArea: 'Overcoming and rising',
  },

  accelerator: {
    templates: [
      'Take one immediate action toward {goal} in the next 10 minutes',
      'Make the fastest possible progress on {goal} today - quantity over perfection',
      'Ship a micro-version of {goal} before midnight',
      'Speed-run the first step of {goal} with a 30-minute timer',
      'Remove one decision standing between you and {goal} momentum',
    ],
    style: 'speed-focused, action-biased',
    focusArea: 'Velocity and execution',
  },

  visionary: {
    templates: [
      'Sketch the future state: What does success with {goal} look like in vivid detail?',
      'Create a vision board (digital or physical) for {goal}',
      'Write the announcement post for when you achieve {goal}',
      'Identify 3 innovative approaches others haven\'t tried for {goal}',
      'Map out how {goal} fits into your 10-year vision',
    ],
    style: 'vision-focused, big-picture thinking',
    focusArea: 'Envisioning and innovating',
  },

  emperor: {
    templates: [
      'Identify the first person you need to recruit/delegate to for {goal}',
      'Draft a 90-day empire-building plan for {goal}',
      'List the resources and team you\'ll need to scale {goal}',
      'Define the success metrics that will guide {goal} to empire status',
      'Establish the first system that will run {goal} without you',
    ],
    style: 'empire-building, delegation-focused',
    focusArea: 'Scaling and leadership',
  },
};

/**
 * Generate a personalized first action based on goal and archetype
 */
export function generateFirstAction(
  manifestationGoal: string,
  archetype: ArchetypeKey
): FirstAction {
  // Use the manifestation goal directly
  const goalText = manifestationGoal || 'goal';

  // Get archetype templates
  const archetypeData = ARCHETYPE_TEMPLATES[archetype];

  // Select a random template (in production, could use more sophisticated selection)
  const template = archetypeData.templates[Math.floor(Math.random() * archetypeData.templates.length)];

  // Replace placeholder with actual goal
  const task = template.replace('{goal}', goalText);

  // Estimate time based on task complexity
  const estimatedTime = estimateTaskTime(task);

  return {
    task,
    category: archetypeData.focusArea,
    estimatedTime,
    xpReward: 10, // Base reward for first action
    archetype,
  };
}

/**
 * Generate multiple first action options for user choice
 */
export function generateFirstActionOptions(
  manifestationGoal: string,
  archetype: ArchetypeKey,
  count: number = 3
): FirstAction[] {
  const goalText = manifestationGoal || 'goal';
  const archetypeData = ARCHETYPE_TEMPLATES[archetype];

  // Get unique templates
  const selectedTemplates = shuffleArray(archetypeData.templates).slice(0, count);

  return selectedTemplates.map(template => {
    const task = template.replace('{goal}', goalText);
    return {
      task,
      category: archetypeData.focusArea,
      estimatedTime: estimateTaskTime(task),
      xpReward: 10,
      archetype,
    };
  });
}

/**
 * Estimate task completion time based on task description
 */
function estimateTaskTime(task: string): number {
  const lowerTask = task.toLowerCase();

  // Quick actions (5-10 minutes)
  if (
    lowerTask.includes('list') ||
    lowerTask.includes('write down') ||
    lowerTask.includes('identify')
  ) {
    return 5;
  }

  // Medium actions (15-30 minutes)
  if (
    lowerTask.includes('create') ||
    lowerTask.includes('draft') ||
    lowerTask.includes('map out') ||
    lowerTask.includes('sketch')
  ) {
    return 20;
  }

  // Longer actions (30-60 minutes)
  if (
    lowerTask.includes('plan') ||
    lowerTask.includes('system') ||
    lowerTask.includes('matrix')
  ) {
    return 45;
  }

  // Immediate actions (1-5 minutes)
  if (
    lowerTask.includes('immediate') ||
    lowerTask.includes('right now') ||
    lowerTask.includes('10 minutes')
  ) {
    return 3;
  }

  // Default
  return 15;
}

/**
 * Generate a motivational context message for the first action
 */
export function generateActionContext(archetype: ArchetypeKey): string {
  const contexts: Record<ArchetypeKey, string[]> = {
    builder: [
      'Builders ship. Let\'s create your foundation.',
      'Your empire starts with this single action.',
      'The best time to build was yesterday. The second best is now.',
    ],
    optimizer: [
      'Optimization begins with measurement. Let\'s start tracking.',
      'The 1% improvement starts here.',
      'Efficiency is a habit. This is your first rep.',
    ],
    phoenix: [
      'Your resurrection begins with this choice.',
      'From the ashes, you rise. Starting now.',
      'Transformation isn\'t comfortable. It\'s necessary.',
    ],
    accelerator: [
      'Momentum starts with speed. Let\'s move.',
      'Fast action beats perfect planning.',
      'Velocity creates clarity. Execute now.',
    ],
    visionary: [
      'See it. Believe it. Achieve it. Start visualizing.',
      'Your vision becomes reality one step at a time.',
      'The future you see is waiting for you to build it.',
    ],
    emperor: [
      'Empires are built one strategic move at a time.',
      'Leadership starts with leading yourself. Take action.',
      'Your kingdom awaits. Establish the first pillar.',
    ],
  };

  const options = contexts[archetype];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Get suggested follow-up actions after first action completion
 */
export function generateFollowUpActions(
  completedAction: string,
  manifestationGoal: string,
  archetype: ArchetypeKey
): string[] {
  // Simple heuristic: suggest 2-3 logical next steps
  const followUps: string[] = [];

  if (completedAction.includes('Define') || completedAction.includes('MVP')) {
    followUps.push('Break down your MVP into weekly milestones');
    followUps.push('Identify the first user to test with');
  }

  if (completedAction.includes('Time-block') || completedAction.includes('priorit')) {
    followUps.push('Review your calendar and block time tomorrow');
    followUps.push('Set up a daily review ritual');
  }

  if (completedAction.includes('fear') || completedAction.includes('belief')) {
    followUps.push('Create an affirmation to counter that fear');
    followUps.push('Share your commitment with an accountability partner');
  }

  if (completedAction.includes('immediate') || completedAction.includes('10 minutes')) {
    followUps.push('Build on that momentum - take the next step');
    followUps.push('Document what you just accomplished');
  }

  if (completedAction.includes('vision') || completedAction.includes('Sketch')) {
    followUps.push('Share your vision with someone who believes in you');
    followUps.push('Reverse-engineer the first milestone');
  }

  if (completedAction.includes('recruit') || completedAction.includes('delegate')) {
    followUps.push('Draft the job description or ask');
    followUps.push('List where to find this person');
  }

  // Default follow-ups if no specific matches
  if (followUps.length === 0) {
    followUps.push('Complete one more action toward your manifestation');
    followUps.push('Review your progress and adjust course');
    followUps.push('Set tomorrow\'s top priority');
  }

  return followUps.slice(0, 2); // Return top 2 follow-ups
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Validate if a custom first action is appropriate
 */
export function validateCustomAction(action: string): {
  valid: boolean;
  feedback?: string;
} {
  if (action.length < 10) {
    return {
      valid: false,
      feedback: 'Your action needs more detail to be actionable',
    };
  }

  if (action.length > 200) {
    return {
      valid: false,
      feedback: 'Keep it focused - break this into a single, clear action',
    };
  }

  // Check for vague words
  const vagueWords = ['try', 'think about', 'maybe', 'consider', 'eventually'];
  const hasVagueWords = vagueWords.some(word => action.toLowerCase().includes(word));

  if (hasVagueWords) {
    return {
      valid: false,
      feedback: 'Make it concrete - replace "try" with "do", "think" with "write"',
    };
  }

  return { valid: true };
}
