"use client"

import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

interface Track {
    id: string
    title: string
    artist: string
    audioUrl: string
    imageUrl?: string
    price?: string
}

interface PlayerContextType {
    currentTrack: Track | null
    isPlaying: boolean
    volume: number
    progress: number
    duration: number
    playlist: Track[]
    isExpanded: boolean
    playTrack: (track: Track, playlist?: Track[]) => void
    togglePlay: () => void
    stopTrack: () => void
    setVolume: (volume: number) => void
    seek: (time: number) => void
    nextTrack: () => void
    previousTrack: () => void
    setExpanded: (expanded: boolean) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.8)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [playlist, setPlaylist] = useState<Track[]>([])
    const [isExpanded, setExpanded] = useState(false)

    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        audioRef.current = new Audio()
        audioRef.current.volume = volume

        const audio = audioRef.current

        const updateProgress = () => setProgress(audio.currentTime)
        const updateDuration = () => setDuration(audio.duration)
        const onEnded = () => {
            setIsPlaying(false)
            // Auto-play next track if available
            setTimeout(() => {
                if (currentTrack && playlist.length > 0) {
                    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id)
                    if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
                        const next = playlist[currentIndex + 1]
                        if (audioRef.current) {
                            audioRef.current.src = next.audioUrl
                            audioRef.current.play()
                            setCurrentTrack(next)
                            setIsPlaying(true)
                        }
                    }
                }
            }, 500)
        }

        audio.addEventListener('timeupdate', updateProgress)
        audio.addEventListener('loadedmetadata', updateDuration)
        audio.addEventListener('ended', onEnded)

        return () => {
            audio.removeEventListener('timeupdate', updateProgress)
            audio.removeEventListener('loadedmetadata', updateDuration)
            audio.removeEventListener('ended', onEnded)
            audio.pause()
        }
    }, [currentTrack, playlist])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const playTrack = (track: Track, newPlaylist?: Track[]) => {
        if (currentTrack?.id === track.id) {
            togglePlay()
            return
        }

        if (audioRef.current) {
            audioRef.current.src = track.audioUrl
            audioRef.current.play()
            setCurrentTrack(track)
            setIsPlaying(true)

            // Update playlist if provided
            if (newPlaylist) {
                setPlaylist(newPlaylist)
            }
        }
    }

    const togglePlay = () => {
        if (audioRef.current && currentTrack) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time
            setProgress(time)
        }
    }

    const stopTrack = () => {
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
            setCurrentTrack(null)
            setIsPlaying(false)
            setProgress(0)
            setDuration(0)
            setExpanded(false)
        }
    }

    const nextTrack = () => {
        if (!currentTrack || playlist.length === 0) return

        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id)
        if (currentIndex === -1 || currentIndex === playlist.length - 1) return

        const next = playlist[currentIndex + 1]
        if (audioRef.current) {
            audioRef.current.src = next.audioUrl
            audioRef.current.play()
            setCurrentTrack(next)
            setIsPlaying(true)
        }
    }

    const previousTrack = () => {
        if (!currentTrack || playlist.length === 0) return

        // If more than 3 seconds played, restart current track
        if (progress > 3) {
            seek(0)
            return
        }

        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id)
        if (currentIndex === -1 || currentIndex === 0) return

        const previous = playlist[currentIndex - 1]
        if (audioRef.current) {
            audioRef.current.src = previous.audioUrl
            audioRef.current.play()
            setCurrentTrack(previous)
            setIsPlaying(true)
        }
    }

    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                isPlaying,
                volume,
                progress,
                duration,
                playlist,
                isExpanded,
                playTrack,
                togglePlay,
                stopTrack,
                setVolume,
                seek,
                nextTrack,
                previousTrack,
                setExpanded,
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export function usePlayer() {
    const context = useContext(PlayerContext)
    if (context === undefined) {
        throw new Error('usePlayer must be used within a PlayerProvider')
    }
    return context
}
