import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/follows
 * Follow a user
 */
export async function POST(request: NextRequest) {
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
