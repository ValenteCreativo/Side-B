'use client'

import { useState } from 'react'
import { useUser } from '@/components/auth/UserContext'
import { UploadSessionForm } from '@/components/studio/UploadSessionForm'
import { SessionList } from '@/components/studio/SessionList'
import { Button } from '@/components/ui/button'
import { truncateAddress } from '@/lib/utils'
import { LogOut, Music, Mic2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AppShell } from '@/components/layout/AppShell'
import { PageHero } from '@/components/ui/PageHero'
import { VinylFlip } from '@/components/ui/VinylFlip'

function StudioPage() {
  const { user, logout } = useUser()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = () => {
    // Trigger refresh of session list
    setRefreshKey(prev => prev + 1)
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <PageHero
          title="YOUR STUDIO"
          subtitle="COMMAND_CENTER"
          description="Upload your sound. Register your ownership. Monetize your craft."
          sideText="SIDE B"
        >
          <VinylFlip flippable={false}
            className="w-64 h-64 ml-auto"
            front={
              <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                <Mic2 className="w-32 h-32" />
              </div>
            }
            back={
              <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
                <span className="font-mono text-sm font-bold tracking-widest text-bronze">
                  RECORD
                  <br />
                  UPLOAD
                  <br />
                  EARN
                </span>
              </div>
            }
          />
        </PageHero>
        <div className="container mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground font-mono">PLEASE_SIGN_IN_TO_VIEW_STUDIO</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <PageHero
        title="YOUR STUDIO"
        subtitle="COMMAND_CENTER"
        description="Upload your sound. Register your ownership. Monetize your craft."
        sideText="SIDE A"
      >
        <VinylFlip flippable={false}
          className="w-64 h-64 ml-auto"
          front={
            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
              <Mic2 className="w-32 h-32" />
            </div>
          }
          back={
            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
              <span className="font-mono text-sm font-bold tracking-widest text-bronze">
                RECORD
                <br />
                UPLOAD
                <br />
                EARN
              </span>
            </div>
          }
        />
      </PageHero>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[400px_1fr]">
          {/* Upload Form - Floating Panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-background border border-zinc-200 dark:border-zinc-800 p-1 shadow-refined rounded-md">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-t-sm">
                <h3 className="font-bold uppercase tracking-widest text-sm text-bronze">New Session</h3>
              </div>
              <div className="p-4">
                <UploadSessionForm onSuccess={handleUploadSuccess} />
              </div>
            </div>
          </div>

          {/* Session List */}
          <div key={refreshKey} className="min-h-[500px]">
            <div className="mb-8 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <h2 className="text-2xl font-bold tracking-tight uppercase">Your Sessions</h2>
              <div className="h-1.5 w-1.5 bg-bronze rounded-full animate-pulse" />
            </div>
            <SessionList />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function StudioPageWithAuth() {
  return (
    <AppShell>
      <StudioPage />
    </AppShell>
  )
}
