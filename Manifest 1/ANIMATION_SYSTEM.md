# World-Class Animation System

A comprehensive animation system that surpasses Apple, Google, and Palantir in quality and feel.

## 🎯 Overview

This animation system provides:
- **Premium Liquid Buttons** with morphing effects and 3D tilt
- **3D WebGL Portal** using React Three Fiber
- **Scroll-Triggered Reveals** powered by GSAP
- **Interactive Particle Systems** with mouse interaction
- **Performance Monitoring** ensuring 60fps
- **Animation Principles** library for consistent timing and easing

## 📦 Libraries Used

```bash
npm install gsap @gsap/react three @react-three/fiber @react-three/drei lottie-react @lottiefiles/react-lottie-player react-spring @use-gesture/react --legacy-peer-deps
```

## 🚀 Quick Start

### 1. Liquid Button

Morphing buttons with premium feel, 3D tilt, and buttery interactions.

```tsx
import LiquidButton from './components/LiquidButton';

function MyComponent() {
  return (
    <LiquidButton
      variant="primary"
      onClick={() => console.log('Clicked!')}
    >
      Click Me
    </LiquidButton>
  );
}
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger'
- `fullWidth`: boolean
- `disabled`: boolean
- `gradient`: [string, string] - Custom gradient colors
- `onClick`: () => void

**Variants:**
- `primary`: Purple to Pink gradient
- `secondary`: Blue to Purple gradient
- `success`: Green gradient
- `danger`: Red gradient

### 2. Scroll Reveal

Animate elements as they enter the viewport with GSAP ScrollTrigger.

```tsx
import { ScrollReveal, SlideUp, FadeIn, ScaleIn, StaggerReveal } from './components/ScrollReveal';

function MyComponent() {
  return (
    <>
      {/* Simple fade in */}
      <FadeIn>
        <div>This fades in on scroll</div>
      </FadeIn>

      {/* Slide up animation */}
      <SlideUp delay={0.2}>
        <div>This slides up</div>
      </SlideUp>

      {/* Scale in animation */}
      <ScaleIn>
        <div>This scales in</div>
      </ScaleIn>

      {/* Stagger children */}
      <StaggerReveal>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </StaggerReveal>

      {/* Custom animation */}
      <ScrollReveal
        animation="custom"
        customAnimation={{
          opacity: 0,
          rotation: -45,
          scale: 0.5,
        }}
        duration={1}
        ease="elastic.out"
      >
        <div>Custom animation</div>
      </ScrollReveal>
    </>
  );
}
```

**Props:**
- `animation`: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn' | 'custom'
- `customAnimation`: gsap.TweenVars (when animation="custom")
- `duration`: number (seconds)
- `delay`: number (seconds)
- `ease`: string (GSAP easing)
- `stagger`: number (delay between children)
- `triggerPoint`: number (0-1, where 0.8 = 80% from top)
- `once`: boolean (animate once or every time)
- `scrub`: boolean | number (tie animation to scroll)
- `markers`: boolean (show debug markers)

### 3. Particle Field

Interactive 3D particle system using Three.js.

```tsx
import { ParticleField, ManifestationParticles } from './components/ParticleField';

function MyComponent() {
  return (
    <>
      {/* Basic particle field */}
      <ParticleField
        particleCount={1000}
        color="#8B5CF6"
        color2="#EC4899"
        interactive={true}
        speed={1}
        height="400px"
      />

      {/* Preset manifestation particles */}
      <ManifestationParticles energy="high" />
    </>
  );
}
```

**Props:**
- `particleCount`: number (default: 1000)
- `color`: string (primary color)
- `color2`: string (secondary color for gradient)
- `size`: number (particle size)
- `interactive`: boolean (mouse interaction)
- `speed`: number (animation speed multiplier)
- `height`: string (canvas height)

**ManifestationParticles Props:**
- `energy`: 'low' | 'medium' | 'high'
  - low: 500 particles, slower
  - medium: 1000 particles, normal speed
  - high: 2000 particles, faster

### 4. 3D Portal Transition

Cinema-quality 3D portal using React Three Fiber (replaces the 2D portal).

```tsx
import Portal3D from './components/onboarding/Portal3D';

