import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { parseMoodTags } from '@/lib/utils'

/**
 * GET /api/users/[id]
 * Get a specific user's profile with stats
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const searchParams = request.nextUrl.searchParams
    const currentUserId = searchParams.get('currentUserId')

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        walletAddress: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        twitter: true,
        instagram: true,
        website: true,
        createdAt: true,
        sessions: {
          select: {
            id: true,
            title: true,
            description: true,
            contentType: true,
            moodTags: true,
            priceUsd: true,
            audioUrl: true,
            storyAssetId: true,
            storyTxHash: true,
            createdAt: true,
            _count: {
              select: {
                licenses: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            sessions: true,
            followers: true,
            following: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // If currentUserId is provided, check if they follow this user
    let isFollowing = false
    if (currentUserId && currentUserId !== id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: id,
          },
        },
      })
      isFollowing = !!follow
    }

    // Parse moodTags for all sessions from JSON string to array
    const formattedUser = {
      ...user,
      sessions: user.sessions.map(session => ({
        ...session,
        moodTags: parseMoodTags(session.moodTags),
      })),
      isFollowing,
    }

    return NextResponse.json(formattedUser)
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
