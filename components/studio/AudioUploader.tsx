'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Music, X, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface AudioUploaderProps {
    onUploadComplete: (url: string, durationSec?: number) => void
    disabled?: boolean
}

const ACCEPTED_FORMATS = {
    'audio/mpeg': ['.mp3'],
    'audio/mp4': ['.m4a'],
    'audio/x-m4a': ['.m4a'], // Alternative M4A MIME type
    'audio/wav': ['.wav'],
    'audio/x-wav': ['.wav'], // Alternative WAV MIME type
    'audio/flac': ['.flac'],
    'audio/ogg': ['.ogg'],
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export function AudioUploader({ onUploadComplete, disabled }: AudioUploaderProps) {
    const { toast } = useToast()
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const audioRef = useRef<HTMLAudioElement>(null)

    const validateFile = (file: File): string | null => {
        // Check file type by MIME type or extension
        const isValidMimeType = Object.keys(ACCEPTED_FORMATS).includes(file.type)
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        const allExtensions = Object.values(ACCEPTED_FORMATS).flat()
        const isValidExtension = allExtensions.includes(fileExtension)

        if (!isValidMimeType && !isValidExtension) {
            return `Invalid file type. Accepted: ${allExtensions.join(', ')}`
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
        }

        return null
    }

    const extractAudioDuration = (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const audio = new Audio()
            const objectUrl = URL.createObjectURL(file)

            audio.addEventListener('loadedmetadata', () => {
                URL.revokeObjectURL(objectUrl)
                resolve(Math.round(audio.duration))
            })

            audio.addEventListener('error', () => {
                URL.revokeObjectURL(objectUrl)
                reject(new Error('Failed to load audio metadata'))
            })

            audio.src = objectUrl
        })
    }

    const uploadFile = async (file: File) => {
        setIsUploading(true)
        setUploadProgress(0)

        try {
            // Extract duration before upload
            let durationSec: number | undefined
            try {
                durationSec = await extractAudioDuration(file)
                console.log('📊 Audio duration extracted:', durationSec, 'seconds')
            } catch (error) {
                console.warn('⚠️ Could not extract audio duration:', error)
                // Continue with upload even if duration extraction fails
            }

            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload/audio', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Upload failed')
            }

            const data = await response.json()

            setAudioUrl(data.url)
            setUploadedFile(file)
            onUploadComplete(data.url, durationSec)

            toast({
                title: 'Upload successful',
                description: `${file.name} uploaded successfully`,
            })
        } catch (error) {
            console.error('Upload error:', error)
            toast({
                title: 'Upload failed',
                description: error instanceof Error ? error.message : 'Failed to upload audio',
                variant: 'destructive',
            })
            setUploadedFile(null)
            setAudioUrl(null)
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    const handleFile = async (file: File) => {
        console.log('📁 File selected:', file.name, file.type, file.size)

        const error = validateFile(file)
        if (error) {
            console.error('❌ Validation failed:', error)
            toast({
                title: 'Invalid file',
                description: error,
                variant: 'destructive',
            })
            return
        }

        console.log('✅ File validated, starting upload...')
        await uploadFile(file)
    }

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)
            console.log('🎯 Drop event triggered')

            if (disabled || isUploading) {
                console.log('⚠️ Upload blocked - disabled:', disabled, 'isUploading:', isUploading)
                return
            }

            const files = Array.from(e.dataTransfer.files)
            console.log('📎 Files dropped:', files.length, files)
            if (files.length > 0) {
                handleFile(files[0])
            }
        },
        [disabled, isUploading]
    )

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('📂 File input clicked')
        const files = e.target.files
        if (files && files.length > 0) {
            console.log('📂 File selected via input:', files[0].name)
            handleFile(files[0])
        }
    }

    const handleRemove = () => {
        setUploadedFile(null)
        setAudioUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            {!uploadedFile && (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
            relative border-2 border-dashed transition-all
            ${isDragging ? 'border-foreground bg-foreground/5' : 'border-foreground/30'}
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-foreground'}
          `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={Object.values(ACCEPTED_FORMATS).flat().join(',')}
                        onChange={handleFileInput}
                        disabled={disabled || isUploading}
                        className="hidden"
                    />

                    <div
                        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
                        className="p-12 text-center"
                    >
                        {isUploading ? (
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <div className="animate-spin">
                                        <Music className="h-12 w-12" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-mono text-sm font-bold">UPLOADING...</p>
                                    <div className="w-full bg-foreground/10 h-2 border border-foreground">
                                        <div
                                            className="bg-foreground h-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-center">
                                    <Upload className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-mono text-sm font-bold uppercase">
                                        {isDragging ? 'DROP_FILE_HERE' : 'DRAG_&_DROP_AUDIO'}
                                    </p>
                                    <p className="text-xs text-muted-foreground font-mono">
                                        or click to browse
                                    </p>
                                    <p className="text-xs text-muted-foreground font-mono">
                                        MP3, M4A, WAV, FLAC, OGG • Max 50MB
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Uploaded File Preview */}
            {uploadedFile && audioUrl && (
                <div className="border-2 border-foreground bg-background p-4 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                            <CheckCircle2 className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="font-mono text-sm font-bold truncate">
                                    {uploadedFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground font-mono">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={handleRemove}
                            variant="ghost"
                            size="sm"
                            className="rounded-none border-2 border-foreground hover:bg-foreground hover:text-background"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Audio Preview */}
                    <div className="border-t-2 border-foreground pt-4">
                        <p className="text-xs font-mono font-bold mb-2 uppercase">Preview:</p>
                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            controls
                            className="w-full"
                            style={{
                                filter: 'invert(1) grayscale(1) contrast(1.2)',
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
