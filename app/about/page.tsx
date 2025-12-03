"use client"

import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Shield, Users, Zap } from "lucide-react"

export default function AboutPage() {
    return (
        <AppShell>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4 tracking-tight">About Side B</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            A minimalist marketplace for independent musicians to register and license their music as IP
                        </p>
                    </div>

                    {/* Mission Statement */}
                    <Card className="bg-card/40 backdrop-blur-md border-white/5 mb-8">
                        <CardHeader>
                            <CardTitle className="text-2xl">Our Mission</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-muted-foreground">
                            <p>
                                Side B Sessions is revolutionizing how independent musicians share and monetize their creative work.
                                We believe that every jam session, rehearsal, and raw recording has value—not just polished studio
                                productions.
                            </p>
                            <p>
                                By combining Web3 technology with a minimalist user experience, we empower musicians to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Own their intellectual property on-chain</li>
                                <li>License their music directly to creators</li>
                                <li>Build a community around their creative process</li>
                                <li>Earn from their "Side B" moments—the raw, unfiltered sessions</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <Card className="bg-card/40 backdrop-blur-md border-white/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <Music className="h-5 w-5" />
                                    </div>
                                    Raw & Authentic
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                <p>
                                    Share your jam sessions, rehearsals, and unpolished recordings. Side B celebrates the creative
                                    process, not just the final product.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/40 backdrop-blur-md border-white/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    IP Protection
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                <p>
                                    Register your music as intellectual property on Story Protocol. Maintain ownership and
                                    control while licensing your work to creators.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/40 backdrop-blur-md border-white/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    Community First
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                <p>
                                    Connect with fellow musicians and creators. Follow, message, and discover new
                                    collaborators in a minimalist, distraction-free environment.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/40 backdrop-blur-md border-white/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    Web3 Powered
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                <p>
                                    Built on Coinbase wallet infrastructure with Story Protocol IP registration.
                                    Transparent, secure, and decentralized.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* The Story Behind Side B */}
                    <Card className="bg-card/40 backdrop-blur-md border-white/5 mb-8">
                        <CardHeader>
                            <CardTitle className="text-2xl">Why "Side B"?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-muted-foreground">
                            <p>
                                In the vinyl era, the "Side B" of a record often contained the experimental tracks, the B-sides,
                                the raw moments that didn't make the radio cut. Yet these tracks often became cult favorites,
                                showcasing the true artistry and creative exploration of musicians.
                            </p>
                            <p>
                                Side B Sessions honors that spirit. We're a platform for the unpolished, the experimental,
                                the in-between moments that define an artist's journey. Your jam sessions, your late-night
                                rehearsals, your creative experiments—they all have value, and they all deserve a home.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Tech Stack */}
                    <Card className="bg-card/40 backdrop-blur-md border-white/5">
                        <CardHeader>
                            <CardTitle className="text-2xl">Built With</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="font-medium mb-1">Frontend</p>
                                    <p className="text-muted-foreground">Next.js 14, React, TypeScript</p>
                                </div>
                                <div>
                                    <p className="font-medium mb-1">Styling</p>
                                    <p className="text-muted-foreground">Tailwind CSS, Radix UI</p>
                                </div>
                                <div>
                                    <p className="font-medium mb-1">Database</p>
                                    <p className="text-muted-foreground">Prisma, SQLite</p>
                                </div>
                                <div>
                                    <p className="font-medium mb-1">Auth</p>
                                    <p className="text-muted-foreground">Coinbase Wallet</p>
                                </div>
                                <div>
                                    <p className="font-medium mb-1">IP Registry</p>
                                    <p className="text-muted-foreground">Story Protocol</p>
                                </div>
                                <div>
                                    <p className="font-medium mb-1">Design</p>
                                    <p className="text-muted-foreground">Minimalist, Dark Mode</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    )
}
