"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Music, MessageCircle, Radio } from "lucide-react"
import { useUser } from "@/components/auth/UserContext"
import { useToast } from "@/hooks/use-toast"
import { PageHero } from "@/components/ui/PageHero"
import { VinylFlip } from "@/components/ui/VinylFlip"

interface Musician {
    id: string
    walletAddress: string
    displayName: string | null
    bio: string | null
    avatarUrl: string | null
    _count: {
        sessions: number
        followers: number
    }
    isFollowing?: boolean
}

export default function CommunityPage() {
    const router = useRouter()
    const { user } = useUser()
    const { toast } = useToast()
    const [musicians, setMusicians] = useState<Musician[]>([])
    const [filteredMusicians, setFilteredMusicians] = useState<Musician[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchMusicians()
    }, [])

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredMusicians(musicians)
        } else {
            const query = searchQuery.toLowerCase()
            setFilteredMusicians(
                musicians.filter(
                    (musician) =>
                        musician.displayName?.toLowerCase().includes(query) ||
                        musician.bio?.toLowerCase().includes(query)
                )
            )
        }
    }, [searchQuery, musicians])

    const fetchMusicians = async () => {
        try {
            const response = await fetch("/api/users")
            if (!response.ok) throw new Error("Failed to fetch musicians")
            const data = await response.json()
            setMusicians(data)
            setFilteredMusicians(data)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load community",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleFollow = async (musicianId: string) => {
        if (!user) {
            toast({
                title: "Sign in required",
                description: "Please sign in to follow musicians",
                variant: "destructive",
            })
            return
        }

        const musician = musicians.find((m) => m.id === musicianId)
        const isCurrentlyFollowing = musician?.isFollowing || false

        try {
            const response = await fetch("/api/follows", {
                method: isCurrentlyFollowing ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    followerId: user?.id,
                    followingId: musicianId
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to update follow status")
            }

            // Update local state
            setMusicians((prev) =>
                prev.map((m) =>
                    m.id === musicianId ? { ...m, isFollowing: !isCurrentlyFollowing } : m
                )
            )

            toast({
                title: isCurrentlyFollowing ? "Unfollowed" : "Following",
                description: isCurrentlyFollowing
                    ? `You unfollowed ${musician?.displayName || "this musician"}`
                    : `You are now following ${musician?.displayName || "this musician"}`,
            })
        } catch (error) {
            console.error("Follow error:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update follow status",
                variant: "destructive",
            })
        }
    }

    const handleMessage = (musicianId: string) => {
        // TODO: Implement messaging
        toast({
            title: "Coming soon",
            description: "Messaging feature is under development",
        })
    }

    const handleViewProfile = (musicianId: string) => {
        router.push(`/profile/${musicianId}`)
    }

    if (isLoading) {
        return (
            <AppShell>
                <div className="min-h-screen bg-background">
                    <PageHero
                        title="COMMUNITY"
                        subtitle="NETWORK"
                        description="Discover independent musicians and connect with the creative underground."
                    />
                    <div className="container mx-auto px-4 py-12 text-center">
                        <p className="font-mono text-muted-foreground animate-pulse">LOADING_NETWORK...</p>
                    </div>
                </div>
            </AppShell>
        )
    }

    return (
        <AppShell>
            <div className="min-h-screen bg-background">
                <PageHero
                    title="COMMUNITY"
                    subtitle="NETWORK"
                    description="Discover independent musicians and connect with the creative underground."
                    sideText="SIDE B"
                >
                    <VinylFlip
                        className="w-64 h-64 ml-auto"
                        front={
                            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                <Radio className="w-32 h-32" />
                            </div>
                        }
                        back={
                            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                                <span className="font-mono text-sm font-bold tracking-widest">
                                    CONNECT
                                    <br />
                                    COLLABORATE
                                    <br />
                                    CREATE
                                </span>
                            </div>
                        }
                    />
                </PageHero>

                <div className="container mx-auto px-4 py-12 max-w-6xl">
                    {/* Search */}
                    <div className="mb-12 flex justify-center">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="SEARCH_MUSICIANS..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 rounded-none border-2 border-foreground h-12 font-mono uppercase placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                    </div>

                    {/* Musicians Grid */}
                    {filteredMusicians.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-foreground/20">
                            <p className="font-mono text-muted-foreground">
                                {searchQuery ? "NO_MUSICIANS_FOUND" : "NO_MUSICIANS_YET"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredMusicians.map((musician) => {
                                const initials = musician.displayName
                                    ? musician.displayName.substring(0, 2).toUpperCase()
                                    : "?"

                                const isOwnProfile = user?.id === musician.id

                                return (
                                    <div
                                        key={musician.id}
                                        className="group relative cursor-pointer"
                                        onClick={() => handleViewProfile(musician.id)}
                                    >
                                        <div className="absolute inset-0 bg-foreground translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" />
                                        <div className="relative bg-background border-2 border-foreground p-6 hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col items-center text-center">
                                            <Avatar className="h-24 w-24 mb-6 border-2 border-foreground rounded-none">
                                                {musician.avatarUrl && (
                                                    <AvatarImage src={musician.avatarUrl} alt={musician.displayName || "User"} className="rounded-none" />
                                                )}
                                                <AvatarFallback className="bg-foreground text-background text-2xl font-bold rounded-none">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>

                                            <h3 className="text-xl font-bold mb-2 tracking-tight uppercase">
                                                {musician.displayName || "Anonymous"}
                                            </h3>

                                            <Badge variant="outline" className="mb-4 rounded-none border-foreground font-mono">
                                                MUSICIAN
                                            </Badge>

                                            <p className="text-sm text-muted-foreground mb-6 line-clamp-2 min-h-[2.5rem] font-light">
                                                {musician.bio || "No bio yet"}
                                            </p>

                                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6 font-mono">
                                                <div className="flex items-center gap-2">
                                                    <Music className="h-4 w-4" />
                                                    <span>{musician._count.sessions}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span>{musician._count.followers}</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto w-full pt-6 border-t border-border">
                                                {!isOwnProfile ? (
                                                    <div className="flex gap-2 w-full">
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleFollow(musician.id)
                                                            }}
                                                            variant={musician.isFollowing ? "outline" : "default"}
                                                            size="sm"
                                                            className="flex-1 rounded-none border-2 border-foreground"
                                                        >
                                                            <Users className="h-4 w-4 mr-2" />
                                                            {musician.isFollowing ? "UNFOLLOW" : "FOLLOW"}
                                                        </Button>
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleMessage(musician.id)
                                                            }}
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-none border-2 border-foreground"
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            router.push("/settings")
                                                        }}
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full rounded-none border-2 border-foreground hover:bg-foreground hover:text-background"
                                                    >
                                                        EDIT PROFILE
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    )
}
