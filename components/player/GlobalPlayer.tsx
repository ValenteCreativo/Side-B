"use client"

import { usePlayer } from './PlayerContext'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2 } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function GlobalPlayer() {
    const { currentTrack, isPlaying, togglePlay, volume, setVolume, progress, duration, seek } = usePlayer()

    if (!currentTrack) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]"
            >
                <div className="container mx-auto flex items-center justify-between gap-4">
                    {/* Track Info */}
                    <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
                        <div className="relative h-14 w-14 rounded-md overflow-hidden bg-secondary/20 border border-white/5 shadow-inner">
                            {currentTrack.imageUrl ? (
                                <Image src={currentTrack.imageUrl} alt={currentTrack.title} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-background">
                                    <div className={`w-2 h-2 rounded-full bg-primary ${isPlaying ? 'animate-pulse' : ''}`} />
                                </div>
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="font-medium text-sm truncate text-foreground">{currentTrack.title}</h4>
                            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
                        </div>
                    </div>

                    {/* Controls & Progress */}
                    <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
                        <div className="flex items-center gap-6">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <SkipBack className="h-4 w-4" />
                            </Button>

                            <Button
                                size="icon"
                                className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:scale-105 transition-transform"
                                onClick={togglePlay}
                            >
                                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                            </Button>

                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <SkipForward className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="w-full flex items-center gap-3 text-xs font-mono text-muted-foreground">
                            <span className="w-10 text-right">{formatDuration(progress)}</span>
                            <Slider
                                value={[progress]}
                                max={duration || 100}
                                step={1}
                                onValueChange={(value) => seek(value[0])}
                                className="cursor-pointer"
                            />
                            <span className="w-10">{formatDuration(duration)}</span>
                        </div>
                    </div>

                    {/* Volume & Extras */}
                    <div className="flex items-center justify-end gap-4 w-1/4 min-w-[200px]">
                        <div className="flex items-center gap-2 w-32">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setVolume(volume === 0 ? 0.8 : 0)}>
                                {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                            </Button>
                            <Slider
                                value={[volume]}
                                max={1}
                                step={0.01}
                                onValueChange={(value) => setVolume(value[0])}
                                className="cursor-pointer"
                            />
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Maximize2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
