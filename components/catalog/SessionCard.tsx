'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/components/auth/UserContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { formatPrice, truncateAddress } from '@/lib/utils'
import { ShoppingCart, Check, ExternalLink, DollarSign, Download } from 'lucide-react'
import { HallidayOnrampButton } from '@/components/payments/HallidayOnrampButton'

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

  // Check if user has a license for this session
  useEffect(() => {
    const checkLicense = async () => {
      if (!user) {
        setIsLicensed(false)
        return
      }

      // User owns the track
      if (session.owner.id === user.id) {
        setIsLicensed(true)
        return
      }

      try {
        const response = await fetch(`/api/licenses?buyerId=${user.id}`)
        if (response.ok) {
          const licenses = await response.json()
          const hasLicense = licenses.some((l: any) => l.sessionId === session.id)
          setIsLicensed(hasLicense)
        }
      } catch (error) {
        console.error('Failed to check license:', error)
      }
    }

    checkLicense()
  }, [user, session.id, session.owner.id])

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
      // Step 1: Get payment details (calculates 2% platform fee split)
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          buyerId: user.id,
          buyerWalletAddress: user.walletAddress,
        }),
      })

      if (!paymentResponse.ok) {
        const error = await paymentResponse.json()
        throw new Error(error.error || 'Failed to get payment details')
      }

      const { paymentDetails } = await paymentResponse.json()

      // Step 2: Request wallet transaction via Coinbase Wallet
      // Note: This uses the Coinbase Wallet SDK to send transactions
      // The user will see a confirmation in their wallet extension/app

      if (!window.ethereum) {
        throw new Error('Coinbase Wallet not found. Please install the wallet extension.')
      }

      toast({
        title: 'Confirm in wallet',
        description: `Sending ${formatPrice(paymentDetails.total.amount)} (${formatPrice(paymentDetails.artistPayment.amount)} to artist + ${formatPrice(paymentDetails.platformFee.amount)} platform fee)`,
      })

      // For now, we'll use a simplified single transaction to the artist
      // In production, you might want to use a smart contract to split payments atomically
      // or send two separate transactions

      // Single transaction approach (artist receives full amount, platform fee handled off-chain):
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

      // Convert USD to wei (assuming 1 USD = some amount of ETH/token)
      // NOTE: In production, you'll need proper price conversion
      // For now, we'll use a placeholder that assumes direct USDC transfer
      const amountInWei = '0x' + (paymentDetails.total.amount * 1e6).toString(16) // USDC has 6 decimals

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accounts[0],
          to: paymentDetails.artistPayment.recipient,
          value: amountInWei,
          data: '0x', // No data needed for simple transfer
        }],
      })

      toast({
        title: 'Transaction sent',
        description: 'Waiting for confirmation...',
      })

      // Step 3: Confirm payment and create license
      const confirmResponse = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          buyerId: user.id,
          txHash: txHash,
        }),
      })

      if (!confirmResponse.ok) {
        const error = await confirmResponse.json()
        throw new Error(error.error || 'Failed to confirm payment')
      }

      const { license } = await confirmResponse.json()

      setIsLicensed(true)
      toast({
        title: '✅ License acquired!',
        description: `You can now use "${session.title}" in your projects. Check My Licenses to download.`,
      })

    } catch (error) {
      console.error('License creation failed:', error)

      // Handle specific wallet errors
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          toast({
            title: 'Transaction cancelled',
            description: 'You cancelled the transaction in your wallet',
          })
        } else if (error.message.includes('insufficient funds')) {
          toast({
            title: 'Insufficient funds',
            description: 'You don\'t have enough funds to complete this purchase',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'License failed',
            description: error.message,
            variant: 'destructive',
          })
        }
      } else {
        toast({
          title: 'License failed',
          description: 'Please try again',
          variant: 'destructive',
        })
      }
    } finally {
      setIsLicensing(false)
    }
  }

  return (
    <Card className="h-full flex flex-col group hover:border-bronze/50 transition-refined">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              {session.title}
              {session.collection && (
                <Badge variant="secondary" className="text-[10px] font-normal tracking-wide">
                  {session.collection.title}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1.5 font-mono text-xs">
              by {session.owner.displayName || truncateAddress(session.owner.walletAddress)}
            </CardDescription>
          </div>

          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
            {session.contentType.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-6">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {session.description}
        </p>

        {/* Mood Tags */}
        {session.moodTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {session.moodTags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-[10px] px-2 py-0.5 font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Audio Player - Free Preview for Everyone */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Free Preview
            </p>
            {isLicensed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = session.audioUrl
                  link.download = `${session.title}.mp3`
                  link.click()
                }}
                className="h-7 text-xs"
              >
                <Download className="h-3 w-3 mr-1.5" />
                Download
              </Button>
            )}
          </div>
          <audio controls className="w-full h-8" preload="metadata">
            <source src={session.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          {!isLicensed && (
            <p className="text-[10px] text-muted-foreground italic">
              License required for download & commercial use
            </p>
          )}
        </div>

        {/* Price and License Button */}
        <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-4 pt-4">
            <div>
              <p className="text-2xl font-bold tracking-tight">{formatPrice(session.priceUsd)}</p>
              {session.licenseCount !== undefined && session.licenseCount > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {session.licenseCount} {session.licenseCount === 1 ? 'license' : 'licenses'} sold
                </p>
              )}
            </div>

            <Button
              onClick={handleLicense}
              disabled={isLicensing || isLicensed}
              className="shrink-0"
              size="lg"
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

          {/* Halliday On-ramp Button */}
          {!isLicensed && (
            <HallidayOnrampButton
              suggestedAmount={session.priceUsd}
              variant="outline"
              size="sm"
              className="w-full rounded-sm border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-wider hover:border-bronze hover:text-bronze transition-colors"
            >
              <DollarSign className="h-3 w-3 mr-2" />
              Need Crypto? Buy USDC
            </HallidayOnrampButton>
          )}
        </div>

        {/* Story Protocol Info */}
        {session.storyAssetId && (
          <div className="rounded-sm bg-zinc-50 dark:bg-zinc-900 p-3 text-xs border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-3 w-3 text-bronze shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">Registered IP</p>
                <p className="text-muted-foreground font-mono truncate text-[10px]">
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
