"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/components/auth/UserContext"
import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, Calendar, Music, FileCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/utils"
import { PageHero } from "@/components/ui/PageHero"
import { VinylFlip } from "@/components/ui/VinylFlip"

interface License {
    id: string
    createdAt: string
    txHash: string | null
    session: {
        id: string
        title: string
        description: string
        contentType: string
        audioUrl: string
        priceUsd: number
        storyAssetId: string | null
        storyTxHash: string | null
        owner: {
            walletAddress: string
            displayName: string | null
        }
    }
}

export default function LicensesPage() {
    const { user } = useUser()
    const { toast } = useToast()
    const [licenses, setLicenses] = useState<License[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchLicenses()
        }
    }, [user])

    const fetchLicenses = async () => {
        try {
            const response = await fetch(`/api/licenses?buyerId=${user?.id}`)
            if (!response.ok) throw new Error("Failed to fetch licenses")
            const data = await response.json()
            setLicenses(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load your licenses",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownload = async (audioUrl: string, title: string) => {
        try {
            // In production, you'd want to generate a signed download URL
            // For now, we'll open the audio URL
            const link = document.createElement('a')
            link.href = audioUrl
            link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`
            link.target = '_blank'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast({
                title: "Download started",
                description: `Downloading ${title}`,
            })
        } catch (error) {
            toast({
                title: "Download failed",
                description: "Please try again",
                variant: "destructive",
            })
        }
    }

    if (!user) {
        return (
            <AppShell>
                <div className="min-h-screen bg-background">
                    <PageHero
                        title="MY LICENSES"
                        subtitle="ACCESS_GRANTED"
                        description="Your collection of licensed works and commercial rights."
                        sideText="SIDE B"
                    >
                        <VinylFlip flippable={false}
                            className="w-64 h-64 ml-auto"
                            front={
                                <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                    <FileCheck className="w-32 h-32" />
                                </div>
                            }
                            back={
                                <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
                                    <span className="font-mono text-sm font-bold tracking-widest text-bronze">
                                        COMMERCIAL
                                        <br />
                                        RIGHTS
                                        <br />
                                        SECURED
                                    </span>
                                </div>
                            }
                        />
                    </PageHero>
                    <div className="container mx-auto px-4 py-12">
                        <p className="text-center text-muted-foreground font-mono">PLEASE_SIGN_IN_TO_VIEW_LICENSES</p>
                    </div>
                </div>
            </AppShell>
        )
    }

    return (
        <AppShell>
            <div className="min-h-screen bg-background">
                <PageHero
                    title="MY LICENSES"
                    subtitle="ACCESS_GRANTED"
                    description="Your collection of licensed works and commercial rights."
                    sideText="SIDE B"
                >
                    <VinylFlip flippable={false}
                        className="w-64 h-64 ml-auto"
                        front={
                            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                <FileCheck className="w-32 h-32" />
                            </div>
                        }
                        back={
                            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
                                <span className="font-mono text-sm font-bold tracking-widest text-bronze">
                                    COMMERCIAL
                                    <br />
                                    RIGHTS
                                    <br />
                                    SECURED
                                </span>
                            </div>
                        }
                    />
                </PageHero>

                <div className="container mx-auto px-4 py-12 max-w-6xl">
                    {/* Stats */}
                    {licenses.length > 0 && (
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-background border border-zinc-200 dark:border-zinc-800 p-6 shadow-refined rounded-md">
                                <div className="text-4xl font-bold mb-2 text-foreground">{licenses.length}</div>
                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Total Licenses</div>
                            </div>
                            <div className="bg-background border border-zinc-200 dark:border-zinc-800 p-6 shadow-refined rounded-md">
                                <div className="text-4xl font-bold mb-2 text-foreground">
                                    {formatPrice(licenses.reduce((sum, l) => sum + l.session.priceUsd, 0))}
                                </div>
                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Total Invested</div>
                            </div>
                            <div className="bg-background border border-zinc-200 dark:border-zinc-800 p-6 shadow-refined rounded-md">
                                <div className="text-4xl font-bold mb-2 text-foreground">
                                    {new Set(licenses.map(l => l.session.owner.walletAddress)).size}
                                </div>
                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Artists Supported</div>
                            </div>
                        </div>
                    )}

                    {/* Licenses List */}
                    {isLoading ? (
                        <div className="py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md">
                            <p className="font-mono text-muted-foreground animate-pulse">LOADING_LICENSES...</p>
                        </div>
                    ) : licenses.length === 0 ? (
                        <div className="py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md">
                            <Music className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground mb-8 font-light text-lg">You haven't licensed any tracks yet</p>
                            <Button
                                onClick={() => window.location.href = '/catalog'}
                                size="lg"
                                className="rounded-sm border border-zinc-200 dark:border-zinc-800 bg-transparent text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-refined shadow-sm"
                            >
                                BROWSE CATALOG
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {licenses.map((license) => (
                                <div key={license.id} className="group relative">
                                    <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800/50 translate-x-2 translate-y-2 rounded-md transition-transform duration-300 group-hover:translate-x-3 group-hover:translate-y-3" />
                                    <div className="relative bg-background border border-zinc-200 dark:border-zinc-800 p-6 rounded-md shadow-refined hover-lift">
                                        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold mb-2 tracking-tight">
                                                    {license.session.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                                                    <span className="font-mono uppercase">
                                                        by {license.session.owner.displayName || "Anonymous Artist"}
                                                    </span>
                                                    <div className="h-1 w-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                                                    <Badge variant="outline" className="rounded-sm border-zinc-200 dark:border-zinc-800 font-mono text-xs">
                                                        {license.session.contentType}
                                                    </Badge>
                                                    <div className="h-1 w-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                                                    <div className="flex items-center gap-2 font-mono text-xs">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                            {new Date(license.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground mb-6 max-w-2xl font-light leading-relaxed">
                                                    {license.session.description}
                                                </p>

                                                <div className="flex flex-wrap gap-3">
                                                    <Button
                                                        onClick={() => handleDownload(license.session.audioUrl, license.session.title)}
                                                        className="rounded-sm bg-foreground text-background hover:bg-foreground/90 shadow-refined hover-lift"
                                                    >
                                                        <Download className="h-4 w-4 mr-2" />
                                                        DOWNLOAD AUDIO
                                                    </Button>

                                                    {license.session.storyTxHash && (
                                                        <Button
                                                            onClick={() => window.open(
                                                                `https://aeneid.storyscan.io/tx/${license.session.storyTxHash}`,
                                                                '_blank'
                                                            )}
                                                            variant="outline"
                                                            className="rounded-sm border-zinc-200 dark:border-zinc-800 hover-bronze hover:text-bronze"
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            STORY PROTOCOL
                                                        </Button>
                                                    )}

                                                    {license.txHash && (
                                                        <Button
                                                            onClick={() => window.open(
                                                                `https://aeneid.storyscan.io/tx/${license.txHash}`,
                                                                '_blank'
                                                            )}
                                                            variant="outline"
                                                            className="rounded-sm border-zinc-200 dark:border-zinc-800 hover-bronze hover:text-bronze"
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            LICENSE TX
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right border-l border-zinc-200 dark:border-zinc-800 pl-6 min-w-[150px]">
                                                <div className="text-3xl font-bold mb-1 text-bronze">
                                                    {formatPrice(license.session.priceUsd)}
                                                </div>
                                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">License Fee</div>

                                                <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                                    <h4 className="text-xs font-bold uppercase tracking-widest mb-3">Terms</h4>
                                                    <ul className="text-[10px] font-mono text-muted-foreground space-y-1 text-left">
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-3 h-3 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-foreground" />
                                                            </div>
                                                            NON-EXCLUSIVE
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-3 h-3 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-foreground" />
                                                            </div>
                                                            COMMERCIAL USE
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-3 h-3 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-foreground" />
                                                            </div>
                                                            ATTRIBUTION
                                                        </li>
                                                        <li className="flex items-center gap-2 opacity-50">
                                                            <div className="w-3 h-3 border border-zinc-300 dark:border-zinc-700" />
                                                            RESALE
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    )
}
