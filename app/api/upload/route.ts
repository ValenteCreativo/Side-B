import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { uploadLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Maximum file size: 5MB for images
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Accepted image formats
const ACCEPTED_IMAGE_FORMATS = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
]

export async function POST(request: NextRequest) {
    try {
        // Rate limiting: 10 uploads per hour per IP (more lenient for images)
        const identifier = getClientIdentifier(request)
        const rateLimitResult = await checkRateLimit(uploadLimiter, identifier)

        if (rateLimitResult && !rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: 'Upload limit exceeded. Please try again later.',
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

        const formData = await request.formData()
        const file = formData.get('file') as File
        const type = formData.get('type') as string // 'image' or 'audio'

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Validate based on type
        if (type === 'image') {
            if (!ACCEPTED_IMAGE_FORMATS.includes(file.type)) {
                return NextResponse.json(
                    { error: `Invalid image type. Accepted: JPG, PNG, GIF, WEBP` },
                    { status: 400 }
                )
            }

            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json(
                    { error: `Image too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
                    { status: 400 }
                )
            }
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 8)
        const extension = file.name.split('.').pop()
        const prefix = type === 'image' ? 'image' : 'file'
        const filename = `${prefix}-${timestamp}-${randomString}.${extension}`

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: 'public',
            addRandomSuffix: false,
        })

        console.log(`✅ ${type || 'File'} uploaded to Vercel Blob:`, blob.url)

        return NextResponse.json({
            success: true,
            url: blob.url,
            filename: filename,
            size: file.size,
            type: file.type,
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}
