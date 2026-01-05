# Create Component

Create a new React component for FleetSure.

## Instructions

When the user asks to create a component, follow these rules:

### File Location
- UI primitives: `apps/web/components/ui/`
- Shared components: `apps/web/components/shared/`
- Fleet-specific: `apps/web/components/fleet/`
- Mechanic-specific: `apps/web/components/mechanic/`
- Runner-specific: `apps/web/components/runner/`
- Admin-specific: `apps/web/components/admin/`
- Map components: `apps/web/components/maps/`

### File Naming
- Use kebab-case: `job-card.tsx`, `status-badge.tsx`
- One component per file
- Index files for barrel exports

### Component Structure

```tsx
import { cn } from "@/lib/utils"

interface ComponentNameProps {
  className?: string
  // other props
}

export function ComponentName({ className, ...props }: ComponentNameProps) {
  return (
    <div className={cn("base-classes", className)}>
      {/* content */}
    </div>
  )
}
```

### Design Rules

**Colors:**
- Primary: `bg-blue-600` / `text-blue-600` (trust, action)
- Success: `bg-green-600` (completed, online)
- Warning: `bg-amber-500` (at risk, pending)
- Danger: `bg-red-600` (breach, error, urgent)
- Neutral: `bg-gray-100` to `bg-gray-900`

**Spacing:**
- Card padding: `p-4` or `p-6`
- Gap between items: `gap-4`
- Section spacing: `space-y-6`

**Typography:**
- Headings: `font-semibold`
- Body: `text-gray-600` (light mode)
- Small/muted: `text-sm text-gray-500`

**Borders & Shadows:**
- Cards: `rounded-lg border shadow-sm`
- Buttons: `rounded-md`
- Inputs: `rounded-md border`

**Responsive:**
- Mobile-first: Start with mobile, add `md:` and `lg:` for larger
- Mechanic/Runner components: Optimize for touch (min 44px tap targets)

### shadcn/ui Usage

Always check if shadcn/ui has a component first:
- Button, Card, Input, Select, Dialog, Toast, Badge, Avatar
- Import from `@/components/ui/`

### Example

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface JobCardProps {
  job: {
    jobNumber: string
    status: string
    issueType: string
    vehicle: { unitNumber: string }
  }
  className?: string
}

export function JobCard({ job, className }: JobCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{job.jobNumber}</CardTitle>
          <Badge variant={job.status === "COMPLETED" ? "default" : "secondary"}>
            {job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Unit: {job.vehicle.unitNumber}</p>
        <p className="text-sm">{job.issueType}</p>
      </CardContent>
    </Card>
  )
}
```
