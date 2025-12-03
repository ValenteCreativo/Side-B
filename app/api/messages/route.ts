import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/messages
 * Get messages for a user (inbox/sent)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') || 'inbox' // 'inbox' or 'sent'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const messages = await prisma.message.findMany({
      where: type === 'inbox'
        ? { receiverId: userId }
        : { senderId: userId },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            walletAddress: true,
          },
        },
        receiver: {
          select: {
            id: true,
            displayName: true,
            walletAddress: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/messages
 * Send a message to another user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { senderId, receiverId, content } = body as {
      senderId: string
      receiverId: string
      content: string
    }

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: 'Sender ID, Receiver ID, and content are required' },
        { status: 400 }
      )
    }

    if (senderId === receiverId) {
      return NextResponse.json(
        { error: 'Cannot send message to yourself' },
        { status: 400 }
      )
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            walletAddress: true,
          },
        },
        receiver: {
          select: {
            id: true,
            displayName: true,
            walletAddress: true,
          },
        },
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Failed to send message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/messages
 * Mark a message as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId } = body as { messageId: string }

    if (!messageId) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      )
    }

    const message = await prisma.message.update({
      where: { id: messageId },
      data: { read: true },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Failed to mark message as read:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}
