import { NextRequest, NextResponse } from 'next/server'
import { getOnrampQuotes } from '@/lib/halliday'

/**
 * POST /api/halliday/quotes
 * Get Halliday on-ramp quotes for fiat to crypto conversion
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { inputAmount, outputAsset, destinationAddress, onrampMethods, countryCode } = body

    if (!inputAmount || !outputAsset || !destinationAddress) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const quotes = await getOnrampQuotes({
      inputAmount,
      outputAsset,
      destinationAddress,
      onrampMethods,
      countryCode,
    })

    return NextResponse.json({ quotes })
  } catch (error) {
    console.error('Halliday quotes API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get quotes' },
      { status: 500 }
    )
  }
}
