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

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambient Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl animate-drift animation-delay-1000" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-3xl animate-breathe" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity">
            <Music className="h-5 w-5 text-primary" />
            <span>Side B Sessions</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Signed in as</p>
              <p className="font-medium font-mono text-sm text-foreground/80">
                {user?.displayName || truncateAddress(user?.walletAddress || '')}
              </p>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">The Catalog</h1>
          <p className="text-lg text-muted-foreground font-light">
            Browse and license tracks from independent musicians. <br />
            All works are registered as IP on Story Protocol.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex justify-center">
          <div className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-xl inline-block">
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
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading catalog...</p>
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Music className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-medium mb-2">No sessions found</h3>
            <p className="text-muted-foreground mb-6">
              {sessions.length === 0
                ? 'Be the first to upload a session!'
                : 'Try adjusting your filters'}
            </p>
            {sessions.length === 0 && (
              <Link href="/studio">
                <Button variant="outline" className="rounded-full">Go to Studio</Button>
              </Link>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between px-2">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {filteredSessions.length} {filteredSessions.length === 1 ? 'track' : 'tracks'} available
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSessions.map((session) => (
                <VinylTrack
                  key={session.id}
                  title={session.title}
                  artist={session.owner.displayName || truncateAddress(session.owner.walletAddress)}
                  price={formatPrice(session.priceUsd)}
                  onPlay={() => {
                    const audio = new Audio(session.audioUrl)
                    audio.play()
                  }}
                />
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
    <AuthGate requiredRole="CREATOR" redirectTo="/studio">
      <CatalogPage />
    </AuthGate>
  )
}