function MyComponent() {
  return (
    <Portal3D
      archetype={{
        emoji: '🌟',
        gradient: ['#8B5CF6', '#EC4899'],
        title: 'Visionary',
      }}
      manifestationGoal="My manifestation goal"
      duration={3000}
      onComplete={() => navigate('/dashboard')}
    />
  );
}
```

**Props:**
- `archetype`: { emoji: string; gradient: string[]; title: string }
- `manifestationGoal`: string
- `duration`: number (milliseconds)
- `onComplete`: () => void

### 5. Performance Monitor

Real-time FPS and performance tracking with debug overlay.

```tsx
import { PerformanceMonitor, usePerformanceMonitor } from './systems/PerformanceMonitor';

function MyComponent() {
  // Use as component (with debug overlay)
  return (
    <PerformanceMonitor
      showDebug={true}
      targetFps={60}
      autoAdjustQuality={true}
      onLowPerformance={(metrics) => console.log('Low performance:', metrics)}
    />
  );
}

// Or use as hook
function AnotherComponent() {
  const metrics = usePerformanceMonitor(60);

  console.log('FPS:', metrics.fps);
  console.log('Average FPS:', metrics.averageFps);
  console.log('Quality:', metrics.quality);

  return <div>FPS: {metrics.fps}</div>;
}
```

**Props:**
- `showDebug`: boolean (show debug overlay)
- `targetFps`: number (target FPS, default: 60)
- `autoAdjustQuality`: boolean (auto quality adjustment)
- `onLowPerformance`: (metrics) => void

**Metrics:**
```ts
interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  averageFps: number;
  droppedFrames: number;
  quality: 'high' | 'medium' | 'low';
}
```

### 6. Animation Engine

Core animation principles and presets.

```tsx
import { ANIMATION_PRINCIPLES, ANIMATION_PRESETS, useAnimatedRef, useHoverAnimation } from './systems/AnimationEngine';
import gsap from 'gsap';

function MyComponent() {
  // Use animation principles
  const duration = ANIMATION_PRINCIPLES.TIMING.SMOOTH; // 0.5s
  const easing = ANIMATION_PRINCIPLES.EASING.DRAMATIC; // 'power4.out'

  // Use presets
  useEffect(() => {
    ANIMATION_PRESETS.fadeIn('.my-element', 0.5);
    ANIMATION_PRESETS.slideInFromBottom('.another-element');
  }, []);

  // Use animated ref
  const { ref, animate } = useAnimatedRef();

  const handleClick = () => {
    animate({
      scale: 1.2,
      duration: ANIMATION_PRINCIPLES.TIMING.QUICK,
      ease: ANIMATION_PRINCIPLES.EASING.ELASTIC,
    });
  };

  // Use hover animation hook
  const hoverProps = useHoverAnimation(
    { scale: 1.05, y: -8 }, // hover state
    { scale: 1, y: 0 }      // default state
  );

  return (
    <>
      <div ref={ref} onClick={handleClick}>Click me</div>
      <div {...hoverProps}>Hover me</div>
    </>
  );
}
```

**Animation Principles:**

```ts
ANIMATION_PRINCIPLES.TIMING = {
  INSTANT: 0.15,       // Instant feedback (button presses)
  QUICK: 0.3,          // Quick transitions (hover states)
  SMOOTH: 0.5,         // Smooth page transitions
  DRAMATIC: 0.8,       // Dramatic reveals
  CINEMATIC: 1.2,      // Cinematic moments
  MEDITATION: 2.0,     // Meditative moments
}

ANIMATION_PRINCIPLES.EASING = {
  NATURAL: 'power2.out',    // Smooth, natural
  SNAPPY: 'power3.out',     // Snappy, responsive
  ELASTIC: 'elastic.out',   // Elastic, playful
  BOUNCE: 'bounce.out',     // Bounce, joyful
  SMOOTH: 'power2.inOut',   // Smooth both ways
  DRAMATIC: 'power4.out',   // Dramatic entrance
  MAGICAL: 'expo.out',      // Exponential, magical
}

