import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, amount, token } = body

    if (!from || !to || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

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
