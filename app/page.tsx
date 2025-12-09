"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mic2, Users, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { VinylFlip } from "@/components/ui/VinylFlip"
import { EncryptedText } from "@/components/ui/encryptedtext"

export default function Home() {
  const [vinylFlipped, setVinylFlipped] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-bronze selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 border-b border-zinc-200 dark:border-zinc-800">
        <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10"
          >
            {/* Badge */}
            <div className="inline-block border border-[hsl(var(--bronze)/0.5)] px-4 py-1 mb-6 rounded-full bg-[hsl(var(--bronze)/0.05)]">
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-bronze">
                On-chain IP for independent music
              </span>
            </div>

            {/* Title */}
            <h1 className="text-display mb-8 leading-[0.9] tracking-tight">
              SIDE <br />
              <span className="text-bronze">B</span>
            </h1>

            {/* Subcopy */}
            <p className="text-xl md:text-2xl font-light tracking-wide max-w-md mb-12 border-l-2 border-bronze pl-6 text-muted-foreground">
              Built for musicians who won&apos;t play the influencer game — and creators who need real music.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog">
                <Button size="lg" className="rounded-sm text-lg px-8 py-6 shadow-refined hover-lift">
                  EXPLORE CATALOG <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/studio">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-sm text-lg px-8 py-6 hover-bronze hover:text-bronze"
                >
                  ENTER STUDIO
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Art / Vinyl Flip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[50vh] w-full flex items-center justify-center"
          >
            <VinylFlip
              variant="transparent"
              className="w-80 h-80 md:w-96 md:h-96"
              onFlipChange={setVinylFlipped}
              front={
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Centro del disco sin texto, limpio */}
                  <div className="w-2 h-2 rounded-full bg-bronze/80" />

                  {/* Sello holográfico centrado */}
                  {!vinylFlipped && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--bronze)/0.6)] bg-[linear-gradient(120deg,rgba(255,255,255,0.08),hsl(var(--bronze)/0.45),rgba(148,163,184,0.3))] px-6 py-2 text-[9px] font-mono uppercase tracking-[0.25em] backdrop-blur-sm shadow-[0_0_18px_rgba(251,191,36,0.45)] group-hover:shadow-[0_0_26px_rgba(251,191,36,0.75)] group-hover:-translate-y-0.5 group-hover:brightness-110 transition-all">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
                        <span>PLAY THE RECORD</span>
                      </div>
                    </div>
                  )}
                </div>
              }
              back={
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  {/* MUSIC / IS / ART en líneas, desencriptado al voltear */}
                  <EncryptedText
                    text="MUSIC"
                    delay={200}
                    speed={90}
                    trigger={vinylFlipped}
                    loop={false}
                    loopDelay={15000}
                    className="font-mono text-xl md:text-2xl font-bold tracking-[0.5em] text-center"
                  />
                  <EncryptedText
                    text="IS"
                    delay={400}
                    speed={90}
                    trigger={vinylFlipped}
                    loop={false}
                    loopDelay={15000}
                    className="font-mono text-xl md:text-2xl font-bold tracking-[0.5em] text-center"
                  />
                  <EncryptedText
                    text="ART"
                    delay={600}
                    speed={90}
                    trigger={vinylFlipped}
                    loop={false}
                    loopDelay={15000}
                    className="font-mono text-xl md:text-2xl font-bold tracking-[0.5em] text-center"
                  />
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
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pb-10"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground">Scroll</span>
          <div className="w-[1px] h-12 bg-zinc-300 dark:bg-zinc-700" />
        </motion.div>
      </section>

      {/* Manifesto Section */}
      <section className="py-32 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-display mb-12 tracking-tight">
              NOT CONTENT. <br />
              <span className="text-bronze">ART.</span>
            </h2>
            <p className="text-xl md:text-3xl font-light leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              Streaming pays in fractions. Real income mostly comes if you turn yourself into content. But the hours you
              spend in rehearsal rooms, the late nights experimenting, the voice memos, the creative process itself—
              <span className="text-foreground font-bold">that has value</span>.
            </p>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-muted-foreground max-w-3xl mx-auto mt-8">
              Side B Sessions honors the craft. Sign in with your email. Upload your sound.
              Register it as intellectual property. License it globally.
            </p>
            <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto mt-4">
              <span className="text-bronze font-bold">
                Earn from your art, not your follower count.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid - For Musicians */}
      <section className="py-0 border-b border-zinc-200 dark:border-zinc-800">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
          <FeatureCard
            icon={<Mic2 className="h-10 w-10 text-bronze" />}
            title="REGISTER & EARN"
            description="Upload your sessions, register them as IP on-chain, and open them up for licensing to filmmakers, game devs, and creators."
            link="/studio"
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-bronze" />}
            title="ENCRYPTED COLLABS"
            description="Connect through encrypted messaging. Share references, negotiate custom work, and build long-term creative relationships off the algorithm."
            link="/community"
          />
          <FeatureCard
            icon={<Globe className="h-10 w-10 text-bronze" />}
            title="GLOBAL IP RIGHTS"
            description="Blockchain-verified ownership and clear licensing terms, powered by Story Protocol. Keep your rights, choose how your music is used."
            link="/rights"
          />
        </div>
      </section>

      {/* For Creators Section */}
      <section className="py-24 border-b border-zinc-200 dark:border-zinc-800 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase border border-[hsl(var(--bronze)/0.5)] px-4 py-1 inline-block mb-6 rounded-full text-bronze bg-[hsl(var(--bronze)/0.05)]">
                For Creators
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                Authentic sound for <br />
                <span className="text-bronze">your creative vision.</span>
              </h2>
              <p className="text-xl md:text-2xl font-light leading-relaxed text-muted-foreground">
                Films. Podcasts. Games. Content. Find original, licensable music with verified ownership. No stock
                libraries. No generic loops. Just independent artists creating real sound.
                <br />
                <br />
                Every track comes with IP on-chain and clear{" "}
                <span className="text-foreground font-semibold">commercial licensing terms</span>, so you can use it in
                your projects without legal gray areas.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog">
                <Button size="lg" className="rounded-sm text-lg px-8 py-6 shadow-refined hover-lift">
                  BROWSE CATALOG <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-sm text-lg px-8 py-6 hover-bronze hover:text-bronze"
                >
                  LEARN MORE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-start md:items-center gap-1">
            <div className="text-[10px] font-mono text-muted-foreground tracking-[0.25em] uppercase">
              © 2025 SIDE B SESSIONS
            </div>
            <div className="text-[9px] font-mono text-muted-foreground/70 tracking-widest">
              From México with <span className="text-bronze">❤️‍🔥</span>
            </div>
          </div>
          <div className="flex gap-8">
            <Link
              href="/about"
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-bronze transition-colors"
            >
              About
            </Link>
            <Link
              href="https://github.com/ValenteCreativo/Side-B"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-bronze transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}) {
  return (
    <Link
      href={link}
      className="group relative bg-background p-12 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-refined"
    >
      <div className="mb-8 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase group-hover:text-bronze transition-colors">
        {title}
      </h3>
      <p className="font-light leading-relaxed text-lg text-muted-foreground mb-8">{description}</p>
      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 text-bronze">
        <ArrowRight className="h-6 w-6" />
      </div>
    </Link>
  )
}
