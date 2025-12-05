import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, type Address } from 'viem'
import { base } from 'viem/chains'

export const dynamic = 'force-dynamic'

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
})

// Base network chain ID
const BASE_CHAIN_ID = 8453

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 })
    }

    // Get current block number
    const currentBlock = await publicClient.getBlockNumber()
    const fromBlock = currentBlock - 10000n // Last ~10,000 blocks (approximately 1-2 days on Base)

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
