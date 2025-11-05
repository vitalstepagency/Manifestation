/**
 * Reality Fracture Countdown - Transformation Ceremony
 *
 * BULLETPROOF SIMPLE VERSION - NO CRASHES
 * - Count from duration to 1 (never 0)
 * - Show manifestation at 3
 * - Show promises at 2
 * - Show archetype at 1
 * - Trigger animation immediately at 1
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

interface RealityFractureCountdownProps {
  /** Callback when countdown reaches zero */
  onComplete: () => void;

  /** Countdown duration in seconds (default: 10) */
  duration?: number;

  /** User's manifestation goal */
  manifestationGoal?: string;

  /** User's archetype for theming */
  archetype?: {
    emoji: string;
    gradient: string[];
    title: string;
  };

  /** Sacred promises (non-negotiables + habits) */
  promises?: string[];

  /** Whether countdown starts automatically */
  autoStart?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const RealityFractureCountdown: React.FC<RealityFractureCountdownProps> = ({
  onComplete,
  duration = 10,
  manifestationGoal = '',
  archetype,
  promises = [],
  autoStart = false,
}) => {
  const [count, setCount] = useState(duration);

  // CUMULATIVE DISPLAY: Elements stay once shown
  const [showManifestation, setShowManifestation] = useState(false);
  const [showPromises, setShowPromises] = useState(false);
  const [showArchetype, setShowArchetype] = useState(false);

  // SAFETY: Ensure all data has fallbacks
  const safeManifestationGoal = manifestationGoal || 'Your transformation';
  const safePromises = Array.isArray(promises) ? promises.filter(Boolean) : [];
  const safeArchetype = archetype || { emoji: '🏆', title: 'Builder', gradient: ['#9333ea', '#a855f7'] };

  console.log('🎬 COUNTDOWN COMPONENT MOUNTED');
  console.log('📊 Duration:', duration);
  console.log('🎯 Manifestation Goal:', safeManifestationGoal);
  console.log('🏛️ Promises:', safePromises);
  console.log('👑 Archetype:', safeArchetype);

  // Simple countdown timer - starts immediately
  useEffect(() => {
    console.log('⏱️ Starting countdown timer from', duration);

    const interval = setInterval(() => {
      setCount(prev => {
        const newCount = prev - 1;
        console.log('⏰ Countdown tick:', newCount);

        // Show elements at specific counts - they STAY visible
        if (newCount === 3) {
          console.log('✨ COUNT 3: Showing manifestation goal');
          setShowManifestation(true);
        }
        if (newCount === 2) {
          console.log('🏛️ COUNT 2: Showing promises');
          setShowPromises(true);
        }
        if (newCount === 1) {
          console.log('👑 COUNT 1: Showing archetype - holding for 750ms');
          setShowArchetype(true);

          // At 1, wait 750ms then trigger animation (skip showing 0)
          clearInterval(interval);
          setTimeout(() => {
            console.log('🔥 TRIGGERING SHATTER ANIMATION NOW (from count 1)');
            onComplete();
          }, 750);

          return 1; // Stay at 1, never go to 0
        }

        if (newCount <= 0) {
          console.log('🎬 Countdown hit ZERO (should not happen)');
          clearInterval(interval);
          onComplete();
          return 0;
        }

        return newCount;
      });
    }, 1000);

    return () => {
      console.log('🛑 Countdown timer cleaned up');
      clearInterval(interval);
    };
  }, [duration, onComplete]);

  // Get archetype color (fallback to purple)
  const archetypeColor = safeArchetype.gradient[0] || '#9333ea';

  // SAFETY: Wrap entire render in try-catch
  try {
    return (
      <div
        className="relative w-full h-screen overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)',
        }}
      >
      {/* ===== FLOATING ORBS IN BACKGROUND ===== */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%)',
          top: '20%',
          left: '10%',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${archetypeColor}20 0%, transparent 70%)`,
          top: '60%',
          right: '15%',
          animation: 'float 8s ease-in-out infinite',
        }}
      />

      {/* Main content container */}
      <div className="relative h-full flex flex-col items-center justify-center z-10">
        {/* ===== TITLE - Only show when count > 3 ===== */}
        {count > 3 && (
          <div className="absolute top-[25%]">
            <p
              className="text-2xl font-light tracking-[0.2em] animate-fade-in"
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Your transformation begins in
            </p>
          </div>
        )}

        {/* ===== MAIN COUNTDOWN NUMBER - Show 5 through 1, never 0 ===== */}
        {count >= 1 && (
          <div
            key={count}
            className="text-[180px] leading-none font-light text-white select-none"
            style={{
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              fontWeight: 200,
              textShadow: `
                0 0 80px rgba(255,255,255,0.5),
                0 0 120px ${archetypeColor}50,
                0 0 200px ${archetypeColor}20
              `,
              animation: 'pulse 1s ease-out',
            }}
          >
            {count}
          </div>
        )}

        {/* ===== MANIFESTATION GOAL - Appears at 3 and STAYS ===== */}
        {showManifestation && (
          <div
            className="absolute top-[20%] px-10 py-5 rounded-[20px] transition-opacity duration-500"
            style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              maxWidth: '80%',
              opacity: showManifestation ? 1 : 0,
            }}
          >
            <p
              className="text-[24px] font-light m-0"
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                color: 'white',
              }}
            >
              "{safeManifestationGoal}"
            </p>
          </div>
        )}

        {/* ===== PROMISES - Appear at 2 and STAY ===== */}
        {showPromises && safePromises.length > 0 && (
          <div
            className="absolute bottom-[30%] flex gap-5 flex-wrap justify-center max-w-4xl transition-opacity duration-500"
            style={{
              opacity: showPromises ? 1 : 0,
            }}
          >
            {safePromises.slice(0, 2).map((promise, i) => (
              <div
                key={`promise-${i}`}
                className="px-6 py-3 rounded-[15px]"
                style={{
                  background: `rgba(147,51,234,0.1)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${archetypeColor}50`,
                }}
              >
                <p
                  className="m-0 text-sm font-normal"
                  style={{
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    color: 'white',
                  }}
                >
                  {i === 0 ? '🌱' : '🔥'} {promise}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ===== ARCHETYPE - Appears at 1 and STAYS ===== */}
        {showArchetype && (
          <div
            className="absolute bottom-[15%] text-4xl font-light tracking-[0.15em] uppercase transition-opacity duration-500"
            style={{
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              color: 'white',
              textShadow: '0 0 40px rgba(255,255,255,0.5)',
              opacity: showArchetype ? 1 : 0,
            }}
          >
            {safeArchetype.title}
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes pulse {
          from { transform: scale(0.95); opacity: 0.7; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-in;
        }
      `}</style>
      </div>
    );
  } catch (error) {
    console.error('🚨 COUNTDOWN RENDER ERROR:', error);
    // FALLBACK: Simple black screen with number
    return (
      <div style={{
        background: '#000',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '120px',
        fontWeight: '200'
      }}>
        {count}
      </div>
    );
  }
};

export default RealityFractureCountdown;
