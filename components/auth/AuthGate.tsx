'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from './UserContext'
import { UserRole } from '@/lib/types'
import { AuthModal } from './AuthModal'

interface AuthGateProps {
  children: React.ReactNode
  requiredRole?: UserRole
  redirectTo?: string
}

export function AuthGate({ children, requiredRole, redirectTo }: AuthGateProps) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // If user is authenticated but has wrong role, redirect
    if (user && requiredRole && user.role !== requiredRole && redirectTo) {
      router.push(redirectTo)
    }

    // Show auth modal if not authenticated
    if (!isLoading && !user) {
      setShowAuthModal(true)
    }
  }, [user, requiredRole, redirectTo, router, isLoading])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth modal if not authenticated
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
        <AuthModal
          open={showAuthModal}
          onOpenChange={setShowAuthModal}
          defaultRole={requiredRole}
        />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to Side B Sessions</h2>
          <p className="text-muted-foreground">Please sign in to continue</p>
        </div>
      </div>
    )
  }

  // User is authenticated and has correct role
  return <>{children}</>
}
