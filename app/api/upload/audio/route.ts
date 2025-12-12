import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { uploadLimiter, getClientIdentifier, checkRateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Maximum file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024

// Accepted audio formats
const ACCEPTED_FORMATS = [
    'audio/mpeg',      // .mp3
    'audio/mp4',       // .m4a
    'audio/x-m4a',     // .m4a (alternative MIME - mobile devices)
    'audio/wav',       // .wav
    'audio/x-wav',     // .wav (alternative MIME - mobile devices)
    'audio/flac',      // .flac
    'audio/ogg',       // .ogg
    'audio/aac',       // .aac (mobile recordings)
    'audio/3gpp',      // .3gp (mobile recordings)
    'audio/quicktime', // .mov audio (iOS)
]

export async function POST(request: NextRequest) {
    try {
        // Rate limiting: 5 uploads per hour per IP
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

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        console.log('📁 Audio upload request:', {
            name: file.name,
            type: file.type,
            size: file.size,
            sizeInMB: (file.size / 1024 / 1024).toFixed(2)
        })

        // Validate file type
        if (!ACCEPTED_FORMATS.includes(file.type)) {
            console.error('❌ Invalid MIME type:', file.type, 'Expected one of:', ACCEPTED_FORMATS)
            return NextResponse.json(
                { error: `Invalid file type "${file.type}". Accepted: ${ACCEPTED_FORMATS.join(', ')}` },
                { status: 400 }
            )
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
                { status: 400 }
            )
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 8)
        const extension = file.name.split('.').pop()
        const filename = `audio-${timestamp}-${randomString}.${extension}`

        // Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: 'public',
            addRandomSuffix: false,
        })

        console.log('✅ Audio uploaded to Vercel Blob:', blob.url)

        return NextResponse.json({
            success: true,
            url: blob.url,
            filename: filename,
            size: file.size,
            type: file.type,
        })
    } catch (error) {
        console.error('Audio upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload audio file' },
            { status: 500 }
        )
    }
}
