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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Music className="h-6 w-6" />
            Side B Sessions
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm">
              <p className="text-muted-foreground">Signed in as</p>
              <p className="font-medium font-mono">
                {user?.displayName || truncateAddress(user?.walletAddress || '')}
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Studio</h1>
          <p className="text-muted-foreground">
            Upload your rehearsals and finished tracks. Each one is registered as IP on Story Protocol.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Upload Form */}
          <div>
            <UploadSessionForm onSuccess={handleUploadSuccess} />
          </div>

          {/* Session List */}
          <div key={refreshKey}>
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
