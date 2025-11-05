import { Link } from 'react-router-dom';
import DreamPortal from '../components/DreamPortal';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Flowing Curves Background */}
        <div className="absolute inset-0 w-full h-full">
          <DreamPortal />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 mb-8 leading-tight">
            Your Dreams Already Exist.
            <br />
            <span className="font-normal">That's Why You Can See Them.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 font-light max-w-4xl mx-auto mb-12 leading-relaxed">
            Stop chasing them blind.
            <br />
            <span className="font-normal text-gray-900">Manifest makes them visible. Then inevitable.</span>
          </p>

          {/* CTA Button */}
          <Link
            to="/auth"
            className="group inline-block relative px-12 py-5 bg-gray-900 text-white text-lg font-medium rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <span className="relative z-10">Start Your Journey</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </section>
    </div>
  );
}
