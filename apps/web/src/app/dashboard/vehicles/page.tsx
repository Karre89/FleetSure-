'use client'

import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, Badge, Button, Input } from '@/components/ui'
import { vehiclesApi } from '@/lib/api'
import { useState } from 'react'
import {
  Truck,
  Search,
  Plus,
  MoreVertical,
  MapPin,
  Calendar,
  Wrench,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  in_service: 'bg-amber-100 text-amber-800',
  out_of_service: 'bg-red-100 text-red-800',
}

export default function VehiclesPage() {
  const [search, setSearch] = useState('')

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesApi.getAll,
  })

  const filteredVehicles = vehicles?.filter((v: any) =>
    v.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
    v.make.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.licensePlate?.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="min-h-screen">
      <Header
        title="Vehicles"
        subtitle={`${vehicles?.length || 0} vehicles in your fleet`}
        action={{ label: 'Add Vehicle', href: '/dashboard/vehicles/new' }}
      />

      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search vehicles by unit number, make, model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              All Status
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredVehicles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {search ? 'No vehicles found' : 'No vehicles yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {search
                  ? 'Try a different search term'
                  : 'Add your first vehicle to get started'}
              </p>
              {!search && (
                <Link href="/dashboard/vehicles/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((vehicle: any) => (
              <Link key={vehicle.id} href={`/dashboard/vehicles/${vehicle.id}`}>
                <Card className="hover:shadow-card-hover transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                          <Truck className="w-6 h-6 text-brand-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {vehicle.unitNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      {vehicle.licensePlate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                            {vehicle.licensePlate}
                          </span>
                        </div>
                      )}
                      {vehicle.vin && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>VIN: {vehicle.vin.slice(-6)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <Badge className={cn(statusColors[vehicle.status])}>
                        {vehicle.status.replace('_', ' ')}
                      </Badge>
                      {vehicle.lastServiceDate && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Wrench className="w-3 h-3" />
                          Last service: {new Date(vehicle.lastServiceDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
