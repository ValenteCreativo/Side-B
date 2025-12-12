'use client'

/**
 * Authentication Modal with Coinbase Embedded Wallets
 *
 * Handles role selection and Coinbase email authentication
 */

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Music, Film, Mail, Wallet } from 'lucide-react'
import { CoinbaseAuth } from './CoinbaseAuth'
import { ExternalWalletAuth } from './ExternalWalletAuth'
import { useUser } from './UserContext'
import { UserRole } from '@/lib/types'
import { Address } from 'viem'

type AuthMethod = 'email' | 'wallet' | null

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultRole?: UserRole
}

export function AuthModal({ open, onOpenChange, defaultRole }: AuthModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(defaultRole || null)
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null)
  const [pendingWalletAddress, setPendingWalletAddress] = useState<string | null>(null)
  const [isCheckingUser, setIsCheckingUser] = useState(false)
  const { login } = useUser()

  const handleWalletConnected = async (walletAddress: string) => {
    try {
      setIsCheckingUser(true)

      // Check if user already exists
      const checkResponse = await fetch(`/api/users/check?address=${walletAddress}`)
      const checkData = await checkResponse.json()

      if (checkData.exists && checkData.user) {
        // Existing user - login directly
        await login(walletAddress as Address, checkData.user.role)
        onOpenChange(false)
      } else {
        // New user - show role selection
        setPendingWalletAddress(walletAddress)
        setAuthMethod(null) // Go back to show role selection
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsCheckingUser(false)
    }
  }

  const handleRoleSelect = async (role: UserRole) => {
    if (pendingWalletAddress) {
      // Complete signup for new user
      try {
        await login(pendingWalletAddress as Address, role)
        onOpenChange(false)
        setPendingWalletAddress(null)
      } catch (error) {
        console.error('Signup failed:', error)
      }
    } else {
      // Just select role for initial flow
      setSelectedRole(role)
    }
  }

  const handleBack = () => {
    if (pendingWalletAddress) {
      // User is in signup flow, go back to auth
      setPendingWalletAddress(null)
      setAuthMethod('email') // or remember which method they used
    } else if (authMethod) {
      setAuthMethod(null)
    }
  }

  const getTitle = () => {
    if (pendingWalletAddress) return 'Choose Your Role'
    if (!authMethod) return 'Sign in to Side B'
    return 'Authenticate'
  }

  const getDescription = () => {
    if (pendingWalletAddress) return 'Welcome! Select your role to complete signup'
    if (!authMethod) return 'Choose your preferred authentication method'
    return authMethod === 'email'
      ? 'Sign in or create account with your email'
      : 'Connect your existing wallet'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        {pendingWalletAddress ? (
          // New user - Role Selection after authentication
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-6"
              onClick={() => handleRoleSelect('MUSICIAN')}
            >
              <Music className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">Musician</div>
                <div className="text-xs text-muted-foreground">
                  Upload and register your music as IP
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex-col gap-2 p-6"
              onClick={() => handleRoleSelect('CREATOR')}
            >
              <Film className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">Creator</div>
                <div className="text-xs text-muted-foreground">
                  Browse and license music for your projects
                </div>
              </div>
            </Button>
          </div>
        ) : !authMethod ? (
          // Step 1: Auth Method Selection (first screen for all users)
          <div className="space-y-4">
            <div className="grid gap-4 py-4">
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-6"
                onClick={() => setAuthMethod('email')}
              >
                <Mail className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Sign in with Email</div>
                  <div className="text-xs text-muted-foreground">
                    Login or create account with email
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-6"
                onClick={() => setAuthMethod('wallet')}
              >
                <Wallet className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-semibold">Connect Existing Wallet</div>
                  <div className="text-xs text-muted-foreground">
                    Use MetaMask, Coinbase Wallet, or WalletConnect
                  </div>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          // Step 2: Authentication
          <div className="space-y-4">
            {authMethod === 'email' ? (
              <CoinbaseAuth onSuccess={handleWalletConnected} />
            ) : (
              <ExternalWalletAuth onSuccess={handleWalletConnected} />
            )}
            <Button
              variant="ghost"
              onClick={handleBack}
              className="w-full"
            >
              ← Change Method
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
