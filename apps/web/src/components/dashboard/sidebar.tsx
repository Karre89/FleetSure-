'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Truck,
  LayoutDashboard,
  Car,
  Briefcase,
  Settings,
  LogOut,
  User,
  Wrench,
  Package,
  MapPin,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'
import { Avatar, AvatarFallback, Button, Separator } from '@/components/ui'

const fleetNavItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/vehicles', label: 'Vehicles', icon: Car },
  { href: '/dashboard/jobs', label: 'Service Jobs', icon: Briefcase },
  { href: '/dashboard/map', label: 'Live Map', icon: MapPin },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const mechanicNavItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/jobs', label: 'My Jobs', icon: Briefcase },
  { href: '/dashboard/map', label: 'Live Map', icon: MapPin },
  { href: '/dashboard/earnings', label: 'Earnings', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const runnerNavItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/tasks', label: 'My Tasks', icon: Package },
  { href: '/dashboard/map', label: 'Navigation', icon: MapPin },
  { href: '/dashboard/earnings', label: 'Earnings', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const navItems = user?.role === 'mechanic'
    ? mechanicNavItems
    : user?.role === 'runner'
    ? runnerNavItems
    : fleetNavItems

  const roleIcon = user?.role === 'mechanic'
    ? Wrench
    : user?.role === 'runner'
    ? Package
    : Truck

  const RoleIcon = roleIcon

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-brand-500">FleetSure</span>
            <p className="text-xs text-gray-500 capitalize">{user?.role} Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-brand-500' : 'text-gray-400')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="space-y-1">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
