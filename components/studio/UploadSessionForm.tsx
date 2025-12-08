'use client'

import { useState } from 'react'
import { useUser } from '@/components/auth/UserContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, Upload } from 'lucide-react'
import { AudioUploader } from './AudioUploader'

interface UploadSessionFormProps {
  onSuccess?: () => void
}

export function UploadSessionForm({ onSuccess }: UploadSessionFormProps) {
  const { user } = useUser()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'PRODUCED' as 'JAM' | 'REHEARSAL' | 'PRODUCED',
    moodTags: '',
    priceUsd: '',
    audioUrl: '',
    commercialUse: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to upload sessions',
        variant: 'destructive',
      })
      return
    }

    if (!formData.audioUrl) {
      toast({
        title: 'Audio file required',
        description: 'Please upload an audio file before submitting',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: user.id,
          title: formData.title,
          description: formData.description,
          contentType: formData.contentType,
          moodTags: formData.moodTags,
          audioUrl: formData.audioUrl,
          priceUsd: parseFloat(formData.priceUsd),
          commercialUse: formData.commercialUse,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || error.error || 'Failed to create session')
      }

      const session = await response.json()

      // Show success toast with Story Protocol explorer link
      const explorerUrl = session.storyTxHash
        ? `https://aeneid.explorer.story.foundation/transactions/${session.storyTxHash}`
        : null

      if (explorerUrl) {
        toast({
          title: '✅ Session created!',
          description: (
            <div className="space-y-2">
              <p>"{session.title}" has been registered on Story Protocol</p>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs underline hover:text-bronze transition-colors"
              >
                View on Story Explorer →
              </a>
            </div>
          ),
        })
      } else {
        toast({
          title: '✅ Session created!',
          description: `"${session.title}" has been registered on Story Protocol`,
        })
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        contentType: 'PRODUCED',
        moodTags: '',
        priceUsd: '',
        audioUrl: '',
        commercialUse: true,
      })

      onSuccess?.()
    } catch (error) {
      console.error('Upload failed:', error)
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Session</CardTitle>
        <CardDescription>
          Each track will be registered as IP on Story Protocol
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="My Awesome Track"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about this session..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type *</Label>
              <Select
                value={formData.contentType}
                onValueChange={(value: 'JAM' | 'REHEARSAL' | 'PRODUCED') =>
                  setFormData({ ...formData, contentType: value })
                }
              >
                <SelectTrigger id="contentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JAM">Jam Session</SelectItem>
                  <SelectItem value="REHEARSAL">Rehearsal</SelectItem>
                  <SelectItem value="PRODUCED">Produced Track</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.priceUsd}
                onChange={(e) => setFormData({ ...formData, priceUsd: e.target.value })}
                placeholder="9.99"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="moodTags">Mood Tags</Label>
            <Input
              id="moodTags"
              value={formData.moodTags}
              onChange={(e) => setFormData({ ...formData, moodTags: e.target.value })}
              placeholder="ambient, dark, hopeful (comma separated)"
            />
            <p className="text-xs text-muted-foreground">
              Add mood keywords separated by commas
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="commercialUse"
              checked={formData.commercialUse}
              onCheckedChange={(checked) => setFormData({ ...formData, commercialUse: checked as boolean })}
            />
            <Label
              htmlFor="commercialUse"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Allow commercial use (buyers can use this track in commercial projects)
            </Label>
          </div>

          <div className="space-y-2">
            <Label>Audio File *</Label>
            <AudioUploader
              onUploadComplete={(url) => setFormData(prev => ({ ...prev, audioUrl: url }))}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground font-mono">
              Upload your audio file (MP3, M4A, WAV, FLAC, OGG • Max 50MB)
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering IP on Story...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload & Register
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
