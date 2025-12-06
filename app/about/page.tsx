"use client"

import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Shield, Users, Zap, Film } from "lucide-react"
import { PageHero } from "@/components/ui/PageHero"
import { VinylFlip } from "@/components/ui/VinylFlip"

export default function AboutPage() {
  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        <PageHero
          title="ABOUT SIDE B"
          subtitle="MISSION"
          description="An independent music marketplace where musicians register their work as IP — and creators can license it safely."
          sideText="SIDE B"
        >
          <VinylFlip
            flippable={false}
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
            <h2 className="text-3xl font-bold mb-6 tracking-tighter uppercase">The Manifesto</h2>
            <div className="space-y-4 text-lg font-light leading-relaxed">
              <p>
                <strong className="text-bronze">Music is not content.</strong> It&apos;s art. It&apos;s hours in rehearsal rooms,
                late nights experimenting, raw moments that never see a stage. While streaming platforms pay fractions and
                fame remains a lottery, Side B Sessions honors the craft itself.
              </p>
              <p>
                We built this platform for the independent underground—musicians who deserve ownership, fair compensation,
                and creative freedom. Here, you don&apos;t need followers. You need only your art.
              </p>
              <p>
                And if you&apos;re a creator—filmmaker, game developer, podcaster, storyteller—Side B is your way to find
                original music with clear, on-chain IP and straightforward commercial licenses. No stock-library feel, no
                legal gray areas. Just real artists, real sound, and transparent rights.
              </p>
              <p className="text-bronze font-bold">
                Sign in with email. Upload your sound. Register it as intellectual property. License it globally.
              </p>
              <p>
                Zero blockchain knowledge required. Zero technical barriers. Just you, your music, and the rights you
                deserve—and the creators who actually need it.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 font-mono text-sm text-muted-foreground pt-4">
                <li>
                  <span className="text-foreground font-bold">OWN</span> YOUR INTELLECTUAL PROPERTY WITH BLOCKCHAIN
                  VERIFICATION
                </li>
                <li>
                  <span className="text-foreground font-bold">LICENSE</span> YOUR MUSIC DIRECTLY TO CREATORS WORLDWIDE
                </li>
                <li>
                  <span className="text-foreground font-bold">EARN</span> FROM YOUR ART, NOT YOUR FOLLOWER COUNT
                </li>
                <li>
                  <span className="text-foreground font-bold">FIND</span> AUTHENTIC MUSIC FOR FILMS, GAMES, PODCASTS
                  WITH CLEAR COMMERCIAL RIGHTS
                </li>
                <li>
                  <span className="text-foreground font-bold">CONNECT</span> WITH THE CREATIVE UNDERGROUND THROUGH
                  ENCRYPTED MESSAGING
                </li>
              </ul>
            </div>
          </div>

          {/* Musicians vs Creators */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-6 shadow-refined">
            <div>
              <h3 className="text-sm font-mono tracking-[0.25em] uppercase text-bronze mb-3">
                If you&apos;re a musician
              </h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                Upload your voice notes, rehearsals, and finished tracks. Side B turns them into on-chain IP, lets you
                set your price, track licenses, and see how your catalog performs over time—without becoming an
                influencer or mastering distribution platforms.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-mono tracking-[0.25em] uppercase text-bronze mb-3">
                If you&apos;re a creator
              </h3>
              <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
                Browse a curated underground catalog. Preview tracks, purchase non-exclusive commercial licenses in a
                few clicks, download instantly, and sleep well knowing rights are registered on-chain. When you need
                something more specific, message the artist directly and build something together.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <FeatureCard
              icon={<Music className="h-6 w-6" />}
              title="Raw & Authentic"
              description="Share your jam sessions, rehearsals, demos, and experimental tracks. Side B celebrates the creative process, the B-sides, the moments that define your artistic journey."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Verified Ownership"
              description="Every upload automatically registers your music as intellectual property with blockchain verification. Own your work, license on your terms, track everything transparently."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Creative Underground"
              description="Connect directly with fellow artists and creators through encrypted messaging. Build authentic relationships, discover collaborators, and bridge music with visual storytelling."
            />
            <FeatureCard
              icon={<Film className="h-6 w-6" />}
              title="Clear Commercial Licensing"
              description="For filmmakers, game devs, and content creators: discover non-stock, IP-registered music with straightforward commercial licenses and instant downloads for your projects."
            />
          </div>

          {/* The Story Behind Side B */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 mb-12 border border-zinc-200 dark:border-zinc-800 shadow-refined relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-bronze/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl font-bold mb-6 tracking-tighter uppercase text-bronze">Why &quot;Side B&quot;?</h2>
            <div className="space-y-4 text-lg font-light leading-relaxed opacity-90">
              <p>
                In the vinyl era, the &quot;Side B&quot; of a record often contained the experimental tracks, the B-sides,
                the raw moments that didn&apos;t make the radio cut. Yet these tracks often became cult favorites, showcasing
                the true artistry and creative exploration of musicians.
              </p>
              <p>
                Side B Sessions honors that spirit. We&apos;re a platform for the unpolished, the experimental, the in-between
                moments that define an artist&apos;s journey. Your jam sessions, your late-night rehearsals, your creative
                experiments—they all have value, and they all deserve a home.
              </p>
              <p>
                And for creators, Side B becomes a different kind of library: one built from real artistic process, not
                production-line background tracks.
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="border border-zinc-200 dark:border-zinc-800 p-8 bg-background shadow-refined">
            <h2 className="text-3xl font-bold mb-8 tracking-tighter uppercase">Technology & Infrastructure</h2>
            <p className="text-muted-foreground mb-8 text-lg font-light leading-relaxed">
              Built with production-grade technology to deliver Web3 benefits with Web2 simplicity. Every component
              chosen for reliability, security, and user experience—for both musicians and creators.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <TechItem label="Frontend" value="Next.js 14.2, React 18, TypeScript" />
              <TechItem label="Styling" value="Tailwind CSS, shadcn/ui, Framer Motion" />
              <TechItem label="Database" value="Prisma ORM, PostgreSQL" />
              <TechItem label="Authentication" value="Coinbase CDP (Email/OTP)" />
              <TechItem label="Blockchain" value="Base Network L2, Viem 2.21" />
              <TechItem label="IP Registry" value="Story Protocol SDK v1.0" />
              <TechItem label="Messaging" value="Waku P2P (End-to-End Encrypted)" />
              <TechItem label="Storage" value="Vercel Blob, Pinata IPFS" />
              <TechItem label="Payments" value="USDC/ETH, Halliday Fiat On-Ramp" />
              <TechItem label="Smart Contracts" value="Foundry, Solidity 0.8.20" />
              <TechItem label="Security" value="Zod Validation, ERC-20 Verification" />
              <TechItem label="Design System" value="Refined Brutalism Architecture" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-background border border-zinc-200 dark:border-zinc-800 p-6 hover-lift hover:border-bronze/50 transition-all duration-300 h-full group">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-foreground group-hover:bg-bronze group-hover:text-white transition-colors duration-300 rounded-sm">
          {icon}
        </div>
        <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-bronze transition-colors">
          {title}
        </h3>
      </div>
      <p className="text-muted-foreground font-light leading-relaxed">{description}</p>
    </div>
  )
}

function TechItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-bold uppercase text-sm mb-1 text-bronze">{label}</p>
      <p className="text-muted-foreground font-mono text-xs">{value}</p>
    </div>
  )
}
