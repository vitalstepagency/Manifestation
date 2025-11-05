'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

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

const stats = [
  {
    value: 21,
    suffix: '',
    label: 'Average streak days for active users',
    comparison: '3x longer than traditional habit apps'
  },
  {
    value: 78,
    suffix: '%',
    label: 'Daily active rate',
    comparison: 'Industry average is 25%'
  },
  {
    value: 10000,
    suffix: '+',
    label: 'Dreams manifested and achieved',
    comparison: 'And counting every day'
  }
]

function StatCard({ stat, index, isInView }: { stat: typeof stats[0], index: number, isInView: boolean }) {
  const count = useCountUp(stat.value, isInView, 2000 + index * 200)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
      className="text-center"
    >
      <motion.div
        className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
        animate={isInView && count === stat.value ? {
          scale: [1, 1.05, 1]
        } : {}}
        transition={{ duration: 0.3 }}
      >
        {count.toLocaleString()}{stat.suffix}
      </motion.div>
      <div className="text-xl md:text-2xl text-gray-900 font-semibold mb-2">
        {stat.label}
      </div>
      <div className="text-base md:text-lg text-gray-600">
        {stat.comparison}
      </div>
    </motion.div>
  )
}

export default function StatsMoment() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white py-32 px-6"
    >
      <div className="relative max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-16 md:gap-20 mb-20">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Final statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
          className="text-center space-y-4"
        >
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            The difference between
          </p>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            goal-setting apps and Manifest?
          </p>
          <p className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-8">
            People actually use this.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
