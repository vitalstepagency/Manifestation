import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useManifestStore } from '../store/useManifestStore';
import { toast } from 'sonner';
import { db } from '../lib/supabase';
import { RealityFractureCountdown } from '../components/onboarding/RealityFractureCountdown';
import { RealityShatter } from '../components/onboarding/RealityShatter';
// Upgraded to React 19! Now using the full 3D WebGL portal
import Portal3D from '../components/onboarding/Portal3D';
import LiquidButton from '../components/LiquidButton';

// Archetype definitions with complete theming
const ARCHETYPES = {
  builder: {
    emoji: '🚀',
    title: 'The Builder',
    subtitle: 'Creating something from nothing',
    gradient: ['#0891b2', '#0e7490'],
    mantra: 'Every day you build tomorrow',
    aiPersonality: 'strategic_architect',
    bgGradient: 'from-cyan-900 via-blue-900 to-slate-900'
  },
  optimizer: {
    emoji: '💎',
    title: 'The Optimizer',
    subtitle: 'Maximizing every moment',
    gradient: ['#7c3aed', '#a855f7'],
    mantra: 'Excellence is your standard',
    aiPersonality: 'efficiency_expert',
    bgGradient: 'from-purple-900 via-violet-900 to-indigo-900'
  },
  phoenix: {
    emoji: '🔥',
    title: 'The Phoenix',
    subtitle: 'Rising from the ashes',
    gradient: ['#dc2626', '#f97316'],
    mantra: 'Your resurrection starts now',
    aiPersonality: 'transformation_coach',
    bgGradient: 'from-red-900 via-orange-900 to-yellow-900'
  },
  accelerator: {
    emoji: '⚡',
    title: 'The Accelerator',
    subtitle: 'Moving faster than ever',
    gradient: ['#eab308', '#f59e0b'],
    mantra: 'Speed is your superpower',
    aiPersonality: 'momentum_master',
    bgGradient: 'from-yellow-900 via-amber-900 to-orange-900'
  },
  visionary: {
    emoji: '🌟',
    title: 'The Visionary',
    subtitle: 'Seeing what others can\'t',
    gradient: ['#059669', '#10b981'],
    mantra: 'The future flows through you',
    aiPersonality: 'future_seer',
    bgGradient: 'from-emerald-900 via-green-900 to-teal-900'
  },
  emperor: {
    emoji: '👑',
    title: 'The Emperor',
    subtitle: 'Building an empire',
    gradient: ['#7c2d12', '#a16207'],
    mantra: 'Kingdoms rise from your decisions',
    aiPersonality: 'empire_builder',
    bgGradient: 'from-amber-900 via-yellow-900 to-orange-900'
  }
};

// Energy levels with pulse animations
const ENERGY_LEVELS = {
  drained: { emoji: '🔋', label: 'Drained', pulse: 'slow', speed: 0.5 },
  building: { emoji: '⚡', label: 'Building', pulse: 'medium', speed: 1 },
  charged: { emoji: '🔥', label: 'Charged', pulse: 'fast', speed: 1.5 },
  unstoppable: { emoji: '💎', label: 'Unstoppable', pulse: 'lightning', speed: 2 }
};

interface OnboardingState {
  currentScreen: number;
  archetype: keyof typeof ARCHETYPES | null;
  goal: string;
  energyLevel: keyof typeof ENERGY_LEVELS | null;
  nonNegotiables: string[];
  habitToBuild: string;
  habitToBreak: string;
  startTime: Date;
  hasSpokenGoal: boolean;
  showShatterAnimation: boolean;
  showPortalTransition: boolean;
}

// Confetti Component
const Confetti = ({ colors }: { colors: string[] }) => {
  const pieces = Array.from({ length: 50 }, (_, i) => i);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -10,
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            y: window.innerHeight + 10,
            rotate: Math.random() * 360,
            x: Math.random() * window.innerWidth
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            ease: "easeOut",
            delay: Math.random() * 2
          }}
          className={`w-3 h-3 ${colors[Math.floor(Math.random() * colors.length)]} absolute`}
        />
      ))}
    </div>
  );
};

