"use client"

import { AppShell } from "@/components/layout/AppShell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield, FileCode } from "lucide-react"
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
                    <VinylFlip flippable={false}
                        className="w-64 h-64 ml-auto"
                        front={
                            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                <Shield className="w-32 h-32" />
                            </div>
                        }
                        back={
                            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
                                <span className="font-mono text-sm font-bold tracking-widest text-bronze">
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
                    <div className="bg-background border border-zinc-200 dark:border-zinc-800 p-8 mb-8 shadow-refined hover:shadow-refined-lg transition-refined">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-bronze/10 text-bronze rounded-sm">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Verified Ownership</h2>
                        </div>
                        <div className="space-y-6">
                            <p className="text-lg font-light leading-relaxed">
                                Every track you upload to Side B is automatically registered as <strong className="text-bronze">verified intellectual property</strong>.
                                Your music is protected with blockchain verification—permanent, traceable proof of ownership that you can license globally.
                            </p>
                            <p className="text-muted-foreground font-light">
                                Powered by Story Protocol, an infrastructure for programmable IP that makes your creative work legally protected and commercially viable.
                                No complicated setup. No technical knowledge required. Just upload, and you're protected.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-sm">
                                    <h4 className="font-bold uppercase text-sm mb-2 text-muted-foreground">Technology</h4>
                                    <p className="font-mono text-sm">Story Protocol (Blockchain IP Registry)</p>
                                </div>
                                <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 rounded-sm">
                                    <h4 className="font-bold uppercase text-sm mb-2 text-muted-foreground">Status</h4>
                                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-600/20 rounded-sm font-mono uppercase">
                                        Active & Protecting Your Work
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SPG NFT Contract */}
                    <div className="bg-background border border-zinc-200 dark:border-zinc-800 p-8 mb-8 shadow-refined">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-foreground rounded-sm">
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

                            <div className="bg-zinc-950 text-zinc-50 p-4 font-mono text-sm break-all border border-zinc-800 rounded-sm">
                                {SPG_NFT_CONTRACT}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="rounded-sm border-zinc-200 dark:border-zinc-800 hover:border-bronze hover:text-bronze transition-colors"
                                    onClick={() => window.open(`${STORY_EXPLORER_BASE}/address/${SPG_NFT_CONTRACT}`, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    VIEW ON STORYSCAN
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="bg-background border border-zinc-200 dark:border-zinc-800 p-8 mb-8 shadow-refined">
                        <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">How Protection Works</h2>
                        <div className="space-y-8">
                            <Step
                                number="01"
                                title="Upload Your Music"
                                description="Upload your session—jam, rehearsal, demo, or produced track. Any original sound you create."
                            />
                            <Step
                                number="02"
                                title="Automatic Protection"
                                description="Your music is instantly registered as verified intellectual property. You receive permanent proof of ownership."
                            />
                            <Step
                                number="03"
                                title="Blockchain Verification"
                                description="All ownership records are stored on blockchain infrastructure—permanent, transparent, and globally recognized."
                            />
                            <Step
                                number="04"
                                title="License & Earn"
                                description="Creators can license your protected work. You receive payment directly, with full transparency and proof of every transaction."
                            />
                            <Step
                                number="05"
                                title="Track Everything"
                                description="View all licensing activity and ownership history. Every transaction is recorded and verifiable forever."
                            />
                        </div>
                    </div>

                    {/* Viewing Your IP Assets */}
                    <div className="bg-background border border-zinc-200 dark:border-zinc-800 p-8 mb-8 shadow-refined">
                        <h2 className="text-2xl font-bold uppercase tracking-tight mb-6">Your Ownership Dashboard</h2>
                        <div className="space-y-6">
                            <p className="text-muted-foreground font-light">
                                After uploading your music, view your verified ownership and licensing activity in your Studio.
                                Every track includes permanent verification that you can share with anyone:
                            </p>

                            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 font-mono text-sm">
                                <li>UNIQUE OWNERSHIP IDENTIFIER (PERMANENT PROOF)</li>
                                <li>REGISTRATION TIMESTAMP (WHEN YOU CLAIMED IT)</li>
                                <li>VERIFICATION RECORD (BLOCKCHAIN PROOF)</li>
                                <li>TRACK DETAILS (TITLE, DESCRIPTION, TYPE)</li>
                                <li>LICENSING HISTORY (WHO LICENSED YOUR WORK)</li>
                            </ul>

                            <div className="mt-6 p-4 border-l-4 border-bronze bg-bronze/5">
                                <p className="text-sm text-muted-foreground font-mono">
                                    PRO TIP: After uploading, you'll see verification links in your Studio. Share these with anyone
                                    who needs proof of your ownership—labels, publishers, collaborators, or licensing platforms.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    variant="outline"
                                    className="rounded-sm border-zinc-200 dark:border-zinc-800 hover:border-bronze hover:text-bronze transition-colors"
                                    onClick={() => window.open(STORY_EXPLORER_BASE, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    OPEN STORYSCAN
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-sm border-zinc-200 dark:border-zinc-800 hover:border-bronze hover:text-bronze transition-colors"
                                    onClick={() => window.open(STORY_DOCS, '_blank')}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    PROTOCOL DOCS
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Future Features */}
                    <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-8 opacity-70 hover:opacity-100 transition-opacity hover:border-bronze/50">
                        <h2 className="text-2xl font-bold uppercase tracking-tight mb-6 text-muted-foreground">What's Next</h2>
                        <p className="text-muted-foreground font-light mb-4">
                            We're building the future of independent music rights. Coming soon:
                        </p>
                        <div className="space-y-3 font-mono text-sm text-muted-foreground">
                            <p>🚀 CUSTOM LICENSE TERMS (SET YOUR OWN RULES)</p>
                            <p>🚀 SPLIT ROYALTIES WITH COLLABORATORS</p>
                            <p>🚀 TRADE AND SELL OWNERSHIP RIGHTS</p>
                            <p>🚀 REGISTER DERIVATIVE WORKS (REMIXES, COVERS)</p>
                            <p>🚀 ADVANCED ANALYTICS AND REVENUE TRACKING</p>
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
            <div className="flex-shrink-0 w-12 h-12 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-lg font-bold bg-background group-hover:border-bronze group-hover:text-bronze transition-colors rounded-sm shadow-sm">
                {number}
            </div>
            <div>
                <h4 className="text-xl font-bold uppercase mb-2 tracking-tight group-hover:text-bronze transition-colors">{title}</h4>
                <p className="text-muted-foreground font-light leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    )
}
