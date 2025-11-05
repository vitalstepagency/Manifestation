/**
 * FinalPortal - Simple, Emotional Transition
 *
 * User's manifestation text morphs into reality
 * Their words → particles → symbol → universe
 * 2.5 seconds total using Framer Motion only
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FinalPortalProps {
  manifestationText: string;
  archetype: {
    emoji: string;
    title: string;
    gradient: string[];
  };
  onComplete?: () => void;
  duration?: number;
}

export const FinalPortal = ({
  manifestationText,
  archetype,
  onComplete,
  duration = 2500
}: FinalPortalProps) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'text' | 'dissolve' | 'symbol' | 'expand' | 'complete'>('text');

  useEffect(() => {
    // Stage timing
    const timers = [
      setTimeout(() => setStage('dissolve'), 800),   // Text appears for 0.8s
      setTimeout(() => setStage('symbol'), 1300),    // Dissolve for 0.5s
      setTimeout(() => setStage('expand'), 1800),    // Symbol for 0.5s
      setTimeout(() => setStage('complete'), 2300),  // Expand for 0.5s
    ];

    // Navigate after complete
    const navTimer = setTimeout(() => {
      console.log('✨ Portal complete - entering Universe');
      if (onComplete) {
        onComplete();
      } else {
        navigate('/universe', { replace: true });
      }
    }, duration);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(navTimer);
    };
  }, [duration, navigate, onComplete]);

  // Shorten text if needed
  const displayText = manifestationText.length > 60
    ? manifestationText.slice(0, 57) + "..."
    : manifestationText;

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Stage 1: Manifestation Text Appears */}
        {stage === 'text' && (
          <motion.div
            key="text"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h1
              className="text-5xl md:text-6xl font-bold text-white text-center px-8 max-w-4xl"
              style={{
                textShadow: `0 0 40px ${archetype.gradient[0]}80, 0 0 80px ${archetype.gradient[1]}40`,
                background: `linear-gradient(135deg, ${archetype.gradient[0]}, ${archetype.gradient[1]})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {displayText}
            </h1>
          </motion.div>
        )}

        {/* Stage 2: Text Dissolves into Particles */}
        {stage === 'dissolve' && (
          <motion.div
            key="dissolve"
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Create particle effect with multiple dots */}
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${archetype.gradient[0]}, ${archetype.gradient[1]})`,
                  boxShadow: `0 0 10px ${archetype.gradient[0]}`
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1
                }}
                animate={{
                  x: (Math.random() - 0.5) * window.innerWidth * 0.3,
                  y: (Math.random() - 0.5) * window.innerHeight * 0.3,
                  opacity: [1, 1, 0],
                  scale: [1, 1.5, 0]
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.01,
                  ease: 'easeOut'
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Stage 3: Archetype Symbol Forms */}
        {(stage === 'symbol' || stage === 'expand') && (
          <motion.div
            key="symbol"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: stage === 'expand' ? 0 : 1,
              scale: stage === 'expand' ? 3 : 1,
              rotate: stage === 'expand' ? 180 : 0
            }}
            transition={{
              duration: stage === 'expand' ? 0.5 : 0.4,
              ease: stage === 'expand' ? 'easeIn' : 'easeOut'
            }}
          >
            {/* Archetype Emoji */}
            <motion.div
              className="text-9xl mb-6"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {archetype.emoji}
            </motion.div>

            {/* Glowing Ring */}
            <motion.div
              className="absolute w-64 h-64 rounded-full border-4"
              style={{
                borderColor: archetype.gradient[0],
                boxShadow: `0 0 60px ${archetype.gradient[0]}, inset 0 0 60px ${archetype.gradient[0]}`
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: 360
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 4, repeat: Infinity, ease: 'linear' }
              }}
            />

            {/* Inner Ring */}
            <motion.div
              className="absolute w-48 h-48 rounded-full border-2"
              style={{
                borderColor: archetype.gradient[1],
                boxShadow: `0 0 40px ${archetype.gradient[1]}`
              }}
              animate={{
                scale: [1, 0.9, 1],
                rotate: -360
              }}
              transition={{
                scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 3, repeat: Infinity, ease: 'linear' }
              }}
            />

            {/* Archetype Title */}
            <motion.p
              className="text-2xl text-white/80 tracking-wider uppercase mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {archetype.title}
            </motion.p>
          </motion.div>
        )}

        {/* Stage 4: Fade to Black & Navigate */}
        {stage === 'complete' && (
          <motion.div
            key="complete"
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Status Text */}
      <motion.div
        className="absolute bottom-12 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white/60 text-sm tracking-widest uppercase">
          {stage === 'text' && 'Your manifestation begins...'}
          {stage === 'dissolve' && 'Breaking through reality...'}
          {stage === 'symbol' && 'Your universe is forming...'}
          {stage === 'expand' && 'Entering your new reality...'}
        </p>
      </motion.div>
    </div>
  );
};

export default FinalPortal;
