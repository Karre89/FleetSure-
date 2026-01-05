// User & Auth Types
export type UserRole = 'fleet' | 'mechanic' | 'runner' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: UserRole
  avatar?: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// Fleet Types
export interface Fleet {
  id: string
  name: string
  address: string
  phone?: string
  email?: string
  ownerId: string
  createdAt: string
  vehicles: Vehicle[]
}

export interface FleetStats {
  totalVehicles: number
  activeJobs: number
  completedJobs: number
  avgResponseTime: number
}

// Vehicle Types
export interface Vehicle {
  id: string
  fleetId: string
  unitNumber: string
  vin?: string
  make: string
  model: string
  year: number
  licensePlate?: string
  currentLat?: number
  currentLng?: number
  status: VehicleStatus
  lastServiceDate?: string
  createdAt: string
}

export type VehicleStatus = 'active' | 'in_service' | 'out_of_service'

// Job Types
export interface Job {
  id: string
  jobNumber: string
  vehicleId: string
  vehicle: Vehicle
  mechanicId?: string
  mechanic?: Mechanic
  description: string
  urgency: JobUrgency
  type: JobType
  status: JobStatus
  locationLat: number
  locationLng: number
  locationAddress: string
  estimatedArrival?: string
  actualArrival?: string
  completedAt?: string
  totalAmount?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export type JobStatus =
  | 'pending'
  | 'dispatched'
  | 'en_route'
  | 'on_site'
  | 'in_progress'
  | 'parts_needed'
  | 'completed'
  | 'cancelled'

export type JobUrgency = 'standard' | 'urgent' | 'critical'
export type JobType = 'breakdown' | 'preventive' | 'inspection' | 'tire' | 'other'

// Mechanic Types
export interface Mechanic {
  id: string
  userId: string
  user: User
  rating: number
  totalJobs: number
  completedJobs: number
  currentLat?: number
  currentLng?: number
  isAvailable: boolean
  certifications: string[]
  specialties: string[]
  serviceRadius: number
  createdAt: string
}

// Runner Types
export interface Runner {
  id: string
  userId: string
  user: User
  currentLat?: number
  currentLng?: number
  isAvailable: boolean
  vehicleInfo?: string
  totalDeliveries: number
  createdAt: string
}

export interface RunnerTask {
  id: string
  runnerId: string
  jobId: string
  job: Job
  partId?: string
  part?: Part
  type: RunnerTaskType
  status: RunnerTaskStatus
  pickupLat: number
  pickupLng: number
  pickupAddress: string
  dropoffLat: number
  dropoffLng: number
  dropoffAddress: string
  notes?: string
  createdAt: string
  completedAt?: string
}

export type RunnerTaskType = 'part_pickup' | 'part_delivery' | 'tool_delivery' | 'other'
export type RunnerTaskStatus = 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled'

// Part Types
export interface Part {
  id: string
  jobId: string
  partNumber: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  status: PartStatus
  vendorId?: string
  vendor?: PartVendor
  orderedAt?: string
  deliveredAt?: string
  createdAt: string
}

export type PartStatus = 'needed' | 'ordered' | 'in_transit' | 'delivered' | 'installed'

export interface PartVendor {
  id: string
  name: string
  address: string
  phone: string
  email?: string
  lat: number
  lng: number
}

// API Response Types
export interface ApiError {
  statusCode: number
  message: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
