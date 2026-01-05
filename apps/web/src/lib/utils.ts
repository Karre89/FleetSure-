import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-status-pending text-white',
    dispatched: 'bg-status-dispatched text-white',
    en_route: 'bg-status-en-route text-white',
    on_site: 'bg-status-on-site text-white',
    in_progress: 'bg-status-in-progress text-white',
    completed: 'bg-status-completed text-white',
    cancelled: 'bg-status-cancelled text-white',
  }
  return colors[status.toLowerCase()] || 'bg-gray-500 text-white'
}

export function getUrgencyColor(urgency: string): string {
  const colors: Record<string, string> = {
    standard: 'bg-urgency-standard text-white',
    urgent: 'bg-urgency-urgent text-white',
    critical: 'bg-urgency-critical text-white',
  }
  return colors[urgency.toLowerCase()] || 'bg-gray-500 text-white'
}

export function calculateETA(distance: number, averageSpeed: number = 45): number {
  // Returns estimated time in minutes
  return Math.ceil((distance / averageSpeed) * 60)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}
