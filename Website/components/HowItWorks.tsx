'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, Eye, Link2, Rocket, Trophy } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: Sparkles,
    title: 'Define Dreams',
    description: '"I will make $100,000 this year"',
    detail: 'Not vague. Not someday. Specific and dated.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    number: 2,
    icon: Eye,
    title: 'See It in 3D',
    description: 'That goal appears in your Universe',
    detail: 'Floating. Glowing. Impossible to ignore.',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    number: 3,
    icon: Link2,
    title: 'Connect Habits',
    description: '10 sales calls → $100k goal',
    detail: 'Every action flows energy toward your dream.',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    number: 4,
    icon: Rocket,
    title: 'Complete Daily Three',
    description: 'Morning routine. 10 calls. Email newsletter.',
    detail: 'Three things. Every day. No excuses.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    number: 5,
    icon: Trophy,
    title: 'Watch It Happen',
    description: 'Day 1: 0% → Day 243: $100,000 achieved',
    detail: 'What seemed impossible became inevitable.',
    color: 'from-rose-500 to-red-500'
  }
]

function StepCard({ step, index }: { step: typeof steps[0], index: number }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.2,
        delay: index * 0.05,
        ease: "easeOut"
      }}
      className="relative"
    >
      <div className="border border-gray-200 bg-white rounded-2xl p-8 hover:shadow-lg hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-200 ease-out group">
        {/* Number badge - static, no rotation */}
        <div
          className={`absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-lg font-bold shadow-lg text-white`}
        >
          {step.number}
        </div>

        {/* Icon */}
        <div className="mb-4 ml-10">
          <step.icon className="w-7 h-7 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold mb-2 text-gray-900">
          {step.title}
        </h3>

        <p className="text-lg text-purple-600 mb-4 font-medium">
          {step.description}
        </p>

        <p className="text-gray-600 leading-relaxed">
          {step.detail}
        </p>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-32 px-6 overflow-hidden bg-gray-50">
      <div className="relative max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="inline-block px-4 py-2 rounded-full border border-gray-200 bg-gray-50 mb-6"
          >
            <span className="text-sm font-medium text-gray-900">
              🚀 Your Transformation Journey
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold mb-6 text-gray-900"
          >
            From Dream to{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Reality</span>
            <br />
            in 5 Simple Steps
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Our proven system turns wishful thinking into inevitable achievement.
            Follow the path. Trust the process.
          </motion.p>
        </div>

        {/* Steps - increased spacing for breathing room */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.2, delay: 0.3, ease: "easeOut" }}
          className="text-center mt-20"
        >
          <a
            href="http://localhost:5175"
            className="inline-block px-8 py-4 rounded-xl bg-white text-black font-semibold text-lg hover:scale-[1.02] transition-all duration-200 ease-out"
          >
            Start Your Journey Now →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
