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
    playTrack: (track: Track) => void
    togglePlay: () => void
    setVolume: (volume: number) => void
    seek: (time: number) => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(0.8)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)

    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        audioRef.current = new Audio()
        audioRef.current.volume = volume

        const audio = audioRef.current

        const updateProgress = () => setProgress(audio.currentTime)
        const updateDuration = () => setDuration(audio.duration)
        const onEnded = () => setIsPlaying(false)

        audio.addEventListener('timeupdate', updateProgress)
        audio.addEventListener('loadedmetadata', updateDuration)
        audio.addEventListener('ended', onEnded)

        return () => {
            audio.removeEventListener('timeupdate', updateProgress)
            audio.removeEventListener('loadedmetadata', updateDuration)
            audio.removeEventListener('ended', onEnded)
            audio.pause()
        }
    }, [])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const playTrack = (track: Track) => {
        if (currentTrack?.id === track.id) {
            togglePlay()
            return
        }

        if (audioRef.current) {
            audioRef.current.src = track.audioUrl
            audioRef.current.play()
            setCurrentTrack(track)
            setIsPlaying(true)
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

    return (
        <PlayerContext.Provider
            value={{
                currentTrack,
                isPlaying,
                volume,
                progress,
                duration,
                playTrack,
                togglePlay,
                setVolume,
                seek,
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
