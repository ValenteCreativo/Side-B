import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { registerSessionAsIp } from '@/lib/story'
import { ContentType } from '@/lib/types'
import { parseMoodTags, stringifyMoodTags } from '@/lib/utils'
import { validateRequest, createSessionSchema } from '@/lib/validations'
import { apiLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit'
import { Address } from 'viem'

// Cache catalog sessions for 30 seconds (public data, frequently accessed)
export const revalidate = 30

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
    const validation = await validateRequest(request, createSessionSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

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
      commercialUse,
    } = validation.data

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
        commercialUse,
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
