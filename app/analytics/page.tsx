'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/components/auth/UserContext'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHero } from '@/components/ui/PageHero'
import { VinylFlip } from '@/components/ui/VinylFlip'
import { DollarSign, TrendingUp, Music, Users, Award, Loader2 } from 'lucide-react'

interface AnalyticsData {
  totalRevenue: number
  totalLicenses: number
  totalTracks: number
  monthlyData: Array<{
    month: string
    revenue: number
    sales: number
  }>
  topTracks: Array<{
    id: string
    title: string
    sales: number
    revenue: number
  }>
  followers: number
  following: number
}

export default function AnalyticsPage() {
  const { user } = useUser()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user])

  const fetchAnalytics = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/analytics?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <AppShell>
        <div className="min-h-screen bg-background">
          <PageHero
            title="ANALYTICS"
            subtitle="DATA_DASHBOARD"
            description="Track your performance and growth metrics"
            sideText="SIDE B"
          >
            <VinylFlip
              className="w-64 h-64 ml-auto"
              front={
                <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                  <TrendingUp className="w-32 h-32" />
                </div>
              }
              back={
                <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                  <span className="font-mono text-sm font-bold tracking-widest">
                    TRACK
                    <br />
                    YOUR
                    <br />
                    SUCCESS
                  </span>
                </div>
              }
            />
          </PageHero>
          <div className="container mx-auto px-4 py-12">
            <p className="text-center text-muted-foreground font-mono">PLEASE_SIGN_IN_TO_VIEW_ANALYTICS</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        <PageHero
          title="ANALYTICS"
          subtitle="DATA_DASHBOARD"
          description="Track your performance and growth metrics"
          sideText="SIDE B"
        >
          <VinylFlip
            className="w-64 h-64 ml-auto"
            front={
              <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                <TrendingUp className="w-32 h-32" />
              </div>
            }
            back={
              <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                <span className="font-mono text-sm font-bold tracking-widest">
                  {analytics ? `$${analytics.totalRevenue.toFixed(2)}` : 'LOADING'}
                  <br />
                  TOTAL
                  <br />
                  REVENUE
                </span>
              </div>
            }
          />
        </PageHero>

        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-mono text-lg tracking-widest">LOADING_DATA...</p>
              </div>
            </div>
          ) : analytics ? (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                  <CardHeader className="border-b-2 border-foreground pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest">
                      <DollarSign className="h-4 w-4" />
                      Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-3xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground uppercase mt-1">Total Earned</p>
                  </CardContent>
                </Card>

                <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                  <CardHeader className="border-b-2 border-foreground pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest">
                      <Award className="h-4 w-4" />
                      Licenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-3xl font-bold">{analytics.totalLicenses}</p>
                    <p className="text-xs text-muted-foreground uppercase mt-1">Total Sold</p>
                  </CardContent>
                </Card>

                <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                  <CardHeader className="border-b-2 border-foreground pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest">
                      <Music className="h-4 w-4" />
                      Tracks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-3xl font-bold">{analytics.totalTracks}</p>
                    <p className="text-xs text-muted-foreground uppercase mt-1">Published</p>
                  </CardContent>
                </Card>

                <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                  <CardHeader className="border-b-2 border-foreground pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest">
                      <Users className="h-4 w-4" />
                      Followers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-3xl font-bold">{analytics.followers}</p>
                    <p className="text-xs text-muted-foreground uppercase mt-1">Community</p>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Performance */}
              {analytics.monthlyData.length > 0 && (
                <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                  <CardHeader className="border-b-2 border-foreground">
                    <CardTitle className="font-mono uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Monthly Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {analytics.monthlyData.map((data, index) => (
                        <div key={index} className="flex items-center justify-between border-b-2 border-foreground/20 pb-3 last:border-0">
                          <div>
                            <p className="font-mono font-bold uppercase text-sm">{data.month}</p>
                            <p className="text-xs text-muted-foreground">{data.sales} {data.sales === 1 ? 'sale' : 'sales'}</p>
                          </div>
                          <p className="text-xl font-bold">${data.revenue.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Tracks */}
              {analytics.topTracks.length > 0 && (
                <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                  <CardHeader className="border-b-2 border-foreground">
                    <CardTitle className="font-mono uppercase tracking-widest flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Top Performing Tracks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {analytics.topTracks.map((track, index) => (
                        <div key={track.id} className="flex items-center justify-between border-b-2 border-foreground/20 pb-3 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-bold rounded-none border-2 border-foreground">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-bold">{track.title}</p>
                              <p className="text-xs text-muted-foreground">{track.sales} {track.sales === 1 ? 'license' : 'licenses'}</p>
                            </div>
                          </div>
                          <p className="text-lg font-bold">${track.revenue.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No Data State */}
              {analytics.totalLicenses === 0 && (
                <Card className="rounded-none border-2 border-dashed border-foreground/30">
                  <CardContent className="py-12 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2 tracking-tight uppercase">NO_SALES_YET</h3>
                    <p className="text-muted-foreground font-light">
                      Start uploading tracks to see your analytics grow
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  )
}
