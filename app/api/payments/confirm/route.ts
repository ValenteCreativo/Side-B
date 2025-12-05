import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyMultiPayment } from '@/lib/payment-verification'
import { validateRequest, paymentConfirmSchema } from '@/lib/validations'
import { paymentLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit'
import { Hex, Address } from 'viem'

export const dynamic = 'force-dynamic'

/**
 * POST /api/payments/confirm
 * Confirm payment and create license after successful wallet transaction
 *
 * Flow:
 * 1. Verify transaction hash exists and is valid on Base network
 * 2. Verify payment recipients and amounts match expected values
 * 3. Create license record in database
 * 4. Link to Story Protocol IP asset
 * 5. Return license details
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 requests per minute per IP
    const identifier = getClientIdentifier(request)
    const rateLimitResult = await checkRateLimit(paymentLimiter, identifier)

    if (rateLimitResult && !rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many payment requests. Please try again later.',
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
    const validation = await validateRequest(request, paymentConfirmSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { sessionId, buyerId, txHash } = validation.data

    // Verify session exists and get payment details
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        title: true,
        audioUrl: true,
        storyAssetId: true,
        storyTxHash: true,
        priceUsd: true,
        owner: {
          select: {
            walletAddress: true,
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

    // Check if license already exists
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
        { error: 'License already exists for this session' },
        { status: 400 }
      )
    }

    // Calculate expected payment amounts (2% platform fee)
    const PLATFORM_FEE_PERCENTAGE = 0.02
    const totalAmount = session.priceUsd
    const platformFee = totalAmount * PLATFORM_FEE_PERCENTAGE
    const artistAmount = totalAmount - platformFee

    const platformWallet = process.env.PLATFORM_WALLET_ADDRESS

    // Verify transaction on Base network
    console.log('🔍 Verifying payment transaction on Base network...')
    console.log(`   TX Hash: ${txHash}`)
    console.log(`   Expected Artist Payment: $${artistAmount} to ${session.owner.walletAddress}`)
    console.log(`   Expected Platform Fee: $${platformFee} to ${platformWallet}`)

    const verification = await verifyMultiPayment(txHash as Hex, [
      {
        recipient: session.owner.walletAddress as Address,
        minAmount: artistAmount,
        token: 'USDC',
      },
      ...(platformWallet
        ? [
          {
            recipient: platformWallet as Address,
            minAmount: platformFee,
            token: 'USDC' as const,
          },
        ]
        : []),
    ])

    if (!verification.isValid) {
      console.error('❌ Payment verification failed:', verification.error)
      return NextResponse.json(
        {
          error: 'Payment verification failed',
          details: verification.error,
        },
        { status: 400 }
      )
    }

    console.log('✅ Payment verified on Base network')
    console.log(`   Confirmations: ${verification.transaction?.confirmations}`)
    console.log(`   Block: ${verification.transaction?.blockNumber}`)

    // Create license
    const license = await prisma.license.create({
      data: {
        sessionId,
        buyerId,
        txHash,
      },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            description: true,
            audioUrl: true,
            storyAssetId: true,
            storyTxHash: true,
            owner: {
              select: {
                walletAddress: true,
                displayName: true,
              },
            },
          },
        },
      },
    })

    console.log('✅ License created successfully')
    console.log(`   License ID: ${license.id}`)
    console.log(`   Session: ${license.session.title}`)
    console.log(`   Story Asset ID: ${license.session.storyAssetId}`)
    console.log(`   Payment TX: ${txHash}`)

    return NextResponse.json({
      success: true,
      license: {
        id: license.id,
        sessionId: license.sessionId,
        createdAt: license.createdAt,
        txHash: license.txHash,
        session: {
          title: license.session.title,
          description: license.session.description,
          audioUrl: license.session.audioUrl,
          storyAssetId: license.session.storyAssetId,
          owner: license.session.owner,
        },
      },
      message: 'License created successfully! You can now access your content.',
    })
  } catch (error) {
    console.error('Failed to confirm payment:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment and create license' },
      { status: 500 }
    )
  }
}
