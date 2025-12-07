'use client'

import { useState } from 'react'
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
import { Slider } from '@/components/ui/slider'
import { X, Search, DollarSign, User, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'

interface FilterBarProps {
  contentType: string
  moodTag: string
  searchQuery: string
  priceRange: [number, number]
  selectedArtist: string
  artists: Array<{ id: string; name: string }>
  onContentTypeChange: (value: string) => void
  onMoodTagChange: (value: string) => void
  onSearchQueryChange: (value: string) => void
  onPriceRangeChange: (value: [number, number]) => void
  onArtistChange: (value: string) => void
  onClearFilters: () => void
  maxPrice: number
}

export function FilterBar({
  contentType,
  moodTag,
  searchQuery,
  priceRange,
  selectedArtist,
  artists,
  onContentTypeChange,
  onMoodTagChange,
  onSearchQueryChange,
  onPriceRangeChange,
  onArtistChange,
  onClearFilters,
  maxPrice,
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const hasFilters =
    contentType !== 'all' ||
    moodTag !== '' ||
    searchQuery !== '' ||
    selectedArtist !== 'all' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== maxPrice

  const activeFilterCount = [
    contentType !== 'all',
    moodTag !== '',
    selectedArtist !== 'all',
    priceRange[0] !== 0 || priceRange[1] !== maxPrice,
  ].filter(Boolean).length

  return (
    <div className="w-full space-y-4">
      {/* Compact Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search tracks by title or description..."
            className="pl-10 rounded-none border-2 border-foreground focus-visible:ring-0 h-12 text-base"
          />
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="rounded-none border-2 border-foreground uppercase text-xs tracking-wider font-bold whitespace-nowrap gap-2 h-12"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Advanced
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-bronze text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
          {showAdvanced ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {hasFilters && (
          <Button
            variant="outline"
            size="lg"
            onClick={onClearFilters}
            className="rounded-none border-2 border-foreground uppercase text-xs tracking-wider font-bold h-12"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters - Collapsible */}
      {showAdvanced && (
        <div className="rounded-none border-2 border-foreground bg-background p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] animate-in slide-in-from-top-2 duration-300">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-wide text-lg flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Advanced Filters
            </h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Content Type */}
            <div className="space-y-2">
              <Label htmlFor="contentType" className="font-mono uppercase text-xs">
                Content Type
              </Label>
              <Select value={contentType} onValueChange={onContentTypeChange}>
                <SelectTrigger id="contentType" className="rounded-none border-2 border-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-foreground">
                  <SelectItem value="all">ALL TYPES</SelectItem>
                  <SelectItem value="JAM">JAM SESSIONS</SelectItem>
                  <SelectItem value="REHEARSAL">REHEARSALS</SelectItem>
                  <SelectItem value="PRODUCED">PRODUCED TRACKS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Artist Filter */}
            <div className="space-y-2">
              <Label htmlFor="artist" className="font-mono uppercase text-xs flex items-center gap-2">
                <User className="h-3 w-3" />
                Artist
              </Label>
              <Select value={selectedArtist} onValueChange={onArtistChange}>
                <SelectTrigger id="artist" className="rounded-none border-2 border-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-foreground max-h-[300px]">
                  <SelectItem value="all">ALL ARTISTS</SelectItem>
                  {artists.map((artist) => (
                    <SelectItem key={artist.id} value={artist.id}>
                      {artist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mood Tag */}
            <div className="space-y-2">
              <Label htmlFor="moodTag" className="font-mono uppercase text-xs">
                Mood / Tag
              </Label>
              <Input
                id="moodTag"
                value={moodTag}
                onChange={(e) => onMoodTagChange(e.target.value)}
                placeholder="SEARCH_MOODS..."
                className="rounded-none border-2 border-foreground focus-visible:ring-0"
              />
            </div>

            {/* Price Range */}
            <div className="space-y-3 sm:col-span-2 lg:col-span-3">
              <Label className="font-mono uppercase text-xs flex items-center gap-2">
                <DollarSign className="h-3 w-3" />
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </Label>
              <Slider
                value={priceRange}
                onValueChange={onPriceRangeChange}
                min={0}
                max={maxPrice}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>MIN: $0</span>
                <span>MAX: ${maxPrice}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
