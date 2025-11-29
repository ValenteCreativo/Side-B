import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { Address } from 'viem'

/**
 * POST /api/users
 * Create or retrieve a user by wallet address
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, role } = body as { walletAddress: Address; role: UserRole }

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Upsert user (create if doesn't exist, return if exists)
    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: {
        // Update role if provided
        ...(role && { role }),
      },
      create: {
        walletAddress,
        role: role || 'MUSICIAN',
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to create/get user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/users
 * Update user role or profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, role, displayName } = body as {
      userId: string
      role?: UserRole
      displayName?: string
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(role && { role }),
        ...(displayName !== undefined && { displayName }),
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
