"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SendMessageDialogProps {
    isOpen: boolean
    onClose: () => void
    recipientId: string
    recipientName: string
    senderId: string
}

export function SendMessageDialog({
    isOpen,
    onClose,
    recipientId,
    recipientName,
    senderId,
}: SendMessageDialogProps) {
    const { toast } = useToast()
    const [content, setContent] = useState("")
    const [isSending, setIsSending] = useState(false)

    const handleSend = async () => {
        if (!content.trim()) {
            toast({
                title: "Empty message",
                description: "Please enter a message",
                variant: "destructive",
            })
            return
        }

        try {
            setIsSending(true)

            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId,
                    receiverId: recipientId,
                    content,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to send message')
            }

            toast({
                title: "Message sent",
                description: `Your message to ${recipientName} has been sent`,
            })

            setContent("")
            onClose()
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to send message",
                variant: "destructive",
            })
        } finally {
            setIsSending(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="rounded-none border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold uppercase tracking-tight">
                        Send Message
                    </DialogTitle>
                    <DialogDescription className="font-mono text-xs">
                        TO: {recipientName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="TYPE_YOUR_MESSAGE..."
                        rows={6}
                        className="rounded-none border-2 border-foreground focus-visible:ring-0 resize-none"
                    />

                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isSending}
                            className="rounded-none border-2 border-foreground hover:bg-foreground hover:text-background"
                        >
                            CANCEL
                        </Button>
                        <Button
                            onClick={handleSend}
                            disabled={isSending || !content.trim()}
                            className="rounded-none bg-foreground text-background hover:bg-foreground/90"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            {isSending ? "SENDING..." : "SEND"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
