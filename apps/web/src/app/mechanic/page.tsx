'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, Badge, Button } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/lib/api'
import {
  MapPin,
  Clock,
  Truck,
  Phone,
  Navigation,
  Check,
  X,
  AlertTriangle,
  Zap,
  ChevronRight,
  Loader2,
  Power,
} from 'lucide-react'
import Link from 'next/link'

// Mechanic-specific API calls
const mechanicApi = {
  getProfile: async () => {
    const response = await api.get('/mechanics/me')
    return response.data
  },
  getJobs: async () => {
    const response = await api.get('/mechanics/jobs')
    return response.data
  },
  updateAvailability: async (isAvailable: boolean) => {
    const response = await api.patch('/mechanics/me/availability', { isAvailable })
    return response.data
  },
  acceptJob: async (jobId: string) => {
    const response = await api.patch(`/jobs/${jobId}/accept`)
    return response.data
  },
  declineJob: async (jobId: string) => {
    const response = await api.patch(`/jobs/${jobId}/decline`)
    return response.data
  },
  updateJobStatus: async (jobId: string, status: string) => {
    const response = await api.patch(`/jobs/${jobId}/status`, { status })
    return response.data
  },
}

const STATUS_STEPS = [
  { status: 'ACCEPTED', label: 'Accepted', next: 'EN_ROUTE' },
  { status: 'EN_ROUTE', label: 'En Route', next: 'ON_SITE' },
  { status: 'ON_SITE', label: 'On Site', next: 'COMPLETED' },
  { status: 'COMPLETED', label: 'Completed', next: null },
]

export default function MechanicJobsPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [isOnline, setIsOnline] = useState(true)

  // Fetch mechanic profile
  const { data: profile } = useQuery({
    queryKey: ['mechanic-profile'],
    queryFn: mechanicApi.getProfile,
  })

  // Fetch jobs assigned to mechanic
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['mechanic-jobs'],
    queryFn: mechanicApi.getJobs,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Toggle availability mutation
  const toggleAvailability = useMutation({
    mutationFn: (isAvailable: boolean) => mechanicApi.updateAvailability(isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mechanic-profile'] })
    },
  })

  // Accept job mutation
  const acceptJob = useMutation({
    mutationFn: mechanicApi.acceptJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mechanic-jobs'] })
    },
  })

  // Update status mutation
  const updateStatus = useMutation({
    mutationFn: ({ jobId, status }: { jobId: string; status: string }) =>
      mechanicApi.updateJobStatus(jobId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mechanic-jobs'] })
    },
  })

  const activeJob = jobs?.find((j: any) =>
    ['ACCEPTED', 'EN_ROUTE', 'ON_SITE'].includes(j.status)
  )

  const pendingJobs = jobs?.filter((j: any) => j.status === 'ASSIGNED') || []
  const completedToday = jobs?.filter((j: any) => {
    if (j.status !== 'COMPLETED') return false
    const today = new Date().toDateString()
    return new Date(j.completedAt).toDateString() === today
  }) || []

  const getNextStatus = (currentStatus: string) => {
    const step = STATUS_STEPS.find((s) => s.status === currentStatus)
    return step?.next
  }

  const getNextStatusLabel = (currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus)
    if (nextStatus === 'EN_ROUTE') return 'Start Driving'
    if (nextStatus === 'ON_SITE') return 'Arrived'
    if (nextStatus === 'COMPLETED') return 'Complete Job'
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-brand-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-brand-100 text-sm">Welcome back</p>
            <h1 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h1>
          </div>
          <button
            onClick={() => {
              setIsOnline(!isOnline)
              toggleAvailability.mutate(!isOnline)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isOnline
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Power className="w-4 h-4" />
            {isOnline ? 'Online' : 'Offline'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{completedToday.length}</p>
            <p className="text-xs text-brand-100">Today</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{profile?.totalJobs || 0}</p>
            <p className="text-xs text-brand-100">Total Jobs</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{profile?.averageRating?.toFixed(1) || '5.0'}</p>
            <p className="text-xs text-brand-100">Rating</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Active Job Card */}
        {activeJob && (
          <Card className="border-2 border-brand-500 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="default" className="bg-brand-600">
                  Active Job
                </Badge>
                <span className="text-sm font-mono text-gray-500">
                  {activeJob.jobNumber}
                </span>
              </div>

              {/* Status Progress */}
              <div className="flex items-center gap-1 mb-4">
                {STATUS_STEPS.map((step, index) => (
                  <div key={step.status} className="flex-1 flex items-center">
                    <div
                      className={`h-1.5 flex-1 rounded ${
                        STATUS_STEPS.findIndex((s) => s.status === activeJob.status) >= index
                          ? 'bg-brand-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Job Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{activeJob.locationAddress}</p>
                    <p className="text-sm text-gray-500">
                      {activeJob.locationCity}, {activeJob.locationState}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {activeJob.vehicle?.unitNumber} - {activeJob.vehicle?.make} {activeJob.vehicle?.model}
                    </p>
                    <p className="text-sm text-gray-500">{activeJob.issueType}</p>
                  </div>
                </div>

                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {activeJob.issueDescription}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    // Open maps with navigation
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${activeJob.locationLatitude},${activeJob.locationLongitude}`,
                      '_blank'
                    )
                  }}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigate
                </Button>
                {getNextStatus(activeJob.status) && (
                  <Button
                    className="flex-1 bg-brand-600 hover:bg-brand-700"
                    onClick={() =>
                      updateStatus.mutate({
                        jobId: activeJob.id,
                        status: getNextStatus(activeJob.status)!,
                      })
                    }
                    disabled={updateStatus.isPending}
                  >
                    {updateStatus.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        {getNextStatusLabel(activeJob.status)}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending Jobs */}
        {pendingJobs.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              New Job Requests ({pendingJobs.length})
            </h2>
            <div className="space-y-3">
              {pendingJobs.map((job: any) => (
                <Card key={job.id} className="border-l-4 border-l-amber-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{job.jobNumber}</span>
                          <Badge
                            variant={
                              job.urgency === 'EMERGENCY'
                                ? 'destructive'
                                : job.urgency === 'PRIORITY'
                                ? 'urgent'
                                : 'secondary'
                            }
                          >
                            {job.urgency === 'EMERGENCY' && <Zap className="w-3 h-3 mr-1" />}
                            {job.urgency}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{job.issueType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">~15 min</p>
                        <p className="text-xs text-gray-500">away</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{job.locationAddress}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => acceptJob.mutate(job.id)}
                        disabled={acceptJob.isPending}
                      >
                        {acceptJob.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!activeJob && pendingJobs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No jobs right now</h3>
            <p className="text-gray-500 text-sm">
              {isOnline
                ? "Stay online and we'll notify you when a job comes in"
                : 'Go online to start receiving job requests'}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          </div>
        )}
      </div>
    </div>
  )
}
