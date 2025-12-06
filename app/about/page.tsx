"use client"

import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Shield, Users, Zap } from "lucide-react"
import { PageHero } from "@/components/ui/PageHero"
import { VinylFlip } from "@/components/ui/VinylFlip"

export default function AboutPage() {
    return (
        <AppShell>
            <div className="min-h-screen bg-background">
                <PageHero
                    title="ABOUT SIDE B"
                    subtitle="MISSION"
                    description="An independent music marketplace for musicians to register and license their music as IP."
                    sideText="SIDE B"
                >
                    <VinylFlip flippable={false}
                        className="w-64 h-64 ml-auto"
                        front={
                            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                <Music className="w-32 h-32" />
                            </div>
                        }
                        back={
                            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
                                <span className="font-mono text-sm font-bold tracking-widest text-bronze">
                                    RAW
                                    <br />
                                    REAL
                                    <br />
                                    RIGHTS
                                </span>
                            </div>
                        }
                    />
                </PageHero>

                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    {/* Mission Statement */}
                    <div className="bg-background border border-zinc-200 dark:border-zinc-800 p-8 mb-12 shadow-refined hover:shadow-refined-lg transition-refined relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-bronze transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                        <h2 className="text-3xl font-bold mb-6 tracking-tighter uppercase">Our Mission</h2>
                        <div className="space-y-4 text-lg font-light leading-relaxed">
                            <p>
                                Side B Sessions is revolutionizing how independent musicians share and monetize their creative work.
                                We believe that every jam session, rehearsal, and raw recording has value—not just polished studio
                                productions.
                            </p>
                            <p>
                                By combining Web3 technology with a powerful user experience, we empower musicians to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4 font-mono text-sm text-muted-foreground">
                                <li><span className="text-foreground font-bold">OWN</span> THEIR INTELLECTUAL PROPERTY ON-CHAIN</li>
                                <li><span className="text-foreground font-bold">LICENSE</span> THEIR MUSIC DIRECTLY TO CREATORS</li>
                                <li><span className="text-foreground font-bold">BUILD</span> A COMMUNITY AROUND THEIR CREATIVE PROCESS</li>
                                <li><span className="text-foreground font-bold">EARN</span> FROM THEIR "SIDE B" MOMENTS</li>
                            </ul>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <FeatureCard
                            icon={<Music className="h-6 w-6" />}
                            title="Raw & Authentic"
                            description="Share your jam sessions, rehearsals, and unpolished recordings. Side B celebrates the creative process, not just the final product."
                        />
                        <FeatureCard
                            icon={<Shield className="h-6 w-6" />}
                            title="IP Protection"
                            description="Register your music as intellectual property on Story Protocol. Maintain ownership and control while licensing your work to creators."
                        />
                        <FeatureCard
                            icon={<Users className="h-6 w-6" />}
                            title="Community First"
                            description="Connect with fellow musicians and creators. Follow, message, and discover new collaborators in a distraction-free environment."
                        />
                        <FeatureCard
                            icon={<Zap className="h-6 w-6" />}
                            title="Web3 Powered"
                            description="Built on Coinbase wallet infrastructure with Story Protocol IP registration. Transparent, secure, and decentralized."
                        />
                    </div>

                    {/* The Story Behind Side B */}
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 mb-12 border border-zinc-200 dark:border-zinc-800 shadow-refined relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-bronze/10 rounded-full blur-3xl pointer-events-none" />
                        <h2 className="text-3xl font-bold mb-6 tracking-tighter uppercase text-bronze">Why "Side B"?</h2>
                        <div className="space-y-4 text-lg font-light leading-relaxed opacity-90">
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
                        </div>
                    </div>

                    {/* Tech Stack */}
                    <div className="border border-zinc-200 dark:border-zinc-800 p-8 bg-background shadow-refined">
                        <h2 className="text-3xl font-bold mb-8 tracking-tighter uppercase">Built With</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <TechItem label="Frontend" value="Next.js 14, React 18, TypeScript" />
                            <TechItem label="Styling" value="Tailwind CSS, Radix UI, Framer Motion" />
                            <TechItem label="Database" value="Prisma ORM, PostgreSQL" />
                            <TechItem label="Blockchain" value="Base Network (L2), Viem" />
                            <TechItem label="Wallet" value="Coinbase CDP SDK" />
                            <TechItem label="IP Registry" value="Story Protocol SDK" />
                            <TechItem label="Messaging" value="Waku Protocol (encrypted P2P)" />
                            <TechItem label="Storage" value="Vercel Blob, Pinata IPFS" />
                            <TechItem label="Payments" value="USDC, ETH, Halliday Fiat On/Off-Ramp" />
                            <TechItem label="APIs" value="Etherscan V2, Base RPC" />
                            <TechItem label="Validation" value="Zod, ERC-20 Event Parsing" />
                            <TechItem label="Design" value="Refined Brutalism, shadcn/ui" />
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-background border border-zinc-200 dark:border-zinc-800 p-6 hover-lift hover:border-bronze/50 transition-all duration-300 h-full group">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-foreground group-hover:bg-bronze group-hover:text-white transition-colors duration-300 rounded-sm">
                    {icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-bronze transition-colors">{title}</h3>
            </div>
            <p className="text-muted-foreground font-light leading-relaxed">
                {description}
            </p>
        </div>
    )
}

function TechItem({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="font-bold uppercase text-sm mb-1 text-bronze">{label}</p>
            <p className="text-muted-foreground font-mono text-xs">{value}</p>
        </div>
    )
}
