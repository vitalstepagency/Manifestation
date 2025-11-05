/**
 * Audio Manager
 *
 * Manages the subtle audio layer that enhances the transformation experience
 * including the 528Hz "transformation frequency" and ambient sounds.
 *
 * IMPORTANT: All audio is optional and toggle-able. Users can disable entirely.
 * The 528Hz frequency is BARELY audible - felt more than heard.
 */

import type { AudioConfig, AudioTrack, AudioPlayOptions, AudioPreferences } from '../types/audio.types';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: AudioConfig = {
  enabled: true,
  masterVolume: 0.5,

  // Individual volumes (all very subtle)
  ambientVolume: 0.15,      // Very low for 528Hz
  transitionVolume: 0.3,
  achievementVolume: 0.4,
  interactionVolume: 0.2,
  celebrationVolume: 0.5,

  // 528Hz settings
  use528Hz: true,
  frequencyVolume: 0.05,  // BARELY audible

  // Preloading
  preloadAudio: true,
  preloadUrls: [],
};

// ============================================================================
// AUDIO TRACK LIBRARY
// ============================================================================

// In production, these would be actual audio files
// For now, we'll use Web Audio API for synthesis
const AUDIO_LIBRARY = {
  // Ambient (528Hz will be synthesized)
  '528hz': {
    id: '528hz',
    name: '528Hz Transformation Frequency',
    type: 'ambient' as const,
    url: '', // Synthesized
    volume: 0.05,
    loop: true,
    fadeIn: 3000,
    fadeOut: 2000,
  },

  // Transitions (whoosh sounds)
  'portal_whoosh': {
    id: 'portal_whoosh',
    name: 'Portal Transition Whoosh',
    type: 'transition' as const,
    url: '/audio/portal_whoosh.mp3',
    volume: 0.3,
    loop: false,
    duration: 1500,
  },

  'screen_transition': {
    id: 'screen_transition',
    name: 'Screen Transition',
    type: 'transition' as const,
    url: '/audio/screen_transition.mp3',
    volume: 0.2,
    loop: false,
    duration: 300,
  },

  // Achievements (chimes)
  'achievement_chime': {
    id: 'achievement_chime',
    name: 'Achievement Unlock Chime',
    type: 'achievement' as const,
    url: '/audio/achievement_chime.mp3',
    volume: 0.4,
    loop: false,
    duration: 800,
  },

  'level_up_fanfare': {
    id: 'level_up_fanfare',
    name: 'Level Up Fanfare',
    type: 'achievement' as const,
    url: '/audio/level_up.mp3',
    volume: 0.5,
    loop: false,
    duration: 1200,
  },

  // Interactions (subtle clicks)
  'habit_complete_click': {
    id: 'habit_complete_click',
    name: 'Habit Complete Click',
    type: 'interaction' as const,
    url: '/audio/habit_click.mp3',
    volume: 0.2,
    loop: false,
    duration: 100,
  },

  // Celebrations
  'confetti_pop': {
    id: 'confetti_pop',
    name: 'Confetti Pop',
    type: 'celebration' as const,
    url: '/audio/confetti.mp3',
    volume: 0.5,
    loop: false,
    duration: 600,
  },

  'perfect_day_celebration': {
    id: 'perfect_day_celebration',
    name: 'Perfect Day Celebration',
    type: 'celebration' as const,
    url: '/audio/perfect_day.mp3',
    volume: 0.5,
    loop: false,
    duration: 2000,
  },
};

// ============================================================================
// AUDIO MANAGER CLASS
// ============================================================================

class AudioManagerClass {
  private config: AudioConfig;
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private oscillator: OscillatorNode | null = null;
  private activeTracks: Map<string, HTMLAudioElement> = new Map();
  private preloadedTracks: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  constructor(config: AudioConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.loadPreferences();
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  async initialize() {
    if (!this.config.enabled) return;

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.config.masterVolume;

      // Preload audio if enabled
      if (this.config.preloadAudio) {
        await this.preloadAll();
      }
    } catch (error) {
      console.error('[AudioManager] Failed to initialize:', error);
      this.config.enabled = false;
    }
  }

  // =========================================================================
  // 528HZ FREQUENCY GENERATOR
  // =========================================================================

  start528Hz() {
    if (!this.config.enabled || !this.config.use528Hz || !this.audioContext) return;

    try {
      // Stop existing oscillator
      this.stop528Hz();

      // Create oscillator
      this.oscillator = this.audioContext.createOscillator();
      this.oscillator.type = 'sine';
      this.oscillator.frequency.value = 528; // 528Hz - "transformation frequency"

      // Create gain for volume control
      const oscillatorGain = this.audioContext.createGain();
      oscillatorGain.gain.value = this.config.frequencyVolume * this.config.ambientVolume;

      // Connect: oscillator → gain → destination
      this.oscillator.connect(oscillatorGain);
      oscillatorGain.connect(this.gainNode!);

      // Start
      this.oscillator.start();

      // Fade in
      oscillatorGain.gain.setValueAtTime(0, this.audioContext.currentTime);
      oscillatorGain.gain.linearRampToValueAtTime(
        this.config.frequencyVolume * this.config.ambientVolume,
        this.audioContext.currentTime + 3
      );
    } catch (error) {
      console.error('[AudioManager] Failed to start 528Hz:', error);
    }
  }

