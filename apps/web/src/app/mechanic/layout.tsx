'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/stores/auth'
import { Briefcase, User, DollarSign, MapPin } from 'lucide-react'

const navItems = [
  { href: '/mechanic', label: 'Jobs', icon: Briefcase },
  { href: '/mechanic/map', label: 'Map', icon: MapPin },
  { href: '/mechanic/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/mechanic/profile', label: 'Profile', icon: User },
]

export default function MechanicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (user?.role !== 'mechanic') {
      router.push('/dashboard')
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== 'mechanic') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {children}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/mechanic' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  isActive ? 'text-brand-600' : 'text-gray-500'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
