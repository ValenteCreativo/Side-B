"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Music, Users, MessageCircle, ExternalLink, Calendar } from "lucide-react"
import { useUser } from "@/components/auth/UserContext"
import { useToast } from "@/hooks/use-toast"

interface ProfileData {
    id: string
    walletAddress: string
    displayName: string | null
    bio: string | null
    twitter: string | null
    instagram: string | null
    website: string | null
    createdAt: string
    _count: {
        sessions: number
        followers: number
        following: number
    }
    isFollowing?: boolean
}

export default function ProfilePage() {
    const params = useParams()
    const { user } = useUser()
    const { toast } = useToast()
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isFollowing, setIsFollowing] = useState(false)

    const userId = params.id as string

    useEffect(() => {
        fetchProfile()
    }, [userId])

    const fetchProfile = async () => {
        try {
            const response = await fetch(`/api/users/${userId}`)
            if (!response.ok) throw new Error("Failed to fetch profile")
            const data = await response.json()
            setProfile(data)
            setIsFollowing(data.isFollowing || false)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load profile",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleFollow = async () => {
        if (!user) {
            toast({
                title: "Sign in required",
                description: "Please sign in to follow musicians",
                variant: "destructive",
            })
            return
        }

        try {
            const response = await fetch("/api/follows", {
                method: isFollowing ? "DELETE" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ followingId: userId }),
            })

            if (!response.ok) throw new Error("Failed to update follow status")

            setIsFollowing(!isFollowing)
            toast({
                title: isFollowing ? "Unfollowed" : "Following",
                description: isFollowing
                    ? `You unfollowed ${profile?.displayName || "this musician"}`
                    : `You are now following ${profile?.displayName || "this musician"}`,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update follow status",
                variant: "destructive",
            })
        }
    }

    const handleMessage = () => {
        // TODO: Open messaging modal/page
        toast({
            title: "Coming soon",
            description: "Messaging feature is under development",
        })
    }

    if (isLoading) {
        return (
            <AppShell>
                <div className="container mx-auto px-4 py-12">
                    <p className="text-center text-muted-foreground">Loading profile...</p>
                </div>
            </AppShell>
        )
    }

    if (!profile) {
        return (
            <AppShell>
                <div className="container mx-auto px-4 py-12">
                    <p className="text-center text-muted-foreground">Profile not found</p>
                </div>
            </AppShell>
        )
    }

    const initials = profile.displayName
        ? profile.displayName.substring(0, 2).toUpperCase()
        : "?"

    const isOwnProfile = user?.id === profile.id

    return (
        <AppShell>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    {/* Profile Header */}
                    <Card className="bg-card/40 backdrop-blur-md border-white/5 mb-6">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <Avatar className="h-24 w-24 border-2 border-white/10">
                                    <AvatarFallback className="bg-primary/20 text-primary text-2xl font-medium">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold">
                                            {profile.displayName || "Anonymous Musician"}
                                        </h1>
                                        <Badge variant="outline">Musician</Badge>
                                    </div>

                                    <p className="text-muted-foreground mb-4">
                                        {profile.bio || "No bio yet"}
                                    </p>

                                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-2">
                                            <Music className="h-4 w-4" />
                                            <span>{profile._count.sessions} tracks</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span>{profile._count.followers} followers</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span>{profile._count.following} following</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {!isOwnProfile && (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleFollow}
                                                variant={isFollowing ? "outline" : "default"}
                                            >
                                                <Users className="h-4 w-4 mr-2" />
                                                {isFollowing ? "Unfollow" : "Follow"}
                                            </Button>
                                            <Button onClick={handleMessage} variant="outline">
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Message
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Social Links */}
                            {(profile.twitter || profile.instagram || profile.website) && (
                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <div className="flex gap-4">
                                        {profile.twitter && (
                                            <a
                                                href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Twitter
                                            </a>
                                        )}
                                        {profile.instagram && (
                                            <a
                                                href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Instagram
                                            </a>
                                        )}
                                        {profile.website && (
                                            <a
                                                href={profile.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Website
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Sessions/Tracks */}
                    <Card className="bg-card/40 backdrop-blur-md border-white/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Music className="h-5 w-5" />
                                Tracks
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {profile._count.sessions === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No tracks uploaded yet
                                </p>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    Track list coming soon...
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    )
}
