'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, Badge, Button } from '@/components/ui'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/lib/api'
import {
  MapPin,
  Clock,
  Package,
  Phone,
  Navigation,
  Check,
  X,
  Camera,
  Loader2,
  Power,
  ChevronRight,
  Store,
  Truck,
} from 'lucide-react'

// Runner-specific API calls
const runnerApi = {
  getProfile: async () => {
    const response = await api.get('/runners/me')
    return response.data
  },
  getTasks: async () => {
    const response = await api.get('/runners/tasks')
    return response.data
  },
  updateAvailability: async (isAvailable: boolean) => {
    const response = await api.patch('/runners/me/availability', { isAvailable })
    return response.data
  },
  acceptTask: async (taskId: string) => {
    const response = await api.patch(`/runners/tasks/${taskId}/accept`)
    return response.data
  },
  updateTaskStatus: async (taskId: string, status: string) => {
    const response = await api.patch(`/runners/tasks/${taskId}/status`, { status })
    return response.data
  },
}

const TASK_STATUS_FLOW = [
  { status: 'ACCEPTED', label: 'Accepted', action: 'Head to Pickup' },
  { status: 'PICKING_UP', label: 'At Pickup', action: 'Confirm Pickup' },
  { status: 'PICKED_UP', label: 'Picked Up', action: 'Start Delivery' },
  { status: 'IN_TRANSIT', label: 'In Transit', action: 'Confirm Delivery' },
  { status: 'DELIVERED', label: 'Delivered', action: null },
]

export default function RunnerTasksPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [isOnline, setIsOnline] = useState(true)

  // Fetch runner profile
  const { data: profile } = useQuery({
    queryKey: ['runner-profile'],
    queryFn: runnerApi.getProfile,
  })

  // Fetch tasks
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['runner-tasks'],
    queryFn: runnerApi.getTasks,
    refetchInterval: 30000,
  })

  // Toggle availability mutation
  const toggleAvailability = useMutation({
    mutationFn: (isAvailable: boolean) => runnerApi.updateAvailability(isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runner-profile'] })
    },
  })

  // Accept task mutation
  const acceptTask = useMutation({
    mutationFn: runnerApi.acceptTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runner-tasks'] })
    },
  })

  // Update status mutation
  const updateStatus = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      runnerApi.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['runner-tasks'] })
    },
  })

  const activeTask = tasks?.find((t: any) =>
    ['ACCEPTED', 'PICKING_UP', 'PICKED_UP', 'IN_TRANSIT'].includes(t.status)
  )

  const pendingTasks = tasks?.filter((t: any) => t.status === 'PENDING') || []
  const completedToday = tasks?.filter((t: any) => {
    if (t.status !== 'DELIVERED') return false
    const today = new Date().toDateString()
    return new Date(t.deliveredAt).toDateString() === today
  }) || []

  const getNextStatus = (currentStatus: string) => {
    const currentIndex = TASK_STATUS_FLOW.findIndex((s) => s.status === currentStatus)
    if (currentIndex >= 0 && currentIndex < TASK_STATUS_FLOW.length - 1) {
      return TASK_STATUS_FLOW[currentIndex + 1].status
    }
    return null
  }

  const getActionLabel = (currentStatus: string) => {
    const step = TASK_STATUS_FLOW.find((s) => s.status === currentStatus)
    return step?.action
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-green-100 text-sm">Welcome back</p>
            <h1 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h1>
          </div>
          <button
            onClick={() => {
              setIsOnline(!isOnline)
              toggleAvailability.mutate(!isOnline)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isOnline
                ? 'bg-white text-green-600'
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
            <p className="text-xs text-green-100">Today</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{profile?.totalDeliveries || 0}</p>
            <p className="text-xs text-green-100">Total</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{profile?.averageDeliveryTime || 25}</p>
            <p className="text-xs text-green-100">Avg Min</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Active Task Card */}
        {activeTask && (
          <Card className="border-2 border-green-500 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="default" className="bg-green-600">
                  Active Delivery
                </Badge>
                <span className="text-sm font-mono text-gray-500">
                  {activeTask.taskNumber}
                </span>
              </div>

              {/* Status Progress */}
              <div className="flex items-center gap-1 mb-4">
                {TASK_STATUS_FLOW.slice(0, -1).map((step, index) => (
                  <div key={step.status} className="flex-1 flex items-center">
                    <div
                      className={`h-1.5 flex-1 rounded ${
                        TASK_STATUS_FLOW.findIndex((s) => s.status === activeTask.status) >= index
                          ? 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Pickup Location */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <Store className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-amber-600 font-medium">PICKUP</p>
                    <p className="font-medium">{activeTask.pickupAddress}</p>
                    {activeTask.pickupNotes && (
                      <p className="text-sm text-gray-500 mt-1">{activeTask.pickupNotes}</p>
                    )}
                  </div>
                  {['ACCEPTED', 'PICKING_UP'].includes(activeTask.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${activeTask.pickupLatitude},${activeTask.pickupLongitude}`,
                          '_blank'
                        )
                      }}
                    >
                      <Navigation className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Delivery Location */}
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Truck className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-green-600 font-medium">DELIVER TO</p>
                    <p className="font-medium">{activeTask.deliveryAddress}</p>
                    {activeTask.deliveryNotes && (
                      <p className="text-sm text-gray-500 mt-1">{activeTask.deliveryNotes}</p>
                    )}
                  </div>
                  {['PICKED_UP', 'IN_TRANSIT'].includes(activeTask.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${activeTask.deliveryLatitude},${activeTask.deliveryLongitude}`,
                          '_blank'
                        )
                      }}
                    >
                      <Navigation className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {getNextStatus(activeTask.status) && (
                <Button
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    updateStatus.mutate({
                      taskId: activeTask.id,
                      status: getNextStatus(activeTask.status)!,
                    })
                  }
                  disabled={updateStatus.isPending}
                >
                  {updateStatus.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {activeTask.status === 'IN_TRANSIT' && <Camera className="w-4 h-4 mr-2" />}
                      {activeTask.status !== 'IN_TRANSIT' && <Check className="w-4 h-4 mr-2" />}
                      {getActionLabel(activeTask.status)}
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              New Delivery Requests ({pendingTasks.length})
            </h2>
            <div className="space-y-3">
              {pendingTasks.map((task: any) => (
                <Card key={task.id} className="border-l-4 border-l-amber-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-mono text-sm">{task.taskNumber}</span>
                        <p className="text-sm text-gray-600 mt-1">Parts Delivery</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ${(task.paymentCents / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">~{task.estimatedMinutes || 25} min</p>
                      </div>
                    </div>

                    {/* Route Summary */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Store className="w-4 h-4 text-amber-500" />
                      <span className="truncate flex-1">{task.pickupAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Truck className="w-4 h-4 text-green-500" />
                      <span className="truncate flex-1">{task.deliveryAddress}</span>
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
                        onClick={() => acceptTask.mutate(task.id)}
                        disabled={acceptTask.isPending}
                      >
                        {acceptTask.isPending ? (
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
        {!activeTask && pendingTasks.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No deliveries right now</h3>
            <p className="text-gray-500 text-sm">
              {isOnline
                ? "Stay online and we'll notify you when a delivery comes in"
                : 'Go online to start receiving delivery requests'}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        )}
      </div>
    </div>
  )
}
