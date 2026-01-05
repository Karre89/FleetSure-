'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'
import {
  Truck,
  Clock,
  MapPin,
  Shield,
  Wrench,
  Package,
  ArrowRight,
  Phone,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-500">FleetSure</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            Average response time: 47 minutes
          </div>
          <h1 className="text-display-sm md:text-display font-bold text-gray-900 mb-6 max-w-4xl mx-auto">
            Professional Roadside Repair for Commercial Truck Fleets
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with certified diesel mechanics instantly. Get your trucks back on the road in under 60 minutes with our network of mobile repair professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=fleet">
              <Button size="xl" className="w-full sm:w-auto">
                Register Your Fleet
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/register?role=mechanic">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                <Wrench className="w-5 h-5 mr-2" />
                Join as Mechanic
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-display-sm font-bold text-center text-gray-900 mb-4">
            How FleetSure Works
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our platform connects fleet managers with certified diesel mechanics and parts runners for fast, reliable roadside repair.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-brand-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Request Service</h3>
              <p className="text-gray-600">
                Open a job request from your dashboard or mobile app. Describe the issue and location.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-brand-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Dispatch</h3>
              <p className="text-gray-600">
                We automatically dispatch the nearest available certified mechanic to your location.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-brand-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Back on the Road</h3>
              <p className="text-gray-600">
                Track progress in real-time and get your truck repaired with our SLA guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-brand-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">47</div>
              <div className="text-brand-200">Avg. Response (min)</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-brand-200">Certified Mechanics</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-brand-200">First-Fix Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-brand-200">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-display-sm font-bold text-center text-gray-900 mb-12">
            Built for Everyone
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Fleet Managers */}
            <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fleet Managers</h3>
              <p className="text-gray-600 mb-4">
                Manage your entire fleet from one dashboard. Request repairs, track progress, and view detailed analytics.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Real-time job tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Vehicle management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Cost analytics
                </li>
              </ul>
            </div>
            {/* Mechanics */}
            <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diesel Mechanics</h3>
              <p className="text-gray-600 mb-4">
                Set your availability and service area. Get matched with nearby jobs and earn on your own schedule.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Flexible scheduling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  GPS navigation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Parts ordering
                </li>
              </ul>
            </div>
            {/* Parts Runners */}
            <div className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Parts Runners</h3>
              <p className="text-gray-600 mb-4">
                Deliver critical parts to repair sites. Help mechanics complete jobs faster with on-demand deliveries.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Route optimization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Delivery tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Instant payments
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-brand-500 rounded-3xl p-12 md:p-16">
            <h2 className="text-display-sm font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
              Join FleetSure today and experience the fastest, most reliable roadside repair service for commercial fleets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="xl" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-brand-500">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">FleetSure</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} FleetSure. All rights reserved.</p>
            <p className="mt-1 flex items-center justify-center gap-1">
              <Shield className="w-4 h-4" />
              Serving the I-5 Corridor: Washington &amp; Oregon
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
