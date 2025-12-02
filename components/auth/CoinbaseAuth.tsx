'use client'

/**
 * Coinbase Embedded Wallets Authentication Component
 *
 * Provides email-based authentication using Coinbase Developer Platform
 * Users sign in with email/OTP and automatically get an Ethereum wallet
 */

import { useState, useEffect } from 'react'
import { useSignInWithEmail, useVerifyEmailOTP, useIsSignedIn, useCurrentUser, useEvmAddress } from '@coinbase/cdp-hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface CoinbaseAuthProps {
  onSuccess: (walletAddress: string) => void
}

export function CoinbaseAuth({ onSuccess }: CoinbaseAuthProps) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [flowId, setFlowId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { signInWithEmail } = useSignInWithEmail()
  const { verifyEmailOTP } = useVerifyEmailOTP()
  const { isSignedIn } = useIsSignedIn()
  const { user } = useCurrentUser()
  const { evmAddress } = useEvmAddress()
  const { toast } = useToast()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await signInWithEmail({ email })

      if (result.flowId) {
        setFlowId(result.flowId)
        toast({
          title: 'OTP sent',
          description: `Check your email at ${email} for the verification code`,
        })
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      toast({
        title: 'Failed to send OTP',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp || !flowId) {
      toast({
        title: 'Verification code required',
        description: 'Please enter the code from your email',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      await verifyEmailOTP({ flowId, otp })

      toast({
        title: 'Authentication successful',
        description: 'Your wallet has been created',
      })

      // Wait a moment for the wallet address to be available
      setTimeout(() => {
        // The address will be available via useEvmAddress hook
      }, 1000)
    } catch (error) {
      console.error('Error verifying OTP:', error)
      toast({
        title: 'Verification failed',
        description: error instanceof Error ? error.message : 'Invalid code. Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Use effect to trigger onSuccess when wallet address becomes available
  useEffect(() => {
    if (isSignedIn && evmAddress) {
      onSuccess(evmAddress)
    }
  }, [isSignedIn, evmAddress, onSuccess])

  // If already signed in, show success
  if (isSignedIn && evmAddress) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="text-green-500">Wallet Connected</CardTitle>
          <CardDescription>
            {evmAddress.slice(0, 6)}...{evmAddress.slice(-4)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => onSuccess(evmAddress)}
            className="w-full"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in with Email</CardTitle>
        <CardDescription>
          {!flowId
            ? "Enter your email to receive a verification code"
            : "Enter the 6-digit code sent to your email"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!flowId ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isLoading}
                maxLength={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                Code sent to {email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFlowId(null)
                  setOtp('')
                }}
                disabled={isLoading}
                className="w-full"
              >
                Change Email
              </Button>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
