import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, amount } = body

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

    // Generate Halliday on-ramp URL
    // Documentation: https://docs.halliday.xyz/
    const hallidayUrl = `https://widget.halliday.xyz/?` + new URLSearchParams({
      apiKey: hallidayApiKey,
      walletAddress: address,
      amount: amount.toString(),
      currency: 'USD',
      network: 'base',
      theme: 'dark',
    }).toString()

    return NextResponse.json({
      url: hallidayUrl,
      provider: 'halliday',
    })

  } catch (error) {
    console.error('Halliday on-ramp error:', error)
    return NextResponse.json({ error: 'Failed to generate on-ramp URL' }, { status: 500 })
  }
}
