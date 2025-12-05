/**
 * Halliday Payments API Integration
 *
 * Enables fiat on-ramp for purchasing crypto (USDC/USDT) to license music
 * Documentation: https://docs.halliday.xyz
 */

const HALLIDAY_API_BASE = 'https://v2.prod.halliday.xyz'
const HALLIDAY_API_KEY = process.env.HALLIDAY_API_KEY

if (!HALLIDAY_API_KEY) {
  throw new Error('HALLIDAY_API_KEY environment variable is required')
}

export interface HallidayQuoteRequest {
  inputAmount: string // USD amount
  outputAsset: {
    symbol: string // 'USDC' or 'USDT'
    chain_id: string // '8453' for Base
    contract_address?: string
  }
  destinationAddress: string // User's wallet address
  onrampMethods?: ('CREDIT_DEBIT_CARD' | 'ACH')[]
  countryCode?: string // Default 'USA'
}

export interface HallidayQuote {
  payment_id: string
  provider: string
  input_amount: string
  output_amount: string
  fees: {
    total_fee_usd: string
    network_fee_usd: string
    provider_fee_usd: string
  }
  rate: string
  estimated_time_seconds: number
}

export interface HallidayPaymentConfirmation {
  payment_id: string
  status: string
  widget_url?: string
  deposit_address?: string
  qr_code_url?: string
}

/**
 * Get quotes for on-ramping fiat to crypto
 */
export async function getOnrampQuotes(
  params: HallidayQuoteRequest
): Promise<HallidayQuote[]> {
  try {
    const response = await fetch(`${HALLIDAY_API_BASE}/payments/quotes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HALLIDAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request: {
          kind: 'FIXED_INPUT',
          fixed_input_amount: {
            asset: {
              symbol: 'USD',
              chain_id: 'fiat',
            },
            amount: params.inputAmount,
          },
          output_asset: params.outputAsset,
        },
        price_currency: 'usd',
        onramps: ['stripe', 'transak', 'moonpay'], // Available providers
        onramp_methods: params.onrampMethods || ['CREDIT_DEBIT_CARD'],
        customer_geolocation: {
          alpha3_country_code: params.countryCode || 'USA',
        },
        destination_wallets: [
          {
            address: params.destinationAddress,
            chain_id: params.outputAsset.chain_id,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.errors?.[0]?.message || 'Failed to get quotes')
    }

    const data = await response.json()

    // Transform API response to our interface
    return data.quotes.map((quote: any) => ({
      payment_id: quote.payment_id,
      provider: quote.provider,
      input_amount: quote.input_amount.amount,
      output_amount: quote.output_amount.amount,
      fees: {
        total_fee_usd: quote.fees.total_fee_usd,
        network_fee_usd: quote.fees.network_fee_usd || '0',
        provider_fee_usd: quote.fees.provider_fee_usd || '0',
      },
      rate: quote.rate,
      estimated_time_seconds: quote.estimated_time_seconds || 300,
    }))
  } catch (error) {
    console.error('Halliday getOnrampQuotes error:', error)
    throw error
  }
}

/**
 * Confirm a quote and get payment instructions (widget URL)
 */
export async function confirmOnrampQuote(
  paymentId: string
): Promise<HallidayPaymentConfirmation> {
  try {
    const response = await fetch(`${HALLIDAY_API_BASE}/payments/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HALLIDAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id: paymentId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.errors?.[0]?.message || 'Failed to confirm quote')
    }

    const data = await response.json()

    return {
      payment_id: data.payment_id,
      status: data.status,
      widget_url: data.widget_url,
      deposit_address: data.deposit_address,
      qr_code_url: data.qr_code_url,
    }
  } catch (error) {
    console.error('Halliday confirmOnrampQuote error:', error)
    throw error
  }
}

/**
 * Check payment status
 */
export async function getPaymentStatus(paymentId: string) {
  try {
    const response = await fetch(
      `${HALLIDAY_API_BASE}/payments?payment_id=${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${HALLIDAY_API_KEY}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.errors?.[0]?.message || 'Failed to get payment status')
    }

    return await response.json()
  } catch (error) {
    console.error('Halliday getPaymentStatus error:', error)
    throw error
  }
}

/**
 * Get supported chains and assets
 */
export async function getSupportedChains() {
  try {
    const response = await fetch(`${HALLIDAY_API_BASE}/chains`, {
      headers: {
        'Authorization': `Bearer ${HALLIDAY_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get supported chains')
    }

    return await response.json()
  } catch (error) {
    console.error('Halliday getSupportedChains error:', error)
    throw error
  }
}

/**
 * Helper: Get Base chain USDC asset configuration
 */
export const BASE_USDC_ASSET = {
  symbol: 'USDC',
  chain_id: '8453', // Base mainnet
  contract_address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
}

/**
 * Helper: Get Story Protocol chain asset configuration
 */
export const STORY_IP_ASSET = {
  symbol: 'IP',
  chain_id: '1513', // Story Iliad testnet (update for mainnet)
  contract_address: undefined, // Native token
}

/**
 * Common asset IDs for Halliday API
 */
export const HALLIDAY_ASSETS = {
  USD: 'usd',
  USDC_BASE: 'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  ETH_BASE: 'base:0x',
}

/**
 * Get Halliday quotes (wrapper for existing function)
 */
export async function getHallidayQuotes(params: {
  inputAsset: string
  outputAsset: string
  amount: string
  isFixedInput?: boolean
}): Promise<any[]> {
  // For now, use the existing getOnrampQuotes function
  // This is a simplified wrapper - you may need to adapt based on actual API
  const { inputAsset, outputAsset, amount } = params

  try {
    const response = await fetch(`${HALLIDAY_API_BASE}/payments/quotes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HALLIDAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request: {
          kind: 'FIXED_INPUT',
          fixed_input_amount: {
            asset: inputAsset,
            amount,
          },
          output_asset: outputAsset,
        },
        price_currency: 'usd',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to get quotes')
    }

    const data = await response.json()
    return data.quotes || []
  } catch (error) {
    console.error('getHallidayQuotes error:', error)
    throw error
  }
}

/**
 * Confirm Halliday quote (wrapper)
 */
export async function confirmHallidayQuote(params: {
  paymentId: string
  stateToken: string
  ownerAddress: string
  destinationAddress: string
}): Promise<any> {
  try {
    const response = await fetch(`${HALLIDAY_API_BASE}/payments/confirm`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HALLIDAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id: params.paymentId,
        state_token: params.stateToken,
        owner_address: params.ownerAddress,
        destination_address: params.destinationAddress,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to confirm quote')
    }

    return await response.json()
  } catch (error) {
    console.error('confirmHallidayQuote error:', error)
    throw error
  }
}

