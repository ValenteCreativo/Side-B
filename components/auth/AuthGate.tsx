'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from './UserContext'
import { getOrCreateUserFromCoinbaseAuth } from '@/lib/coinbase'
import { UserRole } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Music, Film } from 'lucide-react'

interface AuthGateProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

export function AuthGate({ children, requiredRole, redirectTo }: AuthGateProps) {
  const { user, isLoading, login } = useUser()
  const router = useRouter()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If user is authenticated but has wrong role, redirect
    if (user && requiredRole && user.role !== requiredRole && redirectTo) {
      router.push(redirectTo)
    }
  }, [user, requiredRole, redirectTo, router])

  async function handleAuth(role: UserRole) {
    try {
      setIsAuthenticating(true)
      setError(null)

      // Get or create wallet using Coinbase Embedded Wallets
      const { walletAddress } = await getOrCreateUserFromCoinbaseAuth()

      // Login with the wallet address and selected role
      await login(walletAddress, role)

    } catch (err) {
      console.error('Authentication failed:', err)
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setIsAuthenticating(false)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth prompt if not authenticated
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Side B Sessions</CardTitle>
            <CardDescription>
              Choose your role to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-4">
              <Button
                onClick={() => handleAuth('MUSICIAN')}
                disabled={isAuthenticating}
                size="lg"
                variant="default"
                className="w-full h-auto py-6 flex-col gap-2"
              >
                <Music className="h-6 w-6" />
                <div>
                  <div className="font-semibold">I'm a Musician</div>
                  <div className="text-xs font-normal opacity-90">
                    Upload and register your tracks as IP
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => handleAuth('CREATOR')}
                disabled={isAuthenticating}
                size="lg"
                variant="outline"
                className="w-full h-auto py-6 flex-col gap-2"
              >
                <Film className="h-6 w-6" />
                <div>
                  <div className="font-semibold">I'm a Creator</div>
                  <div className="text-xs font-normal opacity-90">
                    Browse and license independent music
                  </div>
                </div>
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              {isAuthenticating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Connecting wallet...
                </span>
              ) : (
                <span>
                  Powered by Coinbase Embedded Wallets & Story Protocol
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error if user has wrong role
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              This page is only accessible to {requiredRole === 'MUSICIAN' ? 'musicians' : 'creators'}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push(requiredRole === 'MUSICIAN' ? '/catalog' : '/studio')}
              className="w-full"
            >
              Go to {requiredRole === 'MUSICIAN' ? 'Catalog' : 'Studio'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is authenticated and has correct role
  return <>{children}</>
}
