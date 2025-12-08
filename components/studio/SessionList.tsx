"use client"

import { useEffect, useState } from 'react'
import { useUser } from '@/components/auth/UserContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatPrice, parseMoodTags, formatDuration, truncateAddress } from '@/lib/utils'
import { Music, ExternalLink } from 'lucide-react'
import { TrackCard } from './TrackCard'

interface Session {
  id: string
  title: string
  description: string
  contentType: string
  moodTags: string[]
  priceUsd: number
  audioUrl: string
  durationSec?: number | null
  storyAssetId: string | null
  storyTxHash?: string | null
  createdAt: string
  owner?: {
    id: string
    displayName: string | null
    walletAddress: string
  }
  collection?: {
    id: string
    title: string
  } | null
}

export function SessionList() {
  const { user } = useUser()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadSessions()
    }
  }, [user])

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      if (!response.ok) throw new Error('Failed to load sessions')

      const allSessions = await response.json()

      // Filter to only show current user's sessions
      const userSessions = allSessions.filter((s: any) => s.owner.id === user?.id)
      setSessions(userSessions)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-bronze border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground font-mono text-sm">LOADING_SESSIONS...</p>
        </div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50/50 dark:bg-zinc-900/50">
        <Music className="h-16 w-16 text-muted-foreground mb-6 opacity-50" />
        <h3 className="text-xl font-bold mb-2 tracking-tight">NO_SESSIONS_YET</h3>
        <p className="text-muted-foreground font-mono text-sm mb-2">Upload your first track above to get started</p>
        <p className="text-xs text-muted-foreground font-mono">Your music will appear here once uploaded</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sessions.map((session) => (
        <TrackCard
          key={session.id}
          id={session.id}
          title={session.title}
          status={session.storyAssetId ? "registered" : "pending"}
          date={formatDate(session.createdAt)}
          duration={session.durationSec ? formatDuration(session.durationSec) : "--:--"}
          storyTxHash={session.storyTxHash || undefined}
          audioUrl={session.audioUrl}
          artist={session.owner?.displayName || truncateAddress(session.owner?.walletAddress || "")}
        />
      ))}
    </div>
  )
}
