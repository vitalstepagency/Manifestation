/**
 * Audio System Type Definitions
 *
 * Defines types for the subtle audio layer that enhances the
 * transformation experience with 528Hz frequency and ambient sounds.
 */

export type AudioType =
  | 'ambient'        // Background frequency (528Hz)
  | 'transition'     // Whoosh sounds for transitions
  | 'achievement'    // Chimes for achievement unlocks
  | 'interaction'    // Subtle clicks/taps
  | 'celebration';   // Success sounds

export type AudioTrigger =
  | 'onboarding_start'
  | 'portal_transition'
  | 'achievement_unlock'
  | 'habit_complete'
  | 'streak_milestone'
  | 'dashboard_enter'
  | 'perfect_day'
  | 'level_up';

export interface AudioTrack {
  id: string;
  name: string;
  type: AudioType;
  url: string;
  volume: number; // 0-1
  loop: boolean;
  fadeIn?: number; // milliseconds
  fadeOut?: number; // milliseconds
  duration?: number; // milliseconds
}

export interface AudioConfig {
  enabled: boolean;
  masterVolume: number; // 0-1

  // Individual volume controls
  ambientVolume: number;
  transitionVolume: number;
  achievementVolume: number;
  interactionVolume: number;
  celebrationVolume: number;

  // 528Hz frequency settings
  use528Hz: boolean;
  frequencyVolume: number; // Very low, barely audible

  // Preload settings
  preloadAudio: boolean;
  preloadUrls: string[];
}

export interface AudioContext {
  context: AudioContext | null;
  gainNode: GainNode | null;
  oscillator: OscillatorNode | null;
  isPlaying: boolean;
}

export interface AudioPlayOptions {
  volume?: number;
  fadeIn?: number;
  fadeOut?: number;
  loop?: boolean;
  onEnded?: () => void;
}

export interface AudioManager {
  // Core controls
  play: (trackId: string, options?: AudioPlayOptions) => Promise<void>;
  stop: (trackId: string) => void;
  pause: (trackId: string) => void;
  resume: (trackId: string) => void;

  // Volume controls
  setVolume: (trackId: string, volume: number) => void;
  setMasterVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;

  // 528Hz frequency
  start528Hz: () => void;
  stop528Hz: () => void;

  // Preloading
  preload: (urls: string[]) => Promise<void>;

  // Cleanup
  cleanup: () => void;
}

// Audio track library
export interface AudioLibrary {
  // Ambient
  '528hz': AudioTrack;
  'transformation_ambient': AudioTrack;

  // Transitions
  'portal_whoosh': AudioTrack;
  'screen_transition': AudioTrack;

  // Achievements
  'achievement_chime': AudioTrack;
  'level_up_fanfare': AudioTrack;

  // Interactions
  'habit_complete_click': AudioTrack;
  'checkbox_check': AudioTrack;

  // Celebrations
  'confetti_pop': AudioTrack;
  'perfect_day_celebration': AudioTrack;
  'streak_milestone': AudioTrack;
}

// Audio event
export interface AudioEvent {
  trigger: AudioTrigger;
  trackId: string;
  timestamp: Date;
  context?: Record<string, any>;
}

// Audio preferences (user settings)
export interface AudioPreferences {
  enabled: boolean;
  masterVolume: number;
  ambientEnabled: boolean;
  transitionsEnabled: boolean;
  achievementsEnabled: boolean;
  interactionsEnabled: boolean;
  celebrationsEnabled: boolean;
  use528Hz: boolean;
}
