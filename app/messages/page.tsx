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
                    <VinylFlip flippable={false}
                        className="w-64 h-64 ml-auto"
                        front={
                            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                <MessageCircle className="w-32 h-32" />
                            </div>
                        }
                        back={
                            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
                                <span className="font-mono text-sm font-bold tracking-widest text-bronze">
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
                <VinylFlip flippable={false}
                    className="w-64 h-64 ml-auto"
                    front={
                        <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                            <MessageCircle className="w-32 h-32" />
                        </div>
                    }
                    back={
                        <div className="w-full h-full flex items-center justify-center bg-background text-foreground border border-zinc-200 dark:border-zinc-800 p-4 text-center rounded-md shadow-refined">
                            <span className="font-mono text-sm font-bold tracking-widest text-bronze">
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
                    <Card className="rounded-md border border-red-500 mb-6 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-red-500">
                                <AlertCircle className="h-5 w-5" />
                                <p className="font-mono text-sm">WAKU_ERROR: {error}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!isReady && !error && (
                    <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 mb-6 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin text-bronze" />
                                <p className="font-mono text-sm text-muted-foreground">CONNECTING_TO_WAKU_NETWORK...</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {isReady && (
                    <Card className="rounded-md border border-green-500/50 mb-6 shadow-sm bg-green-50/10 dark:bg-green-900/10">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <p className="font-mono text-sm">WAKU_CONNECTED</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Messaging Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recipient Selection */}
                    <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                        <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
                            <CardTitle className="font-mono uppercase tracking-widest text-sm text-muted-foreground">
                                Recipient
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <Input
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                placeholder="0x..."
                                className="rounded-sm border-zinc-200 dark:border-zinc-800 font-mono text-sm focus-visible:ring-bronze shadow-sm"
                            />
                            <p className="text-xs text-muted-foreground mt-2 font-mono">
                                Enter wallet address to message
                            </p>
                        </CardContent>
                    </Card>

                    {/* Conversation */}
                    <Card className="lg:col-span-2 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                        <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
                            <CardTitle className="font-mono uppercase tracking-widest text-sm text-muted-foreground">
                                {selectedUser ? `Chat with ${truncateAddress(selectedUser)}` : 'Select a user'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Messages */}
                            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-zinc-50/30 dark:bg-zinc-900/30">
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
                                                        className={`max-w-[70%] p-3 rounded-md border ${isOwn
                                                            ? 'bg-foreground text-background border-foreground'
                                                            : 'bg-background text-foreground border-zinc-200 dark:border-zinc-700 shadow-sm'
                                                            }`}
                                                    >
                                                        <p className="text-sm break-words">{msg.content}</p>
                                                        <p className={`text-[10px] mt-1 font-mono ${isOwn ? 'text-background/70' : 'text-muted-foreground'}`}>
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
                            <div className="border-t border-zinc-100 dark:border-zinc-800 p-4 bg-background rounded-b-md">
                                <div className="flex gap-2">
                                    <Input
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Type a message..."
                                        disabled={!isReady || !selectedUser}
                                        className="rounded-sm border-zinc-200 dark:border-zinc-800 font-mono focus-visible:ring-bronze shadow-sm"
                                    />
                                    <Button
                                        onClick={handleSend}
                                        disabled={!messageText.trim() || !selectedUser || isSending || !isReady}
                                        className="rounded-sm border border-zinc-200 dark:border-zinc-800 hover:border-bronze hover:text-bronze shadow-sm"
                                        variant="outline"
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
                <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 mt-6 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                            <AlertCircle className="h-3 w-3" />
                            Messages are sent via Waku, a decentralized P2P network. Your messages are
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
                        <p className="font-mono animate-pulse text-muted-foreground">LOADING_MESSAGES...</p>
                    </div>
                }>
                    <MessagesContent />
                </Suspense>
            </WakuProvider>
        </AppShell>
    )
}

