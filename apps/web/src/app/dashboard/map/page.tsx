'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/dashboard/header'
import { LiveMap } from '@/components/dashboard/live-map'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { jobsApi } from '@/lib/api'
import { formatDateTime } from '@/lib/utils'
import {
  MapPin,
  List,
  Filter,
  RefreshCw,
  Truck,
  Wrench,
  AlertTriangle,
  Clock,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

export default function MapPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all')
  const [showList, setShowList] = useState(true)

  const { data: jobs = [], isLoading, refetch } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getAll,
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  // Filter jobs
  const filteredJobs = jobs.filter((job: any) => {
    // Exclude completed and cancelled from map view by default
    if (['completed', 'cancelled'].includes(job.status)) return false
    if (statusFilter !== 'all' && job.status !== statusFilter) return false
    if (urgencyFilter !== 'all' && job.urgency !== urgencyFilter) return false
    return true
  })

  const selectedJob = jobs.find((j: any) => j.id === selectedJobId)

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'urgent':
        return <Clock className="w-4 h-4 text-amber-500" />
      default:
        return <Wrench className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Live Map"
        subtitle="Track active jobs and field technicians in real-time"
      />

      <div className="flex-1 p-6 flex gap-6">
        {/* Map Container */}
        <div className={`flex-1 ${showList ? '' : 'w-full'}`}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-500" />
                Job Locations
              </CardTitle>
              <div className="flex items-center gap-2">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="parts_pickup">Parts Pickup</option>
                  <option value="in_progress">In Progress</option>
                </select>

                {/* Urgency Filter */}
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="all">All Urgency</option>
                  <option value="emergency">Emergency</option>
                  <option value="urgent">Urgent</option>
                  <option value="normal">Normal</option>
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="gap-1"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowList(!showList)}
                  className="gap-1"
                >
                  <List className="w-4 h-4" />
                  {showList ? 'Hide List' : 'Show List'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-60px)]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Loading map data...</p>
                  </div>
                </div>
              ) : (
                <LiveMap
                  jobs={filteredJobs}
                  selectedJobId={selectedJobId || undefined}
                  onJobSelect={setSelectedJobId}
                  className="h-full"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Jobs List Sidebar */}
        {showList && (
          <div className="w-96 flex-shrink-0">
            <Card className="h-full overflow-hidden flex flex-col">
              <CardHeader className="py-3 border-b">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <List className="w-5 h-5 text-brand-500" />
                    Active Jobs
                  </span>
                  <Badge variant="secondary">{filteredJobs.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                {filteredJobs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-6">
                    <div>
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No active jobs</p>
                      <p className="text-sm text-gray-400">
                        Jobs will appear here when created
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredJobs.map((job: any) => (
                      <button
                        key={job.id}
                        onClick={() => setSelectedJobId(job.id)}
                        className={`
                          w-full p-4 text-left hover:bg-gray-50 transition-colors
                          ${selectedJobId === job.id ? 'bg-brand-50 border-l-4 border-brand-500' : ''}
                        `}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getUrgencyIcon(job.urgency)}
                            <span className="font-medium text-gray-900">
                              {job.jobNumber}
                            </span>
                          </div>
                          <Badge
                            variant={job.status.replace('_', '-') as any}
                            className="text-xs"
                          >
                            {job.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {job.description}
                        </p>

                        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{job.locationAddress}</span>
                        </div>

                        {job.vehicle && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Truck className="w-3 h-3" />
                            <span>
                              {job.vehicle.unitNumber} - {job.vehicle.make}
                            </span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {formatDateTime(job.createdAt)}
                          </span>
                          <Link
                            href={`/dashboard/jobs/${job.id}`}
                            className="text-brand-500 hover:text-brand-600 text-xs font-medium flex items-center gap-0.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Details
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
