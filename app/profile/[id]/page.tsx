"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Music, Users, MessageCircle, ExternalLink, Calendar } from "lucide-react"
import { useUser } from "@/components/auth/UserContext"
import { useToast } from "@/hooks/use-toast"

interface Session {
    id: string
    title: string
    description: string
    contentType: string
    moodTags: string[]
    priceUsd: number
    audioUrl: string
    storyAssetId: string | null
    createdAt: string
    _count: {
        licenses: number
    }
}

interface ProfileData {
    id: string
    walletAddress: string
    displayName: string | null
    bio: string | null
    avatarUrl: string | null
    twitter: string | null
    instagram: string | null
    website: string | null
    createdAt: string
    sessions?: Session[]
    _count: {
        sessions: number
        followers: number
        following: number
    }
    isFollowing?: boolean
}

export default function ProfilePage() {
    const params = useParams()
    const router = useRouter()
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
                    ? `You unfollowed ${profile?.displayName || "this musician"} `
                    : `You are now following ${profile?.displayName || "this musician"} `,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update follow status",
                variant: "destructive",
            })
        }
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
                                    {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.displayName || "User avatar"} />}
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
                                            <Button
                                                onClick={() => router.push(`/ messages ? user = ${profile.walletAddress} `)}
                                                variant="outline"
                                            >
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
                                            </a >
                                        )}
                                        {
                                            profile.instagram && (
                                                <a
                                                    href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    Instagram
                                                </a>
                                            )
                                        }
                                        {
                                            profile.website && (
                                                <a
                                                    href={profile.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    Website
                                                </a>
                                            )
                                        }
                                    </div >
                                </div >
                            )}
                        </CardContent >
                    </Card >

                    {/* Sessions/Tracks */}
                    < Card className="bg-card/40 backdrop-blur-md border-white/5" >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Music className="h-5 w-5" />
                                Tracks ({profile._count.sessions})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!profile.sessions || profile.sessions.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No tracks uploaded yet
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {profile.sessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="p-4 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg mb-1">{session.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {session.description}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className="mb-2">
                                                        {session.contentType.replace('_', ' ')}
                                                    </Badge>
                                                    <p className="text-sm font-semibold">${session.priceUsd}</p>
                                                    {session._count.licenses > 0 && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {session._count.licenses} {session._count.licenses === 1 ? 'license' : 'licenses'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Mood Tags */}
                                            {session.moodTags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {session.moodTags.map((tag, idx) => (
                                                        <Badge key={idx} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Audio Player */}
                                            <audio controls className="w-full" preload="metadata">
                                                <source src={session.audioUrl} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>

                                            {/* Story Protocol Badge */}
                                            {session.storyAssetId && (
                                                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <ExternalLink className="h-3 w-3" />
                                                    <span>Registered IP: {session.storyAssetId.substring(0, 10)}...</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card >
                </div >
            </div >
        </AppShell >
    )
}
