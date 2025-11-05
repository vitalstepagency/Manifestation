'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, Sparkles, Crown, Zap } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free Forever',
    price: '$0',
    period: 'forever',
    description: 'Build your Universe. Manifest your first 10 dreams.',
    icon: Sparkles,
    features: [
      'Unlimited dreams',
      '3D Universe',
      'Daily habits tracking',
      'Basic analytics',
      'Mobile & desktop apps',
      'Community access'
    ],
    cta: 'Start Free',
    href: 'http://localhost:5175',
    popular: false,
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'For people building empires. AI insights. Social competition.',
    icon: Zap,
    features: [
      'Everything in Free',
      'AI insights & predictions',
      'Social features & challenges',
      'Advanced analytics',
      'Priority support',
      'Custom themes',
      'Export & backup'
    ],
    cta: 'Join Waitlist',
    href: '#waitlist',
    popular: true,
    badge: 'Coming Soon',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Empire',
    price: '$49',
    period: '/month',
    description: 'For coaches managing 50+ clients. Team dashboards. Built for scale.',
    icon: Crown,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Coach dashboard',
      'White-label options',
      'Custom AI training',
      'Dedicated support',
      'Early access to features'
    ],
    cta: 'Contact Sales',
    href: '#contact',
    popular: false,
    badge: 'Coming Soon',
    gradient: 'from-yellow-500 to-orange-500'
  }
]

function PricingCard({ plan, index }: { plan: typeof plans[0], index: number }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.2 })

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
      className={`relative border bg-white rounded-3xl p-8 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 transition-all duration-200 ease-out ${
        plan.popular ? 'border-purple-500' : 'border-gray-200'
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-sm font-semibold shadow-lg text-white">
          Most Popular
        </div>
      )}

      {/* Coming soon badge */}
      {plan.badge && !plan.popular && (
        <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
          {plan.badge}
        </div>
      )}

      {/* Icon - subtle scale on card hover */}
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} p-4 mb-6`}>
        <plan.icon className="w-full h-full text-white" />
      </div>

      {/* Plan name */}
      <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{plan.description}</p>

      {/* Price */}
      <div className="mb-8">
        <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{plan.price}</span>
        <span className="text-gray-600 ml-2">{plan.period}</span>
      </div>

      {/* CTA Button */}
      <div className="mb-8">
        <Link
          href={plan.href}
          className={`block w-full text-center px-6 py-4 rounded-full font-semibold transition-all duration-200 ease-out hover:scale-[1.02] ${
            plan.popular
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
              : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-900'
          }`}
        >
          {plan.cta}
        </Link>
      </div>

      {/* Features */}
      <ul className="space-y-4">
        {plan.features.map((feature, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.2,
              delay: index * 0.05 + i * 0.03,
              ease: "easeOut"
            }}
            className="flex items-start gap-3"
          >
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 leading-relaxed">{feature}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function Pricing() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section id="pricing" ref={sectionRef} className="relative py-32 px-6 overflow-hidden bg-gray-50">
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="inline-block px-4 py-2 rounded-full border border-gray-200 bg-gray-50 mb-6"
          >
            <span className="text-sm font-medium text-gray-900">
              💎 Simple Pricing
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold mb-6 text-gray-900"
          >
            Start Free.{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Upgrade When Ready.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Free tier forever. Paid features coming soon. No credit card required.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} />
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.2, delay: 0.25, ease: "easeOut" }}
          className="text-center mt-16 space-y-4"
        >
          <p className="text-gray-600 text-sm leading-relaxed">
            ✅ No credit card required • ✅ Cancel anytime • ✅ 30-day money-back guarantee
          </p>
          <p className="text-gray-500 text-xs leading-relaxed">
            We never sell your data. Your dreams are private, encrypted, and yours alone.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
