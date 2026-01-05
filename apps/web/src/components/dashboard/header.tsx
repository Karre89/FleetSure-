'use client'

import { Bell, Search, Menu, Plus } from 'lucide-react'
import { Button, Input, Avatar, AvatarFallback } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import Link from 'next/link'

interface HeaderProps {
  title: string
  subtitle?: string
  action?: {
    label: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
  }
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const { user } = useAuthStore()

  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-9 w-64 h-9"
          />
        </div>

        {/* Action Button */}
        {action && (
          <Link href={action.href}>
            <Button size="sm">
              {action.icon && <action.icon className="w-4 h-4 mr-2" />}
              {!action.icon && <Plus className="w-4 h-4 mr-2" />}
              {action.label}
            </Button>
          </Link>
        )}

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
