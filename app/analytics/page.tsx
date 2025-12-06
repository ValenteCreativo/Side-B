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
            <VinylFlip flippable={false}
              className="w-64 h-64 ml-auto"
              front={
                <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                  <TrendingUp className="w-32 h-32" />
                </div>
              }
              back={
                <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
                  <span className="font-mono text-sm font-bold tracking-widest text-bronze">
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
          <VinylFlip flippable={false}
            className="w-64 h-64 ml-auto"
            front={
              <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                <TrendingUp className="w-32 h-32" />
              </div>
            }
            back={
              <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
                <span className="font-mono text-sm font-bold tracking-widest text-bronze">
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
                <Loader2 className="h-12 w-12 animate-spin text-bronze mx-auto mb-4" />
                <p className="text-muted-foreground font-mono text-lg tracking-widest">LOADING_DATA...</p>
              </div>
            </div>
          ) : analytics ? (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground">
                      <DollarSign className="h-4 w-4 text-bronze" />
                      Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-3xl font-bold text-foreground">${analytics.totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground uppercase mt-1">Total Earned</p>
                  </CardContent>
                </Card>

                <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground">
                      <Award className="h-4 w-4 text-bronze" />
                      Licenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-3xl font-bold text-foreground">{analytics.totalLicenses}</p>
                    <p className="text-xs text-muted-foreground uppercase mt-1">Total Sold</p>
                  </CardContent>
                </Card>

                <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground">
                      <Music className="h-4 w-4 text-bronze" />
                      Tracks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-3xl font-bold text-foreground">{analytics.totalTracks}</p>
                    <p className="text-xs text-muted-foreground uppercase mt-1">Published</p>
                  </CardContent>
                </Card>

                <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground">
                      <Users className="h-4 w-4 text-bronze" />
                      Followers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-3xl font-bold text-foreground">{analytics.followers}</p>
                    <p className="text-xs text-muted-foreground uppercase mt-1">Community</p>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Performance */}
              {analytics.monthlyData.length > 0 && (
                <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
                    <CardTitle className="font-mono uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-5 w-5 text-bronze" />
                      Monthly Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {analytics.monthlyData.map((data, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-0">
                          <div>
                            <p className="font-mono font-bold uppercase text-sm text-foreground">{data.month}</p>
                            <p className="text-xs text-muted-foreground">{data.sales} {data.sales === 1 ? 'sale' : 'sales'}</p>
                          </div>
                          <p className="text-xl font-bold text-bronze">${data.revenue.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Tracks */}
              {analytics.topTracks.length > 0 && (
                <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                  <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
                    <CardTitle className="font-mono uppercase tracking-widest flex items-center gap-2 text-muted-foreground">
                      <Award className="h-5 w-5 text-bronze" />
                      Top Performing Tracks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {analytics.topTracks.map((track, index) => (
                        <div key={track.id} className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 text-foreground flex items-center justify-center font-bold rounded-sm border border-zinc-200 dark:border-zinc-700">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{track.title}</p>
                              <p className="text-xs text-muted-foreground">{track.sales} {track.sales === 1 ? 'license' : 'licenses'}</p>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-bronze">${track.revenue.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No Data State */}
              {analytics.totalLicenses === 0 && (
                <Card className="rounded-md border border-dashed border-zinc-200 dark:border-zinc-800 shadow-none bg-zinc-50/50 dark:bg-zinc-900/50">
                  <CardContent className="py-12 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2 tracking-tight uppercase text-foreground">NO_SALES_YET</h3>
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
