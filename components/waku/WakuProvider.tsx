'use client'

import { LightNodeProvider } from '@waku/react'
import { WAKU_NODE_OPTIONS } from '@/lib/waku/config'

export function WakuProvider({ children }: { children: React.ReactNode }) {
  return (
    <LightNodeProvider options={WAKU_NODE_OPTIONS}>
      {children}
    </LightNodeProvider>
  )
}
