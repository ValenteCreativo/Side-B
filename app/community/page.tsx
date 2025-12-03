"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Music, MessageCircle } from "lucide-react"
import { useUser } from "@/components/auth/UserContext"
import { useToast } from "@/hooks/use-toast"

interface Musician {
    id: string
    walletAddress: string
    displayName: string | null
    bio: string | null
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
                body: JSON.stringify({ followingId: musicianId }),
            })

            if (!response.ok) throw new Error("Failed to update follow status")

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
            toast({
                title: "Error",
                description: "Failed to update follow status",
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
                <div className="container mx-auto px-4 py-12">
                    <p className="text-center text-muted-foreground">Loading community...</p>
                </div>
            </AppShell>
        )
    }

    return (
        <AppShell>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12 max-w-6xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2 tracking-tight">Community</h1>
                        <p className="text-muted-foreground">
                            Discover independent musicians and connect with the creative community
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mb-8">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search musicians..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Musicians Grid */}
                    {filteredMusicians.length === 0 ? (
                        <Card className="bg-card/40 backdrop-blur-md border-white/5">
                            <CardContent className="py-12">
                                <p className="text-center text-muted-foreground">
                                    {searchQuery ? "No musicians found" : "No musicians yet"}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMusicians.map((musician) => {
                                const initials = musician.displayName
                                    ? musician.displayName.substring(0, 2).toUpperCase()
                                    : "?"

                                const isOwnProfile = user?.id === musician.id

                                return (
                                    <Card
                                        key={musician.id}
                                        className="bg-card/40 backdrop-blur-md border-white/5 hover:border-white/10 transition-all cursor-pointer"
                                        onClick={() => handleViewProfile(musician.id)}
                                    >
                                        <CardContent className="pt-6">
                                            <div className="flex flex-col items-center text-center">
                                                <Avatar className="h-20 w-20 mb-4 border-2 border-white/10">
                                                    <AvatarFallback className="bg-primary/20 text-primary text-xl font-medium">
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <h3 className="text-xl font-bold mb-1">
                                                    {musician.displayName || "Anonymous"}
                                                </h3>

                                                <Badge variant="outline" className="mb-3">
                                                    Musician
                                                </Badge>

                                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                                                    {musician.bio || "No bio yet"}
                                                </p>

                                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <Music className="h-4 w-4" />
                                                        <span>{musician._count.sessions}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-4 w-4" />
                                                        <span>{musician._count.followers}</span>
                                                    </div>
                                                </div>

                                                {!isOwnProfile && (
                                                    <div className="flex gap-2 w-full">
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleFollow(musician.id)
                                                            }}
                                                            variant={
                                                                musician.isFollowing ? "outline" : "default"
                                                            }
                                                            size="sm"
                                                            className="flex-1"
                                                        >
                                                            <Users className="h-4 w-4 mr-2" />
                                                            {musician.isFollowing ? "Unfollow" : "Follow"}
                                                        </Button>
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleMessage(musician.id)
                                                            }}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <MessageCircle className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}

                                                {isOwnProfile && (
                                                    <div className="w-full">
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                router.push("/settings")
                                                            }}
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full"
                                                        >
                                                            Edit Profile
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    )
}
