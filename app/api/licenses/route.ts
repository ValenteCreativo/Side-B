import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validateRequest, createLicenseSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

/**
 * POST /api/licenses
 * Create a new license (non-exclusive) for a session
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request body with Zod
    const validation = await validateRequest(request, createLicenseSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { sessionId, buyerId } = validation.data

    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true, title: true, priceUsd: true },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Check if license already exists (prevent duplicates)
    const existingLicense = await prisma.license.findUnique({
      where: {
        sessionId_buyerId: {
          sessionId,
          buyerId,
        },
      },
    })

    if (existingLicense) {
      return NextResponse.json(
        { error: 'You already have a license for this session' },
        { status: 400 }
      )
    }

    // TODO: Process payment here
    // For hackathon, we're skipping payment processing
    // In production, integrate with payment provider (Stripe, crypto payment, etc.)

    // Create license
    const license = await prisma.license.create({
      data: {
        sessionId,
        buyerId,
        // txHash would come from payment/blockchain transaction
        txHash: null,
      },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            audioUrl: true,
            priceUsd: true,
          },
        },
        buyer: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
          },
        },
      },
    })

    console.log(`✅ License created: ${license.id} for session "${session.title}"`)

    return NextResponse.json(license, { status: 201 })
  } catch (error) {
    console.error('Failed to create license:', error)
    return NextResponse.json(
      { error: 'Failed to create license' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/licenses
 * Get licenses for a user (as buyer)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const buyerId = searchParams.get('buyerId')

    if (!buyerId) {
      return NextResponse.json(
        { error: 'Buyer ID is required' },
        { status: 400 }
      )
    }

    const licenses = await prisma.license.findMany({
      where: { buyerId },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            description: true,
            contentType: true,
            audioUrl: true,
            priceUsd: true,
            owner: {
              select: {
                walletAddress: true,
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(licenses)
  } catch (error) {
    console.error('Failed to fetch licenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch licenses' },
      { status: 500 }
    )
  }
}
