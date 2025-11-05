'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'How is this different from a todo list?',
    answer: 'Todo lists are 2D, boring, and die in a drawer. Manifest is 3D, alive, and ADDICTIVE. Your dreams aren\'t text - they\'re visual, tangible objects in your universe. You can touch them, rotate them, and watch them grow as you progress.'
  },
  {
    question: 'Do I need VR headset or special equipment?',
    answer: 'No. Manifest works perfectly in your browser on desktop, tablet, and mobile. We use WebGL for stunning 3D visualization that runs on any modern device. VR support coming soon for next-level immersion.'
  },
  {
    question: 'Is my data private?',
    answer: 'Absolutely. Your dreams, goals, and habits are encrypted end-to-end. We never sell your data. Ever. Your transformation is between you and your future self. We\'re just the tool.'
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. Free tier is forever - no credit card required. Paid features (coming soon) can be canceled anytime with one click. 30-day money-back guarantee, no questions asked.'
  },
  {
    question: 'What if I\'m not technical?',
    answer: 'Perfect! Manifest is designed for everyone. If you can use Instagram, you can use Manifest. The 4-minute onboarding guides you through everything. Most users are completely set up in under 5 minutes.'
  },
  {
    question: 'Does this really work?',
    answer: 'Our users have manifested $100K businesses, dream homes, perfect relationships, and life transformations. The app doesn\'t do magic - YOU do. Manifest just makes your goals visual, trackable, and inevitable through proven psychology and beautiful design.'
  }
]

function FAQItem({ faq, index }: { faq: typeof faqs[0], index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const itemRef = useRef(null)
  const isInView = useInView(itemRef, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
      className="border border-gray-200 bg-white rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="text-lg font-semibold text-gray-900 pr-4">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-6 h-6 text-gray-600" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden bg-white">
      <div className="relative max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="inline-block px-4 py-2 rounded-full border border-gray-200 bg-gray-50 mb-6"
          >
            <span className="text-sm font-medium text-gray-900">
              ❓ Questions & Answers
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold mb-6 text-gray-900"
          >
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Questions</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Everything you need to know about Manifest
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.2, delay: 0.35, ease: "easeOut" }}
          className="text-center mt-16 border border-gray-200 bg-white rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We're here to help. Reach out anytime.
          </p>
          <a
            href="mailto:support@manifest.app"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-[1.02] transition-all duration-200 ease-out"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  )
}
