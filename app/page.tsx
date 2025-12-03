"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Disc, Mic2, Globe } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-foreground selection:text-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10"
          >
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9] mb-8">
              SIDE <br />
              <span className="text-muted-foreground">B</span>
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wide max-w-md mb-12 border-l-2 border-foreground pl-6">
              The sanctuary for independent sound. <br />
              Register. License. Create.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog">
                <Button size="lg" className="rounded-none text-lg px-8 py-6 bg-foreground text-background hover:bg-foreground/90 transition-all">
                  Explore Catalog <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/studio">
                <Button variant="outline" size="lg" className="rounded-none text-lg px-8 py-6 border-foreground hover:bg-foreground hover:text-background transition-all">
                  Enter Studio
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Art */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[60vh] w-full"
          >
            <Image
              src="/assets/hero-art.png"
              alt="Abstract Sound Waves"
              fill
              className="object-contain dark:invert"
              priority
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-foreground/20" />
        </motion.div>
      </section>

      {/* Manifesto Section */}
      <section className="py-32 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12">
              MUSIC IS NOT CONTENT. <br />
              IT IS ART.
            </h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-muted-foreground">
              We are building a future where music is valued as intellectual property, not just a stream.
              Side B is a minimalist marketplace powered by Story Protocol, designed to give power back to the creators.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-px bg-border border border-border">
            <FeatureCard
              icon={<Disc className="h-10 w-10" />}
              title="The Catalog"
              description="Discover and license raw, unpolished gems from independent artists."
              link="/catalog"
            />
            <FeatureCard
              icon={<Mic2 className="h-10 w-10" />}
              title="The Studio"
              description="Upload your sessions. Register your IP. Manage your rights."
              link="/studio"
            />
            <FeatureCard
              icon={<Globe className="h-10 w-10" />}
              title="Global Rights"
              description="Powered by Story Protocol. Your music, your rules, everywhere."
              link="/rights"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm font-mono text-muted-foreground">
            © 2025 SIDE B SESSIONS.
          </div>
          <div className="flex gap-8">
            <Link href="/about" className="text-sm uppercase tracking-widest hover:underline underline-offset-4">About</Link>
            <Link href="https://github.com/ValenteCreativo/Side-B" target="_blank" rel="noopener noreferrer" className="text-sm uppercase tracking-widest hover:underline underline-offset-4">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) {
  return (
    <Link href={link} className="group bg-background p-12 hover:bg-foreground hover:text-background transition-colors duration-500">
      <div className="mb-8 opacity-50 group-hover:opacity-100 transition-opacity">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="font-light leading-relaxed opacity-80">{description}</p>
      <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
        <ArrowRight className="h-6 w-6" />
      </div>
    </Link>
  )
}
