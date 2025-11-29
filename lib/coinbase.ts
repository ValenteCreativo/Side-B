/**
 * Coinbase Embedded Wallets Integration
 *
 * Official Documentation:
 * - https://docs.cdp.coinbase.com/
 * - https://docs.cdp.coinbase.com/wallet-sdk/docs/welcome
 *
 * This module handles user authentication and wallet creation using
 * Coinbase's Embedded Wallets for seamless Web3 onboarding.
 */

import { Address } from 'viem'

export interface UserAuthResult {
  walletAddress: Address
  email?: string
  userId?: string
}

/**
 * Initialize Coinbase Embedded Wallets SDK
 *
 * Reference: https://docs.cdp.coinbase.com/wallet-sdk/docs/installing
 *
 * TODO: Replace this mock implementation with real Coinbase Embedded Wallets integration
 */
function initializeCoinbaseSDK() {
  const apiKey = process.env.COINBASE_API_KEY
  const projectId = process.env.COINBASE_PROJECT_ID

  if (!apiKey || !projectId) {
    console.warn('⚠️  Coinbase Embedded Wallets not configured. Using mock authentication.')
    return null
  }

  // TODO: Initialize actual Coinbase SDK
  // import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
  //
  // const sdk = new CoinbaseWalletSDK({
  //   appName: 'Side B Sessions',
  //   appLogoUrl: 'https://yourapp.com/logo.png',
  //   darkMode: true
  // })
  //
  // return sdk

  return null
}

/**
 * Get or create user wallet using Coinbase Embedded Wallets
 *
 * Flow:
 * 1. User initiates sign-in
 * 2. Coinbase SDK handles wallet creation/retrieval
 * 3. Return wallet address and optional email
 *
 * Reference: https://docs.cdp.coinbase.com/wallet-sdk/docs/web3-onboard
 */
export async function getOrCreateUserFromCoinbaseAuth(): Promise<UserAuthResult> {
  const sdk = initializeCoinbaseSDK()

  // Development mode: Use mock authentication
  if (!sdk) {
    console.log('🔐 Mock authentication - generating random wallet')

    // Generate a deterministic "wallet" for development
    // In production, this would come from Coinbase
    const mockWallet = generateMockWallet()

    return {
      walletAddress: mockWallet.address,
      email: mockWallet.email,
      userId: mockWallet.userId,
    }
  }

  try {
    // TODO: Implement actual Coinbase authentication flow
    //
    // const provider = sdk.makeWeb3Provider()
    // const accounts = await provider.request({
    //   method: 'eth_requestAccounts'
    // })
    //
    // const walletAddress = accounts[0] as Address
    //
    // // Optionally get user email if available
    // const userInfo = await sdk.getUserInfo()
    //
    // return {
    //   walletAddress,
    //   email: userInfo?.email,
    //   userId: userInfo?.id
    // }

    // Placeholder return
    return {
      walletAddress: '0x0000000000000000000000000000000000000000' as Address,
      email: 'user@example.com',
    }
  } catch (error) {
    console.error('Coinbase authentication failed:', error)
    throw new Error('Failed to authenticate with Coinbase Embedded Wallets')
  }
}

/**
 * Sign out user and clear Coinbase session
 */
export async function signOutCoinbaseUser(): Promise<void> {
  const sdk = initializeCoinbaseSDK()

  if (!sdk) {
    console.log('🔐 Mock sign out')
    // Clear local session state
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_user_session')
    }
    return
  }

  try {
    // TODO: Implement actual sign out
    // await sdk.disconnect()
    console.log('Signed out successfully')
  } catch (error) {
    console.error('Sign out failed:', error)
  }
}

/**
 * Check if user is currently authenticated
 */
export async function isUserAuthenticated(): Promise<boolean> {
  const sdk = initializeCoinbaseSDK()

  if (!sdk) {
    // Check mock session in development
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('mock_user_session')
    }
    return false
  }

  try {
    // TODO: Implement actual authentication check
    // const provider = sdk.makeWeb3Provider()
    // const accounts = await provider.request({ method: 'eth_accounts' })
    // return accounts.length > 0

    return false
  } catch (error) {
    return false
  }
}

// ============================================================================
// Development Helpers (Remove in production)
// ============================================================================

/**
 * Generate a mock wallet for development
 * This simulates the Coinbase wallet creation flow
 */
function generateMockWallet(): { address: Address; email: string; userId: string } {
  if (typeof window !== 'undefined') {
    // Check if we have a stored session
    const stored = localStorage.getItem('mock_user_session')
    if (stored) {
      return JSON.parse(stored)
    }

    // Create new mock session
    const mockData = {
      address: `0x${Math.random().toString(16).substring(2, 42).padEnd(40, '0')}` as Address,
      email: `user${Math.floor(Math.random() * 10000)}@mock.local`,
      userId: `mock-user-${Date.now()}`,
    }

    localStorage.setItem('mock_user_session', JSON.stringify(mockData))
    return mockData
  }

  // Server-side fallback
  return {
    address: '0x0000000000000000000000000000000000000000' as Address,
    email: 'server@mock.local',
    userId: 'server-mock',
  }
}

/**
 * Clear mock session (development only)
 */
export function clearMockSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('mock_user_session')
  }
}