// Portal Screen Component - MANIFEST YOUR DESTINY Sequence
const PortalScreen = () => {
  const [showManifest, setShowManifest] = useState(false);
  const [showYour, setShowYour] = useState(false);
  const [showDestiny, setShowDestiny] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Words appear one by one
    const appearTimers = [
      setTimeout(() => setShowManifest(true), 300),    // MANIFEST appears
      setTimeout(() => setShowYour(true), 900),         // YOUR appears
      setTimeout(() => setShowDestiny(true), 1500),     // DESTINY appears
    ];

    // Then they disappear quickly in sequence
    const disappearTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2800); // Start fading after all words shown

    return () => {
      appearTimers.forEach(clearTimeout);
      clearTimeout(disappearTimer);
    };
  }, []);

  return (
    <div
      style={{
        background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #0a0a0f 100%)',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated text container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {/* MANIFEST */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{
            opacity: showManifest && !fadeOut ? 1 : 0,
            scale: showManifest && !fadeOut ? 1 : 0.8,
            y: showManifest ? 0 : 30,
          }}
          transition={{
            duration: 0.4,
            type: 'spring',
            stiffness: 200,
          }}
          style={{
            fontSize: '72px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          MANIFEST
        </motion.h1>

        {/* YOUR */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{
            opacity: showYour && !fadeOut ? 1 : 0,
            x: showYour ? 0 : -50,
          }}
          transition={{
            duration: 0.4,
            delay: fadeOut ? 0.1 : 0,
          }}
          style={{
            fontSize: '48px',
            color: 'rgba(255,255,255,0.8)',
            fontWeight: '300',
            letterSpacing: '2px',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          YOUR
        </motion.div>

        {/* DESTINY */}
        <motion.h2
          initial={{ opacity: 0, scale: 1.3, y: -30 }}
          animate={{
            opacity: showDestiny && !fadeOut ? 1 : 0,
            scale: showDestiny && !fadeOut ? 1 : 1.2,
            y: showDestiny ? 0 : -30,
          }}
          transition={{
            duration: 0.4,
            delay: fadeOut ? 0.2 : 0,
            type: 'spring',
          }}
          style={{
            fontSize: '84px',
            fontWeight: '900',
            color: 'white',
            textShadow: '0 0 80px rgba(147,51,234,0.6)',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          DESTINY
        </motion.h2>
      </div>

      {/* Floating orbs in background */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(147,51,234,0.2) 0%, transparent 70%)',
          top: '20%',
          left: '10%',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          bottom: '20%',
          right: '10%',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
    </div>
  );
};

export default function Onboarding() {
  console.log('🎯 Onboarding component is rendering');
  const navigate = useNavigate();
  const { completeOnboarding, addNonNegotiable, addHabit, setEnergyLevel, saveOnboardingProgress, profile, user } = useManifestStore();
  
  const [state, setState] = useState<OnboardingState>({
    currentScreen: 0,
    archetype: null,
    goal: '',
    energyLevel: null,
    nonNegotiables: [],
    habitToBuild: '',
    habitToBreak: '',
    startTime: new Date(),
    hasSpokenGoal: false,
    showShatterAnimation: false,
    showPortalTransition: false
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  // Combined effect to load saved progress and handle auto-advance
  useEffect(() => {
    console.log('Profile data:', profile);
    console.log('Onboarding progress:', profile?.onboarding_progress);
    
    if (profile?.onboarding_progress) {
      const savedProgress = profile.onboarding_progress;
      console.log('Saved progress:', savedProgress);
      
      // Validate that the saved progress has a valid currentScreen
      // If currentScreen is invalid or undefined, start from screen 0
      const validScreen = typeof savedProgress.currentScreen === 'number' && 
                         savedProgress.currentScreen >= 0 && 
                         savedProgress.currentScreen <= 7 
                         ? savedProgress.currentScreen 
                         : 0;
      
      console.log('Valid screen determined:', validScreen);

      // If user has made progress (not on screen 0), show welcome back
      if (validScreen > 0) {
        setHasRestoredProgress(true);
        setShowWelcomeBack(true);
        console.log('User has progress - showing welcome back screen');
      }

      setState(prev => ({
        ...prev,
        currentScreen: validScreen,
        archetype: savedProgress.archetype || null,
        goal: savedProgress.goal || '',
        energyLevel: savedProgress.energyLevel || null,
        nonNegotiables: savedProgress.nonNegotiables || [],
        habitToBuild: savedProgress.habitToBuild || '',
        habitToBreak: savedProgress.habitToBreak || '',
        hasSpokenGoal: savedProgress.hasSpokenGoal || false,
        showShatterAnimation: false // Always reset animation state on reload
      }));
    } else {
      // If no saved progress, ensure we start at screen 0
      console.log('No saved progress, starting at screen 0');
      setState(prev => ({ ...prev, currentScreen: 0 }));
    }
  }, [profile]);

  // Auto-advance portal screen - separate effect with proper dependency
  useEffect(() => {
    console.log('Auto-advance effect - currentScreen:', state.currentScreen, 'profile loaded:', !!profile);

    // Only auto-advance if we're on screen 0
    if (state.currentScreen === 0) {
      console.log('Setting timer to advance from screen 0 to screen 1');
      // Timing: "MANIFEST YOUR DESTINY" sequence = 3.6s total
      const timer = setTimeout(() => {
        console.log('Auto-advancing from screen 0 to screen 1');
        setState(prev => ({ ...prev, currentScreen: 1 }));
      }, 3600);
      return () => {
        console.log('Clearing auto-advance timer');
        clearTimeout(timer);
      };
    }
  }, [state.currentScreen]);

  // Maintain background based on archetype selection
  useEffect(() => {
    if (state.archetype && state.currentScreen >= 2) {
      // If we have a selected archetype, apply its background
      const selectedArchetypeData = ARCHETYPES[state.archetype];
      const [color1, color2] = selectedArchetypeData.gradient;
      const archetypeBackground = `linear-gradient(135deg, ${color1}30 0%, ${color2}25 40%, #1e1b4b 70%, #0a0a0f 100%)`;

      document.body.style.background = archetypeBackground;
      document.body.style.transition = 'background 0.5s ease';
    } else {
      // Before archetype selection (screens 0-1), use the dark theme
      document.body.style.background = 'radial-gradient(ellipse at center, #1e1b4b 0%, #0a0a0f 100%)';
      document.body.style.transition = 'background 0.5s ease';
    }
  }, [state.currentScreen, state.archetype]);

  // Save onboarding progress to database
  const saveProgress = useCallback(async (newState: Partial<OnboardingState>) => {
    try {
      await saveOnboardingProgress({
        currentScreen: newState.currentScreen || state.currentScreen,
        archetype: newState.archetype || state.archetype,
        goal: newState.goal || state.goal,
        energyLevel: newState.energyLevel || state.energyLevel,
        nonNegotiables: newState.nonNegotiables || state.nonNegotiables,
        habitToBuild: newState.habitToBuild || state.habitToBuild,
        habitToBreak: newState.habitToBreak || state.habitToBreak,
        hasSpokenGoal: newState.hasSpokenGoal || state.hasSpokenGoal,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving onboarding progress:', error);
    }
  }, [state, saveOnboardingProgress]);

  // Handle goal input
  const handleGoalChange = (value: string) => {
    setState(prev => ({
      ...prev,
      goal: value
    }));
  };

  // Handle archetype selection
  const selectArchetype = async (archetype: keyof typeof ARCHETYPES) => {
    const newState = { archetype };
    setState(prev => ({ ...prev, ...newState }));

    // IMMEDIATELY change the background based on archetype
    const selectedArchetypeData = ARCHETYPES[archetype];
    const [color1, color2] = selectedArchetypeData.gradient;
    const archetypeBackground = `linear-gradient(135deg, ${color1}30 0%, ${color2}25 40%, #1e1b4b 70%, #0a0a0f 100%)`;

    // Apply to the root element immediately
    document.body.style.background = archetypeBackground;
    document.body.style.transition = 'background 0.5s ease';

    await saveProgress(newState);

    // INSTANT RESPONSE: Only 200ms delay for smooth transition
    setTimeout(async () => {
      const screenState = { currentScreen: 2 };
      setState(prev => ({ ...prev, ...screenState }));
      await saveProgress(screenState);
    }, 200);
  };

  // Handle energy selection - INSTANT RESPONSE
  const selectEnergy = async (energy: keyof typeof ENERGY_LEVELS) => {
    const newState = { energyLevel: energy };
    setState(prev => ({ ...prev, ...newState }));
    setEnergyLevel(energy);
    await saveProgress(newState);

    // INSTANT RESPONSE: Only 200ms delay for smooth transition
    setTimeout(async () => {
      const screenState = { currentScreen: 4 };
      setState(prev => ({ ...prev, ...screenState }));
      await saveProgress(screenState);
    }, 200);
  };

  // Complete transformation - NEVER BLOCKS, ALWAYS NAVIGATES
  const completeTransformation = async () => {
    console.log('🚀 completeTransformation called');
    console.log('Current state:', state);
    console.log('Profile:', profile);
    console.log('User:', user);

    // CRITICAL: Mark onboarding complete in localStorage FIRST
    localStorage.setItem('onboarding_complete', 'true');

    if (!user?.id) {
      console.error('❌ No user found - skipping database save');
      console.log('🌀 Triggering portal transition anyway');
      setState(prev => ({ ...prev, showPortalTransition: true }));
      return;
    }

    let hasErrors = false;

    try {
      console.log('💾 Starting to save onboarding data...');

      // Save non-negotiables to database
      console.log('Saving non-negotiables:', state.nonNegotiables);
      for (const item of state.nonNegotiables) {
        try {
          const { data, error } = await db.nonNegotiables.create({
            user_id: user.id,
            title: item
          });

          if (error) {
            console.error('❌ Failed to save non-negotiable:', item, error);
            hasErrors = true;
          } else {
            console.log('✅ Saved non-negotiable:', item, data);
          }
        } catch (error) {
          console.error('❌ Error saving non-negotiable:', item, error);
          hasErrors = true;
        }
      }

      // Save habits to database
      if (state.habitToBuild) {
        console.log('Saving habit to build:', state.habitToBuild);
        try {
          const { data, error} = await db.habits.create({
            user_id: user.id,
            title: state.habitToBuild,
            type: 'building',  // FIXED: was 'category', should be 'type'
            streak_count: 0,
            is_completed_today: false
          });

          if (error) {
            console.error('❌ Failed to save habit to build:', error);
            hasErrors = true;
          } else {
            console.log('✅ Saved habit to build:', data);
          }
        } catch (error) {
          console.error('❌ Error saving habit to build:', error);
          hasErrors = true;
        }
      }

      if (state.habitToBreak) {
        console.log('Saving habit to break:', state.habitToBreak);
        try {
          const { data, error } = await db.habits.create({
            user_id: user.id,
            title: state.habitToBreak,
            type: 'breaking',  // FIXED: was 'category', should be 'type'
            streak_count: 0,
            is_completed_today: false
          });

          if (error) {
            console.error('❌ Failed to save habit to break:', error);
            hasErrors = true;
          } else {
            console.log('✅ Saved habit to break:', data);
          }
        } catch (error) {
          console.error('❌ Error saving habit to break:', error);
          hasErrors = true;
        }
      }

      // Mark onboarding as completed in database
      console.log('📝 Calling completeOnboarding...');
      try {
        await completeOnboarding();
        console.log('✅ completeOnboarding finished successfully');
      } catch (error) {
        console.error('❌ Error calling completeOnboarding:', error);
        hasErrors = true;
      }

      // Trigger portal transition regardless of save success
      console.log('🌀 Triggering portal transition...');

      if (hasErrors) {
        console.warn('⚠️ Some data failed to save - user can update later');
        // Don't show error toast - just log it
      }

      // ALWAYS show portal - NEVER block user
      setState(prev => ({ ...prev, showPortalTransition: true }));
    } catch (error) {
      console.error('❌ Unexpected error completing onboarding:', error);
      // STILL show portal no matter what
      console.log('🌀 Triggering portal transition despite error');
      setState(prev => ({ ...prev, showPortalTransition: true }));
    }
  };

  const currentArchetype = state.archetype ? ARCHETYPES[state.archetype] : null;

  console.log('🎯 Onboarding render - currentScreen:', state.currentScreen);
  console.log('🎯 Onboarding render - state:', state);
  console.log('🎯 Current archetype:', state.archetype);

  // Dynamic background based on archetype selection
  const getArchetypeBackground = () => {
    if (!state.archetype) {
      return 'radial-gradient(ellipse at center, #1e1b4b 0%, #0a0a0f 100%)';
    }

    const backgrounds: Record<string, string> = {
      'builder': 'linear-gradient(135deg, #0891b2 0%, #0e7490 50%, #0a0a0f 100%)',
      'optimizer': 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #0a0a0f 100%)',
      'phoenix': 'linear-gradient(135deg, #f97316 0%, #dc2626 50%, #0a0a0f 100%)',
      'accelerator': 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #0a0a0f 100%)',
      'visionary': 'linear-gradient(135deg, #10b981 0%, #059669 50%, #0a0a0f 100%)',
      'emperor': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #0a0a0f 100%)'
    };

    const bg = backgrounds[state.archetype] || backgrounds['phoenix'];
    console.log('🎨 Background for', state.archetype, ':', bg);
    return bg;
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: getArchetypeBackground(),
        transition: 'background 0.5s ease',
      }}
    >
      {showConfetti && currentArchetype && (
        <Confetti colors={['bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-green-500']} />
      )}

      <AnimatePresence mode="wait">
        {/* WELCOME BACK SCREEN: Shows when user returns with saved progress */}
        {showWelcomeBack && (
          <motion.div
            key="welcome-back"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen flex items-center justify-center p-8"
          >
            <div className="max-w-2xl text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <h1 className="text-6xl font-light text-white mb-4">
                  Welcome Back
                </h1>
                <p className="text-2xl text-purple-200">
                  Your transformation was waiting for you
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <p className="text-lg text-white/90 mb-4">
                  You're picking up where you left off
                </p>
                {state.archetype && (
                  <p className="text-white/70">
                    Archetype: {ARCHETYPES[state.archetype as keyof typeof ARCHETYPES]?.title}
                  </p>
                )}
                {state.goal && (
                  <p className="text-white/70 mt-2">
                    Goal: "{state.goal}"
                  </p>
                )}
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWelcomeBack(false)}
                className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-2xl shadow-lg"
              >
                Continue Your Journey
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* SCREEN 0: MANIFEST YOUR DESTINY - Epic Animated Sequence */}
        {!showWelcomeBack && state.currentScreen === 0 && (
          <PortalScreen key="portal" />
        )}

        {/* SCREEN 1: Dream Activation - Archetype Selection */}
        {!showWelcomeBack && state.currentScreen === 1 && (
          <motion.div
            key="archetypes"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 1, ease: "easeOut", delay: 0.2 }
            }}
            exit={{
              opacity: 0,
              y: -20,
              transition: { duration: 0.6, ease: "easeIn" }
            }}
            className="min-h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-6xl font-bold text-white text-center mb-16"
              style={{
                textShadow: '0 0 40px rgba(147,51,234,0.4)',
              }}
            >
              Who are you becoming?
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
              {Object.entries(ARCHETYPES).map(([key, archetype], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectArchetype(key as keyof typeof ARCHETYPES)}
                  className="rounded-2xl p-8 cursor-pointer transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div className="text-6xl mb-4 text-center">{archetype.emoji}</div>
                  <h3 className="text-2xl font-bold text-white text-center mb-2">{archetype.title}</h3>
                  <p className="text-white/80 text-center">{archetype.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SCREEN 2: Manifestation Moment */}
        {!showWelcomeBack && state.currentScreen === 2 && currentArchetype && (
          <motion.div
            key="manifestation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white text-center mb-12"
              style={{
                textShadow: `0 0 40px ${currentArchetype.gradient[0]}60`,
              }}
            >
              What would make you cry with joy in 90 days?
            </motion.h1>

            <motion.textarea
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              value={state.goal}
              onChange={(e) => handleGoalChange(e.target.value)}
              className="w-full max-w-2xl h-32 p-6 rounded-2xl text-white text-xl resize-none focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              placeholder="Type your deepest desire..."
            />

            {state.goal.length > 20 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-4xl font-bold text-white mb-4"
                  style={{
                    textShadow: `0 0 30px ${currentArchetype.gradient[0]}80`,
                  }}
                >
                  {state.goal}
                </motion.div>
                <p className="text-2xl text-white/90 mb-8">Say it out loud. Right now.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setState(prev => ({ ...prev, hasSpokenGoal: true, currentScreen: 3 }));
                  }}
                  className="px-12 py-4 text-white text-xl font-bold rounded-2xl transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${currentArchetype.gradient[0]} 0%, ${currentArchetype.gradient[1]} 100%)`,
                    boxShadow: `0 8px 32px ${currentArchetype.gradient[0]}40`,
                  }}
                >
                  I said it. I meant it.
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* SCREEN 3: Energy Calibration */}
        {!showWelcomeBack && state.currentScreen === 3 && (
          <motion.div
            key="energy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white text-center mb-16"
              style={{
                textShadow: '0 0 40px rgba(147,51,234,0.4)',
              }}
            >
              How does today feel?
            </motion.h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(ENERGY_LEVELS).map(([key, energy], index) => {
                const glowColors = {
                  drained: '#6b7280',
                  building: '#eab308',
                  charged: '#f97316',
                  unstoppable: '#a855f7',
                };
                const currentGlow = glowColors[key as keyof typeof glowColors];

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => selectEnergy(key as keyof typeof ENERGY_LEVELS)}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <motion.div
                      animate={{
                        scale: energy.pulse === 'slow' ? [1, 1.1, 1] :
                               energy.pulse === 'medium' ? [1, 1.2, 1] :
                               energy.pulse === 'fast' ? [1, 1.3, 1] : [1, 1.5, 1]
                      }}
                      transition={{
                        duration: energy.pulse === 'slow' ? 2 :
                                 energy.pulse === 'medium' ? 1.5 :
                                 energy.pulse === 'fast' ? 1 : 0.5,
                        repeat: Infinity
                      }}
                      className="text-8xl mb-4 rounded-full p-8 relative"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: `0 0 40px ${currentGlow}60, inset 0 0 20px ${currentGlow}20`,
                      }}
                    >
                      {energy.emoji}
                    </motion.div>
                    <p className="text-white text-xl font-medium">{energy.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* SCREEN 4: Sacred Three - Non-Negotiables */}
        {!showWelcomeBack && state.currentScreen === 4 && currentArchetype && (
          <motion.div
            key="sacred-three"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white text-center mb-8"
              style={{
                textShadow: `0 0 40px ${currentArchetype.gradient[0]}60`,
              }}
            >
              Three daily promises to your future self
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-white/90 text-center mb-12"
            >
              Choose the pillars that will hold up your dreams
            </motion.p>

            {/* Archetype-based suggestions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mb-8">
              {getArchetypeNonNegotiables(state.archetype).map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleNonNegotiable(suggestion)}
                  className="p-4 rounded-xl transition-all duration-300 text-white font-medium"
                  style={{
                    background: state.nonNegotiables.includes(suggestion)
                      ? `linear-gradient(135deg, ${currentArchetype.gradient[0]} 0%, ${currentArchetype.gradient[1]} 100%)`
                      : 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)',
                    border: state.nonNegotiables.includes(suggestion)
                      ? `1px solid ${currentArchetype.gradient[0]}`
                      : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: state.nonNegotiables.includes(suggestion)
                      ? `0 4px 20px ${currentArchetype.gradient[0]}40`
                      : 'none',
                  }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>

            {/* Visual pillars */}
            {state.nonNegotiables.length === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-12 text-center"
              >
                <div className="flex items-end justify-center space-x-4 mb-8">
                  {state.nonNegotiables.map((pillar, index) => (
                    <motion.div
                      key={pillar}
                      initial={{ height: 0 }}
                      animate={{ height: 120 }}
                      transition={{ delay: index * 0.3, duration: 0.8 }}
                      className="w-16 rounded-t-lg flex items-end justify-center pb-2"
                      style={{
                        background: `linear-gradient(to top, ${currentArchetype.gradient[0]} 0%, ${currentArchetype.gradient[1]} 100%)`,
                      }}
                    >
                      <span className="text-white text-xs font-bold transform -rotate-90 whitespace-nowrap">
                        {pillar.slice(0, 8)}...
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="p-4 rounded-xl text-white font-bold text-lg mb-8"
                  style={{
                    background: `linear-gradient(135deg, ${currentArchetype.gradient[0]} 0%, ${currentArchetype.gradient[1]} 100%)`,
                  }}
                >
                  {state.goal}
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setState(prev => ({ ...prev, currentScreen: 5 }))}
                  className="px-12 py-4 text-white text-xl font-bold rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${currentArchetype.gradient[0]} 0%, ${currentArchetype.gradient[1]} 100%)`,
                    boxShadow: `0 8px 32px ${currentArchetype.gradient[0]}40`,
                  }}
                >
                  These are my pillars
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* SCREEN 5: Habit Alchemy */}
        {!showWelcomeBack && state.currentScreen === 5 && currentArchetype && (
          <motion.div
            key="habit-alchemy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-8"
          >
            <div className="w-full max-w-6xl">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold text-white text-center mb-16"
                style={{
                  textShadow: `0 0 40px ${currentArchetype.gradient[0]}60`,
                }}
              >
                Habit Alchemy
              </motion.h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Plant a seed */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl p-8"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🌱</div>
                    <h3 className="text-3xl font-bold text-emerald-400 mb-2">Plant one seed</h3>
                    <p className="text-white/80">A habit to build your future</p>
                  </div>

                  <div className="space-y-3">
                    {getArchetypeHabits(state.archetype, 'building').map((habit, index) => (
                      <motion.button
                        key={habit}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setState(prev => ({ ...prev, habitToBuild: habit }))}
                        className="w-full p-4 rounded-xl transition-all duration-300 text-left text-white font-medium"
                        style={{
                          background: state.habitToBuild === habit
                            ? 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'
                            : 'rgba(255,255,255,0.05)',
                          backdropFilter: 'blur(20px)',
                          border: state.habitToBuild === habit
                            ? '1px solid #22c55e'
                            : '1px solid rgba(255,255,255,0.1)',
                          boxShadow: state.habitToBuild === habit
                            ? '0 4px 20px rgba(34, 197, 94, 0.4)'
                            : 'none',
                        }}
                      >
                        {habit}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Pull a weed */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl p-8"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🔥</div>
                    <h3 className="text-3xl font-bold text-red-400 mb-2">Pull one weed</h3>
                    <p className="text-white/80">A habit to eliminate</p>
                  </div>

                  <div className="space-y-3">
                    {getArchetypeHabits(state.archetype, 'breaking').map((habit, index) => (
                      <motion.button
                        key={habit}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setState(prev => ({ ...prev, habitToBreak: habit }))}
                        className="w-full p-4 rounded-xl transition-all duration-300 text-left text-white font-medium"
                        style={{
                          background: state.habitToBreak === habit
                            ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)'
                            : 'rgba(255,255,255,0.05)',
                          backdropFilter: 'blur(20px)',
                          border: state.habitToBreak === habit
                            ? '1px solid #ef4444'
                            : '1px solid rgba(255,255,255,0.1)',
                          boxShadow: state.habitToBreak === habit
                            ? '0 4px 20px rgba(239, 68, 68, 0.4)'
                            : 'none',
                        }}
                      >
                        {habit}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {state.habitToBuild && state.habitToBreak && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-12"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setState(prev => ({ ...prev, currentScreen: 6 }))}
                    className="px-12 py-4 text-white text-xl font-bold rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${currentArchetype.gradient[0]} 0%, ${currentArchetype.gradient[1]} 100%)`,
                      boxShadow: `0 8px 32px ${currentArchetype.gradient[0]}40`,
                    }}
                  >
                    Begin the transformation
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* SCREEN 6: Reality Fracture Countdown - Apple/Google tier transformation */}
        {!showWelcomeBack && state.currentScreen === 6 && currentArchetype && !state.showShatterAnimation && (
          <motion.div
            key="initiation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            <RealityFractureCountdown
              onComplete={() => {
                console.log('🎬 Countdown complete - triggering shatter animation');
                setState(prev => ({ ...prev, showShatterAnimation: true }));
              }}
              duration={5}
              manifestationGoal={state.goal}
              archetype={{
                emoji: currentArchetype.emoji,
                gradient: currentArchetype.gradient,
                title: currentArchetype.title,
              }}
              promises={[
                ...state.nonNegotiables,
                ...(state.habitToBuild ? [state.habitToBuild] : []),
                ...(state.habitToBreak ? [state.habitToBreak] : []),
              ].filter(Boolean)}
              autoStart={true}
            />
          </motion.div>
        )}

        {/* SCREEN 6.5: Reality Shatter Animation - SIMPLIFIED */}
        {!showWelcomeBack && state.currentScreen === 6 && state.showShatterAnimation && currentArchetype && (
          <motion.div
            key="shatter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            {/* Simple white flash instead of complex animation */}
            <motion.div
              initial={{ backgroundColor: '#000' }}
              animate={{ backgroundColor: ['#000', '#fff', '#000'] }}
              transition={{ duration: 1, times: [0, 0.5, 1] }}
              onAnimationComplete={() => {
                console.log('🎊 Flash animation complete - moving to achievement screen');
                setState(prev => ({ ...prev, currentScreen: 7, showShatterAnimation: false }));
              }}
              className="w-full h-screen"
            />
          </motion.div>
        )}

        {/* SCREEN 7: Final Achievement - Combined & Beautiful */}
        {!showWelcomeBack && state.currentScreen === 7 && currentArchetype && (
          <motion.div
            key="victory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-8 text-center gap-10"
            style={{
              background: `linear-gradient(135deg, ${currentArchetype.gradient[0]} 0%, ${currentArchetype.gradient[1]} 100%)`,
            }}
          >
            {/* Trophy - Big and Dramatic */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="text-[80px]"
            >
              🏆
            </motion.div>

            {/* Main Message */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-semibold text-white text-center max-w-3xl"
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              }}
            >
              You just did what 99% won't do
            </motion.h1>

            {/* Achievement Card - Glass morphism */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-[20px] px-12 py-8"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              <h2 className="text-white text-2xl mb-4 font-medium">
                Achievement Unlocked
              </h2>
              <div className="flex items-center gap-4 justify-center">
                <span className="text-[40px]">🏆</span>
                <div className="text-left">
                  <p className="text-white text-xl font-medium m-0 mb-1">
                    The Initiator
                  </p>
                  <p className="text-yellow-400 text-lg font-semibold m-0">
                    +100 XP
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Welcome Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-2xl font-light"
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                color: 'rgba(255,255,255,0.9)',
              }}
            >
              Welcome to your transformation, {currentArchetype.title}
            </motion.p>

            {/* Enter Button - Glass Style */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={completeTransformation}
              className="px-16 py-5 text-xl font-medium text-white rounded-[15px] cursor-pointer mt-5"
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              Enter your new reality
            </motion.button>

            {/* Confetti Effect */}
            <Confetti colors={['bg-white', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400']} />
          </motion.div>
        )}

        {/* MANIFESTATION PORTAL: Their words literally becoming reality */}
        {!showWelcomeBack && state.showPortalTransition && currentArchetype && (
          <Portal3D
            onComplete={() => {
              console.log('✨ Manifestation complete - entering universe');
              console.log('🚀 ABOUT TO NAVIGATE TO UNIVERSE');
              console.log('Navigate function exists?', typeof navigate);

              try {
                navigate('/universe', {
                  replace: true,
                  state: {
                    manifestationGoal: state.goal,
                    archetype: currentArchetype,
                    firstTime: true
                  }
                });
                console.log('🚀 NAVIGATION CALLED - React Router navigate() executed');

                // Fallback: If navigation doesn't happen in 500ms, force it
                setTimeout(() => {
                  console.log('⚠️ FALLBACK: Checking if still on onboarding page...');
                  if (window.location.pathname.includes('onboarding')) {
                    console.warn('🔴 React Router navigation failed - using window.location');
                    window.location.href = '/universe';
                  }
                }, 500);
              } catch (error) {
                console.error('❌ Navigation error:', error);
                // Emergency fallback
                console.log('🚨 EMERGENCY: Using window.location.href');
                window.location.href = '/universe';
              }
            }}
            archetype={{
              emoji: currentArchetype.emoji,
              gradient: currentArchetype.gradient,
              title: currentArchetype.title,
            }}
            manifestationGoal={state.goal}
            duration={4000}
          />
        )}

        {/* FALLBACK: Invalid Screen State */}
        {(state.currentScreen > 7 || state.currentScreen < 0) && (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-light text-white text-center mb-8"
            >
              Something went wrong...
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl text-white/70 text-center mb-8"
            >
              Let's start your journey fresh.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setState(prev => ({ ...prev, currentScreen: 0 }))}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-xl"
            >
              Start Over
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Helper functions
  function toggleNonNegotiable(item: string) {
    setState(prev => ({
      ...prev,
      nonNegotiables: prev.nonNegotiables.includes(item)
        ? prev.nonNegotiables.filter(nn => nn !== item)
        : prev.nonNegotiables.length < 3
        ? [...prev.nonNegotiables, item]
        : prev.nonNegotiables
    }));
  }

  function getArchetypeNonNegotiables(archetype: keyof typeof ARCHETYPES | null): string[] {
    const suggestions = {
      builder: [
        'Morning planning session',
        'Daily skill building',
        'Network with one person',
        'Review progress metrics',
        'Read industry content',
        'Exercise for energy',
        'Prototype something new',
        'Document learnings',
        'Connect with mentors',
        'Visualize the vision',
        'Take calculated risks',
        'Optimize one process'
      ],
      optimizer: [
        'Time-block the day',
        'Eliminate one inefficiency',
        'Track key metrics',
        'Automate routine tasks',
        'Review and refine systems',
        'Learn optimization techniques',
        'Batch similar activities',
        'Minimize decision fatigue',
        'Optimize workspace',
        'Measure everything',
        'Continuous improvement',
        'Energy management'
      ],
      phoenix: [
        'Morning transformation ritual',
        'Release old patterns',
        'Embrace discomfort',
        'Practice resilience',
        'Celebrate small wins',
        'Journal breakthroughs',
        'Connect with purpose',
        'Take bold action',
        'Learn from setbacks',
        'Visualize new identity',
        'Practice self-compassion',
        'Share your story'
      ],
      accelerator: [
        'High-intensity morning routine',
        'Sprint on priority tasks',
        'Eliminate time wasters',
        'Move faster than yesterday',
        'Take immediate action',
        'Optimize for speed',
        'Practice rapid decision-making',
        'Maintain high energy',
        'Focus on momentum',
        'Compress timelines',
        'Execute with urgency',
        'Measure velocity'
      ],
      visionary: [
        'Morning vision meditation',
        'Scan for future trends',
        'Connect seemingly unrelated ideas',
        'Prototype future concepts',
        'Share your vision',
        'Study emerging patterns',
        'Practice systems thinking',
        'Cultivate intuition',
        'Document insights',
        'Network with innovators',
        'Question assumptions',
        'Imagine possibilities'
      ],
      emperor: [
        'Strategic planning session',
        'Make decisive choices',
        'Build your empire daily',
        'Delegate effectively',
        'Expand your influence',
        'Study successful leaders',
        'Practice commanding presence',
        'Invest in assets',
        'Build strategic relationships',
        'Think long-term',
        'Take calculated risks',
        'Measure your kingdom'
      ]
    };

    return archetype ? suggestions[archetype] : [];
  }

  function getArchetypeHabits(archetype: keyof typeof ARCHETYPES | null, type: 'building' | 'breaking'): string[] {
    const habits = {
      builder: {
        building: [
          'Code for 2 hours daily',
          'Read technical documentation',
          'Build one feature daily',
          'Learn new frameworks',
          'Contribute to open source',
          'Practice system design'
        ],
        breaking: [
          'Stop perfectionism paralysis',
          'Quit tutorial hell',
          'Stop building without planning',
          'Eliminate feature creep',
          'Stop working without breaks',
          'Quit comparing to others'
        ]
      },
      optimizer: {
        building: [
          'Time-block every hour',
          'Automate repetitive tasks',
          'Track productivity metrics',
          'Optimize workspace daily',
          'Batch similar activities',
          'Review and refine processes'
        ],
        breaking: [
          'Stop multitasking',
          'Eliminate decision fatigue',
          'Quit perfectionism',
          'Stop reactive scheduling',
          'Eliminate time wasters',
          'Stop saying yes to everything'
        ]
      },
      phoenix: {
        building: [
          'Morning transformation ritual',
          'Practice resilience daily',
          'Embrace one fear daily',
          'Journal breakthroughs',
          'Celebrate small wins',
          'Connect with purpose'
        ],
        breaking: [
          'Stop victim mentality',
          'Quit comfort zone addiction',
          'Stop dwelling on past',
          'Eliminate self-doubt',
          'Stop making excuses',
          'Quit negative self-talk'
        ]
      },
      accelerator: {
        building: [
          'Sprint on priority tasks',
          'Take immediate action',
          'Move faster than yesterday',
          'Practice rapid decisions',
          'Maintain high energy',
          'Execute with urgency'
        ],
        breaking: [
          'Stop overthinking',
          'Eliminate procrastination',
          'Quit analysis paralysis',
          'Stop slow decision-making',
          'Eliminate time wasters',
          'Stop perfectionism'
        ]
      },
      visionary: {
        building: [
          'Morning vision meditation',
          'Study future trends',
          'Connect unrelated ideas',
          'Prototype concepts',
          'Share your vision',
          'Practice systems thinking'
        ],
        breaking: [
          'Stop short-term thinking',
          'Quit conventional wisdom',
          'Stop limiting beliefs',
          'Eliminate narrow focus',
          'Stop following crowds',
          'Quit playing it safe'
        ]
      },
      emperor: {
        building: [
          'Strategic planning daily',
          'Make decisive choices',
          'Build influence daily',
          'Delegate effectively',
          'Expand your network',
          'Study successful leaders'
        ],
        breaking: [
          'Stop micromanaging',
          'Quit indecisiveness',
          'Stop doing everything yourself',
          'Eliminate weak boundaries',
          'Stop seeking approval',
          'Quit small thinking'
        ]
      }
    };

    return archetype ? habits[archetype][type] : [];
  }
}