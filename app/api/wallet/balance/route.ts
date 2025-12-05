import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, formatEther, type Address } from 'viem'
import { base } from 'viem/chains'
import { validateQuery, walletBalanceSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
})

// USDC contract on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address

const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const validation = validateQuery(searchParams, walletBalanceSchema)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { address } = validation.data

    const balances = []

    // Get ETH balance
    const ethBalance = await publicClient.getBalance({
      address: address as Address,
    })

    balances.push({
      symbol: 'ETH',
      name: 'Ethereum',
      balance: formatEther(ethBalance),
      usdValue: parseFloat(formatEther(ethBalance)) * 2500, // Approximate ETH price
      decimals: 18,
    })

    // Get USDC balance
    try {
      const usdcBalance = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address as Address],
      })

      const usdcDecimals = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'decimals',
      })

      const formattedUsdc = Number(usdcBalance) / Math.pow(10, usdcDecimals)

      balances.push({
        symbol: 'USDC',
        name: 'USD Coin',
        balance: formattedUsdc.toFixed(2),
        usdValue: formattedUsdc,
        decimals: usdcDecimals,
      })
    } catch (error) {
      console.error('Failed to fetch USDC balance:', error)
    }

    return NextResponse.json({ balances })
  } catch (error) {
    console.error('Failed to fetch balances:', error)
    return NextResponse.json({ error: 'Failed to fetch balances' }, { status: 500 })
  }
}
