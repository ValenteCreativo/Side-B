"use client"

import { useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Music, Film, Shield, Coins, Users, Sparkles, ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smooth spring physics for parallax
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const yHero = useSpring(useTransform(scrollYProgress, [0, 0.2], [0, 200]), springConfig)
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 1.1])

  const yVideo = useSpring(useTransform(scrollYProgress, [0.1, 0.4], [100, 0]), springConfig)
  const opacityVideo = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])

  return (
    <div ref={containerRef} className="relative min-h-[300vh] bg-background overflow-hidden selection:bg-primary/30">

      {/* Background Ambient Particles (CSS Animation) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-drift" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-breathe animation-delay-2000" />
      </div>

      {/* Hero Section */}
      <section className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center z-10 pointer-events-none">
        <motion.div
          style={{ y: yHero, opacity: opacityHero, scale: scaleHero }}
          className="text-center space-y-8 px-4"
        >
          <div className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary tracking-wide backdrop-blur-sm">
            SIDE B SESSIONS
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground mix-blend-difference">
            The Analog <br />
            <span className="text-primary font-serif italic">Sanctuary</span>
          </h1>

          <p className="max-w-xl mx-auto text-lg md:text-xl text-muted-foreground/80 font-light leading-relaxed">
            A weightless studio for independent musicians to register their work as IP
            and creators to find authentic sounds.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 pointer-events-auto">
            <Link href="/studio">
              <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5)]">
                Enter Studio
              </Button>
            </Link>
            <Link href="/catalog">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg border-primary/20 hover:bg-primary/10 hover:border-primary/50 transition-all hover:scale-105 backdrop-blur-sm">
                Browse Catalog
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Video Placeholder Section (Scrolls into view) */}
      <div className="relative z-20 mt-[100vh] min-h-screen flex items-center justify-center px-4">
        <motion.div
          style={{ y: yVideo, opacity: opacityVideo }}
          className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-black/40 backdrop-blur-md relative group"
        >
          {/* Faux Video UI */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500 cursor-pointer">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-2xl font-medium text-white mb-2">The Session</h3>
            <p className="text-white/60">Recorded in zero-gravity. Registered on Story Protocol.</p>
          </div>

          {/* Grain Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="relative z-20 min-h-screen bg-background py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "IP Protection", desc: "Every track is registered on Story Protocol, ensuring your work is protected and traceable." },
              { icon: Coins, title: "Fair Licensing", desc: "Non-exclusive licensing means multiple creators can use your music while you retain ownership." },
              { icon: Users, title: "Direct Connection", desc: "No middlemen. Musicians and creators connect directly on a transparent platform." },
              { icon: Music, title: "All Content Types", desc: "From raw jams to polished productions—all your creative output has value." },
              { icon: Sparkles, title: "Easy Onboarding", desc: "Coinbase Embedded Wallets make Web3 accessible—no crypto expertise required." },
              { icon: Film, title: "Creator Friendly", desc: "Find unique sounds for films, games, podcasts, and content that stand out." },
            ].map((feature, i) => (
              <FeatureCard key={i} {...feature} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/5 bg-background/50 backdrop-blur-xl py-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            Built for Story Buildathon with <span className="text-primary">Story Protocol</span> & <span className="text-primary">Coinbase Embedded Wallets</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc, index }: { icon: any, title: string, desc: string, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      viewport={{ once: true }}
    >
      <Card className="h-full bg-card/50 border-white/5 backdrop-blur-sm hover:bg-card/80 transition-colors group">
        <CardHeader>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl font-light tracking-wide">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
