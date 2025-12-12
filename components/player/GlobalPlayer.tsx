"use client"

import { usePlayer } from './PlayerContext'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, X } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function GlobalPlayer() {
    const { currentTrack, isPlaying, togglePlay, stopTrack, volume, setVolume, progress, duration, seek, nextTrack, previousTrack, playlist, setExpanded } = usePlayer()

    if (!currentTrack) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t-2 border-zinc-200 dark:border-zinc-800 px-3 py-3 md:px-4 md:py-4 shadow-refined-lg"
            >
                <div className="container mx-auto">
                    {/* Mobile Layout (< md) */}
                    <div className="md:hidden flex flex-col gap-2">
                        {/* Top Row: Track Info + Close */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="relative h-10 w-10 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex-shrink-0">
                                    {currentTrack.imageUrl ? (
                                        <Image src={currentTrack.imageUrl} alt={currentTrack.title} fill className="object-cover dark:invert" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                                            <div className={`w-2 h-2 rounded-full bg-bronze ${isPlaying ? 'animate-pulse' : ''}`} />
                                        </div>
                                    )}
                                </div>
                                <div className="overflow-hidden flex-1 min-w-0">
                                    <h4 className="font-bold text-xs truncate tracking-tight">{currentTrack.title}</h4>
                                    <p className="text-[10px] text-muted-foreground truncate font-mono">{currentTrack.artist}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-bronze hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors flex-shrink-0"
                                onClick={stopTrack}
                                title="Close player"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                            <span className="w-8 text-right">{formatDuration(progress)}</span>
                            <Slider
                                value={[progress]}
                                max={duration || 100}
                                step={1}
                                onValueChange={(value) => seek(value[0])}
                                className="cursor-pointer [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-2 [&_[role=slider]]:border-bronze [&_[role=slider]]:bg-background"
                            />
                            <span className="w-8">{formatDuration(duration)}</span>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-bronze hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors disabled:opacity-30"
                                onClick={previousTrack}
                                disabled={playlist.length === 0}
                            >
                                <SkipBack className="h-3 w-3" />
                            </Button>

                            <Button
                                size="icon"
                                className="h-9 w-9 rounded-sm bg-bronze text-white hover:bg-bronze/90 shadow-refined hover:shadow-refined-lg transition-all"
                                onClick={togglePlay}
                            >
                                {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-bronze hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors disabled:opacity-30"
                                onClick={nextTrack}
                                disabled={playlist.length === 0}
                            >
                                <SkipForward className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    {/* Desktop Layout (>= md) */}
                    <div className="hidden md:flex items-center justify-between gap-4">
                        {/* Track Info */}
                        <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
                            <div className="relative h-14 w-14 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                {currentTrack.imageUrl ? (
                                    <Image src={currentTrack.imageUrl} alt={currentTrack.title} fill className="object-cover dark:invert" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                                        <div className={`w-2 h-2 rounded-full bg-bronze ${isPlaying ? 'animate-pulse' : ''}`} />
                                    </div>
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-bold text-sm truncate tracking-tight">{currentTrack.title}</h4>
                                <p className="text-xs text-muted-foreground truncate font-mono">{currentTrack.artist}</p>
                            </div>
                        </div>

                        {/* Controls & Progress */}
                        <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
                            <div className="flex items-center gap-6">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-bronze hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors disabled:opacity-30"
                                    onClick={previousTrack}
                                    disabled={playlist.length === 0}
                                >
                                    <SkipBack className="h-4 w-4" />
                                </Button>

                                <Button
                                    size="icon"
                                    className="h-10 w-10 rounded-sm bg-bronze text-white hover:bg-bronze/90 shadow-refined hover:shadow-refined-lg transition-all"
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-bronze hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors disabled:opacity-30"
                                    onClick={nextTrack}
                                    disabled={playlist.length === 0}
                                >
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
                                    className="cursor-pointer [&_[role=slider]]:border-2 [&_[role=slider]]:border-bronze [&_[role=slider]]:bg-background"
                                />
                                <span className="w-10">{formatDuration(duration)}</span>
                            </div>
                        </div>

                        {/* Volume & Extras */}
                        <div className="flex items-center justify-end gap-4 w-1/4 min-w-[200px]">
                            <div className="flex items-center gap-2 w-32">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-bronze hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors"
                                    onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                                >
                                    {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                </Button>
                                <Slider
                                    value={[volume]}
                                    max={1}
                                    step={0.01}
                                    onValueChange={(value) => setVolume(value[0])}
                                    className="cursor-pointer [&_[role=slider]]:border-2 [&_[role=slider]]:border-bronze [&_[role=slider]]:bg-background"
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-bronze hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors"
                                onClick={() => setExpanded(true)}
                                title="Expand player"
                            >
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-bronze hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors"
                                onClick={stopTrack}
                                title="Close player"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
