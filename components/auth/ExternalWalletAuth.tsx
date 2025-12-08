'use client'

/**
 * External Wallet Authentication Component
 *
 * Allows users to connect existing wallets (MetaMask, WalletConnect, etc.)
 * instead of creating a new embedded wallet
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Wallet, Loader2 } from 'lucide-react'

interface ExternalWalletAuthProps {
  onSuccess: (walletAddress: string) => void
}

export function ExternalWalletAuth({ onSuccess }: ExternalWalletAuthProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null)
  const { toast } = useToast()

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        })
        if (accounts.length > 0) {
          setConnectedAddress(accounts[0])
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: 'No wallet detected',
        description: 'Please install MetaMask or another Web3 wallet',
        variant: 'destructive',
      })
      return
    }

    setIsConnecting(true)
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]
      setConnectedAddress(address)

      // Verify we're on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })

      toast({
        title: 'Wallet connected',
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      })

      onSuccess(address)
    } catch (error: any) {
      console.error('Error connecting wallet:', error)

      let errorMessage = 'Failed to connect wallet'
      if (error.code === 4001) {
        errorMessage = 'Connection request rejected'
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending. Check your wallet.'
      }

      toast({
        title: 'Connection failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // If already connected, show success
  if (connectedAddress) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="text-green-500">Wallet Connected</CardTitle>
          <CardDescription>
            {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => onSuccess(connectedAddress)}
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
        <CardTitle>Connect Your Wallet</CardTitle>
        <CardDescription>
          Connect an existing wallet with funds to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={connectWallet}
          className="w-full"
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Supports MetaMask, Coinbase Wallet, WalletConnect, and more
        </p>
      </CardContent>
    </Card>
  )
}
