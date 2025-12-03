"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/components/auth/UserContext"
import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Play, ExternalLink, Calendar, Music } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/utils"

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
                <div className="container mx-auto px-4 py-12">
                    <p className="text-center text-muted-foreground">Please sign in to view your licenses.</p>
                </div>
            </AppShell>
        )
    }

    return (
        <AppShell>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12 max-w-6xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2 tracking-tight">My Licenses</h1>
                        <p className="text-muted-foreground">
                            Access and download all your licensed tracks
                        </p>
                    </div>

                    {/* Stats */}
                    {licenses.length > 0 && (
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <Card className="bg-card/40 backdrop-blur-md border-white/5">
                                <CardContent className="pt-6">
                                    <div className="text-3xl font-bold mb-1">{licenses.length}</div>
                                    <div className="text-sm text-muted-foreground">Total Licenses</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/40 backdrop-blur-md border-white/5">
                                <CardContent className="pt-6">
                                    <div className="text-3xl font-bold mb-1">
                                        {formatPrice(licenses.reduce((sum, l) => sum + l.session.priceUsd, 0))}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Total Spent</div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card/40 backdrop-blur-md border-white/5">
                                <CardContent className="pt-6">
                                    <div className="text-3xl font-bold mb-1">
                                        {new Set(licenses.map(l => l.session.owner.walletAddress)).size}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Artists Supported</div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Licenses List */}
                    {isLoading ? (
                        <Card className="bg-card/40 backdrop-blur-md border-white/5">
                            <CardContent className="py-12">
                                <p className="text-center text-muted-foreground">Loading licenses...</p>
                            </CardContent>
                        </Card>
                    ) : licenses.length === 0 ? (
                        <Card className="bg-card/40 backdrop-blur-md border-white/5">
                            <CardContent className="py-12 text-center">
                                <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-muted-foreground mb-4">You haven't licensed any tracks yet</p>
                                <Button onClick={() => window.location.href = '/catalog'}>
                                    Browse Catalog
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {licenses.map((license) => (
                                <Card key={license.id} className="bg-card/40 backdrop-blur-md border-white/5">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">
                                                    {license.session.title}
                                                </CardTitle>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                                    <span>
                                                        by {license.session.owner.displayName || "Anonymous Artist"}
                                                    </span>
                                                    <span>•</span>
                                                    <Badge variant="outline">
                                                        {license.session.contentType}
                                                    </Badge>
                                                    <span>•</span>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                            Licensed {new Date(license.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">
                                                    {formatPrice(license.session.priceUsd)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">License Fee</div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">{license.session.description}</p>

                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                onClick={() => handleDownload(license.session.audioUrl, license.session.title)}
                                                variant="default"
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download Audio
                                            </Button>

                                            {license.session.storyTxHash && (
                                                <Button
                                                    onClick={() => window.open(
                                                        `https://aeneid.storyscan.io/tx/${license.session.storyTxHash}`,
                                                        '_blank'
                                                    )}
                                                    variant="outline"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View IP on StoryScan
                                                </Button>
                                            )}

                                            {license.txHash && (
                                                <Button
                                                    onClick={() => window.open(
                                                        `https://aeneid.storyscan.io/tx/${license.txHash}`,
                                                        '_blank'
                                                    )}
                                                    variant="outline"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View License Transaction
                                                </Button>
                                            )}
                                        </div>

                                        {/* License Terms */}
                                        <div className="mt-4 p-4 bg-muted/50 rounded-md">
                                            <h4 className="text-sm font-medium mb-2">License Terms</h4>
                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                <li>✓ Non-exclusive license</li>
                                                <li>✓ Use in commercial projects</li>
                                                <li>✓ Attribution required</li>
                                                <li>✓ No resale or sublicensing</li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    )
}
