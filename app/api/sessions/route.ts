import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { registerSessionAsIp } from '@/lib/story'
import { ContentType } from '@/lib/types'
import { parseMoodTags, stringifyMoodTags } from '@/lib/utils'
import { Address } from 'viem'

/**
 * GET /api/sessions
 * Get all sessions for the catalog
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentType = searchParams.get('contentType') as ContentType | null
    const moodTag = searchParams.get('moodTag')

    // Build where clause for filtering
    const where: any = {}

    if (contentType) {
      where.contentType = contentType
    }

    if (moodTag) {
      // SQLite JSON search workaround - filter in memory after fetch
      // In production with PostgreSQL, use proper JSON operators
    }

    const sessions = await prisma.session.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
          },
        },
        collection: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            licenses: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Filter by mood tag if provided (SQLite workaround)
    let filteredSessions = sessions
    if (moodTag) {
      filteredSessions = sessions.filter((session) => {
        const tags = parseMoodTags(session.moodTags)
        return tags.some((tag) => tag.toLowerCase().includes(moodTag.toLowerCase()))
      })
    }

    // Parse mood tags for response
    const formattedSessions = filteredSessions.map((session) => ({
      ...session,
      moodTags: parseMoodTags(session.moodTags),
      licenseCount: session._count.licenses,
    }))

    return NextResponse.json(formattedSessions)
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/sessions
 * Create a new session and register it as IP on Story Protocol
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      ownerId,
      title,
      description,
      contentType,
      moodTags,
      collectionId,
      audioUrl,
      priceUsd,
      durationSec,
    } = body

    // Validation
    if (!ownerId || !title || !description || !contentType || !audioUrl || priceUsd === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get owner wallet address
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { walletAddress: true },
    })

    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      )
    }

    // Register IP on Story Protocol
    console.log('🎵 Registering session as IP on Story Protocol...')
    const { storyAssetId, txHash } = await registerSessionAsIp({
      title,
      description,
      audioUrl,
      ownerWallet: owner.walletAddress as Address,
      contentType,
      moodTags: Array.isArray(moodTags) ? moodTags : parseMoodTags(moodTags || ''),
    })

    console.log('✅ IP registered:', { storyAssetId, txHash })

    // Create session in database
    const session = await prisma.session.create({
      data: {
        ownerId,
        title,
        description,
        contentType,
        moodTags: Array.isArray(moodTags) ? stringifyMoodTags(moodTags) : moodTags || '',
        collectionId: collectionId || null,
        audioUrl,
        priceUsd,
        durationSec: durationSec || null,
        storyAssetId,
        storyTxHash: txHash,
      },
      include: {
        owner: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
          },
        },
        collection: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // Format response
    const formattedSession = {
      ...session,
      moodTags: parseMoodTags(session.moodTags),
    }

    return NextResponse.json(formattedSession, { status: 201 })
  } catch (error) {
    console.error('Failed to create session:', error)
    return NextResponse.json(
      { error: 'Failed to create session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
