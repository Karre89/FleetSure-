# FleetSure Design System

Reference guide for consistent design across the FleetSure application.

## Brand Identity

- **Name**: FleetSure (capital S, no space)
- **Tagline**: "Guaranteed fleet uptime, on-demand."
- **Voice**: Professional, reliable, efficient

## Color Palette

### Primary Colors
```css
/* Blue - Primary actions, links, trust */
--primary: #2563eb;        /* blue-600 */
--primary-hover: #1d4ed8;  /* blue-700 */
--primary-light: #dbeafe;  /* blue-100 */
```

### Status Colors
```css
/* Success - Completed, Online, Good */
--success: #16a34a;        /* green-600 */
--success-light: #dcfce7;  /* green-100 */

/* Warning - At Risk, Pending, Caution */
--warning: #f59e0b;        /* amber-500 */
--warning-light: #fef3c7;  /* amber-100 */

/* Danger - Emergency, Error, Breach */
--danger: #dc2626;         /* red-600 */
--danger-light: #fee2e2;   /* red-100 */

/* Info - Informational */
--info: #0891b2;           /* cyan-600 */
--info-light: #cffafe;     /* cyan-100 */
```

### Neutral Colors
```css
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

## Job Status Badges

| Status | Color | Tailwind Classes |
|--------|-------|------------------|
| REQUESTED | Blue | `bg-blue-100 text-blue-700` |
| ASSIGNED | Purple | `bg-purple-100 text-purple-700` |
| ACCEPTED | Indigo | `bg-indigo-100 text-indigo-700` |
| EN_ROUTE | Cyan | `bg-cyan-100 text-cyan-700` |
| ON_SITE | Yellow | `bg-yellow-100 text-yellow-700` |
| PARTS_REQUESTED | Orange | `bg-orange-100 text-orange-700` |
| PARTS_DISPATCHED | Orange | `bg-orange-100 text-orange-700` |
| PARTS_DELIVERED | Orange | `bg-orange-100 text-orange-700` |
| COMPLETED | Green | `bg-green-100 text-green-700` |
| PAID | Green | `bg-green-100 text-green-700` |
| CANCELLED | Gray | `bg-gray-100 text-gray-700` |

## Urgency Indicators

| Urgency | Color | Icon |
|---------|-------|------|
| STANDARD | Gray | Clock |
| PRIORITY | Amber | AlertTriangle |
| EMERGENCY | Red | AlertCircle (pulsing) |

## Typography

### Font Stack
```css
font-family: Inter, system-ui, -apple-system, sans-serif;
```

### Scale
| Element | Classes |
|---------|---------|
| Page Title | `text-2xl font-semibold` |
| Section Title | `text-xl font-semibold` |
| Card Title | `text-lg font-medium` |
| Body | `text-base` |
| Small | `text-sm` |
| Caption | `text-xs text-gray-500` |

## Spacing

Use Tailwind's spacing scale consistently:

| Use Case | Value |
|----------|-------|
| Card padding | `p-4` or `p-6` |
| Section gap | `gap-6` or `space-y-6` |
| Item gap | `gap-4` or `space-y-4` |
| Inline gap | `gap-2` |
| Icon gap | `gap-1.5` |

## Components

### Cards
```tsx
<Card className="rounded-lg border shadow-sm">
  <CardHeader className="pb-2">
    <CardTitle className="text-lg">Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

### Buttons
```tsx
// Primary action
<Button>Create Job</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Danger action
<Button variant="destructive">Delete</Button>

// Ghost (subtle)
<Button variant="ghost">View Details</Button>

// With icon
<Button>
  <Plus className="w-4 h-4 mr-2" />
  Add Vehicle
</Button>
```

### Form Inputs
```tsx
// Standard input
<Input className="h-10" placeholder="Enter value" />

// With label
<div className="space-y-2">
  <Label>Email</Label>
  <Input type="email" />
</div>

// Error state
<Input className="border-red-500" />
<p className="text-sm text-red-500">Error message</p>
```

### Stats Card
```tsx
<Card>
  <CardContent className="p-6">
    <div className="text-sm text-gray-500">Active Jobs</div>
    <div className="text-3xl font-bold">24</div>
    <div className="text-sm text-green-600">+12% from last week</div>
  </CardContent>
</Card>
```

## Layout Patterns

### Fleet Portal (Desktop-first)
```tsx
<div className="flex h-screen">
  {/* Sidebar - 240px */}
  <aside className="w-60 border-r bg-gray-50">
    {/* navigation */}
  </aside>

  {/* Main */}
  <div className="flex-1 flex flex-col">
    {/* Header - 64px */}
    <header className="h-16 border-b px-6 flex items-center">
      {/* header content */}
    </header>

    {/* Content */}
    <main className="flex-1 overflow-auto p-6">
      {/* page content */}
    </main>
  </div>
</div>
```

### Mechanic/Runner PWA (Mobile-first)
```tsx
<div className="flex flex-col h-screen">
  {/* Header - sticky */}
  <header className="sticky top-0 z-10 h-14 border-b bg-white px-4 flex items-center">
    {/* header content */}
  </header>

  {/* Content - scrollable */}
  <main className="flex-1 overflow-auto p-4">
    {/* page content */}
  </main>

  {/* Bottom Nav - fixed */}
  <nav className="fixed bottom-0 left-0 right-0 h-16 border-t bg-white flex">
    {/* nav items */}
  </nav>
</div>
```

## Icons

Use Lucide React icons:

```tsx
import {
  Truck,           // Vehicle/Fleet
  Wrench,          // Mechanic/Repair
  Package,         // Parts/Delivery
  MapPin,          // Location
  Clock,           // Time/SLA
  AlertTriangle,   // Warning
  AlertCircle,     // Error/Emergency
  CheckCircle,     // Success
  User,            // User/Profile
  Settings,        // Settings
  LogOut,          // Logout
  Plus,            // Add
  Search,          // Search
  Filter,          // Filter
  ChevronRight,    // Navigation
  ArrowLeft,       // Back
} from "lucide-react"

// Standard size
<Icon className="w-5 h-5" />

// Small (in buttons/badges)
<Icon className="w-4 h-4" />

// Large (empty states)
<Icon className="w-12 h-12 text-gray-400" />
```

## SLA Timer Display

```tsx
// Healthy (>15 min remaining)
<div className="text-green-600 font-mono">
  <Clock className="w-4 h-4 inline mr-1" />
  45:23 remaining
</div>

// At Risk (5-15 min remaining)
<div className="text-amber-600 font-mono animate-pulse">
  <AlertTriangle className="w-4 h-4 inline mr-1" />
  12:45 remaining
</div>

// Critical (<5 min remaining)
<div className="text-red-600 font-mono animate-pulse">
  <AlertCircle className="w-4 h-4 inline mr-1" />
  03:21 remaining
</div>

// Breached
<div className="text-red-600 font-semibold">
  <AlertCircle className="w-4 h-4 inline mr-1" />
  SLA BREACHED (+15:00)
</div>
```

## Responsive Breakpoints

```css
/* Mobile first */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

## Accessibility

- All interactive elements must have `focus:ring-2 focus:ring-blue-500`
- Minimum touch target: 44x44px on mobile
- Color contrast ratio: 4.5:1 minimum
- Always include alt text for images
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
