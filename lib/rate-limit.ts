/**
 * Rate Limiting with Upstash Redis
 * 
 * Protects critical endpoints from abuse and DDoS attacks
 * Uses sliding window algorithm for accurate rate limiting
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Redis client
// Will use UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null

// Rate limiters for different endpoint categories
export const paymentLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
        analytics: true,
        prefix: 'ratelimit:payment',
    })
    : null

export const uploadLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 uploads per hour
        analytics: true,
        prefix: 'ratelimit:upload',
    })
    : null

export const walletLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
        analytics: true,
        prefix: 'ratelimit:wallet',
    })
    : null

export const apiLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, '1 m'), // 30 requests per minute
        analytics: true,
        prefix: 'ratelimit:api',
    })
    : null

/**
 * Get client identifier from request
 * Uses IP address or fallback to a default identifier
 */
export function getClientIdentifier(request: Request): string {
    // Try to get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')

    const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'anonymous'

    return ip
}

/**
 * Check rate limit and return appropriate response
 * Returns null if rate limit is not exceeded, otherwise returns error response
 */
export async function checkRateLimit(
    limiter: Ratelimit | null,
    identifier: string
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number } | null> {
    // If rate limiting is not configured (no Redis), allow all requests
    if (!limiter) {
        console.warn('⚠️  Rate limiting not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN')
        return { success: true }
    }

    try {
        const { success, limit, remaining, reset } = await limiter.limit(identifier)

        if (!success) {
            console.log(`🚫 Rate limit exceeded for ${identifier}`)
            return {
                success: false,
                limit,
                remaining,
                reset,
            }
        }

        return { success: true, limit, remaining, reset }
    } catch (error) {
        console.error('Rate limit check error:', error)
        // On error, allow the request (fail open)
        return { success: true }
    }
}
