/**
 * Zod validation schemas for API routes
 * Ensures type-safe input validation across the application
 */

import { z } from 'zod'

// Ethereum address validation
const ethereumAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')

// User schemas
export const createUserSchema = z.object({
  walletAddress: ethereumAddress,
  role: z.enum(['MUSICIAN', 'CREATOR']),
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  twitter: z.string().max(100).optional(),
  instagram: z.string().max(100).optional(),
  website: z.string().url().optional(),
})

export const updateUserSchema = createUserSchema.partial().omit({ walletAddress: true, role: true })

// Session (music track) schemas
export const createSessionSchema = z.object({
  ownerId: z.string().cuid(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  contentType: z.enum(['JAM', 'REHEARSAL', 'PRODUCED']),
  moodTags: z.union([
    z.array(z.string()),
    z.string()
  ]).transform(val => typeof val === 'string' ? val : val.join(', ')),
  durationSec: z.number().int().positive().optional(),
  audioUrl: z.string().url(),
  priceUsd: z.number().positive().max(10000),
  collectionId: z.string().cuid().optional(),
})

// License schemas
export const createLicenseSchema = z.object({
  sessionId: z.string().cuid(),
  buyerId: z.string().cuid(),
})

// Payment schemas
export const paymentConfirmSchema = z.object({
  sessionId: z.string().cuid(),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash'),
  buyerId: z.string().cuid(),
})

// Wallet schemas
export const walletBalanceSchema = z.object({
  address: ethereumAddress,
})

export const walletSendSchema = z.object({
  from: ethereumAddress,
  to: ethereumAddress,
  amount: z.string().regex(/^\d+\.?\d*$/, 'Invalid amount format'),
  token: z.enum(['ETH', 'USDC']).optional(),
})

export const walletTransactionsSchema = z.object({
  address: ethereumAddress,
})

// Halliday schemas
export const hallidayOnrampSchema = z.object({
  address: ethereumAddress,
  amount: z.number().positive().max(100000),
})

// Follow schemas
export const followSchema = z.object({
  followingId: z.string().cuid(),
})

// Analytics schemas
export const analyticsQuerySchema = z.object({
  userId: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Helper function to validate request body
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return {
        success: false,
        error: result.error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', '),
      }
    }

    return { success: true, data: result.data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON body',
    }
  }
}

// Helper function to validate query params
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const params = Object.fromEntries(searchParams.entries())
    const result = schema.safeParse(params)

    if (!result.success) {
      return {
        success: false,
        error: result.error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', '),
      }
    }

    return { success: true, data: result.data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid query parameters',
    }
  }
}
