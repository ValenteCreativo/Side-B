import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { parseMoodTags } from '@/lib/utils'

/**
 * GET /api/sessions/[id]
 * Get a single session by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
            role: true,
          },
        },
        collection: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        licenses: {
          select: {
            id: true,
            createdAt: true,
            buyer: {
              select: {
                id: true,
                walletAddress: true,
                displayName: true,
              },
            },
          },
        },
      },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Format response
    const formattedSession = {
      ...session,
      moodTags: parseMoodTags(session.moodTags),
    }

    return NextResponse.json(formattedSession)
  } catch (error) {
    console.error('Failed to fetch session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    )
  }
}
