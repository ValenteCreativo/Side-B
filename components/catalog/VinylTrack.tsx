"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Disc } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { AnalogWaveform } from "./AnalogWaveform"
import { usePlayer } from "@/components/player/PlayerContext"

interface VinylTrackProps {
    id: string
    title: string
    artist: string
    price: string
    audioUrl: string
    image?: string
}

export function VinylTrack({ id, title, artist, price, audioUrl, image }: VinylTrackProps) {
    const [isHovered, setIsHovered] = useState(false)
    const { currentTrack, isPlaying, playTrack } = usePlayer()

    const isCurrentTrack = currentTrack?.id === id
    const isThisPlaying = isCurrentTrack && isPlaying

    const handlePlay = () => {
        playTrack({ id, title, artist, audioUrl, imageUrl: image, price })
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative"
        >
            {/* Vinyl Record (Slides out on hover) */}
            <div className={cn(
                "absolute top-2 right-2 w-[90%] aspect-square rounded-full bg-black border-4 border-neutral-800 shadow-xl transition-transform duration-700 ease-out flex items-center justify-center",
                (isHovered || isPlaying) ? "translate-x-1/3 rotate-12" : "translate-x-0"
            )}>
                {/* Vinyl Grooves */}
                <div className="absolute inset-2 rounded-full border border-neutral-800/50 opacity-50" />
                <div className="absolute inset-4 rounded-full border border-neutral-800/50 opacity-50" />
                <div className="absolute inset-8 rounded-full border border-neutral-800/50 opacity-50" />

                {/* Label */}
                <div className="w-1/3 h-1/3 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <div className={cn(
                        "w-2 h-2 rounded-full bg-black",
                        isPlaying && "animate-spin"
                    )} />
                </div>
            </div>

            {/* Sleeve (Card) */}
            <Card className="relative z-10 aspect-square bg-card border-white/5 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.3)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/60 z-0" />

                {/* Cover Art Placeholder or Image */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-10 transition-opacity">
                    <Disc className="w-32 h-32 text-muted-foreground" />
                </div>

                <CardContent className="relative z-10 h-full flex flex-col justify-between p-6">
                    <div className="flex justify-between items-start">
                        <Badge variant="outline" className="bg-black/40 backdrop-blur-md border-white/10 text-xs">
                            {price}
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight text-white mb-1 line-clamp-2">{title}</h3>
                            <p className="text-muted-foreground font-medium">{artist}</p>
                        </div>

                        <div className="h-[60px] flex items-end">
                            {isHovered ? (
                                <AnalogWaveform isPlaying={isThisPlaying} />
                            ) : (
                                <div className="w-full h-px bg-white/10" />
                            )}
                        </div>

                        <button
                            onClick={handlePlay}
                            className="w-full py-3 rounded-full bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                        >
                            {isThisPlaying ? (
                                <>
                                    <Pause className="w-4 h-4" /> Pause Session
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" /> Preview Session
                                </>
                            )}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
