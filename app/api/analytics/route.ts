import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { validateQuery, analyticsQuerySchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Validate query params with Zod
    const validation = validateQuery(searchParams, analyticsQuerySchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { userId } = validation.data

    // Get user's sessions
    const sessions = await prisma.session.findMany({
      where: { ownerId: userId },
      include: {
        licenses: true,
      },
    })

    // Calculate total revenue
    const totalRevenue = sessions.reduce((sum, session) => {
      const licenseRevenue = session.licenses.length * session.priceUsd * 0.98 // 98% after 2% fee
      return sum + licenseRevenue
    }, 0)

    // Calculate total licenses sold
    const totalLicenses = sessions.reduce((sum, session) => sum + session.licenses.length, 0)

    // Get revenue by month (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const recentLicenses = await prisma.license.findMany({
      where: {
        session: {
          ownerId: userId,
        },
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      include: {
        session: {
          select: {
            priceUsd: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Group by month
    const monthlyRevenue = recentLicenses.reduce((acc: any, license) => {
      const month = new Date(license.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
      if (!acc[month]) {
        acc[month] = { month, revenue: 0, sales: 0 }
      }
      acc[month].revenue += license.session.priceUsd * 0.98
      acc[month].sales += 1
      return acc
    }, {})

    // Get top performing tracks
    const topTracks = sessions
      .map((session) => ({
        id: session.id,
        title: session.title,
        sales: session.licenses.length,
        revenue: session.licenses.length * session.priceUsd * 0.98,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Get user growth metrics
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            sessions: true,
          },
        },
      },
    })

    return NextResponse.json({
      totalRevenue,
      totalLicenses,
      totalTracks: sessions.length,
      monthlyData: Object.values(monthlyRevenue),
      topTracks,
      followers: user?._count.followers || 0,
      following: user?._count.following || 0,
    })
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
