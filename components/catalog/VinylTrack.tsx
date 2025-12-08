"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
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
    const [isExpanded, setIsExpanded] = useState(false)

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
            <div className="absolute inset-0 bg-card z-10 flex flex-col justify-between p-6 border-r border-zinc-200 dark:border-zinc-800 rounded-md group-hover:translate-x-[-10%] transition-transform duration-500">
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
                </div>

                <div className="space-y-1">
                    <h3 className="font-bold text-lg leading-tight line-clamp-1 tracking-tight">{title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 font-mono">{artist}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="font-mono text-sm font-medium">{price}</span>
                    <div className="h-8 w-16 text-bronze">
                        <AnalogWaveform isPlaying={isThisPlaying} color="currentColor" />
                    </div>
                </div>

                {/* Expandable Details */}
                {(description || moodTags || contentType || storyTxHash) && (
                    <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <span className="font-mono uppercase tracking-widest">Details</span>
                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>

                        {isExpanded && (
                            <div className="mt-3 space-y-3 text-xs">
                                {contentType && (
                                    <div>
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Type:</span>
                                        <Badge variant="outline" className="ml-2 text-[10px]">{contentType.replace('_', ' ')}</Badge>
                                    </div>
                                )}

                                {description && (
                                    <div>
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Description:</span>
                                        <p className="text-xs text-foreground/80 line-clamp-3">{description}</p>
                                    </div>
                                )}

                                {moodTags && moodTags.length > 0 && (
                                    <div>
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Mood Tags:</span>
                                        <div className="flex flex-wrap gap-1">
                                            {moodTags.slice(0, 3).map((tag, idx) => (
                                                <Badge key={idx} variant="secondary" className="text-[9px] px-1.5 py-0">#{tag}</Badge>
                                            ))}
                                            {moodTags.length > 3 && (
                                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0">+{moodTags.length - 3}</Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {storyTxHash && (
                                    <a
                                        href={`https://aeneid.explorer.story.foundation/transactions/${storyTxHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-2 bg-bronze/5 border border-bronze/20 rounded-sm hover:border-bronze/40 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <ExternalLink className="h-3 w-3 text-bronze shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Story Protocol</p>
                                                <p className="font-mono text-[10px] text-bronze truncate">
                                                    {storyTxHash.substring(0, 8)}...{storyTxHash.substring(storyTxHash.length - 6)}
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
