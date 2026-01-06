'use client'

export const dynamic = 'force-dynamic'

import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { fleetsApi, jobsApi, vehiclesApi } from '@/lib/api'
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils'
import {
  Truck,
  Briefcase,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuthStore()

  // Fetch fleet stats
  const { data: stats } = useQuery({
    queryKey: ['fleet-stats'],
    queryFn: fleetsApi.getStats,
    enabled: user?.role === 'fleet',
  })

  // Fetch recent jobs
  const { data: jobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getAll,
  })

  // Fetch vehicles (for fleet users)
  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesApi.getAll,
    enabled: user?.role === 'fleet',
  })

  const activeJobs = jobs?.filter((j: any) =>
    !['completed', 'cancelled'].includes(j.status)
  ) || []

  const recentJobs = jobs?.slice(0, 5) || []

  return (
    <div className="min-h-screen">
      <Header
        title={`Welcome back, ${user?.firstName}!`}
        subtitle={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        action={
          user?.role === 'fleet'
            ? { label: 'New Service Request', href: '/dashboard/jobs/new' }
            : undefined
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Vehicles</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.totalVehicles || vehicles?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">Active fleet</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {activeJobs.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                {activeJobs.length > 0 ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-500 mr-1" />
                    <span className="text-amber-500 font-medium">In progress</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">All clear</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg Response Time</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.avgResponseTime || 47} <span className="text-lg">min</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">Under 60 min SLA</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Completed Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats?.completedJobs || jobs?.filter((j: any) => j.status === 'completed').length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">This month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Jobs List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Active Jobs</CardTitle>
                <Link href="/dashboard/jobs">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {activeJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                    <p className="text-gray-500">No active jobs</p>
                    <p className="text-sm text-gray-400">All your vehicles are operational</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeJobs.slice(0, 4).map((job: any) => (
                      <Link
                        key={job.id}
                        href={`/dashboard/jobs/${job.id}`}
                        className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-card-hover transition-shadow"
                      >
                        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-brand-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900 truncate">
                              {job.jobNumber}
                            </p>
                            <Badge variant={job.urgency as any}>
                              {job.urgency}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {job.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <MapPin className="w-3 h-3" />
                            {job.locationAddress}
                          </div>
                        </div>
                        <Badge variant={job.status.replace('_', '-') as any}>
                          {job.status.replace('_', ' ')}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/dashboard/jobs/new" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Request Service
                  </Button>
                </Link>
                <Link href="/dashboard/vehicles" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Truck className="w-4 h-4 mr-2" />
                    Manage Vehicles
                  </Button>
                </Link>
                <Link href="/dashboard/map" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    View Live Map
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentJobs.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentJobs.map((job: any) => (
                      <div key={job.id} className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            job.status === 'completed'
                              ? 'bg-green-500'
                              : job.status === 'cancelled'
                              ? 'bg-red-500'
                              : 'bg-amber-500'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {job.jobNumber}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(job.updatedAt)}
                          </p>
                        </div>
                        <Badge variant={job.status.replace('_', '-') as any} className="text-xs">
                          {job.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
