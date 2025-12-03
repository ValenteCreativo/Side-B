"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Disc, Mic2, Users, Radio } from "lucide-react"
import { motion } from "framer-motion"
import { VinylFlip } from "@/components/ui/VinylFlip"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-foreground selection:text-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 border-b-2 border-foreground">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10"
          >
            <div className="inline-block border-2 border-foreground px-4 py-1 mb-6">
              <span className="font-mono text-sm font-bold tracking-widest uppercase">
                The B-Side of the Music Industry
              </span>
            </div>
            <h1 className="text-massive mb-8 leading-[0.8]">
              SIDE <br />
              <span className="accent-bronze">B</span>
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wide max-w-md mb-12 border-l-4 border-bronze pl-6">
              A sanctuary for independent sound. <br />
              Register. License. Create.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog">
                <Button size="lg" className="rounded-none text-lg px-8 py-6 border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-all">
                  EXPLORE CATALOG <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/studio">
                <Button variant="outline" size="lg" className="rounded-none text-lg px-8 py-6 border-2 border-foreground hover:bg-foreground hover:text-background transition-all">
                  ENTER STUDIO
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Art / Vinyl Flip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[50vh] w-full flex items-center justify-center"
          >
            <VinylFlip
              className="w-80 h-80 md:w-96 md:h-96"
              front={
                <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                  <Disc className="w-48 h-48 animate-spin-slow" />
                </div>
              }
              back={
                <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-4 border-foreground p-8 text-center">
                  <span className="font-mono text-xl font-bold tracking-widest leading-relaxed">
                    MUSIC
                    <br />
                    IS
                    <br />
                    ART
                  </span>
                </div>
              }
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pb-8"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-bold">Scroll</span>
          <div className="w-0.5 h-12 bg-foreground" />
        </motion.div>
      </section>

      {/* Manifesto Section */}
      <section className="py-32 border-b-2 border-foreground bg-foreground text-background">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-display mb-12">
              NOT CONTENT. <br />
              ART.
            </h2>
            <p className="text-xl md:text-3xl font-light leading-relaxed opacity-90 max-w-3xl mx-auto">
              Streaming pays fractions. Fame is a lottery. But the hours you spend rehearsing, creating, dreaming—they have value.
              Side B honors the craft. Register your IP. License your work. Earn from your art, not your follower count.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-0 border-b-2 border-foreground">
        <div className="grid md:grid-cols-3">
          <FeatureCard
            icon={<Disc className="h-12 w-12" />}
            title="DISCOVER & LICENSE"
            description="Browse authentic music from independent artists. License directly, support fairly."
            link="/catalog"
            borderRight
          />
          <FeatureCard
            icon={<Users className="h-12 w-12" />}
            title="CONNECT & COLLABORATE"
            description="Network with musicians and creators. Find collaborators, build community."
            link="/community"
            borderRight
          />
          <FeatureCard
            icon={<Mic2 className="h-12 w-12" />}
            title="UPLOAD & EARN"
            description="Register your sessions as IP. Set your terms. Monetize your craft."
            link="/studio"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm font-mono text-muted-foreground">
            © 2025 SIDE B SESSIONS.
          </div>
          <div className="flex gap-8">
            <Link href="/about" className="text-sm uppercase tracking-widest hover:bg-foreground hover:text-background px-2 py-1 transition-colors">About</Link>
            <Link href="https://github.com/ValenteCreativo/Side-B" target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-widest hover:bg-foreground hover:text-background px-2 py-1 transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, link, borderRight }: { icon: React.ReactNode, title: string, description: string, link: string, borderRight?: boolean }) {
  return (
    <Link href={link} className={`group relative bg-background p-12 hover:bg-foreground hover:text-background transition-colors duration-300 border-b-2 md:border-b-0 border-foreground ${borderRight ? 'md:border-r-2' : ''}`}>
      <div className="mb-8 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="text-3xl font-bold mb-4 tracking-tighter uppercase">{title}</h3>
      <p className="font-light leading-relaxed text-lg opacity-80 mb-8">{description}</p>
      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
        <ArrowRight className="h-8 w-8" />
      </div>
    </Link>
  )
}
