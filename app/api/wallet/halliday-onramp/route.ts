import { NextRequest, NextResponse } from 'next/server'
import { getHallidayQuotes, confirmHallidayQuote, HALLIDAY_ASSETS } from '@/lib/halliday'

export const dynamic = 'force-dynamic'

/**
 * POST /api/wallet/halliday-onramp
 * Get Halliday onramp quotes and return funding URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, amount, action = 'buy' } = body

    if (!address || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const hallidayApiKey = process.env.HALLIDAY_API_KEY

    if (!hallidayApiKey) {
      return NextResponse.json({
        error: 'Halliday API key not configured',
        info: 'Set HALLIDAY_API_KEY in environment variables'
      }, { status: 500 })
    }

    // Determine input/output assets based on action
    const inputAsset = action === 'buy' ? HALLIDAY_ASSETS.USD : HALLIDAY_ASSETS.USDC_BASE
    const outputAsset = action === 'buy' ? HALLIDAY_ASSETS.USDC_BASE : HALLIDAY_ASSETS.USD

    // Step 1: Get quotes
    console.log('🔍 Getting Halliday quotes...')
    const quotesResponse = await getHallidayQuotes({
      inputAsset,
      outputAsset,
      amount: amount.toString(),
      isFixedInput: true,
    })

    if (!quotesResponse.quotes || quotesResponse.quotes.length === 0) {
      return NextResponse.json({
        error: 'No quotes available',
        info: 'Try a different amount or check back later'
      }, { status: 404 })
    }

    // Select best quote (first one is usually best)
    const bestQuote = quotesResponse.quotes[0]
    const stateToken = quotesResponse.state_token

    console.log('✅ Best quote:', bestQuote.onramp, bestQuote.output_amount.amount)

    // Step 2: Confirm the quote
    console.log('🔄 Confirming quote...')
    const confirmation = await confirmHallidayQuote({
      paymentId: bestQuote.payment_id,
      stateToken: stateToken,
      ownerAddress: address,
      destinationAddress: address,
    })

    console.log('✅ Quote confirmed, payment ID:', confirmation.payment_id)

    // Return funding URL
    const fundingUrl = confirmation.next_instruction?.funding_page_url

    if (!fundingUrl) {
      return NextResponse.json({
        error: 'No funding URL received',
        info: 'Payment confirmed but no funding instructions available'
      }, { status: 500 })
    }

    return NextResponse.json({
      url: fundingUrl,
      provider: bestQuote.onramp,
      payment_id: confirmation.payment_id,
      quote: {
        input_amount: '100',
        output_amount: bestQuote.output_amount.amount,
        fees: bestQuote.fees,
      },
    })

  } catch (error) {
    console.error('Halliday on-ramp error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to process onramp request'
    }, { status: 500 })
  }
}
