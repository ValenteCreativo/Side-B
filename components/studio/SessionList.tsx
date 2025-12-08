"use client"

import { useEffect, useState } from 'react'
import { useUser } from '@/components/auth/UserContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatPrice, parseMoodTags, formatDuration } from '@/lib/utils'
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
      <Card>
        <CardHeader>
          <CardTitle>Your Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Sessions</CardTitle>
          <CardDescription>
            Upload your first track to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Music className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No sessions yet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-wide text-foreground/80">Your Sessions</h2>
        <Badge variant="outline" className="font-mono text-xs border-white/10 text-muted-foreground">
          {sessions.length} TRACKS
        </Badge>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {sessions.map((session) => (
          <div key={session.id} className="h-[280px]">
            <TrackCard
              id={session.id}
              title={session.title}
              status={session.storyAssetId ? "registered" : "pending"}
              date={formatDate(session.createdAt)}
              duration={session.durationSec ? formatDuration(session.durationSec) : "--:--"}
              storyTxHash={session.storyTxHash || undefined}
              audioUrl={session.audioUrl}
              artist={session.owner?.displayName || "Unknown Artist"}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
