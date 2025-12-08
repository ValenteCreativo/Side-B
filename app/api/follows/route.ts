import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validateRequest, followSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

/**
 * POST /api/follows
 * Follow a user
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body with Zod
    const validation = await validateRequest(request, followSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { followerId, followingId } = validation.data

    if (followerId === followingId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
      include: {
        follower: {
          select: {
            displayName: true,
          },
        },
      },
    })

    // Create notification for user being followed
    await prisma.notification.create({
      data: {
        userId: followingId,
        type: 'FOLLOW',
        title: 'New follower!',
        message: `${follow.follower.displayName || 'Someone'} started following you`,
        link: `/profile/${followerId}`,
      },
    })

    return NextResponse.json(follow)
  } catch (error: any) {
    // Handle unique constraint violation (already following)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 400 }
      )
    }

    console.error('Failed to follow user:', error)
    return NextResponse.json(
      { error: 'Failed to follow user' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/follows
 * Unfollow a user
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { followerId, followingId } = body as {
      followerId: string
      followingId: string
    }

    if (!followerId || !followingId) {
      return NextResponse.json(
        { error: 'Follower ID and Following ID are required' },
        { status: 400 }
      )
    }

    // Delete follow relationship
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to unfollow user:', error)
    return NextResponse.json(
      { error: 'Failed to unfollow user' },
      { status: 500 }
    )
  }
}
