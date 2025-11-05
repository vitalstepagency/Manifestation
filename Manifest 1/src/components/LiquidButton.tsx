/**
 * LiquidButton - Morphing Liquid Button with Premium Feel
 *
 * Features:
 * - Liquid morphing effect on hover using react-spring
 * - Gesture-based interactions with @use-gesture
 * - Smooth, buttery animations that feel alive
 * - Apple-killer interactions
 */

import { useRef } from 'react';
import { useSpring, animated, config } from 'react-spring';
import { useGesture } from '@use-gesture/react';
import { ANIMATION_PRINCIPLES } from '../systems/AnimationEngine';

// ============================================================================
// TYPES
// ============================================================================

interface LiquidButtonProps {
  /** Button text */
  children: React.ReactNode;

  /** Click handler */
  onClick?: () => void;

  /** Button variant */
  variant?: 'primary' | 'secondary' | 'success' | 'danger';

  /** Full width button */
  fullWidth?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Custom className */
  className?: string;

  /** Gradient colors (optional override) */
  gradient?: [string, string];
}

// ============================================================================
// VARIANT STYLES
// ============================================================================

const VARIANT_GRADIENTS = {
  primary: ['#8B5CF6', '#EC4899'],    // Purple to Pink
  secondary: ['#3B82F6', '#8B5CF6'],  // Blue to Purple
  success: ['#10B981', '#34D399'],    // Green
  danger: ['#EF4444', '#F87171'],     // Red
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className = '',
  gradient,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Get gradient colors
  const [color1, color2] = gradient || VARIANT_GRADIENTS[variant];

  // Spring for liquid morphing effect
  const [springProps, springApi] = useSpring(() => ({
    scale: 1,
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    borderRadius: 12,
    shadowBlur: 20,
    shadowSpread: 0,
    glowIntensity: 0.5,
    config: config.wobbly,
  }));

  // Gesture handlers
  const bind = useGesture(
    {
      // Hover effect
      onHover: ({ hovering }) => {
        if (disabled) return;

        if (hovering) {
          springApi.start({
            scale: ANIMATION_PRINCIPLES.SCALE.HOVER,
            y: -ANIMATION_PRINCIPLES.DISTANCE.TINY,
            borderRadius: 16,
            shadowBlur: 40,
            shadowSpread: 8,
            glowIntensity: 1,
            config: config.wobbly,
          });
        } else {
          springApi.start({
            scale: 1,
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            borderRadius: 12,
            shadowBlur: 20,
            shadowSpread: 0,
            glowIntensity: 0.5,
            config: config.gentle,
          });
        }
      },

      // Mouse move for 3D tilt effect
      onMove: ({ hovering, movement: [mx, my] }) => {
        if (disabled || !hovering) return;

        const rect = buttonRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Calculate rotation based on mouse position
        const rotateY = ((mx - rect.left) / rect.width - 0.5) * 20;
        const rotateX = -((my - rect.top) / rect.height - 0.5) * 20;

        springApi.start({
          rotateX,
          rotateY,
          config: config.slow,
        });
      },

      // Click/press effect
      onClick: () => {
        if (disabled) return;

        // Quick press animation
        springApi.start({
          scale: ANIMATION_PRINCIPLES.SCALE.PRESS,
          config: { tension: 300, friction: 10 },
        });

        // Return to hover state
        setTimeout(() => {
          springApi.start({
            scale: ANIMATION_PRINCIPLES.SCALE.HOVER,
            config: config.wobbly,
          });
        }, 100);

        // Call the actual onClick handler
        if (onClick) {
          onClick();
        }
      },
    },
    {
      hover: { mouseOnly: true },
    }
  );

  return (
    <animated.button
      ref={buttonRef}
      {...bind()}
      disabled={disabled}
      className={`
        relative overflow-hidden font-medium text-white
        transition-opacity duration-200
        ${fullWidth ? 'w-full' : 'px-8'}
        py-4
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        transform: springProps.scale.to((s) =>
          `perspective(1000px)
           scale(${s})
           translateX(${springProps.x.get()}px)
           translateY(${springProps.y.get()}px)
           rotateX(${springProps.rotateX.get()}deg)
           rotateY(${springProps.rotateY.get()}deg)`
        ),
        borderRadius: springProps.borderRadius.to((r) => `${r}px`),
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
        boxShadow: springProps.shadowBlur.to(
          (blur) =>
            `0 ${springProps.shadowSpread.get()}px ${blur}px rgba(139, 92, 246, ${springProps.glowIntensity.get() * 0.4})`
        ),
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* Liquid shimmer effect overlay */}
      <animated.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
          transform: springProps.scale.to(
            (s) => `translateX(${(s - 1) * 200 - 100}%)`
          ),
          transition: 'transform 0.6s ease',
        }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Bottom glow */}
      <animated.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 rounded-full blur-xl pointer-events-none"
        style={{
          background: color1,
          opacity: springProps.glowIntensity.to((i) => i * 0.6),
        }}
      />
    </animated.button>
  );
};

export default LiquidButton;
