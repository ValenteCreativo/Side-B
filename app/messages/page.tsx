'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@/components/auth/UserContext'
import { AppShell } from '@/components/layout/AppShell'
import { PageHero } from '@/components/ui/PageHero'
import { VinylFlip } from '@/components/ui/VinylFlip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Send, Loader2, AlertCircle } from 'lucide-react'
import { WakuProvider, useWaku } from '@/components/waku/WakuProvider'
import { useWakuMessaging } from '@/hooks/useWakuMessaging'
import { formatDistanceToNow } from 'date-fns'
import { truncateAddress } from '@/lib/utils'

function MessagesContent() {
    const { user } = useUser()
    const { isReady, error } = useWaku()
    const searchParams = useSearchParams()
    const recipientAddress = searchParams.get('user')

    const { messages, sendMessage, getConversation, isSending } = useWakuMessaging(
        user?.walletAddress || ''
    )

    const [messageText, setMessageText] = useState('')
    const [selectedUser, setSelectedUser] = useState(recipientAddress || '')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const conversation = selectedUser ? getConversation(selectedUser) : []

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [conversation])

    const handleSend = async () => {
        if (!messageText.trim() || !selectedUser) return

        const success = await sendMessage(selectedUser, messageText)
        if (success) {
            setMessageText('')
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <PageHero
                    title="MESSAGES"
                    subtitle="WAKU_P2P"
                    description="Decentralized peer-to-peer messaging"
                    sideText="SIDE B"
                >
                    <VinylFlip
                        className="w-64 h-64 ml-auto"
                        front={
                            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                <MessageCircle className="w-32 h-32" />
                            </div>
                        }
                        back={
                            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                                <span className="font-mono text-sm font-bold tracking-widest">
                                    CONNECT
                                    <br />
                                    WALLET
                                    <br />
                                    TO
                                    <br />
                                    MESSAGE
                                </span>
                            </div>
                        }
                    />
                </PageHero>
                <div className="container mx-auto px-4 py-12">
                    <p className="text-center text-muted-foreground font-mono">PLEASE_CONNECT_WALLET</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <PageHero
                title="MESSAGES"
                subtitle="WAKU_P2P"
                description="Decentralized peer-to-peer messaging"
                sideText="SIDE B"
            >
                <VinylFlip
                    className="w-64 h-64 ml-auto"
                    front={
                        <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                            <MessageCircle className="w-32 h-32" />
                        </div>
                    }
                    back={
                        <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                            <span className="font-mono text-sm font-bold tracking-widest">
                                {conversation.length}
                                <br />
                                MESSAGES
                            </span>
                        </div>
                    }
                />
            </PageHero>

            <div className="container mx-auto px-4 py-12">
                {/* Waku Status */}
                {error && (
                    <Card className="rounded-none border-2 border-red-500 mb-6">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-red-500">
                                <AlertCircle className="h-5 w-5" />
                                <p className="font-mono text-sm">WAKU_ERROR: {error}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!isReady && !error && (
                    <Card className="rounded-none border-2 border-foreground mb-6">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <p className="font-mono text-sm">CONNECTING_TO_WAKU_NETWORK...</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {isReady && (
                    <Card className="rounded-none border-2 border-green-500 mb-6">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-green-500">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <p className="font-mono text-sm">WAKU_CONNECTED</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Messaging Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recipient Selection */}
                    <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <CardHeader className="border-b-2 border-foreground">
                            <CardTitle className="font-mono uppercase tracking-widest text-sm">
                                Recipient
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <Input
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                placeholder="0x..."
                                className="rounded-none border-2 border-foreground font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-2 font-mono">
                                Enter wallet address to message
                            </p>
                        </CardContent>
                    </Card>

                    {/* Conversation */}
                    <Card className="lg:col-span-2 rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <CardHeader className="border-b-2 border-foreground">
                            <CardTitle className="font-mono uppercase tracking-widest text-sm">
                                {selectedUser ? `Chat with ${truncateAddress(selectedUser)}` : 'Select a user'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Messages */}
                            <div className="h-96 overflow-y-auto p-4 space-y-4">
                                {conversation.length === 0 ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                                            <p className="text-muted-foreground font-mono text-sm">
                                                NO_MESSAGES_YET
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {conversation.map((msg) => {
                                            const isOwn = msg.from.toLowerCase() === user.walletAddress.toLowerCase()
                                            return (
                                                <div
                                                    key={msg.id}
                                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] p-3 border-2 border-foreground ${isOwn
                                                            ? 'bg-foreground text-background'
                                                            : 'bg-background text-foreground'
                                                            }`}
                                                    >
                                                        <p className="text-sm break-words">{msg.content}</p>
                                                        <p className="text-xs opacity-70 mt-1 font-mono">
                                                            {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Send Message */}
                            <div className="border-t-2 border-foreground p-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Type a message..."
                                        disabled={!isReady || !selectedUser}
                                        className="rounded-none border-2 border-foreground font-mono"
                                    />
                                    <Button
                                        onClick={handleSend}
                                        disabled={!messageText.trim() || !selectedUser || isSending || !isReady}
                                        className="rounded-none border-2 border-foreground"
                                    >
                                        {isSending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Info */}
                <Card className="rounded-none border-2 border-foreground/20 mt-6">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-mono">
                            ℹ️ Messages are sent via Waku, a decentralized P2P network. Your messages are
                            encrypted and only visible to you and the recipient.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function MessagesPage() {
    return (
        <AppShell>
            <WakuProvider>
                <Suspense fallback={
                    <div className="min-h-screen bg-background flex items-center justify-center">
                        <p className="font-mono">LOADING_MESSAGES...</p>
                    </div>
                }>
                    <MessagesContent />
                </Suspense>
            </WakuProvider>
        </AppShell>
    )
}

