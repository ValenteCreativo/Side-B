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
                        <VinylFlip
                            className="w-64 h-64 ml-auto"
                            front={
                                <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                    <FileCheck className="w-32 h-32" />
                                </div>
                            }
                            back={
                                <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                                    <span className="font-mono text-sm font-bold tracking-widest">
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
                    <VinylFlip
                        className="w-64 h-64 ml-auto"
                        front={
                            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                <FileCheck className="w-32 h-32" />
                            </div>
                        }
                        back={
                            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                                <span className="font-mono text-sm font-bold tracking-widest">
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
                            <div className="bg-background border-2 border-foreground p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                <div className="text-4xl font-bold mb-2">{licenses.length}</div>
                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Total Licenses</div>
                            </div>
                            <div className="bg-background border-2 border-foreground p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                <div className="text-4xl font-bold mb-2">
                                    {formatPrice(licenses.reduce((sum, l) => sum + l.session.priceUsd, 0))}
                                </div>
                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Total Invested</div>
                            </div>
                            <div className="bg-background border-2 border-foreground p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                <div className="text-4xl font-bold mb-2">
                                    {new Set(licenses.map(l => l.session.owner.walletAddress)).size}
                                </div>
                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Artists Supported</div>
                            </div>
                        </div>
                    )}

                    {/* Licenses List */}
                    {isLoading ? (
                        <div className="py-20 text-center border-2 border-dashed border-foreground/20">
                            <p className="font-mono text-muted-foreground animate-pulse">LOADING_LICENSES...</p>
                        </div>
                    ) : licenses.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-foreground/20">
                            <Music className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-50" />
                            <p className="text-muted-foreground mb-8 font-light text-lg">You haven't licensed any tracks yet</p>
                            <Button
                                onClick={() => window.location.href = '/catalog'}
                                size="lg"
                                className="rounded-none border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                            >
                                BROWSE CATALOG
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {licenses.map((license) => (
                                <div key={license.id} className="group relative">
                                    <div className="absolute inset-0 bg-foreground translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" />
                                    <div className="relative bg-background border-2 border-foreground p-6 hover:-translate-y-1 transition-transform duration-300">
                                        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold mb-2 tracking-tight">
                                                    {license.session.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                                                    <span className="font-mono uppercase">
                                                        by {license.session.owner.displayName || "Anonymous Artist"}
                                                    </span>
                                                    <div className="h-1 w-1 bg-foreground rounded-full" />
                                                    <Badge variant="outline" className="rounded-none border-foreground font-mono">
                                                        {license.session.contentType}
                                                    </Badge>
                                                    <div className="h-1 w-1 bg-foreground rounded-full" />
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
                                                        className="rounded-none bg-foreground text-background hover:bg-foreground/90"
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
                                                            className="rounded-none border-foreground hover:bg-foreground hover:text-background"
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
                                                            className="rounded-none border-foreground hover:bg-foreground hover:text-background"
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-2" />
                                                            LICENSE TX
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-right border-l-2 border-foreground pl-6 min-w-[150px]">
                                                <div className="text-3xl font-bold mb-1">
                                                    {formatPrice(license.session.priceUsd)}
                                                </div>
                                                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">License Fee</div>

                                                <div className="mt-6 pt-6 border-t border-border">
                                                    <h4 className="text-xs font-bold uppercase tracking-widest mb-3">Terms</h4>
                                                    <ul className="text-[10px] font-mono text-muted-foreground space-y-1 text-left">
                                                        <li>[X] NON-EXCLUSIVE</li>
                                                        <li>[X] COMMERCIAL USE</li>
                                                        <li>[X] ATTRIBUTION</li>
                                                        <li>[ ] RESALE</li>
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
