"use client"

import { AppShell } from "@/components/ui/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Github, Shield, Zap } from "lucide-react"
import { PageHero } from "@/components/ui/PageHero"
import { VinylFlip } from "@/components/ui/VinylFlip"

export default function PricingPage() {
  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        <PageHero
          title="PRICING"
          subtitle="TRANSPARENT"
          description="Free and open source platform. Simple, honest fees."
          sideText="FAIR"
        >
          <VinylFlip
            flippable={false}
            className="w-64 h-64 ml-auto"
            front={
              <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                <DollarSign className="w-32 h-32" />
              </div>
            }
            back={
              <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
                <span className="font-mono text-sm font-bold tracking-widest text-bronze">
                  OPEN
                  <br />
                  SOURCE
                  <br />
                  PLATFORM
                </span>
              </div>
            }
          />
        </PageHero>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Main Value Prop */}
          <div className="bg-background border border-zinc-200 dark:border-zinc-800 p-8 mb-12 shadow-refined hover:shadow-refined-lg transition-refined relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-bronze transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <h2 className="text-3xl font-bold mb-6 tracking-tighter uppercase">Free to Use, Built to Last</h2>
            <div className="space-y-4 text-lg font-light leading-relaxed">
              <p>
                <strong className="text-bronze">Side B is open source and free to use.</strong> Musicians can upload,
                register intellectual property, and list music at no cost. Creators can browse and discover the full
                catalog freely.
              </p>
              <p>
                We believe in transparent, fair pricing—and building a sustainable platform that serves artists first.
              </p>
            </div>
          </div>

          {/* Fee Structure */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <PricingCard
              icon={<Zap className="h-6 w-6" />}
              title="Platform Fee"
              amount="3%"
              description="When a license sells, we take a 3% platform fee to maintain infrastructure, database costs, and ongoing development."
            />
            <PricingCard
              icon={<Shield className="h-6 w-6" />}
              title="Artist Earnings"
              amount="97%"
              description="Musicians receive 97% of every license sale, paid directly to their wallet. Smart contracts handle the split automatically—no delays, no middlemen."
            />
          </div>

          {/* Transaction Details */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 mb-12 border border-zinc-200 dark:border-zinc-800 shadow-refined">
            <h2 className="text-2xl font-bold mb-6 tracking-tighter uppercase text-bronze">How Payment Works</h2>
            <div className="space-y-4 text-base font-light leading-relaxed">
              <p>
                When a creator purchases a license, payment happens through smart contracts on the Base blockchain.
                The contract automatically splits funds: <strong>97% to the artist, 3% to the platform</strong>.
              </p>
              <p>
                <strong className="text-foreground">No transaction fees for you.</strong> Network fees are covered
                by a paymaster—you don't pay gas fees when buying or selling licenses.
              </p>
              <p className="text-sm text-muted-foreground font-mono mt-6">
                Payment accepted in USDC and ETH. Fiat on-ramp available via Halliday for credit/debit card purchases.
              </p>
            </div>
          </div>

          {/* Open Source */}
          <div className="border border-zinc-200 dark:border-zinc-800 p-8 bg-background shadow-refined relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-bronze/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-start gap-6">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 text-foreground group-hover:bg-bronze group-hover:text-white transition-colors duration-300 rounded-sm flex-shrink-0">
                <Github className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 tracking-tighter uppercase">Open Source Software</h2>
                <p className="text-muted-foreground font-light leading-relaxed mb-4">
                  Side B is fully open source. The codebase is public, auditable, and built with contributions from
                  the community. You can review smart contracts, inspect infrastructure, and understand exactly how
                  the platform works.
                </p>
                <a
                  href="https://github.com/ValenteCreativo/Side-B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-bronze hover:underline font-mono text-sm"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function PricingCard({
  icon,
  title,
  amount,
  description,
}: {
  icon: React.ReactNode
  title: string
  amount: string
  description: string
}) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-800 hover:border-bronze/50 transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-zinc-100 dark:bg-zinc-800 text-foreground group-hover:bg-bronze group-hover:text-white transition-colors duration-300 rounded-sm">
            {icon}
          </div>
          <CardTitle className="text-xl uppercase tracking-tight group-hover:text-bronze transition-colors">
            {title}
          </CardTitle>
        </div>
        <div className="text-4xl font-bold text-bronze">{amount}</div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground font-light leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
