'use client'

import { useEffect, useState } from 'react'
import { AuthGate } from '@/components/auth/AuthGate'
import { useUser } from '@/components/auth/UserContext'
import { FilterBar } from '@/components/catalog/FilterBar'
import { VinylTrack } from '@/components/catalog/VinylTrack'
import { Button } from '@/components/ui/button'
import { truncateAddress, formatPrice } from '@/lib/utils'
import { LogOut, Music, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AppShell } from '@/components/layout/AppShell'

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
  const { user, logout } = useUser()
  const [sessions, setSessions] = useState<Session[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [contentType, setContentType] = useState('all')
  const [moodTag, setMoodTag] = useState('')

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [sessions, contentType, moodTag])

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (!response.ok) throw new Error('Failed to load sessions')

      const data = await response.json()
      setSessions(data)
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

    setFilteredSessions(filtered)
  }

  const handleClearFilters = () => {
    setContentType('all')
    setMoodTag('')
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 border-b border-border">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">THE CATALOG</h1>
            <p className="text-xl font-light text-muted-foreground max-w-lg">
              Curated sounds from the underground. <br />
              License directly from the source.
            </p>
          </div>

          {/* Abstract Art */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 opacity-80">
            <Image
              src="/assets/catalog-art.png"
              alt="Catalog Art"
              fill
              className="object-contain dark:invert"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Filters */}
        <div className="mb-12 flex justify-center">
          <div className="bg-background border border-border p-1 inline-block">
            <FilterBar
              contentType={contentType}
              moodTag={moodTag}
              onContentTypeChange={setContentType}
              onMoodTagChange={setMoodTag}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-mono text-sm">LOADING_DATA...</p>
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border p-12">
            <Music className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">NO_SESSIONS_FOUND</h3>
            <p className="text-muted-foreground mb-6 font-light">
              {sessions.length === 0
                ? 'Be the first to upload a session.'
                : 'Try adjusting your filters.'}
            </p>
            {sessions.length === 0 && (
              <Link href="/studio">
                <Button variant="outline" className="rounded-none border-foreground hover:bg-foreground hover:text-background">Go to Studio</Button>
              </Link>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between px-2 border-b border-border pb-2">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {filteredSessions.length} {filteredSessions.length === 1 ? 'TRACK' : 'TRACKS'} AVAILABLE
              </p>
            </div>

            <div className="grid gap-px bg-border border border-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSessions.map((session) => (
                <div key={session.id} className="bg-background p-6 hover:bg-secondary/20 transition-colors">
                  <VinylTrack
                    id={session.id}
                    title={session.title}
                    artist={session.owner.displayName || truncateAddress(session.owner.walletAddress)}
                    price={formatPrice(session.priceUsd)}
                    audioUrl={session.audioUrl}
                  />
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
    <AuthGate>
      <AppShell>
        <CatalogPage />
      </AppShell>
    </AuthGate>
  )
}
