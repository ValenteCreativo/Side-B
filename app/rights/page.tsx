"use client"

import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield, FileCode, Globe } from "lucide-react"

export default function GlobalRightsPage() {
    const SPG_NFT_CONTRACT = "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc"
    const STORY_EXPLORER_BASE = "https://aeneid.storyscan.io"
    const STORY_DOCS = "https://docs.story.foundation"

    return (
        <AppShell>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Globe className="h-8 w-8" />
                            <h1 className="text-5xl font-bold tracking-tight">Global Rights</h1>
                        </div>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powered by Story Protocol. Your music, your rules, everywhere.
                        </p>
                    </div>

                    {/* Story Protocol Integration */}
                    <Card className="bg-card/40 backdrop-blur-md border-white/5 mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <Shield className="h-5 w-5" />
                                </div>
                                Story Protocol Integration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Every track uploaded to Side B is registered as intellectual property on{" "}
                                <strong>Story Protocol</strong>, a blockchain infrastructure for programmable IP.
                                This means your music is protected, traceable, and yours to license globally.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4 mt-6">
                                <div className="p-4 border border-white/5 rounded-md">
                                    <h4 className="font-medium mb-2">Blockchain</h4>
                                    <p className="text-sm text-muted-foreground">Story Protocol Aeneid Testnet</p>
                                </div>
                                <div className="p-4 border border-white/5 rounded-md">
                                    <h4 className="font-medium mb-2">Network Status</h4>
                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                        Live
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SPG NFT Contract */}
                    <Card className="bg-card/40 backdrop-blur-md border-white/5 mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <FileCode className="h-5 w-5" />
                                </div>
                                SPG NFT Collection Contract
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Side B uses Story Protocol's SPG (Story Proof of Governance) NFT Collection
                                to register music as IP assets. Each upload mints an NFT and registers it as
                                intellectual property on-chain.
                            </p>

                            <div className="bg-muted/50 p-4 rounded-md font-mono text-sm break-all">
                                {SPG_NFT_CONTRACT}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(`${STORY_EXPLORER_BASE}/address/${SPG_NFT_CONTRACT}`, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View on StoryScan
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* How It Works */}
                    <Card className="bg-card/40 backdrop-blur-md border-white/5 mb-6">
                        <CardHeader>
                            <CardTitle>How IP Registration Works</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Upload Your Track</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Upload your session (jam, rehearsal, or produced track) to Side B.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">NFT Minting</h4>
                                        <p className="text-sm text-muted-foreground">
                                            An NFT is minted on the SPG collection representing your music.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">IP Registration</h4>
                                        <p className="text-sm text-muted-foreground">
                                            The NFT is registered as an IP Asset on Story Protocol with metadata.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                                        4
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">License & Monetize</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Your IP is now licensable. Creators can purchase licenses directly from you.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                                        5
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Track Everything</h4>
                                        <p className="text-sm text-muted-foreground">
                                            All transactions are on-chain and viewable on StoryScan block explorer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Viewing Your IP Assets */}
                    <Card className="bg-card/40 backdrop-blur-md border-white/5 mb-6">
                        <CardHeader>
                            <CardTitle>Viewing Your IP Assets</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Once your track is uploaded and registered, you can view it on the Story Protocol
                                block explorer (StoryScan). Each IP asset has:
                            </p>

                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                                <li>Unique IP ID (on-chain identifier)</li>
                                <li>Transaction hash (proof of registration)</li>
                                <li>NFT token ID within the SPG collection</li>
                                <li>Metadata (title, description, content type)</li>
                                <li>License history and ownership records</li>
                            </ul>

                            <div className="mt-6 p-4 bg-muted/50 rounded-md">
                                <p className="text-sm text-muted-foreground mb-2">
                                    After uploading a track, you'll see the transaction hash and IP ID in your Studio.
                                    Click the explorer link to view your IP asset on StoryScan.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(STORY_EXPLORER_BASE, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open StoryScan Explorer
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(STORY_DOCS, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Story Protocol Docs
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Future Features */}
                    <Card className="bg-card/40 backdrop-blur-md border-white/5">
                        <CardHeader>
                            <CardTitle>Coming Soon</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-muted-foreground">
                            <p>🚀 Custom licensing terms and pricing models</p>
                            <p>🚀 Royalty splitting for collaborations</p>
                            <p>🚀 IP asset marketplace for trading rights</p>
                            <p>🚀 Derivative work registration (remixes, covers)</p>
                            <p>🚀 Revenue analytics and payment distribution</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    )
}