ANIMATION_PRINCIPLES.SCALE = {
  SUBTLE: 1.02,        // Subtle hover
  HOVER: 1.05,         // Standard hover
  PRESS: 0.95,         // Button press
  EMPHASIS: 1.1,       // Draw attention
  DRAMATIC: 1.2,       // Major reveal
  EXPLOSIVE: 1.5,      // Celebration
}
```

**Animation Presets:**

```ts
ANIMATION_PRESETS.fadeIn(element, duration)
ANIMATION_PRESETS.slideInFromBottom(element, duration)
ANIMATION_PRESETS.slideInFromTop(element, duration)
ANIMATION_PRESETS.scaleIn(element, duration)
ANIMATION_PRESETS.celebrationBurst(element)
ANIMATION_PRESETS.hoverLift(element)
ANIMATION_PRESETS.hoverReset(element)
ANIMATION_PRESETS.buttonPress(element)
ANIMATION_PRESETS.staggerChildren(container, childSelector, animation, stagger)
```

## 🎨 Complete Example

See `src/components/AnimationExamples.tsx` for a complete showcase of all animations.

To view the examples:

```tsx
import AnimationExamples from './components/AnimationExamples';

function App() {
  return <AnimationExamples />;
}
```

## 🎯 Best Practices

### 1. Performance
- Always use the PerformanceMonitor during development
- Target 60fps for all animations
- Use hardware acceleration (transform, opacity)
- Avoid animating expensive properties (width, height, top, left)

### 2. Timing
- Use `INSTANT` (0.15s) for immediate feedback (button presses)
- Use `QUICK` (0.3s) for hover states
- Use `SMOOTH` (0.5s) for page transitions
- Use `DRAMATIC` (0.8s) for reveals
- Use `CINEMATIC` (1.2s) for major moments

### 3. Easing
- Use `NATURAL` for most UI interactions
- Use `SNAPPY` for button clicks
- Use `ELASTIC` for success states
- Use `DRAMATIC` for reveals
- Use `MAGICAL` for special moments

### 4. Accessibility
- Respect `prefers-reduced-motion`
- Ensure animations don't interfere with functionality
- Provide static alternatives when needed

### 5. Consistency
- Always use `ANIMATION_PRINCIPLES` for timing and easing
- Use animation presets when possible
- Keep animation style consistent across the app

## 📊 Performance Targets

- **FPS**: Maintain 60fps during all animations
- **Frame Time**: < 16.67ms per frame
- **Quality Levels**:
  - High: 60+ fps
  - Medium: 30-60 fps
  - Low: < 30 fps (auto-reduce particle counts, disable effects)

## 🔧 Troubleshooting

### Low FPS
1. Enable PerformanceMonitor with `showDebug={true}`
2. Check for expensive operations in render loops
3. Reduce particle counts
4. Disable interactive features on low-end devices

### Animations Not Triggering
1. Check ScrollTrigger setup (ensure GSAP is registered)
2. Verify element is in viewport trigger zone
3. Check `once` prop (set to `false` for repeating animations)
4. Ensure element has height/width

### 3D Portal Performance Issues
1. Reduce particle count
2. Lower canvas resolution
3. Disable auto-rotate
4. Use simpler geometry

## 📝 Migration Guide

### From 2D Portal to 3D Portal

**Before:**
```tsx
<PortalTransition
  archetype={archetype}
  duration={3000}
/>
```

**After:**
```tsx
<Portal3D
  archetype={archetype}
  duration={3000}
/>
```

### From Regular Buttons to Liquid Buttons

**Before:**
```tsx
<button onClick={handleClick}>
  Click Me
</button>
```

**After:**
```tsx
<LiquidButton
  variant="primary"
  onClick={handleClick}
>
  Click Me
</LiquidButton>
```

## 🎉 Features Summary

✅ **Liquid Morphing Buttons** - Apple-killer interactions
✅ **3D WebGL Portal** - Cinema-quality transition
✅ **Scroll Reveals** - GSAP-powered scroll animations
✅ **Particle Systems** - Interactive 3D particles
✅ **Performance Monitor** - Real-time FPS tracking
✅ **Animation Engine** - Consistent timing and easing
✅ **Hardware Acceleration** - GPU-optimized rendering
✅ **60fps Target** - Smooth, premium feel

## 📚 Additional Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [React Spring](https://www.react-spring.dev/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Built with** ❤️ **for the Manifest App**
