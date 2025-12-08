"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause, ExternalLink, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnalogWaveform } from "./AnalogWaveform"
import { usePlayer } from "@/components/player/PlayerContext"

interface VinylTrackProps {
    id: string
    title: string
    artist: string
    artistId?: string
    price: string
    audioUrl: string
    imageUrl?: string
    storyTxHash?: string | null
    description?: string
    moodTags?: string[]
    contentType?: string
    ownerId?: string
    currentUserId?: string
    onPurchase?: (id: string) => void
}

export function VinylTrack({ id, title, artist, artistId, price, audioUrl, imageUrl, storyTxHash, description, moodTags, contentType, ownerId, currentUserId, onPurchase }: VinylTrackProps) {
    const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer()
    const isThisPlaying = currentTrack?.id === id && isPlaying
    const [showAllTags, setShowAllTags] = useState(false)

    // Category-specific placeholder images
    const getPlaceholderImage = () => {
        if (contentType === 'REHEARSAL') return '/assets/hero-art.png'
        if (contentType === 'PRODUCED') return '/assets/studio-art.png'
        return '/assets/catalog-art.png' // JAM or default
    }

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (currentTrack?.id === id) {
            togglePlay()
        } else {
            playTrack({ id, title, artist, audioUrl, imageUrl })
        }
    }

    return (
        <div className="group relative w-full aspect-[0.85] bg-card border border-zinc-200 dark:border-zinc-800 rounded-md hover:border-bronze hover:shadow-refined-lg transition-all duration-300">
            {/* Vinyl Record (Slide out animation) */}
            <div className="absolute top-2 right-2 bottom-2 left-2 rounded-full bg-black flex items-center justify-center group-hover:translate-x-1/4 transition-transform duration-500 ease-out shadow-xl z-0">
                <div className="w-1/3 h-1/3 bg-card rounded-full flex items-center justify-center border border-white/10">
                    <div className="w-2 h-2 bg-black rounded-full" />
                </div>
                {/* Grooves */}
                <div className="absolute inset-1 rounded-full border border-white/5 opacity-50" />
                <div className="absolute inset-4 rounded-full border border-white/5 opacity-40" />
                <div className="absolute inset-8 rounded-full border border-white/5 opacity-30" />
            </div>

            {/* Album Cover / Container */}
            <div className="absolute inset-0 bg-card z-10 flex flex-col p-5 border-r border-zinc-200 dark:border-zinc-800 rounded-md group-hover:translate-x-[-10%] transition-transform duration-500">
                {/* Larger Album Art */}
                <div className="relative w-full aspect-square mb-3 overflow-hidden bg-secondary rounded-sm">
                    <Image
                        src={imageUrl || getPlaceholderImage()}
                        alt={title}
                        fill
                        className="object-cover dark:invert"
                    />

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 backdrop-blur-sm">
                        <button
                            onClick={handlePlay}
                            className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-foreground hover:bg-bronze hover:border-bronze hover:text-white transition-colors"
                        >
                            {isThisPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                        </button>
                    </div>

                    {/* Content Type Badge */}
                    {contentType && (
                        <div className="absolute top-2 left-2 z-10">
                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 font-mono backdrop-blur-sm bg-background/80">
                                {contentType}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Track Info */}
                <div className="space-y-1.5 mb-3">
                    <h3 className="font-bold text-base leading-tight line-clamp-1 tracking-tight">{title}</h3>

                    {/* Clickable Artist Name */}
                    {artistId ? (
                        <Link
                            href={`/profile/${artistId}`}
                            className="text-sm text-muted-foreground hover:text-bronze font-mono line-clamp-1 transition-colors inline-block"
                        >
                            {artist}
                        </Link>
                    ) : (
                        <p className="text-sm text-muted-foreground line-clamp-1 font-mono">{artist}</p>
                    )}

                    {/* Story Protocol Link - Below Image */}
                    {storyTxHash && (
                        <a
                            href={`https://aeneid.explorer.story.foundation/transactions/${storyTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[10px] font-mono text-bronze hover:text-bronze/80 transition-colors"
                        >
                            <ExternalLink className="h-2.5 w-2.5" />
                            <span className="uppercase tracking-wider">Story IP</span>
                        </a>
                    )}

                    {/* Mood Tags - Expandable */}
                    {moodTags && moodTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                            {(showAllTags ? moodTags : moodTags.slice(0, 2)).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-[9px] px-1.5 py-0 border-zinc-300 dark:border-zinc-700">
                                    #{tag}
                                </Badge>
                            ))}
                            {moodTags.length > 2 && (
                                <button
                                    onClick={() => setShowAllTags(!showAllTags)}
                                    className="text-[9px] px-1.5 py-0 border border-zinc-300 dark:border-zinc-700 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    {showAllTags ? '−' : `+${moodTags.length - 2}`}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Price, Waveform & Cart */}
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex flex-col">
                        <span className="font-mono text-sm font-medium">{price}</span>
                        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">USDC</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-12 text-bronze">
                            <AnalogWaveform isPlaying={isThisPlaying} color="currentColor" />
                        </div>
                        {onPurchase && currentUserId && ownerId !== currentUserId && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="rounded-sm h-8 w-8 p-0 border-zinc-200 dark:border-zinc-800 hover:border-bronze hover:text-bronze"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onPurchase(id)
                                }}
                            >
                                <ShoppingCart className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
