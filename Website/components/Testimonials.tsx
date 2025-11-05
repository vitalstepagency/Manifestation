'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useSpring, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

// Count-up animation hook
function useCountUp(target: number, inView: boolean, duration: number = 2000) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * target)

      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [target, inView, duration])

  return count
}

const testimonials = [
  {
    id: 1,
    name: 'Marcus Chen',
    role: 'SaaS Founder',
    avatar: '👨‍💼',
    quote: '$347 in my bank account on Day 1.\n$2.1M annual revenue on Day 487.\n\nManifest turned my business from concept to empire.',
    achievement: '$2.1M ARR',
    metric: '487 days'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Fitness Coach',
    avatar: '🏋️‍♀️',
    quote: 'I saw my goal body floating in my Universe every morning.\n\nLost 42lbs in 6 months.\nGained 1,247 clients.\n\nAll because I couldn\'t ignore what I was staring at.',
    achievement: '42lbs + 1,247 clients',
    metric: '6 months'
  },
  {
    id: 3,
    name: 'David Park',
    role: 'Software Engineer',
    avatar: '👨‍💻',
    quote: 'Went from 0 to $5K MRR on my side project.\n\nThe 3D Universe kept me obsessed when motivation died.\nSeeing progress = unstoppable momentum.',
    achievement: '$5K MRR',
    metric: '6 months'
  },
  {
    id: 4,
    name: 'Sarah Rodriguez',
    role: 'Real Estate Agent',
    avatar: '👩‍💼',
    quote: 'I manifested my dream house in 8 months.\n\nNot "someday." Not "maybe."\nI saw it in 3D every morning.\nMade it inevitable.\nMoved in last week.',
    achievement: 'Dream House',
    metric: '8 months'
  },
  {
    id: 5,
    name: 'Emma Thompson',
    role: 'Mom of 3',
    avatar: '👩‍👧‍👦',
    quote: 'My kids asked to use it for their goals.\n\nWe became a manifestation family.\nMy 10-year-old has a 47-day streak.\n\n10/10 parenting hack.',
    achievement: 'Family Transformation',
    metric: '3 months'
  }
]

// Stat Card with count-up animation component
function StatCard({ stat, index, isInView }: { stat: { value: number, suffix: string, label: string, decimals?: number }, index: number, isInView: boolean }) {
  const count = useCountUp(stat.value, isInView, 2000 + index * 200)

  // Format the displayed number
  const displayValue = stat.decimals !== undefined
    ? (count / Math.pow(10, stat.decimals)).toFixed(stat.decimals)
    : count.toLocaleString()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="text-center border border-gray-200 bg-white rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group"
    >
      <motion.div
        className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
        animate={isInView && count === stat.value ? {
          scale: [1, 1.1, 1]
        } : {}}
        transition={{ duration: 0.3 }}
      >
        {displayValue}{stat.suffix}
      </motion.div>
      <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{stat.label}</div>

      {/* Confetti sparkle on completion */}
      {isInView && count === stat.value && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -top-2 -right-2 text-2xl"
        >
          ✨
        </motion.div>
      )}
    </motion.div>
  )
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden bg-white">
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-2 rounded-full border border-gray-200 bg-gray-50 mb-6"
          >
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              💬 Success Stories
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-gray-900"
          >
            Real People.{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Real Results.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Join thousands who have transformed their lives with Manifest
          </motion.p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="border border-gray-200 bg-white rounded-3xl p-12 relative shadow-lg"
            >
              {/* Quote icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute top-8 left-8 text-purple-200"
              >
                <Quote size={64} />
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                {/* Avatar and Name */}
                <div className="flex items-center mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-4xl mr-6"
                  >
                    {currentTestimonial.avatar}
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-gray-600">{currentTestimonial.role}</p>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
                  &ldquo;{currentTestimonial.quote}&rdquo;
                </blockquote>

                {/* Achievement Metrics */}
                <div className="flex flex-wrap gap-4">
                  <div className="border border-gray-200 bg-gray-50 rounded-full px-6 py-3">
                    <span className="text-sm text-gray-600">Achievement: </span>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">{currentTestimonial.achievement}</span>
                  </div>
                  <div className="border border-gray-200 bg-gray-50 rounded-full px-6 py-3">
                    <span className="text-sm text-gray-600">Time: </span>
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">{currentTestimonial.metric}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-900"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsAutoPlaying(false)
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-900"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Stats Bar with Count-up Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-5xl mx-auto"
        >
          {[
            { value: 10000, suffix: '+', label: 'Active Users' },
            { value: 78, suffix: '%', label: 'Daily Active Rate' },
            { value: 21, suffix: '', label: 'Avg. Streak Days' },
            { value: 49, suffix: '★', label: 'User Rating', decimals: 1 }
          ].map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} isInView={isInView} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
