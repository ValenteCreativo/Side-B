'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'

interface ImageUploaderProps {
    onUploadComplete: (url: string) => void
    disabled?: boolean
}

const ACCEPTED_FORMATS = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function ImageUploader({ onUploadComplete, disabled }: ImageUploaderProps) {
    const { toast } = useToast()
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const validateFile = (file: File): string | null => {
        const isValidMimeType = Object.keys(ACCEPTED_FORMATS).includes(file.type)
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        const allExtensions = Object.values(ACCEPTED_FORMATS).flat()
        const isValidExtension = allExtensions.includes(fileExtension)

        if (!isValidMimeType && !isValidExtension) {
            return `Invalid file type. Accepted: ${allExtensions.join(', ')}`
        }

        if (file.size > MAX_FILE_SIZE) {
            return `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
        }

        return null
    }

    const uploadFile = async (file: File) => {
        setIsUploading(true)
        setUploadProgress(0)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', 'image')

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()
            setImageUrl(data.url)
            setUploadedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
            onUploadComplete(data.url)

            toast({
                title: 'Image uploaded',
                description: 'Your cover image has been uploaded successfully',
            })
        } catch (error) {
            console.error('Upload error:', error)
            toast({
                title: 'Upload failed',
                description: error instanceof Error ? error.message : 'Please try again',
                variant: 'destructive',
            })
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragging(false)

            if (disabled) return

            const files = Array.from(e.dataTransfer.files)
            const imageFile = files.find((f) => f.type.startsWith('image/'))

            if (!imageFile) {
                toast({
                    title: 'Invalid file',
                    description: 'Please upload an image file',
                    variant: 'destructive',
                })
                return
            }

            const validationError = validateFile(imageFile)
            if (validationError) {
                toast({
                    title: 'Invalid file',
                    description: validationError,
                    variant: 'destructive',
                })
                return
            }

            uploadFile(imageFile)
        },
        [disabled]
    )

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validationError = validateFile(file)
        if (validationError) {
            toast({
                title: 'Invalid file',
                description: validationError,
                variant: 'destructive',
            })
            return
        }

        uploadFile(file)
    }

    const handleRemove = () => {
        setUploadedFile(null)
        setImageUrl(null)
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        onUploadComplete('')
    }

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept={Object.keys(ACCEPTED_FORMATS).join(',')}
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled}
            />

            {!uploadedFile ? (
                <div
                    onDragOver={(e) => {
                        e.preventDefault()
                        if (!disabled) setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed rounded-md p-8
                        flex flex-col items-center justify-center gap-3
                        cursor-pointer transition-colors
                        ${isDragging ? 'border-bronze bg-bronze/5' : 'border-zinc-200 dark:border-zinc-800'}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-bronze hover:bg-bronze/5'}
                    `}
                >
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                        <p className="text-sm font-medium">
                            {isUploading ? 'Uploading...' : 'Drop image here or click to upload'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG, GIF, WEBP up to 5MB
                        </p>
                    </div>
                    {isUploading && (
                        <div className="w-full max-w-xs h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-bronze transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-md p-4">
                    <div className="flex items-center gap-4">
                        {previewUrl && (
                            <div className="relative w-20 h-20 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm font-medium truncate">{uploadedFile.name}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleRemove}
                            disabled={disabled}
                            className="flex-shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
