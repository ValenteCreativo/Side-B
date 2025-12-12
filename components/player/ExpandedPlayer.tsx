"use client"

import { usePlayer } from './PlayerContext'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, ChevronDown } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export function ExpandedPlayer() {
    const { currentTrack, isPlaying, togglePlay, volume, setVolume, progress, duration, seek, nextTrack, previousTrack, playlist, isExpanded, setExpanded } = usePlayer()

    if (!isExpanded || !currentTrack) return null

    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id)
    const hasNext = currentIndex !== -1 && currentIndex < playlist.length - 1
    const hasPrevious = currentIndex !== -1 && currentIndex > 0

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-background"
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-background/95 backdrop-blur">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-sm"
                        onClick={() => setExpanded(false)}
                    >
                        <ChevronDown className="h-5 w-5" />
                    </Button>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Now Playing</p>
                        {playlist.length > 0 && (
                            <p className="text-[10px] text-muted-foreground/60 font-mono">
                                {currentIndex + 1} of {playlist.length}
                            </p>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-sm"
                        onClick={() => setExpanded(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Main Content */}
                <div className="h-full flex flex-col items-center justify-center px-6 py-20 max-w-2xl mx-auto">
                    {/* Album Art */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-full aspect-square max-w-md mb-8 rounded-md overflow-hidden shadow-refined-lg border-2 border-zinc-200 dark:border-zinc-800"
                    >
                        {currentTrack.imageUrl ? (
                            <Image
                                src={currentTrack.imageUrl}
                                alt={currentTrack.title}
                                width={500}
                                height={500}
                                className="w-full h-full object-cover dark:invert"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                                <div className={`w-24 h-24 rounded-full bg-bronze ${isPlaying ? 'animate-pulse' : ''}`} />
                            </div>
                        )}
                    </motion.div>

                    {/* Track Info */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full text-center mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                            {currentTrack.title}
                        </h1>
                        <p className="text-lg text-muted-foreground font-mono">
                            {currentTrack.artist}
                        </p>
                        {currentTrack.price && (
                            <p className="text-sm text-bronze font-mono mt-2">
                                {currentTrack.price}
                            </p>
                        )}
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full mb-6"
                    >
                        <Slider
                            value={[progress]}
                            max={duration || 100}
                            step={1}
                            onValueChange={(value) => seek(value[0])}
                            className="cursor-pointer [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-bronze [&_[role=slider]]:bg-background"
                        />
                        <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground">
                            <span>{formatDuration(progress)}</span>
                            <span>{formatDuration(duration)}</span>
                        </div>
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center justify-center gap-8 mb-8"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-14 w-14 text-muted-foreground hover:text-bronze hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors disabled:opacity-30"
                            onClick={previousTrack}
                            disabled={!hasPrevious}
                        >
                            <SkipBack className="h-6 w-6" />
                        </Button>

                        <Button
                            size="icon"
                            className="h-20 w-20 rounded-sm bg-bronze text-white hover:bg-bronze/90 shadow-refined-lg hover:shadow-refined-xl transition-all"
                            onClick={togglePlay}
                        >
                            {isPlaying ? (
                                <Pause className="h-8 w-8 fill-current" />
                            ) : (
                                <Play className="h-8 w-8 fill-current ml-1" />
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-14 w-14 text-muted-foreground hover:text-bronze hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors disabled:opacity-30"
                            onClick={nextTrack}
                            disabled={!hasNext}
                        >
                            <SkipForward className="h-6 w-6" />
                        </Button>
                    </motion.div>

                    {/* Volume Control */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-4 w-full max-w-xs"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-muted-foreground hover:text-bronze hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-sm transition-colors"
                            onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                        >
                            {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                        <Slider
                            value={[volume]}
                            max={1}
                            step={0.01}
                            onValueChange={(value) => setVolume(value[0])}
                            className="cursor-pointer [&_[role=slider]]:border-2 [&_[role=slider]]:border-bronze [&_[role=slider]]:bg-background"
                        />
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
