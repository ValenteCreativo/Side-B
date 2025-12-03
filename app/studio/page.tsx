'use client'

import { useState } from 'react'
import { AuthGate } from '@/components/auth/AuthGate'
import { useUser } from '@/components/auth/UserContext'
import { UploadSessionForm } from '@/components/studio/UploadSessionForm'
import { SessionList } from '@/components/studio/SessionList'
import { Button } from '@/components/ui/button'
import { truncateAddress } from '@/lib/utils'
import { LogOut, Music } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AppShell } from '@/components/layout/AppShell'

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

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 border-b border-border">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">YOUR STUDIO</h1>
            <p className="text-xl font-light text-muted-foreground max-w-lg">
              Upload. Register. Monetize. <br />
              Your creative command center.
            </p>
          </div>

          {/* Abstract Art */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 opacity-80">
            <Image
              src="/assets/studio-art.png"
              alt="Studio Art"
              fill
              className="object-contain dark:invert"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[400px_1fr]">
          {/* Upload Form - Floating Panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-background border border-border p-1 shadow-xl">
              <UploadSessionForm onSuccess={handleUploadSuccess} />
            </div>
          </div>

          {/* Session List */}
          <div key={refreshKey} className="min-h-[500px]">
            <SessionList />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function StudioPageWithAuth() {
  return (
    <AuthGate>
      <AppShell>
        <StudioPage />
      </AppShell>
    </AuthGate>
  )
}
