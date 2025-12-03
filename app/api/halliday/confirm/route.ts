import { NextRequest, NextResponse } from 'next/server'
import { confirmOnrampQuote } from '@/lib/halliday'

/**
 * POST /api/halliday/confirm
 * Confirm a Halliday quote and get payment widget URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId } = body

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      )
    }

    const confirmation = await confirmOnrampQuote(paymentId)

    return NextResponse.json(confirmation)
  } catch (error) {
    console.error('Halliday confirm API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to confirm quote' },
      { status: 500 }
    )
  }
}
