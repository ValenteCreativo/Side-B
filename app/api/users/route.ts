import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { UserRole } from '@/lib/types'
import { Address } from 'viem'

/**
 * GET /api/users
 * Get all users (musicians) for community page
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currentUserId = searchParams.get('currentUserId')

    const users = await prisma.user.findMany({
      select: {
        id: true,
        walletAddress: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        _count: {
          select: {
            sessions: true,
            followers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // If currentUserId is provided, check if they follow each user
    if (currentUserId) {
      const followedIds = await prisma.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
      })
      const followedSet = new Set(followedIds.map((f) => f.followingId))

      const usersWithFollowStatus = users.map((user) => ({
        ...user,
        isFollowing: followedSet.has(user.id),
      }))

      return NextResponse.json(usersWithFollowStatus)
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

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
    const { userId, role, displayName, bio, twitter, instagram, website } = body as {
      userId: string
      role?: UserRole
      displayName?: string
      bio?: string
      twitter?: string
      instagram?: string
      website?: string
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
        ...(bio !== undefined && { bio }),
        ...(twitter !== undefined && { twitter }),
        ...(instagram !== undefined && { instagram }),
        ...(website !== undefined && { website }),
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
