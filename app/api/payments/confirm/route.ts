import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/payments/confirm
 * Confirm payment and create license after successful wallet transaction
 *
 * Flow:
 * 1. Verify transaction hash exists and is valid
 * 2. Create license record in database
 * 3. Link to Story Protocol IP asset
 * 4. Return license details
 *
 * Note: In production, you should verify the transaction on-chain
 * to ensure payment was actually received before creating the license.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, buyerId, txHash } = body as {
      sessionId: string
      buyerId: string
      txHash: string
    }

    if (!sessionId || !buyerId || !txHash) {
      return NextResponse.json(
        { error: 'Session ID, Buyer ID, and Transaction Hash are required' },
        { status: 400 }
      )
    }

    // Verify session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        title: true,
        audioUrl: true,
        storyAssetId: true,
        storyTxHash: true,
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

    // TODO: Verify transaction on-chain
    // In production, you should:
    // 1. Check transaction exists on blockchain
    // 2. Verify payment amounts are correct
    // 3. Verify recipients received funds
    // 4. Verify transaction is confirmed
    //
    // Example with viem:
    // const publicClient = createPublicClient({ chain: mainnet, transport: http() })
    // const tx = await publicClient.getTransaction({ hash: txHash })
    // Verify tx.to, tx.value, etc.

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
