"use client"

import { useState } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Play, Pause, MoreVertical, Clock, Calendar, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePlayer } from "@/components/player/PlayerContext"
import { useToast } from "@/components/ui/use-toast"
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
    const [isDeleting, setIsDeleting] = useState(false)
    const { toast } = useToast()

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

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return
        }

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/sessions/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete session')
            }

            toast({
                title: 'Session deleted',
                description: `"${title}" has been deleted successfully`,
            })

            // Refresh the page to update the list
            window.location.reload()
        } catch (error) {
            console.error('Delete error:', error)
            toast({
                title: 'Error',
                description: 'Failed to delete session. Please try again.',
                variant: 'destructive',
            })
            setIsDeleting(false)
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
            className="relative group perspective-1000 h-full"
        >
            <div className="relative bg-background border-2 border-zinc-200 dark:border-zinc-800 hover:border-bronze transition-all duration-300 p-5 shadow-refined hover:shadow-refined-lg rounded-md h-full flex flex-col">

                {/* Status Badge at Top */}
                <div className="flex items-center justify-between mb-4">
                    <Badge
                        variant={status === 'registered' ? 'default' : 'outline'}
                        className={`rounded-sm uppercase text-[10px] tracking-widest font-mono ${
                            status === 'registered'
                                ? 'bg-bronze text-white border-bronze'
                                : 'border-zinc-300 dark:border-zinc-700'
                        }`}
                    >
                        {status === 'registered' ? '✓ REGISTERED' : '⏳ PENDING'}
                    </Badge>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-bronze h-7 w-7"
                                disabled={isDeleting}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {storyTxHash && (
                                <DropdownMenuItem asChild>
                                    <a
                                        href={`https://aeneid.explorer.story.foundation/transactions/${storyTxHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        <span>View on Explorer</span>
                                    </a>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>{isDeleting ? 'Deleting...' : 'Delete Track'}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Large Play Button & Track Info */}
                <div className="flex items-start gap-4 mb-4">
                    <button
                        onClick={handlePlay}
                        className={`w-16 h-16 flex-shrink-0 flex items-center justify-center transition-all duration-300 border-2 rounded-sm shadow-sm ${
                            isThisPlaying
                                ? 'bg-bronze border-bronze text-white shadow-refined'
                                : 'bg-background border-zinc-200 dark:border-zinc-800 text-foreground hover:bg-bronze hover:border-bronze hover:text-white hover:shadow-refined'
                        }`}
                    >
                        {isThisPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-0.5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                        {/* Larger, More Readable Title */}
                        <h3 className="font-bold text-xl leading-tight mb-2 tracking-tight line-clamp-2">
                            {title}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono mb-1">{artist}</p>
                    </div>
                </div>

                {/* Track Metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {date}
                    </span>
                </div>

                {/* Story Protocol Hash */}
                {storyTxHash && (
                    <div className="mt-auto pt-3 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Story IP</span>
                            <a
                                href={`https://aeneid.explorer.story.foundation/transactions/${storyTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-mono text-bronze hover:text-bronze/80 hover:underline truncate max-w-[150px] transition-colors"
                            >
                                {storyTxHash.slice(0, 8)}...{storyTxHash.slice(-6)}
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
