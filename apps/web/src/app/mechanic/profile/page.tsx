'use client'

export const dynamic = 'force-dynamic'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Avatar, AvatarFallback } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/lib/api'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  Briefcase,
  Award,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  Shield,
  HelpCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

const mechanicApi = {
  getProfile: async () => {
    const response = await api.get('/mechanics/me')
    return response.data
  },
}

export default function MechanicProfilePage() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const { data: profile } = useQuery({
    queryKey: ['mechanic-profile'],
    queryFn: mechanicApi.getProfile,
  })

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const menuItems = [
    { icon: Bell, label: 'Notifications', href: '/mechanic/settings/notifications' },
    { icon: Settings, label: 'Account Settings', href: '/mechanic/settings' },
    { icon: Shield, label: 'Certifications', href: '/mechanic/certifications' },
    { icon: HelpCircle, label: 'Help & Support', href: '/mechanic/support' },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-brand-600 text-white px-4 pt-6 pb-20">
        <h1 className="text-xl font-bold">Profile</h1>
      </div>

      <div className="px-4 -mt-16 space-y-4">
        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-brand-100 text-brand-600 text-2xl">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-500">{profile?.businessName || 'Independent Mechanic'}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-medium">{profile?.averageRating?.toFixed(1) || '5.0'}</span>
                  <span className="text-gray-400">({profile?.totalReviews || 0} reviews)</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-600">{profile?.totalJobs || 0}</p>
                <p className="text-sm text-gray-500">Jobs Done</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-600">
                  {profile?.averageRating?.toFixed(1) || '5.0'}
                </p>
                <p className="text-sm text-gray-500">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-600">98%</p>
                <p className="text-sm text-gray-500">On-time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{profile?.phone || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 ${
                  index !== menuItems.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-500" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
