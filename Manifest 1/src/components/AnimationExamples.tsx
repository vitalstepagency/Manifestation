/**
 * Animation Examples - Showcase of World-Class Animation System
 *
 * This component demonstrates how to use all the premium animation components
 * Created: 2025-11-03
 */

import { useState } from 'react';
import LiquidButton from './LiquidButton';
import { ScrollReveal, SlideUp, FadeIn, ScaleIn, StaggerReveal } from './ScrollReveal';
import { ParticleField, ManifestationParticles } from './ParticleField';
import { PerformanceMonitor } from '../systems/PerformanceMonitor';
import { ANIMATION_PRINCIPLES } from '../systems/AnimationEngine';

export const AnimationExamples = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [particleEnergy, setParticleEnergy] = useState<'low' | 'medium' | 'high'>('medium');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Performance Monitor - Toggle with "P" key */}
      <PerformanceMonitor showDebug={showDebug} />

      {/* Debug Toggle */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition-colors"
        >
          {showDebug ? 'Hide' : 'Show'} Performance Monitor
        </button>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <FadeIn>
          <h1 className="text-6xl md:text-8xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            World-Class Animations
          </h1>
        </FadeIn>

        <SlideUp delay={0.2}>
          <p className="text-xl md:text-2xl text-center text-gray-300 mb-12 max-w-2xl">
            Experience animations that surpass Apple, Google, and Palantir
          </p>
        </SlideUp>

        <ScaleIn delay={0.4}>
          <LiquidButton
            variant="primary"
            onClick={() => alert('Liquid button clicked! Check out the morphing effect.')}
          >
            Try Liquid Button
          </LiquidButton>
        </ScaleIn>
      </section>

      {/* Liquid Buttons Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <SlideUp>
          <h2 className="text-5xl font-bold mb-4 text-center">Liquid Morphing Buttons</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl">
            Hover to see the liquid morphing effect with 3D tilt. Click for buttery press feedback.
          </p>
        </SlideUp>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <LiquidButton variant="primary" onClick={() => {}}>
            Primary Action
          </LiquidButton>

          <LiquidButton variant="secondary" onClick={() => {}}>
            Secondary Action
          </LiquidButton>

          <LiquidButton variant="success" onClick={() => {}}>
            Success Action
          </LiquidButton>

          <LiquidButton variant="danger" onClick={() => {}}>
            Danger Action
          </LiquidButton>

          <LiquidButton variant="primary" fullWidth onClick={() => {}}>
            Full Width Button
          </LiquidButton>

          <LiquidButton
            variant="primary"
            gradient={['#FF6B6B', '#FFD93D']}
            onClick={() => {}}
          >
            Custom Gradient
          </LiquidButton>
        </StaggerReveal>
      </section>

      {/* Particle Field Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <SlideUp>
          <h2 className="text-5xl font-bold mb-4 text-center">Interactive Particle Systems</h2>
          <p className="text-gray-400 text-center mb-8 max-w-2xl">
            Move your mouse over the particles to interact with them
          </p>
        </SlideUp>

        <FadeIn delay={0.2}>
          <div className="flex gap-4 mb-8">
            {(['low', 'medium', 'high'] as const).map((energy) => (
              <button
                key={energy}
                onClick={() => setParticleEnergy(energy)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  particleEnergy === energy
                    ? 'bg-purple-600 scale-105'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {energy.charAt(0).toUpperCase() + energy.slice(1)} Energy
              </button>
            ))}
          </div>
        </FadeIn>

        <ScaleIn delay={0.4} className="w-full max-w-4xl">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <ManifestationParticles energy={particleEnergy} className="rounded-xl" />
          </div>
        </ScaleIn>
      </section>

      {/* Scroll Reveal Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <SlideUp>
          <h2 className="text-5xl font-bold mb-4 text-center">Scroll-Triggered Reveals</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl">
            Scroll down to see elements reveal with beautiful animations
          </p>
        </SlideUp>

        <div className="space-y-32 max-w-4xl w-full">
          {/* Fade In Example */}
          <FadeIn>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-12 rounded-2xl border border-white/10">
              <h3 className="text-3xl font-bold mb-4">Fade In</h3>
              <p className="text-gray-300">
                This element fades in smoothly as you scroll past it
              </p>
            </div>
          </FadeIn>

          {/* Slide Up Example */}
          <SlideUp>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-12 rounded-2xl border border-white/10">
              <h3 className="text-3xl font-bold mb-4">Slide Up</h3>
              <p className="text-gray-300">
                This element slides up from below as it enters the viewport
              </p>
            </div>
          </SlideUp>

          {/* Scale In Example */}
          <ScaleIn>
            <div className="bg-gradient-to-r from-pink-500/20 to-orange-500/20 p-12 rounded-2xl border border-white/10">
              <h3 className="text-3xl font-bold mb-4">Scale In</h3>
              <p className="text-gray-300">
                This element scales in from the center point
              </p>
            </div>
          </ScaleIn>

          {/* Stagger Reveal Example */}
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 rounded-xl border border-white/10 text-center"
              >
                <div className="text-4xl font-bold mb-2">{num}</div>
                <div className="text-gray-400">Staggered Item</div>
              </div>
            ))}
          </StaggerReveal>

          {/* Custom Animation Example */}
          <ScrollReveal
            animation="custom"
            customAnimation={{
              opacity: 0,
              scale: 0.5,
              rotation: -180,
            }}
            duration={1}
            ease={ANIMATION_PRINCIPLES.EASING.ELASTIC}
          >
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-12 rounded-2xl border border-white/10">
              <h3 className="text-3xl font-bold mb-4">Custom Animation</h3>
              <p className="text-gray-300">
                This element uses a custom animation with rotation and elastic easing
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Animation Principles Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <SlideUp>
          <h2 className="text-5xl font-bold mb-4 text-center">Animation Principles</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl">
            Our animation system is built on these core principles
          </p>
        </SlideUp>

        <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10">
            <h3 className="text-2xl font-bold mb-4 text-purple-400">Timing</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div>Instant: {ANIMATION_PRINCIPLES.TIMING.INSTANT}s</div>
              <div>Quick: {ANIMATION_PRINCIPLES.TIMING.QUICK}s</div>
              <div>Smooth: {ANIMATION_PRINCIPLES.TIMING.SMOOTH}s</div>
              <div>Dramatic: {ANIMATION_PRINCIPLES.TIMING.DRAMATIC}s</div>
              <div>Cinematic: {ANIMATION_PRINCIPLES.TIMING.CINEMATIC}s</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10">
            <h3 className="text-2xl font-bold mb-4 text-pink-400">Easing</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div>Natural</div>
              <div>Snappy</div>
              <div>Elastic</div>
              <div>Bounce</div>
              <div>Magical</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Performance</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div>✓ Hardware Acceleration</div>
              <div>✓ 60 FPS Target</div>
              <div>✓ GPU Optimized</div>
              <div>✓ Real-time Monitoring</div>
              <div>✓ Auto Quality Adjust</div>
            </div>
          </div>
        </StaggerReveal>
      </section>

      {/* Footer */}
      <section className="py-20 text-center">
        <FadeIn>
          <p className="text-gray-500">
            Built with React Three Fiber, GSAP, React Spring, and Framer Motion
          </p>
        </FadeIn>
      </section>
    </div>
  );
};

export default AnimationExamples;
