"use client"

import { AppShell } from "@/components/layout/AppShell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield, FileCode, Globe, Lock } from "lucide-react"
import { PageHero } from "@/components/ui/PageHero"
import { VinylFlip } from "@/components/ui/VinylFlip"

export default function GlobalRightsPage() {
    const SPG_NFT_CONTRACT = "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc"
    const STORY_EXPLORER_BASE = "https://aeneid.storyscan.io"
    const STORY_DOCS = "https://docs.story.foundation"

    return (
        <AppShell>
            <div className="min-h-screen bg-background">
                <PageHero
                    title="GLOBAL RIGHTS"
                    subtitle="PROTOCOL"
                    description="Powered by Story Protocol. Your music, your rules, everywhere."
                    sideText="SIDE B"
                >
                    <VinylFlip
                        className="w-64 h-64 ml-auto"
                        front={
                            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                <Globe className="w-32 h-32 animate-pulse-slow" />
                            </div>
                        }
                        back={
                            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                                <span className="font-mono text-sm font-bold tracking-widest">
                                    OWN
                                    <br />
                                    YOUR
                                    <br />
                                    FUTURE
                                </span>
                            </div>
                        }
                    />
                </PageHero>

                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    {/* Story Protocol Integration */}
                    <div className="bg-background border-2 border-foreground p-8 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-foreground text-background rounded-none">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Story Protocol Integration</h2>
                        </div>
                        <div className="space-y-6">
                            <p className="text-lg font-light leading-relaxed">
                                Every track uploaded to Side B is registered as intellectual property on{" "}
                                <strong className="font-bold">Story Protocol</strong>, a blockchain infrastructure for programmable IP.
                                This means your music is protected, traceable, and yours to license globally.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 border-2 border-foreground bg-muted/20">
                                    <h4 className="font-bold uppercase text-sm mb-2">Blockchain</h4>
                                    <p className="font-mono text-sm text-muted-foreground">Story Protocol Aeneid Testnet</p>
                                </div>
                                <div className="p-4 border-2 border-foreground bg-muted/20">
                                    <h4 className="font-bold uppercase text-sm mb-2">Network Status</h4>
                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-600 rounded-none font-mono uppercase">
                                        Live
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SPG NFT Contract */}
                    <div className="bg-background border-2 border-foreground p-8 mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-foreground text-background rounded-none">
                                <FileCode className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold uppercase tracking-tight">SPG NFT Collection Contract</h2>
                        </div>
                        <div className="space-y-6">
                            <p className="text-muted-foreground font-light">
                                Side B uses Story Protocol's SPG (Story Proof of Governance) NFT Collection
                                to register music as IP assets. Each upload mints an NFT and registers it as
                                intellectual property on-chain.
                            </p>

                            <div className="bg-foreground text-background p-4 font-mono text-sm break-all border-2 border-foreground">
                                {SPG_NFT_CONTRACT}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="rounded-none border-2 border-foreground hover:bg-foreground hover:text-background"
                                    onClick={() => window.open(`${STORY_EXPLORER_BASE}/address/${SPG_NFT_CONTRACT}`, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    VIEW ON STORYSCAN
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="bg-background border-2 border-foreground p-8 mb-8">
                        <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">How IP Registration Works</h2>
                        <div className="space-y-8">
                            <Step
                                number="01"
                                title="Upload Your Track"
                                description="Upload your session (jam, rehearsal, or produced track) to Side B."
                            />
                            <Step
                                number="02"
                                title="NFT Minting"
                                description="An NFT is minted on the SPG collection representing your music."
                            />
                            <Step
                                number="03"
                                title="IP Registration"
                                description="The NFT is registered as an IP Asset on Story Protocol with metadata."
                            />
                            <Step
                                number="04"
                                title="License & Monetize"
                                description="Your IP is now licensable. Creators can purchase licenses directly from you."
                            />
                            <Step
                                number="05"
                                title="Track Everything"
                                description="All transactions are on-chain and viewable on StoryScan block explorer."
                            />
                        </div>
                    </div>

                    {/* Viewing Your IP Assets */}
                    <div className="bg-background border-2 border-foreground p-8 mb-8">
                        <h2 className="text-2xl font-bold uppercase tracking-tight mb-6">Viewing Your IP Assets</h2>
                        <div className="space-y-6">
                            <p className="text-muted-foreground font-light">
                                Once your track is uploaded and registered, you can view it on the Story Protocol
                                block explorer (StoryScan). Each IP asset has:
                            </p>

                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 font-mono text-sm">
                                <li>UNIQUE IP ID (ON-CHAIN IDENTIFIER)</li>
                                <li>TRANSACTION HASH (PROOF OF REGISTRATION)</li>
                                <li>NFT TOKEN ID WITHIN THE SPG COLLECTION</li>
                                <li>METADATA (TITLE, DESCRIPTION, CONTENT TYPE)</li>
                                <li>LICENSE HISTORY AND OWNERSHIP RECORDS</li>
                            </ul>

                            <div className="mt-6 p-4 border-l-4 border-foreground bg-muted/20">
                                <p className="text-sm text-muted-foreground font-mono">
                                    NOTE: After uploading a track, you'll see the transaction hash and IP ID in your Studio.
                                    Click the explorer link to view your IP asset on StoryScan.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="outline"
                                    className="rounded-none border-2 border-foreground hover:bg-foreground hover:text-background"
                                    onClick={() => window.open(STORY_EXPLORER_BASE, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    OPEN STORYSCAN
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-none border-2 border-foreground hover:bg-foreground hover:text-background"
                                    onClick={() => window.open(STORY_DOCS, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    PROTOCOL DOCS
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Future Features */}
                    <div className="border-2 border-dashed border-foreground p-8 opacity-70 hover:opacity-100 transition-opacity">
                        <h2 className="text-2xl font-bold uppercase tracking-tight mb-6">Coming Soon</h2>
                        <div className="space-y-3 font-mono text-sm text-muted-foreground">
                            <p>🚀 CUSTOM LICENSING TERMS AND PRICING MODELS</p>
                            <p>🚀 ROYALTY SPLITTING FOR COLLABORATIONS</p>
                            <p>🚀 IP ASSET MARKETPLACE FOR TRADING RIGHTS</p>
                            <p>🚀 DERIVATIVE WORK REGISTRATION (REMIXES, COVERS)</p>
                            <p>🚀 REVENUE ANALYTICS AND PAYMENT DISTRIBUTION</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    )
}

function Step({ number, title, description }: { number: string, title: string, description: string }) {
    return (
        <div className="flex gap-6 items-start group">
            <div className="flex-shrink-0 w-12 h-12 border-2 border-foreground flex items-center justify-center text-lg font-bold bg-background group-hover:bg-foreground group-hover:text-background transition-colors">
                {number}
            </div>
            <div>
                <h4 className="text-xl font-bold uppercase mb-2 tracking-tight">{title}</h4>
                <p className="text-muted-foreground font-light leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    )
}
