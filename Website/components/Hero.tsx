'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import DreamPortal from './DreamPortal'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Canvas background - FULL SCREEN */}
      <div className="absolute inset-0 w-full h-full">
        <DreamPortal />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-purple-50 border border-purple-100"
          >
            <span className="text-2xl">⚡</span>
            <span className="text-sm font-medium text-purple-700">
              The Future of Goal Achievement
            </span>
          </motion.div>

          {/* First headline - black, clean */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-black"
          >
            Your Dreams Already Exist.
          </motion.h1>

          {/* REVOLUTIONARY HEADLINE - Liquid gradient with shimmer */}
          <h2 className="revolutionary-headline mb-10">
            That&apos;s Why You Can See Them.
          </h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Stop chasing them blind. Manifest makes them visible.{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
              Then inevitable.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              href="http://localhost:5175"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Start Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-purple-600 hover:text-purple-600 transition-all duration-200">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.45, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">★★★★★</span>
              <span className="font-medium">4.9/5 Rating</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
            <div className="font-medium">10,000+ Users</div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
            <div className="font-medium">Featured in TechCrunch</div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
