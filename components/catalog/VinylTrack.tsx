"use client"

import { motion } from "framer-motion"
import { Play, Pause, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { AnalogWaveform } from "./AnalogWaveform"
import { usePlayer } from "@/components/player/PlayerContext"

interface VinylTrackProps {
    id: string
    title: string
    artist: string
    price: string
    audioUrl: string
    imageUrl?: string
    storyTxHash?: string | null
    description?: string
    moodTags?: string[]
    contentType?: string
}

export function VinylTrack({ id, title, artist, price, audioUrl, imageUrl, storyTxHash, description, moodTags, contentType }: VinylTrackProps) {
    const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer()
    const isThisPlaying = currentTrack?.id === id && isPlaying

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (currentTrack?.id === id) {
            togglePlay()
        } else {
            playTrack({ id, title, artist, audioUrl, imageUrl })
        }
    }

    return (
        <div className="group relative w-full aspect-square bg-card border border-zinc-200 dark:border-zinc-800 rounded-md hover:border-bronze hover:shadow-refined-lg transition-all duration-300">
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
            <div className="absolute inset-0 bg-card z-10 flex flex-col p-6 border-r border-zinc-200 dark:border-zinc-800 rounded-md group-hover:translate-x-[-10%] transition-transform duration-500">
                {/* Album Art with Story Protocol Badge */}
                <div className="relative w-full aspect-square mb-4 overflow-hidden bg-secondary rounded-sm">
                    <Image
                        src={imageUrl || "/assets/catalog-art.png"}
                        alt={title}
                        fill
                        className="object-cover dark:invert"
                    />

                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/80 backdrop-blur-sm">
                        <button
                            onClick={handlePlay}
                            className="w-12 h-12 flex items-center justify-center rounded-full border border-foreground hover:bg-bronze hover:border-bronze hover:text-white transition-colors"
                        >
                            {isThisPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                        </button>
                    </div>

                    {/* Story Protocol Badge - Always Visible */}
                    {storyTxHash && (
                        <a
                            href={`https://aeneid.explorer.story.foundation/transactions/${storyTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2 py-1 bg-bronze/90 hover:bg-bronze text-white rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider transition-colors shadow-lg backdrop-blur-sm"
                        >
                            <ExternalLink className="h-2.5 w-2.5" />
                            <span>IP</span>
                        </a>
                    )}

                    {/* Content Type Badge */}
                    {contentType && (
                        <div className="absolute bottom-2 left-2 z-10">
                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 font-mono backdrop-blur-sm bg-background/80">
                                {contentType}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Track Info */}
                <div className="space-y-1 mb-4">
                    <h3 className="font-bold text-lg leading-tight line-clamp-1 tracking-tight">{title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 font-mono">{artist}</p>

                    {/* Mood Tags - Subtle Display */}
                    {moodTags && moodTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                            {moodTags.slice(0, 2).map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-[9px] px-1.5 py-0 border-zinc-300 dark:border-zinc-700">
                                    #{tag}
                                </Badge>
                            ))}
                            {moodTags.length > 2 && (
                                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-zinc-300 dark:border-zinc-700">
                                    +{moodTags.length - 2}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Price & Waveform */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="font-mono text-sm font-medium">{price}</span>
                    <div className="h-8 w-16 text-bronze">
                        <AnalogWaveform isPlaying={isThisPlaying} color="currentColor" />
                    </div>
                </div>
            </div>
        </div>
    )
}
