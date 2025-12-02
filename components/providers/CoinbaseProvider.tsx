'use client'

/**
 * Coinbase CDP Provider Wrapper
 *
 * This is a client component that wraps the CDPReactProvider
 * Must be 'use client' because CDP SDK uses React hooks and context
 *
 * Following official Next.js implementation guide:
 * https://docs.cdp.coinbase.com/embedded-wallets/nextjs
 */

import { CDPReactProvider } from '@coinbase/cdp-react'
import { ReactNode } from 'react'

export function CoinbaseProvider({ children }: { children: ReactNode }) {
  const projectId = process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID || ''

  if (!projectId) {
    console.warn('⚠️  NEXT_PUBLIC_COINBASE_PROJECT_ID not configured')
  }

  return (
    <CDPReactProvider
      config={{
        projectId: projectId,
        ethereum: {
          createOnLogin: "eoa", // Create Externally Owned Account on login
        },
        appName: "Side B Sessions",
      }}
    >
      {children}
    </CDPReactProvider>
  )
}
