import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Statement from '@/components/Statement'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import StatsMoment from '@/components/StatsMoment'
import Testimonials from '@/components/Testimonials'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Statement />
      <Features />
      <HowItWorks />
      <StatsMoment />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
