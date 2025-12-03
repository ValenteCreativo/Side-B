"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { Play, Pause, MoreVertical, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usePlayer } from "@/components/player/PlayerContext"
import Image from "next/image"

interface TrackCardProps {
    id: string
    title: string
    status: 'registered' | 'pending' | 'draft'
    date: string
    duration: string
    storyTxHash?: string
    audioUrl: string
    artist: string
}

export function TrackCard({ id, title, status, date, duration, storyTxHash, audioUrl, artist }: TrackCardProps) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useTransform(y, [-100, 100], [10, -10])
    const rotateY = useTransform(x, [-100, 100], [-10, 10])

    const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer()
    const isThisPlaying = currentTrack?.id === id && isPlaying

    const handlePlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (currentTrack?.id === id) {
            togglePlay()
        } else {
            playTrack({ id, title, artist, audioUrl })
        }
    }

    return (
        <motion.div
            style={{ x, y, rotateX, rotateY, z: 100 }}
            drag
            dragElastic={0.1}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            whileHover={{ cursor: "grab" }}
            whileDrag={{ cursor: "grabbing" }}
            className="relative group perspective-1000"
        >
            <div className="relative bg-card border border-border hover:border-foreground transition-all duration-300 p-4 shadow-sm hover:shadow-md">

                <div className="flex items-center gap-4 relative z-10">
                    {/* Play Button / Status Indicator */}
                    <button
                        onClick={handlePlay}
                        className={`w-12 h-12 flex items-center justify-center transition-all duration-300 border border-foreground ${isThisPlaying
                                ? 'bg-foreground text-background'
                                : 'bg-background text-foreground hover:bg-foreground hover:text-background'
                            }`}
                    >
                        {isThisPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold truncate pr-2 text-lg tracking-tight">{title}</h3>
                            <Badge variant="outline" className="rounded-none uppercase text-[10px] tracking-widest border-foreground/20">
                                {status}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {duration}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {date}
                            </span>
                        </div>
                    </div>

                    <Button variant="ghost" size="icon" className="rounded-none hover:bg-secondary">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>

                {/* Story Protocol Hash */}
                {storyTxHash && (
                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Story IP Asset</span>
                        <a
                            href={`https://explorer.story.foundation/tx/${storyTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono hover:underline truncate max-w-[150px]"
                        >
                            {storyTxHash.slice(0, 6)}...{storyTxHash.slice(-4)}
                        </a>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
