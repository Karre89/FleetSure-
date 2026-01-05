# Create API Hook

Create a TanStack Query hook for API calls in FleetSure.

## Instructions

When the user asks to create an API hook, follow these rules:

### File Location
- `apps/web/hooks/use-{resource}.ts`
- Example: `use-jobs.ts`, `use-mechanics.ts`

### API Client Setup

First, ensure api-client exists at `apps/web/lib/api-client.ts`:

```tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

class ApiClient {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || "API request failed")
    }

    return response.json()
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" })
  }

  post<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  patch<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const api = new ApiClient()
```

### Query Hook Pattern (GET)

```tsx
// hooks/use-jobs.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api-client"
import type { Job, CreateJobInput, UpdateJobInput } from "@/types"

// Query keys factory
export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
}

// List jobs
export function useJobs(filters?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: jobKeys.list(filters || {}),
    queryFn: () => {
      const params = new URLSearchParams()
      if (filters?.status) params.set("status", filters.status)
      if (filters?.page) params.set("page", String(filters.page))
      return api.get<{ data: Job[]; meta: { total: number } }>(
        `/jobs?${params.toString()}`
      )
    },
  })
}

// Get single job
export function useJob(id: string) {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => api.get<Job>(`/jobs/${id}`),
    enabled: !!id,
  })
}

// Create job
export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateJobInput) => api.post<Job>("/jobs", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
    },
  })
}

// Update job status
export function useUpdateJobStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: string; notes?: string }) =>
      api.patch<Job>(`/jobs/${id}/status`, { status, notes }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
    },
  })
}
```

### Usage in Components

```tsx
"use client"

import { useJobs, useCreateJob } from "@/hooks/use-jobs"
import { toast } from "sonner"

export function JobsList() {
  const { data, isLoading, error } = useJobs({ status: "REQUESTED" })
  const createJob = useCreateJob()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.data.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}

export function CreateJobButton() {
  const createJob = useCreateJob()

  async function handleCreate() {
    try {
      await createJob.mutateAsync({
        vehicleId: "...",
        issueType: "engine",
        // ...
      })
      toast.success("Job created!")
    } catch (error) {
      toast.error("Failed to create job")
    }
  }

  return (
    <Button onClick={handleCreate} disabled={createJob.isPending}>
      {createJob.isPending ? "Creating..." : "Create Job"}
    </Button>
  )
}
```

### Real-time Updates Pattern

For jobs that need live updates:

```tsx
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { socket } from "@/lib/socket"

export function useJobRealtime(jobId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    socket.emit("subscribe:job", { jobId })

    socket.on("job:updated", (updatedJob) => {
      if (updatedJob.id === jobId) {
        queryClient.setQueryData(jobKeys.detail(jobId), updatedJob)
      }
    })

    return () => {
      socket.off("job:updated")
    }
  }, [jobId, queryClient])
}
```

### Common Hook Patterns for FleetSure

```tsx
// hooks/use-auth.ts - Authentication
export function useAuth() { ... }
export function useLogin() { ... }
export function useLogout() { ... }

// hooks/use-fleet.ts - Fleet data
export function useFleet() { ... }
export function useFleetStats() { ... }

// hooks/use-vehicles.ts - Vehicles
export function useVehicles() { ... }
export function useCreateVehicle() { ... }

// hooks/use-mechanics.ts - Mechanics
export function useMechanics() { ... }
export function useMechanicLocation() { ... }

// hooks/use-location.ts - Geolocation
export function useCurrentLocation() { ... }
export function useLocationUpdates() { ... }
```
