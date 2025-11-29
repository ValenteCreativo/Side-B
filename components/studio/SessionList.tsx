'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/components/auth/UserContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatPrice, parseMoodTags } from '@/lib/utils'
import { Music, ExternalLink } from 'lucide-react'

interface Session {
  id: string
  title: string
  description: string
  contentType: string
  moodTags: string[]
  priceUsd: number
  audioUrl: string
  storyAssetId: string | null
  createdAt: string
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Sessions</h2>
        <p className="text-sm text-muted-foreground">{sessions.length} tracks</p>
      </div>

      <div className="grid gap-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {session.title}
                    {session.collection && (
                      <Badge variant="secondary" className="text-xs font-normal">
                        {session.collection.title}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    {session.description}
                  </CardDescription>
                </div>

                <Badge variant="outline">
                  {session.contentType.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Mood Tags */}
              {session.moodTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {session.moodTags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Audio Player */}
              <audio controls className="w-full" preload="metadata">
                <source src={session.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-medium">{formatPrice(session.priceUsd)}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Uploaded</p>
                  <p className="font-medium">{formatDate(session.createdAt)}</p>
                </div>
              </div>

              {/* Story Protocol Info */}
              {session.storyAssetId && (
                <div className="rounded-md bg-primary/5 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-primary">Registered on Story Protocol</p>
                      <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
                        Asset ID: {session.storyAssetId}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
