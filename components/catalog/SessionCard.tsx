'use client'

import { useState } from 'react'
import { useUser } from '@/components/auth/UserContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { formatPrice, truncateAddress } from '@/lib/utils'
import { ShoppingCart, Check, ExternalLink } from 'lucide-react'

interface SessionCardProps {
  session: {
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
}

export function SessionCard({ session }: SessionCardProps) {
  const { user } = useUser()
  const { toast } = useToast()
  const [isLicensing, setIsLicensing] = useState(false)
  const [isLicensed, setIsLicensed] = useState(false)

  const handleLicense = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to license tracks',
        variant: 'destructive',
      })
      return
    }

    // Check if user is trying to license their own track
    if (session.owner.id === user.id) {
      toast({
        title: 'Cannot license your own track',
        description: 'You already own this session',
        variant: 'destructive',
      })
      return
    }

    setIsLicensing(true)

    try {
      const response = await fetch('/api/licenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          buyerId: user.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create license')
      }

      const license = await response.json()

      setIsLicensed(true)
      toast({
        title: '✅ License acquired!',
        description: `You can now use "${session.title}" in your projects`,
      })
    } catch (error) {
      console.error('License creation failed:', error)
      toast({
        title: 'License failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsLicensing(false)
    }
  }

  return (
    <Card className="h-full flex flex-col">
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
              by {session.owner.displayName || truncateAddress(session.owner.walletAddress)}
            </CardDescription>
          </div>

          <Badge variant="outline">
            {session.contentType.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {session.description}
        </p>

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
        <div className="flex-1">
          <audio controls className="w-full" preload="metadata">
            <source src={session.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>

        {/* Price and License Button */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div>
            <p className="text-2xl font-bold">{formatPrice(session.priceUsd)}</p>
            {session.licenseCount !== undefined && session.licenseCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {session.licenseCount} {session.licenseCount === 1 ? 'license' : 'licenses'} sold
              </p>
            )}
          </div>

          <Button
            onClick={handleLicense}
            disabled={isLicensing || isLicensed}
            className="shrink-0"
          >
            {isLicensed ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Licensed
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isLicensing ? 'Processing...' : 'License'}
              </>
            )}
          </Button>
        </div>

        {/* Story Protocol Info */}
        {session.storyAssetId && (
          <div className="rounded-md bg-primary/5 p-2.5 text-xs">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-3 w-3 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-primary">Registered IP</p>
                <p className="text-muted-foreground font-mono truncate">
                  {session.storyAssetId}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
