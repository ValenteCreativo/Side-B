'use client'

/**
 * Authentication Modal with Coinbase Embedded Wallets
 *
 * Handles role selection and Coinbase email authentication
 */

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Music, Film } from 'lucide-react'
import { CoinbaseAuth } from './CoinbaseAuth'
import { useUser } from './UserContext'
import { UserRole } from '@/lib/types'
import { Address } from 'viem'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultRole?: UserRole
}

export function AuthModal({ open, onOpenChange, defaultRole }: AuthModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(defaultRole || null)
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
    setSelectedRole(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {!selectedRole ? 'Choose Your Role' : `Sign in as ${selectedRole === 'MUSICIAN' ? 'Musician' : 'Creator'}`}
          </DialogTitle>
          <DialogDescription>
            {!selectedRole
              ? 'Select your role to get started with Side B Sessions'
              : 'Connect your wallet to continue'
            }
          </DialogDescription>
        </DialogHeader>

        {!selectedRole ? (
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
        ) : (
          <div className="space-y-4">
            <CoinbaseAuth onSuccess={handleWalletConnected} />
            <Button
              variant="ghost"
              onClick={handleBack}
              className="w-full"
            >
              Change Role
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
