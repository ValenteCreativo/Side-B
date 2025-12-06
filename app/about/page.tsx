"use client"

import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Shield, Users, Zap, Info } from "lucide-react"
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
                        variant="transparent"
                        className="w-64 h-64 ml-auto"
                        front={null}
                        back={
                            <div className="w-full h-full flex items-center justify-center text-center">
                                <span className="font-mono text-sm font-bold tracking-widest text-foreground">
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
                    <div className="bg-background border-2 border-foreground p-8 mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
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
                            <ul className="list-disc list-inside space-y-2 ml-4 font-mono text-sm">
                                <li>OWN THEIR INTELLECTUAL PROPERTY ON-CHAIN</li>
                                <li>LICENSE THEIR MUSIC DIRECTLY TO CREATORS</li>
                                <li>BUILD A COMMUNITY AROUND THEIR CREATIVE PROCESS</li>
                                <li>EARN FROM THEIR "SIDE B" MOMENTS—THE RAW, UNFILTERED SESSIONS</li>
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
                    <div className="bg-foreground text-background p-8 mb-12 border-2 border-foreground">
                        <h2 className="text-3xl font-bold mb-6 tracking-tighter uppercase">Why "Side B"?</h2>
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
                    <div className="border-2 border-foreground p-8">
                        <h2 className="text-3xl font-bold mb-8 tracking-tighter uppercase">Built With</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            <TechItem label="Frontend" value="Next.js 14, React, TypeScript" />
                            <TechItem label="Styling" value="Tailwind CSS, Radix UI" />
                            <TechItem label="Database" value="Prisma, SQLite" />
                            <TechItem label="Auth" value="Coinbase Wallet" />
                            <TechItem label="IP Registry" value="Story Protocol" />
                            <TechItem label="Design" value="Brutalist" />
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-background border-2 border-foreground p-6 hover:-translate-y-1 transition-transform duration-300 h-full">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-foreground text-background rounded-none">
                    {icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight">{title}</h3>
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
            <p className="font-bold uppercase text-sm mb-1">{label}</p>
            <p className="text-muted-foreground font-mono text-xs">{value}</p>
        </div>
    )
}
