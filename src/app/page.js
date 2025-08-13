import Link from 'next/link'
import { StickyNote, Search, Shield, Zap, ArrowRight, CheckCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your ideas,
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"> organized</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A simple, beautiful, and secure way to capture your thoughts, ideas, and important notes. 
            Access them anywhere, anytime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 max-w-[200px]"
            >
              Start Writing
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl font-semibold border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why choose our Notes app?
          </h2>
          
          <div className="space-y-6">
            {[
              "Clean, distraction-free writing environment",
              "Automatic saving - never lose your work",
              "Beautiful, responsive design that works everywhere",
              "No ads, no tracking - just pure productivity"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-4">
                <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                <span className="text-lg text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
