"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, ExternalLink } from "lucide-react"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { usePlayer } from "@/components/player/PlayerContext"

interface TrackCardProps {
    id: string
    title: string
    type: string
    createdAt: string
    status: "REGISTERED" | "PENDING"
    txHash?: string
    audioUrl: string
    artist: string
}

export function TrackCard({ id, title, type, createdAt, status, txHash, audioUrl, artist }: TrackCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const { currentTrack, isPlaying, playTrack } = usePlayer()

    const isCurrentTrack = currentTrack?.id === id
    const isThisPlaying = isCurrentTrack && isPlaying

    const handlePlay = () => {
        playTrack({ id, title, artist, audioUrl })
    }

    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return

        const width = rect.width
        const height = rect.height

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5

        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative h-full perspective-1000"
        >
            <Card className={cn(
                "h-full bg-card/40 backdrop-blur-md border-white/5 transition-all duration-500 group",
                "hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.2)] hover:border-primary/20"
            )}>
                <CardHeader className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors">
                            {type}
                        </Badge>
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            status === "REGISTERED" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-yellow-500"
                        )} />
                    </div>
                    <CardTitle className="text-xl font-medium tracking-wide text-foreground/90 group-hover:text-primary transition-colors">
                        {title}
                    </CardTitle>
                </CardHeader>

                <CardContent className="relative z-10 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            {new Date(createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                        <button
                            onClick={handlePlay}
                            className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group-hover:border-primary/50"
                        >
                            {isThisPlaying ? (
                                <Pause className="w-4 h-4 text-primary fill-current" />
                            ) : (
                                <Play className="w-4 h-4 text-primary fill-current ml-0.5" />
                            )}
                        </button>

                        {txHash && (
                            <a
                                href={`https://aeneid.storyscan.xyz/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-muted-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary"
                            >
                                View on Story
                            </a>
                        )}
                    </div>
                </CardContent>

                {/* Glossy Overlay */}
                <div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
                    style={{ transform: "translateZ(1px)" }}
                />
            </Card>
        </motion.div>
    )
}
