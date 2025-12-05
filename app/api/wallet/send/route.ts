import { NextRequest, NextResponse } from 'next/server'
import { validateRequest, walletSendSchema } from '@/lib/validations'
import { walletLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 20 requests per minute per IP
    const identifier = getClientIdentifier(request)
    const rateLimitResult = await checkRateLimit(walletLimiter, identifier)

    if (rateLimitResult && !rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many wallet requests. Please try again later.',
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
    const validation = await validateRequest(request, walletSendSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { from, to, amount, token } = validation.data

    // NOTE: This endpoint is a placeholder for client-side wallet transactions
    // In production, transactions should be signed and sent from the client using
    // Coinbase Wallet SDK or wagmi/viem with the user's connected wallet

    return NextResponse.json({
      message: 'Transaction should be sent from client-side wallet',
      info: 'Use Coinbase Wallet SDK or wagmi to sign and send transactions',
    }, { status: 400 })

  } catch (error) {
    console.error('Send transaction error:', error)
    return NextResponse.json({ error: 'Failed to process transaction' }, { status: 500 })
  }
}
