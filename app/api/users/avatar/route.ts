import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { uploadFileToIPFS, getIPFSGatewayURL } from '@/lib/pinata'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userId = formData.get('userId') as string
    const file = formData.get('file') as File

    if (!userId || !file) {
      return NextResponse.json(
        { error: 'Missing userId or file' },
        { status: 400 }
      )
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Upload to IPFS via Pinata
    const result = await uploadFileToIPFS(file)
    const avatarUrl = getIPFSGatewayURL(result.IpfsHash)

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    })

    return NextResponse.json({
      success: true,
      avatarUrl,
      ipfsHash: result.IpfsHash,
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}
