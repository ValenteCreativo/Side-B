import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, type Address } from 'viem'
import { base } from 'viem/chains'
import { validateQuery, walletTransactionsSchema } from '@/lib/validations'
import { walletLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
})

// Base network chain ID
const BASE_CHAIN_ID = 8453

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)

    // Validate query params with Zod
    const validation = validateQuery(searchParams, walletTransactionsSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { address } = validation.data

    // Get current block number
    const currentBlock = await publicClient.getBlockNumber()
    const fromBlock = currentBlock - BigInt(10000) // Last ~10,000 blocks (approximately 1-2 days on Base)

    // Fetch transaction history using Etherscan API V2
    // Migration from BaseScan to Etherscan API V2 (single endpoint for all chains)
    const etherscanApiKey = process.env.ETHERSCAN_API_KEY || ''

    if (etherscanApiKey) {
      // Etherscan API V2 endpoint - single endpoint for all chains with chainid parameter
      const response = await fetch(
        `https://api.etherscan.io/v2/api?` + new URLSearchParams({
          chainid: BASE_CHAIN_ID.toString(),
          module: 'account',
          action: 'txlist',
          address: address,
          startblock: fromBlock.toString(),
          endblock: currentBlock.toString(),
          page: '1',
          offset: '50',
          sort: 'desc',
          apikey: etherscanApiKey,
        }).toString()
      )

      if (response.ok) {
        const data = await response.json()

        if (data.status === '1' && data.result) {
          const transactions = data.result.map((tx: any) => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: (Number(tx.value) / 1e18).toFixed(6),
            timestamp: Number(tx.timeStamp) * 1000,
            status: tx.isError === '0' ? 'success' : 'failed',
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'send' : 'receive',
          }))

          return NextResponse.json({ transactions })
        }
      }
    }

    // Fallback: Return empty array if Etherscan API key is not configured
    return NextResponse.json({
      transactions: [],
      message: 'Configure ETHERSCAN_API_KEY for transaction history. Get your key at https://etherscan.io/myapikey'
    })

  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}
