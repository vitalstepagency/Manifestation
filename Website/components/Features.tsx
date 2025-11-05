'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe, Zap, Target, TrendingUp, Users, Image as ImageIcon } from 'lucide-react'

const features = [
  {
    icon: Globe,
    title: '3D Dream Universe',
    description: 'Your Ferrari isn\'t a checklist item. It\'s a 3D object you can rotate, click, and obsess over. Turns abstract into tangible.',
    gradient: 'from-purple-500 to-pink-500',
    delay: 0.05
  },
  {
    icon: Zap,
    title: 'Daily Sacred Three',
    description: 'Three non-negotiables. Every single day. No negotiation. No excuses. The only productivity system that works.',
    gradient: 'from-yellow-500 to-orange-500',
    delay: 0.1
  },
  {
    icon: Target,
    title: 'Smart Connections',
    description: 'Make 10 sales calls → Energy flows to your Ferrari. Visual cause and effect. Watch your actions compound.',
    gradient: 'from-cyan-500 to-blue-500',
    delay: 0.15
  },
  {
    icon: TrendingUp,
    title: 'AI Insights',
    description: 'The AI notices patterns you don\'t. "You complete more goals on Tuesdays." "Cold calls at 10am convert 3x better." Actionable intelligence.',
    gradient: 'from-green-500 to-emerald-500',
    badge: 'Soon',
    delay: 0.2
  },
  {
    icon: Users,
    title: 'Social Competition',
    description: "Compete with other founders building empires. Public streaks. You can't quit when 1,000 people are watching you.",
    gradient: 'from-rose-500 to-red-500',
    badge: 'Soon',
    delay: 0.25
  },
  {
    icon: ImageIcon,
    title: 'Visual Manifestation',
    description: 'Search "Ferrari SF90" → See 6 photos → Click → It\'s in your Universe. Your EXACT dream, not a generic emoji.',
    gradient: 'from-violet-500 to-purple-500',
    delay: 0.3
  }
]

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.2,
        delay: feature.delay,
        ease: "easeOut"
      }}
      className="group relative border border-gray-200 bg-white rounded-2xl p-8 hover:bg-gray-50 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-200 ease-out cursor-pointer"
    >
      {/* Badge for upcoming features */}
      {feature.badge && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold">
          {feature.badge}
        </div>
      )}

      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3.5 mb-6 group-hover:scale-110 transition-transform duration-200 ease-out`}>
        <feature.icon className="w-full h-full text-white" />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-3 text-gray-900">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  )
}

export default function Features() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section id="features" ref={sectionRef} className="relative py-32 px-6 overflow-hidden bg-white">
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="inline-block px-4 py-2 rounded-full border border-gray-200 bg-gray-50 mb-6"
          >
            <span className="text-sm font-medium text-gray-600">
              ✨ Powerful Features
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold mb-6 text-gray-900"
          >
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Manifest Success</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            We have built the most advanced manifestation platform on the internet.
            Every feature designed to make your dreams inevitable.
          </motion.p>
        </div>

        {/* Features Grid - Generous spacing */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.2, delay: 0.4, ease: "easeOut" }}
          className="text-center mt-20"
        >
          <p className="text-gray-600 mb-6 text-lg">
            And we are just getting started...
          </p>
          <button className="px-8 py-4 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:border-purple-600 hover:text-purple-600 hover:scale-[1.02] transition-all duration-200 ease-out">
            See Full Roadmap →
          </button>
        </motion.div>
      </div>
    </section>
  )
}
