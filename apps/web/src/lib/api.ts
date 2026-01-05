import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  register: async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role: string
    fleetName?: string
    fleetAddress?: string
  }) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    await api.post('/auth/logout', { refreshToken })
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },
  getMe: async () => {
    const response = await api.get('/users/me')
    return response.data
  },
}

// Fleets API
export const fleetsApi = {
  getMyFleet: async () => {
    const response = await api.get('/fleets/me')
    return response.data
  },
  getStats: async () => {
    const response = await api.get('/fleets/me/stats')
    return response.data
  },
}

// Vehicles API
export const vehiclesApi = {
  getAll: async () => {
    const response = await api.get('/vehicles')
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/vehicles/${id}`)
    return response.data
  },
  create: async (data: {
    unitNumber: string
    vin?: string
    make: string
    model: string
    year: number
    licensePlate?: string
  }) => {
    const response = await api.post('/vehicles', data)
    return response.data
  },
}

// Jobs API
export const jobsApi = {
  getAll: async () => {
    const response = await api.get('/jobs')
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`)
    return response.data
  },
  create: async (data: {
    vehicleId: string
    issueType: string
    issueDescription: string
    urgency: 'STANDARD' | 'PRIORITY' | 'EMERGENCY'
    jobType: 'ROADSIDE' | 'SCHEDULED' | 'PREVENTIVE'
    location: {
      latitude: number
      longitude: number
      address: string
      city?: string
      state?: string
      notes?: string
    }
  }) => {
    const response = await api.post('/jobs', data)
    return response.data
  },
  updateStatus: async (id: string, status: string, notes?: string) => {
    const response = await api.patch(`/jobs/${id}/status`, { status, notes })
    return response.data
  },
}

// Mechanics API
export const mechanicsApi = {
  getAvailable: async (lat?: number, lng?: number) => {
    const params = new URLSearchParams()
    if (lat) params.append('lat', lat.toString())
    if (lng) params.append('lng', lng.toString())
    const response = await api.get(`/mechanics/available?${params}`)
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/mechanics/${id}`)
    return response.data
  },
  updateLocation: async (lat: number, lng: number) => {
    const response = await api.patch('/mechanics/me/location', { lat, lng })
    return response.data
  },
  updateAvailability: async (available: boolean) => {
    const response = await api.patch('/mechanics/me/availability', { available })
    return response.data
  },
}

// Runners API
export const runnersApi = {
  getProfile: async () => {
    const response = await api.get('/runners/me')
    return response.data
  },
  getTasks: async () => {
    const response = await api.get('/runners/tasks')
    return response.data
  },
  updateTaskStatus: async (id: string, status: string) => {
    const response = await api.patch(`/runners/tasks/${id}/status`, { status })
    return response.data
  },
}

// Parts API
export const partsApi = {
  getByJob: async (jobId: string) => {
    const response = await api.get(`/jobs/${jobId}/parts`)
    return response.data
  },
  create: async (jobId: string, data: {
    partNumber: string
    description: string
    quantity: number
    unitPrice: number
    vendorId?: string
  }) => {
    const response = await api.post(`/jobs/${jobId}/parts`, data)
    return response.data
  },
  getVendors: async () => {
    const response = await api.get('/parts/vendors')
    return response.data
  },
}

// Health check
export const healthApi = {
  check: async () => {
    const response = await api.get('/health')
    return response.data
  },
}
