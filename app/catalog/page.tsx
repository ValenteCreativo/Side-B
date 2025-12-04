'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/components/auth/UserContext'
import { FilterBar } from '@/components/catalog/FilterBar'
import { VinylTrack } from '@/components/catalog/VinylTrack'
import { Button } from '@/components/ui/button'
import { truncateAddress, formatPrice } from '@/lib/utils'
import { Music, Loader2, Disc } from 'lucide-react'
import Link from 'next/link'
import { AppShell } from '@/components/layout/AppShell'
import { PageHero } from '@/components/ui/PageHero'
import { VinylFlip } from '@/components/ui/VinylFlip'

interface Session {
  id: string
  title: string
  description: string
  contentType: string
  moodTags: string[]
  priceUsd: number
  audioUrl: string
  storyAssetId: string | null
  owner: {
    id: string
    walletAddress: string
    displayName: string | null
  }
  collection?: {
    id: string
    title: string
  } | null
  licenseCount?: number
}


function CatalogPage() {
  const { user } = useUser()
  const [sessions, setSessions] = useState<Session[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [contentType, setContentType] = useState('all')
  const [moodTag, setMoodTag] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArtist, setSelectedArtist] = useState('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [maxPrice, setMaxPrice] = useState(100)
  const [artists, setArtists] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [sessions, contentType, moodTag, searchQuery, selectedArtist, priceRange])

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (!response.ok) throw new Error('Failed to load sessions')

      const data = await response.json()
      setSessions(data)

      // Extract unique artists
      const uniqueArtists: { id: string; name: string }[] = Array.from(
        new Map(
          data.map((s: Session) => [
            s.owner.id,
            {
              id: s.owner.id,
              name: s.owner.displayName || truncateAddress(s.owner.walletAddress)
            }
          ])
        ).values()
      )
      setArtists(uniqueArtists)

      // Calculate max price
      const max = Math.max(...data.map((s: Session) => s.priceUsd), 100)
      setMaxPrice(max)
      setPriceRange([0, max])
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...sessions]

    // Filter by content type
    if (contentType !== 'all') {
      filtered = filtered.filter((s) => s.contentType === contentType)
    }

    // Filter by mood tag
    if (moodTag.trim()) {
      const searchTerm = moodTag.toLowerCase().trim()
      filtered = filtered.filter((s) =>
        s.moodTags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        s.title.toLowerCase().includes(searchTerm) ||
        s.description.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((s) =>
        s.title.toLowerCase().includes(search) ||
        s.description.toLowerCase().includes(search)
      )
    }

    // Filter by artist
    if (selectedArtist !== 'all') {
      filtered = filtered.filter((s) => s.owner.id === selectedArtist)
    }

    // Filter by price range
    filtered = filtered.filter((s) => s.priceUsd >= priceRange[0] && s.priceUsd <= priceRange[1])

    setFilteredSessions(filtered)
  }

  const handleClearFilters = () => {
    setContentType('all')
    setMoodTag('')
    setSearchQuery('')
    setSelectedArtist('all')
    setPriceRange([0, maxPrice])
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <PageHero
        title="THE CATALOG"
        subtitle="ARCHIVE_01"
        description="Curated sounds from the underground. License directly from the source."
        sideText="SIDE B"
      >
        <VinylFlip
          className="w-64 h-64 ml-auto"
          front={
            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
              <Disc className="w-32 h-32 animate-spin-slow" />
            </div>
          }
          back={
            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
              <span className="font-mono text-sm font-bold tracking-widest">
                DISCOVER
                <br />
                UNHEARD
                <br />
                GEMS
              </span>
            </div>
          }
        />
      </PageHero>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Filters */}
        <div className="mb-12 flex justify-center">
          <div className="bg-background border-2 border-foreground p-2 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <FilterBar
              contentType={contentType}
              moodTag={moodTag}
              searchQuery={searchQuery}
              selectedArtist={selectedArtist}
              priceRange={priceRange}
              artists={artists}
              maxPrice={maxPrice}
              onContentTypeChange={setContentType}
              onMoodTagChange={setMoodTag}
              onSearchQueryChange={setSearchQuery}
              onArtistChange={setSelectedArtist}
              onPriceRangeChange={setPriceRange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-mono text-lg tracking-widest">LOADING_DATA...</p>
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-foreground/20 p-12">
            <Music className="h-16 w-16 text-muted-foreground mb-6 opacity-50" />
            <h3 className="text-2xl font-bold mb-2 tracking-tight">NO_SESSIONS_FOUND</h3>
            <p className="text-muted-foreground mb-8 font-light text-lg">
              {sessions.length === 0
                ? 'Be the first to upload a session.'
                : 'Try adjusting your filters.'}
            </p>
            {sessions.length === 0 && (
              <Link href="/studio">
                <Button size="lg" className="rounded-none border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all duration-300">
                  GO TO STUDIO
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-8 flex items-center justify-between px-2 border-b-2 border-foreground pb-4">
              <p className="font-mono text-sm font-bold uppercase tracking-widest">
                {filteredSessions.length} {filteredSessions.length === 1 ? 'TRACK' : 'TRACKS'} AVAILABLE
              </p>
              <div className="h-2 w-2 bg-foreground rounded-full animate-pulse" />
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSessions.map((session) => (
                <div key={session.id} className="group relative">
                  <div className="absolute inset-0 bg-foreground translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" />
                  <div className="relative bg-background border-2 border-foreground p-4 hover:-translate-y-1 transition-transform duration-300 h-full">
                    <VinylTrack
                      id={session.id}
                      title={session.title}
                      artist={session.owner.displayName || truncateAddress(session.owner.walletAddress)}
                      price={formatPrice(session.priceUsd)}
                      audioUrl={session.audioUrl}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function CatalogPageWithAuth() {
  return (
    <AppShell>
      <CatalogPage />
    </AppShell>
  )
}
