'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function FinalCTA() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden bg-white">
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="border border-gray-200 bg-white rounded-3xl p-12 md:p-16 text-center shadow-lg"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
            className="inline-block mb-8"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-gray-900"
          >
            In 6 months, you&apos;ll be{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">one of two people:</span>
          </motion.h2>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, delay: 0.15, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-600 mb-4 max-w-4xl mx-auto leading-relaxed space-y-4"
          >
            <p>1. Still using todo lists, wondering why nothing changed</p>
            <p>2. Using Manifest, achieving things you thought impossible</p>
            <p className="text-gray-900 font-semibold mt-8 text-2xl md:text-3xl">Which one?</p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, delay: 0.2, ease: "easeOut" }}
          >
            <Link
              href="http://localhost:5175"
              className="group inline-flex items-center px-12 py-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-200 ease-out"
            >
              Create Your Universe
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.2, delay: 0.25, ease: "easeOut" }}
            className="mt-6 text-gray-500 text-sm leading-relaxed"
          >
            Free forever. No credit card. No commitment. Just transformation.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
