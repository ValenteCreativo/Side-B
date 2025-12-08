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
  storyTxHash: string | null
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
      const artistMap = new Map<string, { id: string; name: string }>(
        data.map((s: Session) => [
          s.owner.id,
          {
            id: s.owner.id,
            name: s.owner.displayName || truncateAddress(s.owner.walletAddress)
          }
        ])
      )
      const uniqueArtists = Array.from(artistMap.values())
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
        description="Independent sound from the underground. License authentic music with verified ownership."
        sideText="SIDE B"
      >
        <VinylFlip flippable={false}
          className="w-64 h-64 ml-auto"
          front={
            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
              <Disc className="w-32 h-32 animate-spin-slow" />
            </div>
          }
          back={
            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
              <span className="font-mono text-sm font-bold tracking-widest text-bronze">
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
        <div className="mb-12">
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

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-bronze mx-auto mb-4" />
              <p className="text-muted-foreground font-mono text-lg tracking-widest">LOADING_DATA...</p>
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 p-12 rounded-md bg-zinc-50/50 dark:bg-zinc-900/50">
            <Music className="h-16 w-16 text-muted-foreground mb-6 opacity-50" />
            <h3 className="text-2xl font-bold mb-2 tracking-tight">NO_SESSIONS_FOUND</h3>
            <p className="text-muted-foreground mb-8 font-light text-lg">
              {sessions.length === 0
                ? 'Be the first to upload a session.'
                : 'Try adjusting your filters.'}
            </p>
            {sessions.length === 0 && (
              <Link href="/studio">
                <Button size="lg" className="rounded-sm border border-zinc-200 dark:border-zinc-800 bg-transparent text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-refined">
                  GO TO STUDIO
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Category Sections - Spotify Style */}
            {['JAM', 'REHEARSAL', 'PRODUCED'].map((category) => {
              const categorySessions = filteredSessions.filter(s => s.contentType === category)

              if (categorySessions.length === 0) return null

              return (
                <section key={category} className="space-y-6">
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight mb-1">
                        {category === 'JAM' && '🎸 Jam Sessions'}
                        {category === 'REHEARSAL' && '🎹 Rehearsals'}
                        {category === 'PRODUCED' && '🎵 Produced Tracks'}
                      </h2>
                      <p className="text-sm text-muted-foreground font-mono">
                        {categorySessions.length} {categorySessions.length === 1 ? 'track' : 'tracks'}
                      </p>
                    </div>
                  </div>

                  {/* Horizontal Scrollable Grid */}
                  <div className="relative">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {categorySessions.slice(0, 8).map((session) => (
                        <div key={session.id} className="group relative">
                          <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300 rounded-md" />
                          <div className="relative bg-background border border-zinc-200 dark:border-zinc-800 p-4 hover-lift h-full rounded-md shadow-sm">
                            <VinylTrack
                              id={session.id}
                              title={session.title}
                              artist={session.owner.displayName || truncateAddress(session.owner.walletAddress)}
                              artistId={session.owner.id}
                              price={formatPrice(session.priceUsd)}
                              audioUrl={session.audioUrl}
                              storyTxHash={session.storyTxHash}
                              description={session.description}
                              moodTags={session.moodTags}
                              contentType={session.contentType}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Show More Link */}
                    {categorySessions.length > 8 && (
                      <div className="mt-6 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setContentType(category)}
                          className="font-mono text-xs"
                        >
                          View all {categorySessions.length} tracks
                        </Button>
                      </div>
                    )}
                  </div>
                </section>
              )
            })}

            {/* Show "All Tracks" view when filters are active */}
            {(contentType !== 'all' || moodTag || searchQuery || selectedArtist !== 'all') && (
              <section className="space-y-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight">
                    Filtered Results
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono">
                    {filteredSessions.length} {filteredSessions.length === 1 ? 'track' : 'tracks'}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredSessions.map((session) => (
                    <div key={session.id} className="group relative">
                      <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900 translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300 rounded-md" />
                      <div className="relative bg-background border border-zinc-200 dark:border-zinc-800 p-4 hover-lift h-full rounded-md shadow-sm">
                        <VinylTrack
                          id={session.id}
                          title={session.title}
                          artist={session.owner.displayName || truncateAddress(session.owner.walletAddress)}
                          artistId={session.owner.id}
                          price={formatPrice(session.priceUsd)}
                          audioUrl={session.audioUrl}
                          storyTxHash={session.storyTxHash}
                          description={session.description}
                          moodTags={session.moodTags}
                          contentType={session.contentType}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
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
