/**
 * Portal Transition - Premium Siri/ElevenLabs Quality Orb
 *
 * Stunning multi-layer orb animation with forced navigation to dashboard
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// TYPES
// ============================================================================

interface PortalTransitionProps {
  /** Callback when transition completes (optional, navigation handled internally) */
  onComplete?: () => void;

  /** User's archetype for theming */
  archetype: {
    emoji: string;
    gradient: string[];
    title: string;
  };

  /** Manifestation goal text */
  manifestationGoal?: string;

  /** Duration in milliseconds (default: 3000) */
  duration?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const PortalTransition: React.FC<PortalTransitionProps> = ({
  onComplete,
  archetype,
  manifestationGoal = '',
  duration = 3000,
}) => {
  const navigate = useNavigate();
  const [color1, color2] = archetype.gradient;

  useEffect(() => {
    console.log('🌀 PREMIUM PORTAL TRANSITION STARTED - Auto-advancing in 3s');

    // FORCE NAVIGATION after animation - using replace to prevent back button issues
    const timer = setTimeout(() => {
      console.log('🚀 NAVIGATING TO DASHBOARD...');
      if (onComplete) {
        onComplete();
      } else {
        // FORCE navigation with replace option
        navigate('/dashboard', { replace: true });
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, navigate, onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-50">
      {/* Premium Orb Container */}
      <div className="relative w-96 h-96 portal-orb">

        {/* Outer glow - largest layer */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color1}4D 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Middle layer - pulsing ring */}
        <motion.div
          className="absolute inset-8 rounded-full"
          style={{
            background: `radial-gradient(circle, transparent 40%, ${color2}66 50%, transparent 60%)`,
            filter: 'blur(20px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Core orb with gradient mesh */}
        <motion.div
          className="absolute inset-16 rounded-full"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, ${color1}99 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, ${color2}99 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, ${color1} 0%, transparent 100%)
            `,
            backdropFilter: 'blur(30px)',
            boxShadow: `
              inset 0 0 60px ${color1}80,
              0 0 120px ${color1}66,
              0 0 200px ${color2}4D
            `,
          }}
          animate={{
            scale: [1, 1.1, 0.9, 1],
            rotate: [0, -90, -180, -270, -360],
          }}
          transition={{
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />

        {/* Inner core - bright center */}
        <motion.div
          className="absolute inset-32 rounded-full bg-white"
          style={{
            filter: 'blur(8px)',
            boxShadow: '0 0 80px rgba(255,255,255,0.8)',
          }}
          animate={{
            scale: [0.8, 1, 0.8],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Archetype emoji in center */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-8xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: 0.8,
            times: [0, 0.6, 1],
            ease: "easeOut"
          }}
        >
          {archetype.emoji}
        </motion.div>

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              background: i % 2 === 0 ? color1 : color2,
              filter: 'blur(1px)',
              boxShadow: `0 0 10px ${i % 2 === 0 ? color1 : color2}`,
            }}
            animate={{
              x: [
                Math.cos(i * Math.PI / 3) * 140,
                Math.cos((i * Math.PI / 3) + Math.PI) * 140,
                Math.cos(i * Math.PI / 3) * 140,
              ],
              y: [
                Math.sin(i * Math.PI / 3) * 140,
                Math.sin((i * Math.PI / 3) + Math.PI) * 140,
                Math.sin(i * Math.PI / 3) * 140,
              ],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Text below orb */}
      <motion.div
        className="absolute bottom-32 text-white text-2xl font-light tracking-widest"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
        transition={{ duration: 3, times: [0, 0.3, 0.7, 1] }}
      >
        ENTERING YOUR NEW REALITY
      </motion.div>
    </div>
  );
};

export default PortalTransition;
