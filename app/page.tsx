import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Music, Film, Shield, Coins, Users, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section - Simple layout for custom scroll effects */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Powered by Story Protocol & Coinbase
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Side B Sessions
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            A marketplace for independent music—rehearsals and finished tracks registered as IP.
            <br />
            Where musicians own their work and creators find authentic sounds.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/studio">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Music className="h-5 w-5" />
                I'm a Musician
              </Button>
            </Link>

            <Link href="/catalog">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <Film className="h-5 w-5" />
                I'm a Creator
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <div className="h-8 w-0.5 bg-muted-foreground/30 rounded-full" />
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            How It Works
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {/* For Musicians */}
            <Card>
              <CardHeader>
                <div className="mb-2 inline-block rounded-lg bg-primary/10 p-3">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>For Musicians</CardTitle>
                <CardDescription>
                  Turn your rehearsals and tracks into registered IP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-medium">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Connect Your Wallet</p>
                      <p className="text-sm text-muted-foreground">
                        Sign in with Coinbase Embedded Wallets
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Upload Your Sessions</p>
                      <p className="text-sm text-muted-foreground">
                        Jams, rehearsals, or finished tracks with metadata
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Automatic IP Registration</p>
                      <p className="text-sm text-muted-foreground">
                        Each track is registered on Story Protocol
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Creators */}
            <Card>
              <CardHeader>
                <div className="mb-2 inline-block rounded-lg bg-primary/10 p-3">
                  <Film className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>For Creators</CardTitle>
                <CardDescription>
                  License authentic music for your projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-medium">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Browse the Catalog</p>
                      <p className="text-sm text-muted-foreground">
                        Filter by mood, content type, and style
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Preview Tracks</p>
                      <p className="text-sm text-muted-foreground">
                        Listen to sessions before licensing
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium">License & Use</p>
                      <p className="text-sm text-muted-foreground">
                        Non-exclusive licenses for your creative projects
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">
            Why Side B Sessions?
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>IP Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every track is registered on Story Protocol, ensuring your work is protected and traceable.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Coins className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Fair Licensing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Non-exclusive licensing means multiple creators can use your music while you retain ownership.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Direct Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No middlemen. Musicians and creators connect directly on a transparent platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Music className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>All Content Types</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  From raw jams to polished productions—all your creative output has value.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Easy Onboarding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Coinbase Embedded Wallets make Web3 accessible—no crypto expertise required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Film className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Creator Friendly</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find unique sounds for films, games, podcasts, and content that stand out.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join the independent music revolution. Register your work or find your next soundtrack.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/studio">
              <Button size="lg" className="w-full sm:w-auto">
                Upload Your First Track
              </Button>
            </Link>

            <Link href="/catalog">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore the Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>
            Built for Story Buildathon with{' '}
            <a href="https://www.story.foundation/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              Story Protocol
            </a>{' '}
            &{' '}
            <a href="https://www.coinbase.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              Coinbase Embedded Wallets
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
