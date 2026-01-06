'use client'

import { useState, useCallback, useMemo } from 'react'
import Map, { Marker, Popup, NavigationControl, Source, Layer } from 'react-map-gl'
import { MapPin, Truck, Wrench, Package, AlertTriangle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui'
import { formatDateTime } from '@/lib/utils'
import 'mapbox-gl/dist/mapbox-gl.css'

interface Job {
  id: string
  jobNumber: string
  status: string
  urgency: string
  description: string
  locationAddress: string
  locationLat: number
  locationLng: number
  vehicle?: {
    unitNumber: string
    make: string
    model: string
  }
  mechanic?: {
    firstName: string
    lastName: string
  }
  runner?: {
    firstName: string
    lastName: string
  }
  createdAt: string
}

interface LiveMapProps {
  jobs: Job[]
  selectedJobId?: string
  onJobSelect?: (jobId: string | null) => void
  className?: string
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const statusColors: Record<string, string> = {
  pending: '#f59e0b', // amber
  assigned: '#3b82f6', // blue
  parts_pickup: '#8b5cf6', // purple
  in_progress: '#f97316', // orange
  completed: '#22c55e', // green
  cancelled: '#ef4444', // red
}

const urgencyIcons: Record<string, typeof AlertTriangle> = {
  emergency: AlertTriangle,
  urgent: Clock,
  normal: Wrench,
}

export function LiveMap({ jobs, selectedJobId, onJobSelect, className = '' }: LiveMapProps) {
  const [viewState, setViewState] = useState({
    latitude: 29.7604, // Houston, TX (default center for trucking)
    longitude: -95.3698,
    zoom: 10,
  })
  const [popupJob, setPopupJob] = useState<Job | null>(null)

  // Calculate initial bounds based on jobs
  useMemo(() => {
    if (jobs.length === 0) return

    const lats = jobs.map((j) => j.locationLat).filter(Boolean)
    const lngs = jobs.map((j) => j.locationLng).filter(Boolean)

    if (lats.length > 0 && lngs.length > 0) {
      const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
      const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2

      setViewState((prev) => ({
        ...prev,
        latitude: centerLat,
        longitude: centerLng,
      }))
    }
  }, [jobs])

  const handleMarkerClick = useCallback((job: Job) => {
    setPopupJob(job)
    onJobSelect?.(job.id)
  }, [onJobSelect])

  const getMarkerColor = (job: Job) => {
    return statusColors[job.status] || '#6b7280'
  }

  const UrgencyIcon = (job: Job) => {
    return urgencyIcons[job.urgency] || Wrench
  }

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <p className="text-gray-500">Map token not configured</p>
      </div>
    )
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

        {/* Job Markers */}
        {jobs.map((job) => {
          if (!job.locationLat || !job.locationLng) return null

          const Icon = UrgencyIcon(job)
          const isSelected = selectedJobId === job.id

          return (
            <Marker
              key={job.id}
              latitude={job.locationLat}
              longitude={job.locationLng}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                handleMarkerClick(job)
              }}
            >
              <div
                className={`
                  relative cursor-pointer transition-transform
                  ${isSelected ? 'scale-125 z-10' : 'hover:scale-110'}
                `}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                  style={{ backgroundColor: getMarkerColor(job) }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {job.urgency === 'emergency' && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
            </Marker>
          )
        })}

        {/* Popup for selected job */}
        {popupJob && popupJob.locationLat && popupJob.locationLng && (
          <Popup
            latitude={popupJob.locationLat}
            longitude={popupJob.locationLng}
            anchor="bottom"
            offset={25}
            onClose={() => {
              setPopupJob(null)
              onJobSelect?.(null)
            }}
            closeOnClick={false}
          >
            <div className="p-2 min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{popupJob.jobNumber}</span>
                <Badge variant={popupJob.urgency as any} className="text-xs">
                  {popupJob.urgency}
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-2">{popupJob.description}</p>

              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{popupJob.locationAddress}</span>
                </div>

                {popupJob.vehicle && (
                  <div className="flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    <span>
                      {popupJob.vehicle.unitNumber} - {popupJob.vehicle.make} {popupJob.vehicle.model}
                    </span>
                  </div>
                )}

                {popupJob.mechanic && (
                  <div className="flex items-center gap-1">
                    <Wrench className="w-3 h-3" />
                    <span>
                      {popupJob.mechanic.firstName} {popupJob.mechanic.lastName}
                    </span>
                  </div>
                )}

                {popupJob.runner && (
                  <div className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    <span>
                      {popupJob.runner.firstName} {popupJob.runner.lastName}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t flex items-center justify-between">
                <Badge variant={popupJob.status.replace('_', '-') as any} className="text-xs">
                  {popupJob.status.replace('_', ' ')}
                </Badge>
                <span className="text-xs text-gray-400">
                  {formatDateTime(popupJob.createdAt)}
                </span>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <p className="text-xs font-semibold text-gray-700 mb-2">Status</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-600 capitalize">
                {status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Job Count Badge */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-brand-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{jobs.length}</p>
            <p className="text-xs text-gray-500">Active Jobs</p>
          </div>
        </div>
      </div>
    </div>
  )
}
