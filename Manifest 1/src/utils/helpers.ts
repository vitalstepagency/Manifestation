import type { TimeContext, EnergyLevel } from '../types';

// Time and Context Utilities
export const getTimeContext = (): TimeContext => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return {
      period: 'morning',
      greeting: 'Rise and Manifest',
      message: 'Fresh start, energy check, day planning'
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      period: 'afternoon',
      greeting: 'Keep Pushing Forward',
      message: 'Progress check, motivation boost'
    };
  } else {
    return {
      period: 'evening',
      greeting: 'Finish Strong Today',
      message: 'Reflection, tomorrow prep, wind down'
    };
  }
};

export const getGreeting = (timeContext: string): string => {
  const greetings = {
    morning: 'Rise and Manifest',
    afternoon: 'Keep Pushing Forward',
    evening: 'Finish Strong Today'
  };
  return greetings[timeContext as keyof typeof greetings] || 'Welcome Back';
};

export const getMotivationalMessage = (streak: number): string => {
  if (streak === 0) return "Let's begin your transformation";
  if (streak < 7) return "Building momentum";
  if (streak < 30) return "You're unstoppable";
  if (streak < 100) return "Legendary discipline";
  return "Master of your destiny";
};

// Energy Level Utilities
export const getEnergyLevels = (): EnergyLevel[] => [
  { level: 1, label: 'Low', emoji: '😴' },
  { level: 2, label: 'Medium', emoji: '😐' },
  { level: 3, label: 'High', emoji: '💪' },
  { level: 4, label: 'Peak', emoji: '🚀' }
];

export const getEnergyLabel = (level: number): string => {
  const energyLevels = getEnergyLevels();
  const energyLevel = energyLevels.find(e => e.level === level);
  return energyLevel ? `${energyLevel.emoji} ${energyLevel.label}` : 'Unknown';
};

// Progress and Analytics Utilities
export const calculateProgress = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Date Utilities
export const isToday = (date: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  const checkDate = new Date(date).toISOString().split('T')[0];
  return today === checkDate;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getDaysAgo = (date: string): number => {
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = Math.abs(today.getTime() - targetDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Habit Utilities
export const calculateStreakDays = (completionDates: string[]): number => {
  if (completionDates.length === 0) return 0;
  
  const sortedDates = completionDates
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const date of sortedDates) {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

// Animation Utilities
export const getStaggerDelay = (index: number, baseDelay: number = 0.1): number => {
  return baseDelay * index;
};

export const slideInVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const scaleInVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

// Validation Utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain uppercase, lowercase, and number' };
  }
  return { isValid: true, message: 'Password is valid' };
};

// Local Storage Utilities
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

// Contextual Insights Generator
export const getContextualInsight = (
  timeContext: string,
  energyLevel: number | null,
  streak: number,
  completedHabits: number,
  totalHabits: number
): string => {
  // Morning insights
  if (timeContext === 'morning') {
    if (energyLevel === 4) {
      return "Your energy is peak! Tackle your hardest non-negotiable first. You complete 92% of tasks when you start with the hardest one.";
    }
    if (energyLevel === 3) {
      return "High energy detected! Perfect time for deep work. Your morning sessions are 67% more productive.";
    }
    return "Good morning! Start with your easiest habit to build momentum. Small wins create big days.";
  }
  
  // Afternoon insights
  if (timeContext === 'afternoon') {
    const completionRate = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;
    if (completionRate >= 80) {
      return `Incredible! You've completed ${completionRate.toFixed(0)}% of today's habits. You're in the top 5% of achievers.`;
    }
    if (completionRate >= 50) {
      return `Great progress! ${completionRate.toFixed(0)}% complete. Afternoon momentum often leads to perfect days.`;
    }
    return "Perfect time for a progress boost! One more habit completion doubles your success rate.";
  }
  
  // Evening insights
  if (timeContext === 'evening') {
    if (streak >= 7) {
      return `Perfect time for reflection. Your ${streak}-day streak shows you're 73% more likely to achieve your manifestation goal.`;
    }
    return "Evening reflection time. Celebrating today's wins programs your mind for tomorrow's success.";
  }
  
  // Streak-based insights
  if (streak > 21) {
    return `You're on a ${streak} day streak! You've entered the top 1% of disciplined achievers. You're unstoppable.`;
  }
  if (streak > 10) {
    return `${streak} days strong! People with streaks over 10 days are 5x more likely to achieve their goals.`;
  }
  if (streak > 0) {
    return `Day ${streak} of your transformation. Consistency is the mother of mastery.`;
  }
  
  return "Every master was once a beginner. Your transformation starts with the next action you take.";
};

// XP and Gamification Utilities
export const calculateXP = (habitType: 'building' | 'breaking', streakCount: number): number => {
  const baseXP = habitType === 'building' ? 10 : 15; // Breaking habits is harder
  const streakBonus = Math.floor(streakCount / 7) * 5; // Bonus every week
  return baseXP + streakBonus;
};

export const getStreakEmoji = (streak: number): string => {
  if (streak >= 100) return '🏆';
  if (streak >= 50) return '💎';
  if (streak >= 30) return '⭐';
  if (streak >= 21) return '🔥';
  if (streak >= 7) return '💪';
  if (streak >= 3) return '🌱';
  return '🎯';
};

// Color Utilities for Dynamic Theming
export const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return 'from-green-500 to-emerald-600';
  if (percentage >= 60) return 'from-blue-500 to-cyan-600';
  if (percentage >= 40) return 'from-yellow-500 to-orange-600';
  if (percentage >= 20) return 'from-orange-500 to-red-600';
  return 'from-gray-500 to-gray-600';
};

export const getEnergyColor = (level: number): string => {
  switch (level) {
    case 4: return 'from-purple-500 to-pink-600';
    case 3: return 'from-blue-500 to-cyan-600';
    case 2: return 'from-yellow-500 to-orange-600';
    case 1: return 'from-gray-500 to-gray-600';
    default: return 'from-gray-400 to-gray-500';
  }
};