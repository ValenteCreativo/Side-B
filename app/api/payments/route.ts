import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/payments
 * P2P Payment Flow with Platform Fee
 *
 * Business Model: 2% platform fee on each transaction
 * Payment Flow:
 * 1. Calculate amounts (98% to artist, 2% to platform)
 * 2. Return payment details for wallet transaction
 * 3. Frontend triggers wallet transaction with Coinbase Wallet SDK
 * 4. Once tx confirmed, create license with Story Protocol
 *
 * Story Protocol Integration:
 * - Each purchase creates a license NFT on Story Protocol
 * - License is linked to the original IP asset (the music track)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, buyerId, buyerWalletAddress } = body as {
      sessionId: string
      buyerId: string
      buyerWalletAddress: string
    }

    if (!sessionId || !buyerId || !buyerWalletAddress) {
      return NextResponse.json(
        { error: 'Session ID, Buyer ID, and Wallet Address are required' },
        { status: 400 }
      )
    }

    // Fetch session details including owner wallet
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        title: true,
        description: true,
        priceUsd: true,
        storyAssetId: true,
        owner: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
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
        { error: 'You already have a license for this session' },
        { status: 400 }
      )
    }

    // Calculate payment split (2% platform fee)
    const PLATFORM_FEE_PERCENTAGE = 0.02
    const totalAmount = session.priceUsd
    const platformFee = totalAmount * PLATFORM_FEE_PERCENTAGE
    const artistAmount = totalAmount - platformFee

    // Platform wallet address (Side B revenue wallet)
    const platformWallet = process.env.PLATFORM_WALLET_ADDRESS || process.env.NEXT_PUBLIC_PLATFORM_WALLET

    if (!platformWallet) {
      console.warn('⚠️  Platform wallet not configured. Using mock payment.')
    }

    // Return payment instructions for wallet transaction
    // The frontend will handle the actual wallet transaction
    return NextResponse.json({
      success: true,
      paymentRequired: true,
      paymentDetails: {
        // Artist payment (98%)
        artistPayment: {
          recipient: session.owner.walletAddress,
          amount: artistAmount,
          amountUsd: artistAmount,
        },
        // Platform fee (2%)
        platformFee: {
          recipient: platformWallet,
          amount: platformFee,
          amountUsd: platformFee,
        },
        // Total
        total: {
          amount: totalAmount,
          amountUsd: totalAmount,
        },
        // Session info for license creation
        sessionInfo: {
          sessionId: session.id,
          title: session.title,
          storyAssetId: session.storyAssetId,
          buyerId: buyerId,
        },
      },
      message: 'Payment details ready. Complete transaction in your wallet.',
    })
  } catch (error) {
    console.error('Failed to process payment:', error)
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payments
 * Check payment status
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const chargeId = searchParams.get('chargeId')

    if (!chargeId) {
      return NextResponse.json(
        { error: 'Charge ID is required' },
        { status: 400 }
      )
    }

    // TODO: Check Coinbase Commerce charge status
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        status: 'completed',
        message: 'Mock payment - always completed',
      })
    }

    // Production: Fetch charge status
    /*
    const response = await fetch(
      `https://api.commerce.coinbase.com/charges/${chargeId}`,
      {
        headers: {
          'X-CC-Api-Key': apiKey,
          'X-CC-Version': '2018-03-22',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch charge status')
    }

    const data = await response.json()

    return NextResponse.json({
      status: data.data.timeline[data.data.timeline.length - 1].status,
      confirmedAt: data.data.confirmed_at,
      metadata: data.data.metadata,
    })
    */

    return NextResponse.json({
      status: 'pending',
      message: 'Coinbase Commerce integration pending',
    })
  } catch (error) {
    console.error('Failed to check payment status:', error)
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}
