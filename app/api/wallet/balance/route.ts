import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, formatEther, type Address } from 'viem'
import { baseSepolia, base } from 'viem/chains'
import { validateQuery, walletBalanceSchema } from '@/lib/validations'
import { NETWORK, NETWORK_ENV } from '@/lib/network-config'

export const dynamic = 'force-dynamic'

// Use appropriate chain based on network environment
const chain = NETWORK_ENV === 'testnet' ? baseSepolia : base

const publicClient = createPublicClient({
  chain,
  transport: http(NETWORK.rpcUrl),
})

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
        address: NETWORK.usdcAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address as Address],
      })

      const usdcDecimals = await publicClient.readContract({
        address: NETWORK.usdcAddress,
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
      // Add USDC with 0 balance if contract call fails
      balances.push({
        symbol: 'USDC',
        name: 'USD Coin',
        balance: '0.00',
        usdValue: 0,
        decimals: 6,
      })
    }

    return NextResponse.json({
      balances,
      network: NETWORK.name,
      chainId: NETWORK.chainId,
    })
  } catch (error) {
    console.error('Failed to fetch balances:', error)
    return NextResponse.json({ error: 'Failed to fetch balances' }, { status: 500 })
  }
}
