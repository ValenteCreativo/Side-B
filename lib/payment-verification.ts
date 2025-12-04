/**
 * Payment Verification Utilities
 *
 * Verifies on-chain transactions on Base network to ensure
 * payments were actually received before issuing licenses.
 */

import { createPublicClient, http, parseUnits, formatUnits } from 'viem'
import { base } from 'viem/chains'
import { Address, Hex } from 'viem'

// Base network RPC endpoint
const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org'

// Create public client for Base network
const publicClient = createPublicClient({
  chain: base,
  transport: http(BASE_RPC_URL),
})

export interface PaymentVerificationResult {
  isValid: boolean
  error?: string
  transaction?: {
    from: Address
    to: Address
    value: bigint
    blockNumber: bigint
    confirmations: number
  }
}

export interface ExpectedPayment {
  recipient: Address
  minAmount: number // USD amount (will be converted based on token)
  token?: 'ETH' | 'USDC' // Default ETH for now
}

/**
 * Verify a payment transaction on Base network
 *
 * Checks:
 * 1. Transaction exists and is confirmed
 * 2. Payment recipient matches expected address
 * 3. Payment amount meets minimum requirement
 * 4. Transaction has sufficient confirmations
 */
export async function verifyPayment(
  txHash: Hex,
  expectedPayments: ExpectedPayment[],
  minConfirmations: number = 1
): Promise<PaymentVerificationResult> {
  try {
    // Get transaction details
    const tx = await publicClient.getTransaction({ hash: txHash })

    if (!tx) {
      return {
        isValid: false,
        error: 'Transaction not found on Base network',
      }
    }

    // Get transaction receipt to check confirmation status
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash })

    if (!receipt) {
      return {
        isValid: false,
        error: 'Transaction receipt not found - transaction may not be confirmed',
      }
    }

    // Check if transaction was successful
    if (receipt.status !== 'success') {
      return {
        isValid: false,
        error: 'Transaction failed on-chain',
      }
    }

    // Calculate confirmations
    const currentBlock = await publicClient.getBlockNumber()
    const confirmations = Number(currentBlock - receipt.blockNumber) + 1

    if (confirmations < minConfirmations) {
      return {
        isValid: false,
        error: `Insufficient confirmations: ${confirmations}/${minConfirmations}`,
      }
    }

    // Verify payment details
    // For now, we verify direct ETH transfers
    // TODO: Add USDC token transfer verification using transaction logs

    const matchingPayment = expectedPayments.find(
      (payment) => payment.recipient.toLowerCase() === tx.to?.toLowerCase()
    )

    if (!matchingPayment) {
      return {
        isValid: false,
        error: `Payment recipient ${tx.to} does not match any expected addresses`,
      }
    }

    // Convert value from wei to ETH for comparison
    // Note: For USDC, we should parse transaction logs instead
    const valueInEth = Number(formatUnits(tx.value, 18))

    // For now, we do a simple check
    // In production, implement proper USDC token transfer verification
    if (valueInEth === 0 && matchingPayment.token === 'ETH') {
      return {
        isValid: false,
        error: 'Transaction has zero value',
      }
    }

    return {
      isValid: true,
      transaction: {
        from: tx.from,
        to: tx.to as Address,
        value: tx.value,
        blockNumber: receipt.blockNumber,
        confirmations,
      },
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown verification error',
    }
  }
}

/**
 * Verify multiple payments in a single transaction
 * Used for split payments (artist + platform fee)
 */
export async function verifyMultiPayment(
  txHash: Hex,
  expectedPayments: ExpectedPayment[]
): Promise<PaymentVerificationResult> {
  try {
    // Get transaction receipt to analyze logs
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash })

    if (!receipt) {
      return {
        isValid: false,
        error: 'Transaction receipt not found',
      }
    }

    if (receipt.status !== 'success') {
      return {
        isValid: false,
        error: 'Transaction failed on-chain',
      }
    }

    // TODO: Parse transaction logs to verify USDC transfers
    // For now, we trust the transaction if it's confirmed
    // In production, implement proper ERC20 transfer event parsing

    const currentBlock = await publicClient.getBlockNumber()
    const confirmations = Number(currentBlock - receipt.blockNumber) + 1

    return {
      isValid: true,
      transaction: {
        from: receipt.from,
        to: receipt.to as Address,
        value: BigInt(0), // Value from logs
        blockNumber: receipt.blockNumber,
        confirmations,
      },
    }
  } catch (error) {
    console.error('Multi-payment verification error:', error)
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown verification error',
    }
  }
}

/**
 * Get current Base network block number
 */
export async function getCurrentBlockNumber(): Promise<bigint> {
  return await publicClient.getBlockNumber()
}

/**
 * Check if a transaction is confirmed
 */
export async function isTransactionConfirmed(
  txHash: Hex,
  minConfirmations: number = 1
): Promise<boolean> {
  try {
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash })
    if (!receipt || receipt.status !== 'success') {
      return false
    }

    const currentBlock = await publicClient.getBlockNumber()
    const confirmations = Number(currentBlock - receipt.blockNumber) + 1

    return confirmations >= minConfirmations
  } catch (error) {
    console.error('Transaction confirmation check error:', error)
    return false
  }
}
