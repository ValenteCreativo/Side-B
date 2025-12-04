'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserRole } from '@/lib/types'
import { Address } from 'viem'

interface User {
  id: string
  walletAddress: Address
  role: UserRole
  displayName?: string | null
  avatarUrl?: string | null
  bio?: string | null
  twitter?: string | null
  instagram?: string | null
  website?: string | null
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  login: (walletAddress: Address, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  updateRole: (role: UserRole) => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    try {
      const sessionData = localStorage.getItem('user_session')
      if (sessionData) {
        const parsedUser = JSON.parse(sessionData)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error('Failed to restore session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function login(walletAddress: Address, role: UserRole) {
    try {
      setIsLoading(true)

      // Call API to create/get user
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, role }),
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      const userData = await response.json()

      // Save to state and localStorage
      setUser(userData)
      localStorage.setItem('user_session', JSON.stringify(userData))
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    setUser(null)
    localStorage.removeItem('user_session')
    localStorage.removeItem('mock_user_session')
  }

  async function updateRole(role: UserRole) {
    if (!user) return

    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role }),
      })

      if (!response.ok) {
        throw new Error('Failed to update role')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      localStorage.setItem('user_session', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Failed to update role:', error)
      throw error
    }
  }

  async function refreshUser() {
    if (!user) return

    try {
      const response = await fetch(`/api/users/${user.id}`)
      if (!response.ok) {
        throw new Error('Failed to refresh user data')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      localStorage.setItem('user_session', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Failed to refresh user:', error)
      throw error
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateRole,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
