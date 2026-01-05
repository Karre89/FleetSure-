'use client'

import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, Badge, Button, Input } from '@/components/ui'
import { jobsApi } from '@/lib/api'
import { useState } from 'react'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  Truck,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const statusStyles: Record<string, { bg: string; text: string; icon: typeof AlertCircle }> = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
  dispatched: { bg: 'bg-blue-100', text: 'text-blue-800', icon: User },
  en_route: { bg: 'bg-purple-100', text: 'text-purple-800', icon: ArrowRight },
  on_site: { bg: 'bg-cyan-100', text: 'text-cyan-800', icon: MapPin },
  in_progress: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: Briefcase },
  completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
}

const urgencyStyles: Record<string, string> = {
  standard: 'border-gray-300',
  urgent: 'border-amber-400 bg-amber-50',
  critical: 'border-red-400 bg-red-50',
}

export default function JobsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getAll,
  })

  const filteredJobs = jobs?.filter((job: any) => {
    const matchesSearch =
      job.jobNumber.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase()) ||
      job.locationAddress?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter

    return matchesSearch && matchesStatus
  }) || []

  const activeCount = jobs?.filter((j: any) => !['completed', 'cancelled'].includes(j.status)).length || 0
  const completedCount = jobs?.filter((j: any) => j.status === 'completed').length || 0

  return (
    <div className="min-h-screen">
      <Header
        title="Service Jobs"
        subtitle={`${activeCount} active, ${completedCount} completed`}
        action={{ label: 'New Request', href: '/dashboard/jobs/new' }}
      />

      <div className="p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by job number, description, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'dispatched', 'en_route', 'in_progress', 'completed'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {search || statusFilter !== 'all' ? 'No jobs found' : 'No service jobs yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {search || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first service request when you need roadside assistance'}
              </p>
              {!search && statusFilter === 'all' && (
                <Link href="/dashboard/jobs/new">
                  <Button>Create Service Request</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job: any) => {
              const statusStyle = statusStyles[job.status] || statusStyles.pending
              const StatusIcon = statusStyle.icon

              return (
                <Link key={job.id} href={`/dashboard/jobs/${job.id}`}>
                  <Card
                    className={cn(
                      'hover:shadow-card-hover transition-all cursor-pointer border-l-4',
                      urgencyStyles[job.urgency] || urgencyStyles.standard
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Job Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {job.jobNumber}
                            </h3>
                            <Badge className={cn(statusStyle.bg, statusStyle.text)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {job.status.replace('_', ' ')}
                            </Badge>
                            {job.urgency !== 'standard' && (
                              <Badge
                                variant={job.urgency as any}
                                className={job.urgency === 'critical' ? 'animate-pulse' : ''}
                              >
                                {job.urgency}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{job.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.locationAddress || 'Location pending'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDateTime(job.createdAt)}
                            </span>
                            {job.vehicle && (
                              <span className="flex items-center gap-1">
                                <Truck className="w-4 h-4" />
                                {job.vehicle.unitNumber}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mechanic & ETA */}
                        <div className="flex items-center gap-4 lg:text-right">
                          {job.mechanic && (
                            <div>
                              <p className="text-sm text-gray-500">Assigned to</p>
                              <p className="font-medium">
                                {job.mechanic.user?.firstName} {job.mechanic.user?.lastName}
                              </p>
                            </div>
                          )}
                          {job.estimatedArrival && (
                            <div className="bg-brand-50 px-3 py-2 rounded-lg">
                              <p className="text-xs text-brand-600">ETA</p>
                              <p className="font-semibold text-brand-700">
                                {new Date(job.estimatedArrival).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          )}
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