  stop528Hz() {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      } catch (error) {
        // Oscillator might already be stopped
      }
    }
  }

  // =========================================================================
  // TRACK PLAYBACK
  // =========================================================================

  async play(trackId: string, options: AudioPlayOptions = {}) {
    if (!this.config.enabled || this.isMuted) return;

    const track = AUDIO_LIBRARY[trackId as keyof typeof AUDIO_LIBRARY];
    if (!track) {
      console.warn(`[AudioManager] Track not found: ${trackId}`);
      return;
    }

    // Check if track type is enabled
    if (!this.isTrackTypeEnabled(track.type)) return;

    try {
      // Get or create audio element
      let audio = this.preloadedTracks.get(trackId) || new Audio(track.url);

      // Set volume
      const volume = options.volume ?? track.volume;
      const typeVolume = this.getTypeVolume(track.type);
      audio.volume = volume * typeVolume * this.config.masterVolume;

      // Set loop
      audio.loop = options.loop ?? track.loop;

      // Play
      await audio.play();

      // Fade in
      if (options.fadeIn || track.fadeIn) {
        this.fadeIn(audio, options.fadeIn || track.fadeIn || 0);
      }

      // Track active playback
      this.activeTracks.set(trackId, audio);

      // Handle completion
      audio.onended = () => {
        this.activeTracks.delete(trackId);
        options.onEnded?.();
      };

      // Auto fade out before end
      if (options.fadeOut || track.fadeOut) {
        const fadeOutTime = options.fadeOut || track.fadeOut || 0;
        const duration = track.duration || 0;
        if (duration > fadeOutTime) {
          setTimeout(() => {
            this.fadeOut(audio, fadeOutTime);
          }, duration - fadeOutTime);
        }
      }
    } catch (error) {
      console.error(`[AudioManager] Failed to play ${trackId}:`, error);
    }
  }

  stop(trackId: string) {
    const audio = this.activeTracks.get(trackId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      this.activeTracks.delete(trackId);
    }
  }

  pause(trackId: string) {
    const audio = this.activeTracks.get(trackId);
    if (audio) {
      audio.pause();
    }
  }

  resume(trackId: string) {
    const audio = this.activeTracks.get(trackId);
    if (audio) {
      audio.play();
    }
  }

  // =========================================================================
  // VOLUME CONTROL
  // =========================================================================

  setVolume(trackId: string, volume: number) {
    const audio = this.activeTracks.get(trackId);
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  setMasterVolume(volume: number) {
    this.config.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.value = this.config.masterVolume;
    }
    this.savePreferences();
  }

  mute() {
    this.isMuted = true;
    this.activeTracks.forEach(audio => audio.pause());
    this.stop528Hz();
  }

  unmute() {
    this.isMuted = false;
    this.activeTracks.forEach(audio => audio.play());
    if (this.config.use528Hz) {
      this.start528Hz();
    }
  }

  // =========================================================================
  // FADE UTILITIES
  // =========================================================================

  private fadeIn(audio: HTMLAudioElement, duration: number) {
    const targetVolume = audio.volume;
    audio.volume = 0;

    const steps = 20;
    const interval = duration / steps;
    const volumeStep = targetVolume / steps;

    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.min(targetVolume, volumeStep * currentStep);

      if (currentStep >= steps) {
        clearInterval(fadeInterval);
      }
    }, interval);
  }

  private fadeOut(audio: HTMLAudioElement, duration: number) {
    const initialVolume = audio.volume;

    const steps = 20;
    const interval = duration / steps;
    const volumeStep = initialVolume / steps;

    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      currentStep++;
      audio.volume = Math.max(0, initialVolume - volumeStep * currentStep);

      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        audio.pause();
      }
    }, interval);
  }

  // =========================================================================
  // PRELOADING
  // =========================================================================

  async preloadAll() {
    const tracks = Object.values(AUDIO_LIBRARY).filter(track => track.url);

    const preloadPromises = tracks.map(track =>
      this.preloadTrack(track.id).catch(err => {
        console.warn(`[AudioManager] Failed to preload ${track.id}:`, err);
      })
    );

    await Promise.allSettled(preloadPromises);
  }

  private async preloadTrack(trackId: string) {
    const track = AUDIO_LIBRARY[trackId as keyof typeof AUDIO_LIBRARY];
    if (!track || !track.url) return;

    const audio = new Audio(track.url);
    audio.preload = 'auto';

    // Wait for it to be ready
    await new Promise((resolve, reject) => {
      audio.addEventListener('canplaythrough', resolve, { once: true });
      audio.addEventListener('error', reject, { once: true });
    });

    this.preloadedTracks.set(trackId, audio);
  }

  // =========================================================================
  // PREFERENCES
  // =========================================================================

  private isTrackTypeEnabled(type: string): boolean {
    switch (type) {
      case 'ambient':
        return this.config.ambientVolume > 0;
      case 'transition':
        return this.config.transitionVolume > 0;
      case 'achievement':
        return this.config.achievementVolume > 0;
      case 'interaction':
        return this.config.interactionVolume > 0;
      case 'celebration':
        return this.config.celebrationVolume > 0;
      default:
        return true;
    }
  }

  private getTypeVolume(type: string): number {
    switch (type) {
      case 'ambient':
        return this.config.ambientVolume;
      case 'transition':
        return this.config.transitionVolume;
      case 'achievement':
        return this.config.achievementVolume;
      case 'interaction':
        return this.config.interactionVolume;
      case 'celebration':
        return this.config.celebrationVolume;
      default:
        return 1;
    }
  }

  getPreferences(): AudioPreferences {
    return {
      enabled: this.config.enabled,
      masterVolume: this.config.masterVolume,
      ambientEnabled: this.config.ambientVolume > 0,
      transitionsEnabled: this.config.transitionVolume > 0,
      achievementsEnabled: this.config.achievementVolume > 0,
      interactionsEnabled: this.config.interactionVolume > 0,
      celebrationsEnabled: this.config.celebrationVolume > 0,
      use528Hz: this.config.use528Hz,
    };
  }

  updatePreferences(preferences: Partial<AudioPreferences>) {
    if (preferences.enabled !== undefined) {
      this.config.enabled = preferences.enabled;
    }
    if (preferences.masterVolume !== undefined) {
      this.setMasterVolume(preferences.masterVolume);
    }
    if (preferences.ambientEnabled !== undefined) {
      this.config.ambientVolume = preferences.ambientEnabled ? 0.15 : 0;
    }
    if (preferences.transitionsEnabled !== undefined) {
      this.config.transitionVolume = preferences.transitionsEnabled ? 0.3 : 0;
    }
    if (preferences.achievementsEnabled !== undefined) {
      this.config.achievementVolume = preferences.achievementsEnabled ? 0.4 : 0;
    }
    if (preferences.interactionsEnabled !== undefined) {
      this.config.interactionVolume = preferences.interactionsEnabled ? 0.2 : 0;
    }
    if (preferences.celebrationsEnabled !== undefined) {
      this.config.celebrationVolume = preferences.celebrationsEnabled ? 0.5 : 0;
    }
    if (preferences.use528Hz !== undefined) {
      this.config.use528Hz = preferences.use528Hz;
      if (preferences.use528Hz) {
        this.start528Hz();
      } else {
        this.stop528Hz();
      }
    }

    this.savePreferences();
  }

  private savePreferences() {
    localStorage.setItem('manifest_audio_preferences', JSON.stringify(this.getPreferences()));
  }

  private loadPreferences() {
    try {
      const stored = localStorage.getItem('manifest_audio_preferences');
      if (stored) {
        const preferences = JSON.parse(stored);
        this.updatePreferences(preferences);
      }
    } catch (error) {
      console.error('[AudioManager] Failed to load preferences:', error);
    }
  }

  // =========================================================================
  // CLEANUP
  // =========================================================================

  cleanup() {
    // Stop all active tracks
    this.activeTracks.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.activeTracks.clear();

    // Stop 528Hz
    this.stop528Hz();

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const audioManager = new AudioManagerClass();

// Initialize on import (lazy initialization)
if (typeof window !== 'undefined') {
  // Delay initialization until user interaction (required by browsers)
  const initOnInteraction = () => {
    audioManager.initialize();
    document.removeEventListener('click', initOnInteraction);
    document.removeEventListener('keydown', initOnInteraction);
  };

  document.addEventListener('click', initOnInteraction, { once: true });
  document.addEventListener('keydown', initOnInteraction, { once: true });
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

export const playPortalTransition = () => audioManager.play('portal_whoosh');
export const playAchievement = () => audioManager.play('achievement_chime');
export const playHabitComplete = () => audioManager.play('habit_complete_click');
export const playConfetti = () => audioManager.play('confetti_pop');
export const playPerfectDay = () => audioManager.play('perfect_day_celebration');

export const start528Hz = () => audioManager.start528Hz();
export const stop528Hz = () => audioManager.stop528Hz();
