import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format wallet address for display
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return ''
  if (address.length <= chars * 2 + 2) return address
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`
}

// Format duration in seconds to MM:SS
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Parse mood tags from comma-separated string
export function parseMoodTags(tagsString: string): string[] {
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
}

// Convert mood tags array to comma-separated string for storage
export function stringifyMoodTags(tags: string[]): string {
  return tags.join(', ')
}

// Format price in USD
export function formatPrice(priceUsd: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(priceUsd)
}

// Format date
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}
