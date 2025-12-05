import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get all unique conversation partners
    const sentMessages = await prisma.message.findMany({
      where: { senderId: userId },
      select: {
        receiverId: true,
        receiver: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
          },
        },
        content: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: userId },
      select: {
        senderId: true,
        sender: {
          select: {
            id: true,
            walletAddress: true,
            displayName: true,
          },
        },
        content: true,
        createdAt: true,
        read: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Build conversation list with unique users
    const conversationsMap = new Map()

    // Process sent messages
    for (const msg of sentMessages) {
      const partnerId = msg.receiverId
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          userId: msg.receiver.id,
          userAddress: msg.receiver.walletAddress,
          userName: msg.receiver.displayName || 'Anonymous',
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt.getTime(),
          unreadCount: 0,
        })
      }
    }

    // Process received messages
    for (const msg of receivedMessages) {
      const partnerId = msg.senderId
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          userId: msg.sender.id,
          userAddress: msg.sender.walletAddress,
          userName: msg.sender.displayName || 'Anonymous',
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt.getTime(),
          unreadCount: msg.read ? 0 : 1,
        })
      } else {
        const existing = conversationsMap.get(partnerId)
        if (msg.createdAt.getTime() > existing.lastMessageTime) {
          existing.lastMessage = msg.content
          existing.lastMessageTime = msg.createdAt.getTime()
        }
        if (!msg.read) {
          existing.unreadCount += 1
        }
      }
    }

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => b.lastMessageTime - a.lastMessageTime
    )

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Failed to fetch conversations:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}
