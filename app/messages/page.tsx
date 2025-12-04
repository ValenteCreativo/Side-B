"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/components/auth/UserContext"
import { AppShell } from "@/components/layout/AppShell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Inbox, Mail, User, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PageHero } from "@/components/ui/PageHero"
import { VinylFlip } from "@/components/ui/VinylFlip"
import { formatDistanceToNow } from "date-fns"

interface Message {
    id: string
    content: string
    createdAt: string
    read: boolean
    sender: {
        id: string
        displayName: string | null
        walletAddress: string
        avatarUrl?: string | null
    }
    receiver: {
        id: string
        displayName: string | null
        walletAddress: string
        avatarUrl?: string | null
    }
}

export default function MessagesPage() {
    const { user } = useUser()
    const { toast } = useToast()
    const [inbox, setInbox] = useState<Message[]>([])
    const [sent, setSent] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
    const [isReplying, setIsReplying] = useState(false)
    const [replyContent, setReplyContent] = useState("")

    useEffect(() => {
        if (user) {
            fetchMessages()
        }
    }, [user])

    const fetchMessages = async () => {
        if (!user) return

        try {
            setIsLoading(true)

            // Fetch inbox
            const inboxResponse = await fetch(`/api/messages?userId=${user.id}&type=inbox`)
            if (inboxResponse.ok) {
                const inboxData = await inboxResponse.json()
                setInbox(inboxData)
            }

            // Fetch sent messages
            const sentResponse = await fetch(`/api/messages?userId=${user.id}&type=sent`)
            if (sentResponse.ok) {
                const sentData = await sentResponse.json()
                setSent(sentData)
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error)
            toast({
                title: "Error",
                description: "Failed to load messages",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const markAsRead = async (messageId: string) => {
        try {
            const response = await fetch('/api/messages', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageId }),
            })

            if (response.ok) {
                // Update local state
                setInbox(prev => prev.map(msg =>
                    msg.id === messageId ? { ...msg, read: true } : msg
                ))
            }
        } catch (error) {
            console.error('Failed to mark message as read:', error)
        }
    }

    const handleSelectMessage = (message: Message) => {
        setSelectedMessage(message)
        if (!message.read && message.receiver.id === user?.id) {
            markAsRead(message.id)
        }
    }

    const handleSendReply = async () => {
        if (!user || !selectedMessage || !replyContent.trim()) return

        try {
            setIsReplying(true)

            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: user.id,
                    receiverId: selectedMessage.sender.id,
                    content: replyContent,
                }),
            })

            if (!response.ok) throw new Error('Failed to send reply')

            toast({
                title: "Reply sent",
                description: "Your message has been sent successfully",
            })

            setReplyContent("")
            fetchMessages()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send reply",
                variant: "destructive",
            })
        } finally {
            setIsReplying(false)
        }
    }

    const getInitials = (name: string | null, wallet: string) => {
        if (name) return name.substring(0, 2).toUpperCase()
        return wallet.substring(2, 4).toUpperCase()
    }

    const truncateAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    }

    const unreadCount = inbox.filter(msg => !msg.read).length

    if (!user) {
        return (
            <AppShell>
                <div className="min-h-screen bg-background">
                    <PageHero
                        title="MESSAGES"
                        subtitle="COMMUNICATIONS"
                        description="Private messaging system for collaboration"
                        sideText="SIDE B"
                    >
                        <VinylFlip
                            className="w-64 h-64 ml-auto"
                            front={
                                <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                    <MessageSquare className="w-32 h-32" />
                                </div>
                            }
                            back={
                                <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                                    <span className="font-mono text-sm font-bold tracking-widest">
                                        CONNECT
                                        <br />
                                        COLLABORATE
                                        <br />
                                        CREATE
                                    </span>
                                </div>
                            }
                        />
                    </PageHero>
                    <div className="container mx-auto px-4 py-12">
                        <p className="text-center text-muted-foreground font-mono">PLEASE_SIGN_IN_TO_VIEW_MESSAGES</p>
                    </div>
                </div>
            </AppShell>
        )
    }

    return (
        <AppShell>
            <div className="min-h-screen bg-background">
                <PageHero
                    title="MESSAGES"
                    subtitle="COMMUNICATIONS"
                    description="Private messaging system for collaboration"
                    sideText="SIDE B"
                >
                    <VinylFlip
                        className="w-64 h-64 ml-auto"
                        front={
                            <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                                <MessageSquare className="w-32 h-32" />
                            </div>
                        }
                        back={
                            <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                                <span className="font-mono text-sm font-bold tracking-widest">
                                    {unreadCount > 0 ? `${unreadCount} NEW` : 'NO NEW'}
                                    <br />
                                    MESSAGES
                                </span>
                            </div>
                        }
                    />
                </PageHero>

                <div className="container mx-auto px-4 py-12">
                    <Tabs defaultValue="inbox" className="space-y-6">
                        <TabsList className="rounded-none border-2 border-foreground bg-background">
                            <TabsTrigger value="inbox" className="rounded-none data-[state=active]:bg-foreground data-[state=active]:text-background">
                                <Inbox className="h-4 w-4 mr-2" />
                                INBOX
                                {unreadCount > 0 && (
                                    <Badge className="ml-2 rounded-none bg-foreground text-background">{unreadCount}</Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="sent" className="rounded-none data-[state=active]:bg-foreground data-[state=active]:text-background">
                                <Send className="h-4 w-4 mr-2" />
                                SENT
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="inbox" className="space-y-4">
                            {isLoading ? (
                                <div className="text-center py-12 text-muted-foreground font-mono">
                                    LOADING_MESSAGES...
                                </div>
                            ) : inbox.length === 0 ? (
                                <Card className="rounded-none border-2 border-foreground">
                                    <CardContent className="py-12 text-center">
                                        <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground font-mono">NO_MESSAGES_YET</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Message List */}
                                    <div className="space-y-3">
                                        {inbox.map((message) => (
                                            <Card
                                                key={message.id}
                                                className={`rounded-none border-2 cursor-pointer transition-all ${
                                                    selectedMessage?.id === message.id
                                                        ? 'border-foreground bg-foreground text-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                                        : message.read
                                                            ? 'border-foreground/30 hover:border-foreground'
                                                            : 'border-foreground hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                                }`}
                                                onClick={() => handleSelectMessage(message)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <Avatar className="h-10 w-10 border-2 border-current rounded-none">
                                                            {message.sender.avatarUrl && <AvatarImage src={message.sender.avatarUrl} />}
                                                            <AvatarFallback className="bg-background text-foreground rounded-none">
                                                                {getInitials(message.sender.displayName, message.sender.walletAddress)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                                <p className="font-bold truncate">
                                                                    {message.sender.displayName || truncateAddress(message.sender.walletAddress)}
                                                                </p>
                                                                {!message.read && (
                                                                    <Badge className="rounded-none bg-current text-background">NEW</Badge>
                                                                )}
                                                            </div>
                                                            <p className={`text-sm line-clamp-2 ${selectedMessage?.id === message.id ? 'opacity-90' : 'text-muted-foreground'}`}>
                                                                {message.content}
                                                            </p>
                                                            <p className="text-xs mt-1 opacity-70">
                                                                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Message Detail */}
                                    {selectedMessage && (
                                        <Card className="rounded-none border-2 border-foreground sticky top-4 h-fit">
                                            <CardHeader className="border-b-2 border-foreground">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-12 w-12 border-2 border-foreground rounded-none">
                                                        {selectedMessage.sender.avatarUrl && <AvatarImage src={selectedMessage.sender.avatarUrl} />}
                                                        <AvatarFallback className="bg-foreground text-background rounded-none">
                                                            {getInitials(selectedMessage.sender.displayName, selectedMessage.sender.walletAddress)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <CardTitle className="text-lg">
                                                            {selectedMessage.sender.displayName || 'Anonymous'}
                                                        </CardTitle>
                                                        <p className="text-xs text-muted-foreground font-mono">
                                                            {truncateAddress(selectedMessage.sender.walletAddress)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pt-6 space-y-6">
                                                <div>
                                                    <p className="text-sm whitespace-pre-wrap">{selectedMessage.content}</p>
                                                    <p className="text-xs text-muted-foreground mt-4">
                                                        {formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true })}
                                                    </p>
                                                </div>

                                                <div className="space-y-3 pt-4 border-t-2 border-foreground">
                                                    <p className="text-sm font-bold uppercase tracking-wide">Reply</p>
                                                    <Textarea
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        placeholder="TYPE_YOUR_REPLY..."
                                                        rows={4}
                                                        className="rounded-none border-2 border-foreground focus-visible:ring-0 resize-none"
                                                    />
                                                    <Button
                                                        onClick={handleSendReply}
                                                        disabled={isReplying || !replyContent.trim()}
                                                        className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90"
                                                    >
                                                        <Send className="h-4 w-4 mr-2" />
                                                        {isReplying ? "SENDING..." : "SEND_REPLY"}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="sent" className="space-y-4">
                            {isLoading ? (
                                <div className="text-center py-12 text-muted-foreground font-mono">
                                    LOADING_MESSAGES...
                                </div>
                            ) : sent.length === 0 ? (
                                <Card className="rounded-none border-2 border-foreground">
                                    <CardContent className="py-12 text-center">
                                        <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground font-mono">NO_SENT_MESSAGES</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {sent.map((message) => (
                                        <Card key={message.id} className="rounded-none border-2 border-foreground">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <Avatar className="h-10 w-10 border-2 border-foreground rounded-none">
                                                        {message.receiver.avatarUrl && <AvatarImage src={message.receiver.avatarUrl} />}
                                                        <AvatarFallback className="bg-foreground text-background rounded-none">
                                                            {getInitials(message.receiver.displayName, message.receiver.walletAddress)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <p className="font-bold truncate">
                                                                To: {message.receiver.displayName || truncateAddress(message.receiver.walletAddress)}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                                            {message.content}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppShell>
    )
}
