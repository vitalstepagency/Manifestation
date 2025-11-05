'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const statements = [
  "Most goal-setting apps are graveyards.",
  "",
  "You add a dream.",
  "You check the box.",
  "You forget it exists.",
  "",
  "Manifest is different.",
  "",
  "Your dreams float in 3D.",
  "Your habits flow energy to them.",
  "Your progress is undeniable.",
  "",
  "What seemed impossible",
  "becomes mathematical."
]

export default function Statement() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[120vh] flex items-center justify-center overflow-hidden bg-white py-32 px-6"
    >
      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        {statements.map((statement, index) => {
          // Calculate delay based on index
          const delay = index * 0.08

          // Check if it's the last statement for gradient effect
          const isLastStatement = index === statements.length - 1 || index === statements.length - 2

          return (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay, ease: "easeOut" }}
              className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${
                statement === ""
                  ? "h-8"
                  : isLastStatement
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    : "text-gray-900"
              }`}
            >
              {statement}
            </motion.p>
          )
        })}
      </div>
    </section>
  )
}
