import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, type Address } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { validateQuery, walletTransactionsSchema } from '@/lib/validations'
import { walletLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit'
import { NETWORK, isTestnet } from '@/lib/network-config'

export const dynamic = 'force-dynamic'

const publicClient = createPublicClient({
  chain: isTestnet() ? baseSepolia : base,
  transport: http(NETWORK.rpcUrl),
})

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
      const apiUrl = `https://api.etherscan.io/v2/api?` + new URLSearchParams({
        chainid: NETWORK.chainId.toString(),
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

      console.log('[Transactions API] Fetching from:', apiUrl.replace(etherscanApiKey, 'REDACTED'))

      const response = await fetch(apiUrl)

      if (response.ok) {
        const data = await response.json()
        console.log('[Transactions API] Response status:', data.status, 'Result count:', data.result?.length || 0)

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
        } else {
          // API returned status 0 or no results
          console.log('[Transactions API] No transactions or error:', data.message || data.result)
          return NextResponse.json({
            transactions: [],
            message: data.message || 'No transactions found for this address'
          })
        }
      } else {
        console.error('[Transactions API] HTTP error:', response.status, await response.text())
      }
    } else {
      console.warn('[Transactions API] No ETHERSCAN_API_KEY configured')
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
