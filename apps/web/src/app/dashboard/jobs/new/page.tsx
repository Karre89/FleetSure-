'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Header } from '@/components/dashboard/header'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from '@/components/ui'
import { vehiclesApi, jobsApi } from '@/lib/api'
import {
  Truck,
  AlertTriangle,
  Clock,
  Zap,
  MapPin,
  Wrench,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'

const ISSUE_TYPES = [
  { value: 'engine', label: 'Engine', icon: '🔧' },
  { value: 'electrical', label: 'Electrical', icon: '⚡' },
  { value: 'brakes', label: 'Brakes', icon: '🛑' },
  { value: 'tire', label: 'Tire/Wheel', icon: '🔘' },
  { value: 'transmission', label: 'Transmission', icon: '⚙️' },
  { value: 'cooling', label: 'Cooling System', icon: '❄️' },
  { value: 'fuel', label: 'Fuel System', icon: '⛽' },
  { value: 'exhaust', label: 'Exhaust/DPF', icon: '💨' },
  { value: 'suspension', label: 'Suspension', icon: '🔩' },
  { value: 'other', label: 'Other', icon: '🔨' },
]

const URGENCY_OPTIONS = [
  {
    value: 'STANDARD',
    label: 'Standard',
    description: 'Non-urgent, can wait a few hours',
    icon: Clock,
    color: 'text-gray-600',
  },
  {
    value: 'PRIORITY',
    label: 'Priority',
    description: 'Needs attention within 2 hours',
    icon: AlertTriangle,
    color: 'text-amber-600',
  },
  {
    value: 'EMERGENCY',
    label: 'Emergency',
    description: 'Truck is stranded, needs immediate help',
    icon: Zap,
    color: 'text-red-600',
  },
]

const JOB_TYPES = [
  { value: 'ROADSIDE', label: 'Roadside Assistance', description: 'On-location emergency repair' },
  { value: 'SCHEDULED', label: 'Scheduled Service', description: 'Pre-planned maintenance visit' },
  { value: 'PREVENTIVE', label: 'Preventive Maintenance', description: 'Routine inspection & service' },
]

export default function NewJobPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    vehicleId: '',
    issueType: '',
    issueDescription: '',
    urgency: 'PRIORITY' as const,
    jobType: 'ROADSIDE' as const,
    location: {
      latitude: 47.6062,
      longitude: -122.3321,
      address: '',
      city: '',
      state: 'WA',
      notes: '',
    },
  })

  // Fetch vehicles
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesApi.getAll,
  })

  // Create job mutation
  const createJob = useMutation({
    mutationFn: jobsApi.create,
    onSuccess: (data) => {
      router.push(`/dashboard/jobs/${data.id}`)
    },
  })

  const selectedVehicle = vehicles?.find((v: any) => v.id === formData.vehicleId)

  const handleSubmit = () => {
    createJob.mutate(formData)
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!formData.vehicleId
      case 2:
        return !!formData.issueType && !!formData.issueDescription
      case 3:
        return !!formData.location.address
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="New Service Request"
        subtitle="Request roadside assistance or schedule maintenance"
      />

      <div className="max-w-3xl mx-auto p-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {['Vehicle', 'Issue', 'Location', 'Review'].map((label, index) => (
            <div key={label} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step > index + 1
                    ? 'bg-green-500 text-white'
                    : step === index + 1
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > index + 1 ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              <span
                className={`ml-2 text-sm ${
                  step === index + 1 ? 'text-brand-600 font-medium' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
              {index < 3 && (
                <div
                  className={`w-12 h-0.5 mx-4 ${
                    step > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Vehicle */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Select Vehicle
              </CardTitle>
              <CardDescription>
                Choose the vehicle that needs service
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vehiclesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : vehicles?.length === 0 ? (
                <div className="text-center py-8">
                  <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No vehicles found</p>
                  <Link href="/dashboard/vehicles/new">
                    <Button variant="outline" className="mt-4">
                      Add Vehicle
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3">
                  {vehicles?.map((vehicle: any) => (
                    <button
                      key={vehicle.id}
                      onClick={() => setFormData({ ...formData, vehicleId: vehicle.id })}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        formData.vehicleId === vehicle.id
                          ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {vehicle.unitNumber}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {vehicle.vehicleType}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </p>
                          {vehicle.licensePlate && (
                            <p className="text-xs text-gray-400 mt-1">
                              Plate: {vehicle.licensePlate}
                            </p>
                          )}
                        </div>
                        {formData.vehicleId === vehicle.id && (
                          <CheckCircle className="w-5 h-5 text-brand-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Issue Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Issue Details
              </CardTitle>
              <CardDescription>
                Describe the problem with your vehicle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Issue Type */}
              <div>
                <Label className="text-base font-medium">Issue Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3">
                  {ISSUE_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, issueType: type.value })}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        formData.issueType === type.value
                          ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <p className="text-xs mt-1 font-medium">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what's happening with the vehicle..."
                  className="mt-2 min-h-[120px]"
                  value={formData.issueDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, issueDescription: e.target.value })
                  }
                />
              </div>

              {/* Urgency */}
              <div>
                <Label className="text-base font-medium">Urgency Level</Label>
                <div className="grid gap-3 mt-3">
                  {URGENCY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setFormData({ ...formData, urgency: option.value as any })
                      }
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        formData.urgency === option.value
                          ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <option.icon className={`w-5 h-5 ${option.color}`} />
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Type */}
              <div>
                <Label className="text-base font-medium">Service Type</Label>
                <div className="grid gap-2 mt-3">
                  {JOB_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() =>
                        setFormData({ ...formData, jobType: type.value as any })
                      }
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        formData.jobType === type.value
                          ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium">{type.label}</p>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Service Location
              </CardTitle>
              <CardDescription>
                Where is the vehicle located?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="e.g., I-5 Northbound near Exit 145"
                  className="mt-2"
                  value={formData.location.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, address: e.target.value },
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Seattle"
                    className="mt-2"
                    value={formData.location.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, city: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={formData.location.state}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, state: value },
                      })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WA">Washington</SelectItem>
                      <SelectItem value="OR">Oregon</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="ID">Idaho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Location Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g., On the shoulder past mile marker 145, hazards are on"
                  className="mt-2"
                  value={formData.location.notes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, notes: e.target.value },
                    })
                  }
                />
              </div>

              {/* Map placeholder */}
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Map will appear here</p>
                  <p className="text-xs text-gray-400">Click to set exact location</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Review & Submit
              </CardTitle>
              <CardDescription>
                Confirm your service request details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Vehicle</p>
                <p className="font-semibold">
                  {selectedVehicle?.unitNumber} - {selectedVehicle?.year}{' '}
                  {selectedVehicle?.make} {selectedVehicle?.model}
                </p>
              </div>

              {/* Issue */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Issue</p>
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{formData.issueType}</Badge>
                  <Badge
                    variant={
                      formData.urgency === 'EMERGENCY'
                        ? 'destructive'
                        : formData.urgency === 'PRIORITY'
                        ? 'urgent'
                        : 'secondary'
                    }
                  >
                    {formData.urgency}
                  </Badge>
                </div>
                <p className="text-gray-700">{formData.issueDescription}</p>
              </div>

              {/* Location */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="font-semibold">{formData.location.address}</p>
                {formData.location.city && (
                  <p className="text-gray-600">
                    {formData.location.city}, {formData.location.state}
                  </p>
                )}
                {formData.location.notes && (
                  <p className="text-sm text-gray-500 mt-2">
                    Notes: {formData.location.notes}
                  </p>
                )}
              </div>

              {/* SLA Info */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">
                      Guaranteed Response Time
                    </p>
                    <p className="text-sm text-green-700">
                      A certified mechanic will arrive within 60 minutes of your request.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <div>
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </Link>
            )}
          </div>

          <div>
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createJob.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {createJob.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {createJob.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Failed to create job request. Please try again.
          </div>
        )}
      </div>
    </div>
  )
}
