'use client'

import { useEffect, useState } from 'react'
import { AuthGate } from '@/components/auth/AuthGate'
import { useUser } from '@/components/auth/UserContext'
import { FilterBar } from '@/components/catalog/FilterBar'
import { SessionCard } from '@/components/catalog/SessionCard'
import { Button } from '@/components/ui/button'
import { truncateAddress } from '@/lib/utils'
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Music className="h-6 w-6" />
            Side B Sessions
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm">
              <p className="text-muted-foreground">Signed in as</p>
              <p className="font-medium font-mono">
                {user?.displayName || truncateAddress(user?.walletAddress || '')}
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Independent Music</h1>
          <p className="text-muted-foreground">
            Browse and license tracks from independent musicians. All works are registered as IP on Story Protocol.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterBar
            contentType={contentType}
            moodTag={moodTag}
            onContentTypeChange={setContentType}
            onMoodTagChange={setMoodTag}
            onClearFilters={handleClearFilters}
          />
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
            <Music className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No sessions found</h3>
            <p className="text-muted-foreground mb-6">
              {sessions.length === 0
                ? 'Be the first to upload a session!'
                : 'Try adjusting your filters'}
            </p>
            {sessions.length === 0 && (
              <Link href="/studio">
                <Button>Go to Studio</Button>
              </Link>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredSessions.length} {filteredSessions.length === 1 ? 'track' : 'tracks'} available
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
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
