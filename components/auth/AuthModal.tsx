'use client'

/**
 * Authentication Modal with Coinbase Embedded Wallets
 *
 * Handles role selection and Coinbase email authentication
 */

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Music, Film, Mail, Wallet, ExternalLink } from 'lucide-react'
import { CoinbaseAuth } from './CoinbaseAuth'
import { ExternalWalletAuth } from './ExternalWalletAuth'
import { useUser } from './UserContext'
import { UserRole } from '@/lib/types'
import { Address } from 'viem'
import Link from 'next/link'

type AuthMethod = 'email' | 'wallet' | null
type Step = 'auth_method' | 'authenticate' | 'role_selection' | 'profile_setup'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultRole?: UserRole
}

export function AuthModal({ open, onOpenChange, defaultRole }: AuthModalProps) {
  const [step, setStep] = useState<Step>('auth_method')
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(defaultRole || null)
  const [authMethod, setAuthMethod] = useState<AuthMethod>(null)
  const [pendingWalletAddress, setPendingWalletAddress] = useState<string | null>(null)
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [isCheckingUser, setIsCheckingUser] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const { login, refreshUser } = useUser()

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
        setStep('role_selection')
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsCheckingUser(false)
    }
  }

  const handleRoleSelect = (role: UserRole) => {
    // Store selected role and move to profile setup
    setPendingRole(role)
    setStep('profile_setup')
  }

  const handleProfileSetup = async () => {
    if (!pendingWalletAddress || !pendingRole || !displayName.trim()) {
      return
    }

    try {
      setIsSavingProfile(true)

      // Create user with role
      await login(pendingWalletAddress as Address, pendingRole)

      // Update profile with displayName
      const userResponse = await fetch('/api/users/check', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const userData = await userResponse.json()

      if (userData.user?.id) {
        await fetch('/api/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userData.user.id,
            displayName: displayName.trim(),
          }),
        })

        // Refresh user context to get updated profile
        await refreshUser()
      }

      // Close modal and reset state
      onOpenChange(false)
      setPendingWalletAddress(null)
      setPendingRole(null)
      setDisplayName('')
      setStep('auth_method')
    } catch (error) {
      console.error('Profile setup failed:', error)
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleBack = () => {
    if (step === 'profile_setup') {
      setStep('role_selection')
    } else if (step === 'role_selection') {
      setStep('authenticate')
    } else if (step === 'authenticate') {
      setStep('auth_method')
      setAuthMethod(null)
    }
  }

  const getTitle = () => {
    switch (step) {
      case 'auth_method':
        return 'Sign in to Side B'
      case 'authenticate':
        return 'Authenticate'
      case 'role_selection':
        return 'Choose Your Role'
      case 'profile_setup':
        return 'Create Your Profile'
      default:
        return 'Sign in to Side B'
    }
  }

  const getDescription = () => {
    switch (step) {
      case 'auth_method':
        return 'Choose your preferred authentication method'
      case 'authenticate':
        return authMethod === 'email'
          ? 'Sign in or create account with your email'
          : 'Connect your existing wallet'
      case 'role_selection':
        return 'Welcome! Select your role to complete signup'
      case 'profile_setup':
        return 'Choose a username for your profile'
      default:
        return 'Choose your preferred authentication method'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        {step === 'auth_method' && (
          <div className="space-y-4">
            <div className="grid gap-4 py-4">
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-6"
                onClick={() => {
                  setAuthMethod('email')
                  setStep('authenticate')
                }}
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
                onClick={() => {
                  setAuthMethod('wallet')
                  setStep('authenticate')
                }}
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
        )}

        {step === 'authenticate' && (
          <div className="space-y-4">
            {authMethod === 'email' ? (
              <CoinbaseAuth onSuccess={handleWalletConnected} />
            ) : (
              <ExternalWalletAuth onSuccess={handleWalletConnected} />
            )}
            <Button variant="ghost" onClick={handleBack} className="w-full">
              ← Change Method
            </Button>
          </div>
        )}

        {step === 'role_selection' && (
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
        )}

        {step === 'profile_setup' && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Username *</Label>
              <Input
                id="displayName"
                placeholder="Enter your username"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isSavingProfile}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              You can add more information like profile photo, bio, and social links in{' '}
              <Link href="/settings" className="text-bronze hover:underline inline-flex items-center gap-1">
                Settings
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isSavingProfile}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleProfileSetup}
                disabled={!displayName.trim() || isSavingProfile}
                className="flex-1"
              >
                {isSavingProfile ? 'Creating Profile...' : 'Complete Signup'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
