'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-500 text-white hover:bg-brand-600',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-red-500 text-white hover:bg-red-600',
        outline: 'text-foreground',
        // Status variants
        pending: 'border-transparent bg-amber-100 text-amber-800',
        dispatched: 'border-transparent bg-blue-100 text-blue-800',
        'en-route': 'border-transparent bg-purple-100 text-purple-800',
        'on-site': 'border-transparent bg-cyan-100 text-cyan-800',
        'in-progress': 'border-transparent bg-emerald-100 text-emerald-800',
        completed: 'border-transparent bg-green-100 text-green-800',
        cancelled: 'border-transparent bg-red-100 text-red-800',
        // Urgency variants
        standard: 'border-transparent bg-gray-100 text-gray-800',
        urgent: 'border-transparent bg-amber-100 text-amber-800',
        critical: 'border-transparent bg-red-100 text-red-800 animate-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
