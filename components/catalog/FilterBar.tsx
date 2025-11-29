'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface FilterBarProps {
  contentType: string
  moodTag: string
  onContentTypeChange: (value: string) => void
  onMoodTagChange: (value: string) => void
  onClearFilters: () => void
}

export function FilterBar({
  contentType,
  moodTag,
  onContentTypeChange,
  onMoodTagChange,
  onClearFilters,
}: FilterBarProps) {
  const hasFilters = contentType !== 'all' || moodTag !== ''

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-auto py-1 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contentType">Content Type</Label>
          <Select value={contentType} onValueChange={onContentTypeChange}>
            <SelectTrigger id="contentType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="JAM">Jam Sessions</SelectItem>
              <SelectItem value="REHEARSAL">Rehearsals</SelectItem>
              <SelectItem value="PRODUCED">Produced Tracks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="moodTag">Mood / Tag</Label>
          <Input
            id="moodTag"
            value={moodTag}
            onChange={(e) => onMoodTagChange(e.target.value)}
            placeholder="Search moods..."
          />
        </div>
      </div>
    </div>
  )
}
