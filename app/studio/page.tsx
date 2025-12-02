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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambient Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-drift" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-3xl animate-breathe animation-delay-2000" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight hover:opacity-80 transition-opacity">
            <Music className="h-5 w-5 text-primary" />
            <span>Side B Sessions</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Signed in as</p>
              <p className="font-medium font-mono text-sm text-foreground/80">
                {user?.displayName || truncateAddress(user?.walletAddress || '')}
              </p>
            </div>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Your Studio</h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-light">
            Upload your rehearsals and finished tracks. Each one is registered as IP on Story Protocol.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[400px_1fr]">
          {/* Upload Form - Floating Panel */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="relative">
              {/* Tension Wire Visuals */}
              <div className="absolute -top-12 left-8 w-px h-12 bg-gradient-to-b from-transparent to-white/20" />
              <div className="absolute -top-12 right-8 w-px h-12 bg-gradient-to-b from-transparent to-white/20" />

              <div className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl">
                <UploadSessionForm onSuccess={handleUploadSuccess} />
              </div>
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
    <AuthGate requiredRole="MUSICIAN" redirectTo="/catalog">
      <StudioPage />
    </AuthGate>
  )
}
