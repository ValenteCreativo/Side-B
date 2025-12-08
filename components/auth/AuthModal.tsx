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
  const { login } = useUser()

  const handleWalletConnected = async (walletAddress: string) => {
    if (!selectedRole) {
      console.error('No role selected')
      return
    }

    try {
      await login(walletAddress as Address, selectedRole)
      onOpenChange(false)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleBack = () => {
    if (authMethod) {
      setAuthMethod(null)
    } else {
      setSelectedRole(null)
    }
  }

  const getTitle = () => {
    if (!selectedRole) return 'Choose Your Role'
    if (!authMethod) return 'How would you like to sign in?'
    return `Sign in as ${selectedRole === 'MUSICIAN' ? 'Musician' : 'Creator'}`
  }

  const getDescription = () => {
    if (!selectedRole) return 'Select your role to get started with Side B'
    if (!authMethod) return 'Choose your preferred authentication method'
    return authMethod === 'email'
      ? 'Create a new wallet with your email'
      : 'Connect your existing wallet'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        {!selectedRole ? (
          // Step 1: Role Selection
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
          // Step 2: Auth Method Selection
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
                    Create a new wallet automatically
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

            <Button
              variant="ghost"
              onClick={handleBack}
              className="w-full"
            >
              ← Change Role
            </Button>
          </div>
        ) : (
          // Step 3: Authentication
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
