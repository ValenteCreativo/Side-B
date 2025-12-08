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
import { useToast } from "@/components/ui/use-toast"

interface Session {
    id: string
    title: string
    description: string
    contentType: string
    moodTags: string[]
    priceUsd: number
    audioUrl: string
    storyAssetId: string | null
    storyTxHash: string | null
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
                    <p className="text-center text-muted-foreground font-mono animate-pulse">LOADING_PROFILE...</p>
                </div>
            </AppShell>
        )
    }

    if (!profile) {
        return (
            <AppShell>
                <div className="container mx-auto px-4 py-12">
                    <p className="text-center text-muted-foreground font-mono">PROFILE_NOT_FOUND</p>
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
                    <Card className="bg-card/40 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 mb-6 shadow-refined rounded-md">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                <Avatar className="h-32 w-32 border border-zinc-200 dark:border-zinc-800 shadow-refined rounded-full">
                                    {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.displayName || "User avatar"} className="rounded-full" />}
                                    <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-foreground text-4xl font-medium rounded-full">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 w-full">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h1 className="text-3xl font-bold tracking-tight">
                                                    {profile.displayName || "Anonymous Musician"}
                                                </h1>
                                                <Badge variant="outline" className="rounded-sm border-zinc-200 dark:border-zinc-800 text-muted-foreground font-mono text-[10px]">MUSICIAN</Badge>
                                            </div>
                                            <p className="text-muted-foreground font-light">
                                                {profile.bio || "No bio yet"}
                                            </p>
                                        </div>

                                        {!isOwnProfile && (
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleFollow}
                                                    variant={isFollowing ? "outline" : "default"}
                                                    className={`rounded-sm ${isFollowing ? 'border-zinc-200 dark:border-zinc-800 hover:border-bronze hover:text-bronze' : 'shadow-refined hover:shadow-refined-md'}`}
                                                >
                                                    <Users className="h-4 w-4 mr-2" />
                                                    {isFollowing ? "UNFOLLOW" : "FOLLOW"}
                                                </Button>
                                                <Button
                                                    onClick={() => router.push(`/messages?user=${profile.walletAddress}`)}
                                                    variant="outline"
                                                    className="rounded-sm border-zinc-200 dark:border-zinc-800 hover:border-bronze hover:text-bronze"
                                                >
                                                    <MessageCircle className="h-4 w-4 mr-2" />
                                                    MESSAGE
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6 font-mono">
                                        <div className="flex items-center gap-2">
                                            <Music className="h-4 w-4" />
                                            <span>{profile._count.sessions} TRACKS</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span>{profile._count.followers} FOLLOWERS</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span>{profile._count.following} FOLLOWING</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>JOINED {new Date(profile.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    {(profile.twitter || profile.instagram || profile.website) && (
                                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                            <div className="flex gap-6">
                                                {profile.twitter && (
                                                    <a
                                                        href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-bronze transition-colors"
                                                    >
                                                        <ExternalLink className="h-3 w-3" />
                                                        TWITTER
                                                    </a >
                                                )}
                                                {
                                                    profile.instagram && (
                                                        <a
                                                            href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-bronze transition-colors"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            INSTAGRAM
                                                        </a>
                                                    )
                                                }
                                                {
                                                    profile.website && (
                                                        <a
                                                            href={profile.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-bronze transition-colors"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            WEBSITE
                                                        </a>
                                                    )
                                                }
                                            </div >
                                        </div >
                                    )}
                                </div>
                            </div>
                        </CardContent >
                    </Card >

                    {/* Sessions/Tracks */}
                    < Card className="bg-card/40 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-md" >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-mono text-lg tracking-tight">
                                <Music className="h-5 w-5 text-bronze" />
                                TRACKS ({profile._count.sessions})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!profile.sessions || profile.sessions.length === 0 ? (
                                <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <p className="font-mono text-muted-foreground">NO_TRACKS_UPLOADED_YET</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {profile.sessions.map((session) => (
                                        <div
                                            key={session.id}
                                            className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-md hover:border-[hsl(var(--bronze)/0.5)] transition-colors bg-background/50"
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg mb-1 tracking-tight">{session.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 font-light">
                                                        {session.description}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className="mb-2 rounded-sm border-zinc-200 dark:border-zinc-800 font-mono text-[10px]">
                                                        {session.contentType.replace('_', ' ')}
                                                    </Badge>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold font-mono text-bronze">${session.priceUsd}</span>
                                                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">USDC</span>
                                                    </div>
                                                    {session._count.licenses > 0 && (
                                                        <p className="text-xs text-muted-foreground font-mono mt-1">
                                                            {session._count.licenses} {session._count.licenses === 1 ? 'LICENSE' : 'LICENSES'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Mood Tags */}
                                            {session.moodTags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {session.moodTags.map((tag, idx) => (
                                                        <Badge key={idx} variant="secondary" className="text-[10px] rounded-sm bg-zinc-100 dark:bg-zinc-800 text-muted-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Audio Player */}
                                            <audio
                                                controls
                                                className="w-full h-10 rounded-sm"
                                                preload="metadata"
                                                style={{
                                                    filter: 'brightness(0.95) contrast(1.1)',
                                                    accentColor: 'hsl(var(--bronze))',
                                                }}
                                            >
                                                <source src={session.audioUrl} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>

                                            {/* Story Protocol Badge */}
                                            {session.storyTxHash && (
                                                <div className="mt-3 flex items-center gap-2 text-[10px] font-mono border-t border-zinc-100 dark:border-zinc-800 pt-2">
                                                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                                    <a
                                                        href={`https://aeneid.explorer.story.foundation/transactions/${session.storyTxHash}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-muted-foreground hover:text-bronze transition-colors hover:underline"
                                                    >
                                                        STORY IP: {session.storyTxHash.substring(0, 8)}...{session.storyTxHash.substring(session.storyTxHash.length - 6)}
                                                    </a>
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
