import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { UserRole } from '@/lib/types'
import { Address } from 'viem'
import { validateRequest, createUserSchema, updateUserSchema } from '@/lib/validations'
import { apiLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit'

/**
 * GET /api/users
 * Get all users (musicians) for community page
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currentUserId = searchParams.get('currentUserId')
    const search = searchParams.get('search')

    // Build where clause for search
    const whereClause = search ? {
      OR: [
        { displayName: { contains: search, mode: 'insensitive' as const } },
        { walletAddress: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {}

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        walletAddress: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        role: true,
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
      take: search ? 10 : undefined, // Limit search results
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
    // Rate limiting: 30 requests per minute per IP
    const identifier = getClientIdentifier(request)
    const rateLimitResult = await checkRateLimit(apiLimiter, identifier)

    if (rateLimitResult && !rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          limit: rateLimitResult.limit,
          reset: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit?.toString() || '',
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
            'X-RateLimit-Reset': rateLimitResult.reset?.toString() || '',
          }
        }
      )
    }

    // Validate request body with Zod
    const validation = await validateRequest(request, createUserSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { walletAddress, role, ...optionalFields } = validation.data

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
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/users
 * Delete user profile and all related data
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Delete user and all related data (cascade delete)
    // Prisma will handle cascade deletes based on schema relationships
    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
