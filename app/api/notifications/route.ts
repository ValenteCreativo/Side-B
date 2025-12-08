import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/notifications
 * Get all notifications for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const where: any = { userId }
    if (unreadOnly) {
      where.read = false
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 most recent notifications
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Failed to fetch notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/notifications
 * Create a new notification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, link } = body

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
      },
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Failed to create notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/notifications
 * Mark notification(s) as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationId, userId, markAllAsRead } = body

    if (markAllAsRead && userId) {
      // Mark all notifications for user as read
      await prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
        },
      })

      return NextResponse.json({ success: true, message: 'All notifications marked as read' })
    }

    if (notificationId) {
      // Mark single notification as read
      const notification = await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      })

      return NextResponse.json(notification)
    }

    return NextResponse.json(
      { error: 'Either notificationId or userId with markAllAsRead is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Failed to update notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}
