# Create Page

Create a new Next.js page for FleetSure.

## Instructions

When the user asks to create a page, follow these rules:

### File Location (App Router)

```
apps/web/app/
├── (auth)/           # Login, Register (no sidebar)
│   ├── login/page.tsx
│   └── register/page.tsx
├── (fleet)/          # Fleet dispatcher portal
│   ├── dashboard/page.tsx
│   ├── jobs/page.tsx
│   ├── jobs/[id]/page.tsx
│   ├── jobs/new/page.tsx
│   ├── vehicles/page.tsx
│   └── invoices/page.tsx
├── (mechanic)/       # Mechanic PWA
│   ├── jobs/page.tsx
│   ├── jobs/[id]/page.tsx
│   ├── earnings/page.tsx
│   └── profile/page.tsx
├── (runner)/         # Runner PWA
│   ├── tasks/page.tsx
│   ├── tasks/[id]/page.tsx
│   └── deliveries/page.tsx
├── (admin)/          # Admin console
│   ├── dashboard/page.tsx
│   ├── jobs/page.tsx
│   ├── mechanics/page.tsx
│   ├── runners/page.tsx
│   └── fleets/page.tsx
```

### Page Structure

```tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page Title | FleetSure",
  description: "Page description",
}

export default function PageName() {
  return (
    <div className="container py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Page Title</h1>
        <p className="text-gray-500">Page description</p>
      </div>

      {/* Page Content */}
      <div>
        {/* content */}
      </div>
    </div>
  )
}
```

### Layout Rules

**Auth Pages (login, register):**
- Centered card layout
- No sidebar/header
- Full-screen background

**Fleet Portal:**
- Sidebar navigation (left)
- Top header with user menu
- Main content area with padding
- Desktop-first, but responsive

**Mechanic/Runner PWA:**
- Bottom navigation bar
- No sidebar
- Mobile-first (full-width cards)
- Large touch targets (min 44px)
- Sticky headers

**Admin Console:**
- Sidebar navigation (collapsible)
- Top header with alerts
- Data tables, charts
- Desktop-first

### Page Patterns

**List Page:**
```tsx
export default function JobsPage() {
  return (
    <div className="container py-6">
      {/* Header with action button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="text-gray-500">Manage service requests</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Job
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Input placeholder="Search..." />
        <Select>{/* status filter */}</Select>
      </div>

      {/* List/Table */}
      <div className="space-y-4">
        {/* items */}
      </div>
    </div>
  )
}
```

**Detail Page:**
```tsx
export default function JobDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-6">
      {/* Back button */}
      <Button variant="ghost" className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Job #FS-2024-00001</h1>
          <Badge>IN_PROGRESS</Badge>
        </div>
        <div className="flex gap-2">
          {/* action buttons */}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* main content */}
        </div>
        <div>
          {/* sidebar info */}
        </div>
      </div>
    </div>
  )
}
```

**Dashboard Page:**
```tsx
export default function DashboardPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Active Jobs" value="12" />
        <StatsCard title="SLA Compliance" value="96%" />
        {/* etc */}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* charts, lists, etc */}
      </div>
    </div>
  )
}
```

### Loading & Error States

Always create alongside page:
- `loading.tsx` - Skeleton/spinner
- `error.tsx` - Error boundary

```tsx
// loading.tsx
export default function Loading() {
  return (
    <div className="container py-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
```
