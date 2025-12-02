'use client'

/**
 * Coinbase CDP Provider Wrapper
 *
 * This is a client component that wraps the CDPReactProvider
 * Must be 'use client' because CDP SDK uses React hooks and context
 */

import { CDPReactProvider } from '@coinbase/cdp-react'
import { ReactNode } from 'react'

export function CoinbaseProvider({ children }: { children: ReactNode }) {
  const projectId = process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID || ''

  return (
    <CDPReactProvider
      config={{
        projectId: projectId,
        ethereum: { createOnLogin: "eoa" },
        appName: "Side B Sessions"
      }}
    >
      {children}
    </CDPReactProvider>
  )
}
