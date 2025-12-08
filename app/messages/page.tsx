'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/components/auth/UserContext'
import { AppShell } from '@/components/layout/AppShell'
import { PageHero } from '@/components/ui/PageHero'
import { VinylFlip } from '@/components/ui/VinylFlip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle, Send, Loader2, AlertCircle, Search, Trash2, ExternalLink, Users } from 'lucide-react'
import { WakuProvider, useWaku } from '@/components/waku/WakuProvider'
import { useWakuMessaging } from '@/hooks/useWakuMessaging'
import { formatDistanceToNow } from 'date-fns'
import { truncateAddress } from '@/lib/utils'

interface UserInfo {
    id: string
    walletAddress: string
    displayName: string | null
    avatarUrl: string | null
    role: string
}

function MessagesContent() {
    const { user } = useUser()
    const router = useRouter()
    const { isReady, error } = useWaku()
    const searchParams = useSearchParams()
    const recipientAddress = searchParams.get('user')

    const {
        messages,
        sendMessage,
        getConversation,
        getUniqueConversations,
        deleteMessage,
        isSending
    } = useWakuMessaging(user?.walletAddress || '')

    const [messageText, setMessageText] = useState('')
    const [selectedUser, setSelectedUser] = useState(recipientAddress || '')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<UserInfo[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [userInfoCache, setUserInfoCache] = useState<Record<string, UserInfo>>({})
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const conversation = selectedUser ? getConversation(selectedUser) : []
    const conversations = getUniqueConversations()
    const selectedUserInfo = userInfoCache[selectedUser.toLowerCase()]

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [conversation])

    // Fetch user info for conversation partners
    useEffect(() => {
        async function fetchUserInfo(addresses: string[]) {
            const uncached = addresses.filter(addr => !userInfoCache[addr.toLowerCase()])
            if (uncached.length === 0) return

            try {
                // Fetch all users and filter locally (simpler than multiple API calls)
                const response = await fetch('/api/users')
                if (response.ok) {
                    const users: UserInfo[] = await response.json()
                    const newCache: Record<string, UserInfo> = {}
                    users.forEach(u => {
                        newCache[u.walletAddress.toLowerCase()] = u
                    })
                    setUserInfoCache(prev => ({ ...prev, ...newCache }))
                }
            } catch (err) {
                console.error('Failed to fetch user info:', err)
            }
        }

        const addresses = conversations.map(c => c.address)
        if (addresses.length > 0) {
            fetchUserInfo(addresses)
        }
    }, [conversations])

    // Search users
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!searchQuery.trim()) {
                setSearchResults([])
                return
            }

            setIsSearching(true)
            try {
                const response = await fetch(`/api/users?search=${encodeURIComponent(searchQuery)}`)
                if (response.ok) {
                    const users: UserInfo[] = await response.json()
                    // Filter out current user
                    setSearchResults(users.filter(u =>
                        u.walletAddress.toLowerCase() !== user?.walletAddress?.toLowerCase()
                    ))
                }
            } catch (err) {
                console.error('Search failed:', err)
            } finally {
                setIsSearching(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery, user?.walletAddress])

    const handleSend = async () => {
        if (!messageText.trim() || !selectedUser) return

        const success = await sendMessage(selectedUser, messageText)
        if (success) {
            setMessageText('')
        }
    }

    const handleSelectUser = (address: string) => {
        setSelectedUser(address)
        setSearchQuery('')
        setSearchResults([])
    }

    const handleDeleteMessage = (messageId: string) => {
        deleteMessage(messageId)
    }

    const getDisplayName = (address: string) => {
        const info = userInfoCache[address.toLowerCase()]
        return info?.displayName || truncateAddress(address)
    }

    const getUserId = (address: string) => {
        return userInfoCache[address.toLowerCase()]?.id
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
                                    SIGN
                                    <br />
                                    IN
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
                    <p className="text-center text-muted-foreground font-mono">PLEASE_SIGN_IN_TO_START_MESSAGING</p>
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
                                {conversations.length}
                                <br />
                                CONVERSATIONS
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
                    {/* Left Sidebar: Conversations */}
                    <Card className="rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                        <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 p-3">
                            {/* User Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name or wallet..."
                                    className="pl-9 rounded-sm border-zinc-200 dark:border-zinc-800 font-mono text-sm focus-visible:ring-bronze shadow-sm"
                                />
                            </div>

                            {/* Search Results Dropdown */}
                            {(searchResults.length > 0 || isSearching) && (
                                <div className="mt-2 border border-zinc-200 dark:border-zinc-800 rounded-sm bg-background shadow-md max-h-48 overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-3 text-center">
                                            <Loader2 className="h-4 w-4 animate-spin mx-auto text-bronze" />
                                        </div>
                                    ) : (
                                        searchResults.map((result) => (
                                            <button
                                                key={result.id}
                                                onClick={() => handleSelectUser(result.walletAddress)}
                                                className="w-full p-3 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left"
                                            >
                                                <Avatar className="h-8 w-8">
                                                    {result.avatarUrl && <AvatarImage src={result.avatarUrl} />}
                                                    <AvatarFallback className="text-xs bg-zinc-100 dark:bg-zinc-800">
                                                        {(result.displayName?.[0] || result.walletAddress.slice(2, 4)).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">
                                                        {result.displayName || 'Anonymous'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground font-mono truncate">
                                                        {truncateAddress(result.walletAddress)}
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className="text-[9px] rounded-sm">
                                                    {result.role}
                                                </Badge>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </CardHeader>

                        <CardContent className="p-0 max-h-96 overflow-y-auto">
                            {conversations.length === 0 ? (
                                <div className="p-6 text-center">
                                    <Users className="h-8 w-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                                    <p className="text-xs text-muted-foreground font-mono">NO_CONVERSATIONS</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Search for users above to start a conversation
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {conversations.map((conv) => (
                                        <button
                                            key={conv.address}
                                            onClick={() => handleSelectUser(conv.address)}
                                            className={`w-full p-3 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left ${selectedUser.toLowerCase() === conv.address.toLowerCase()
                                                    ? 'bg-bronze/5 border-l-2 border-bronze'
                                                    : ''
                                                }`}
                                        >
                                            <Avatar className="h-10 w-10">
                                                {userInfoCache[conv.address]?.avatarUrl && (
                                                    <AvatarImage src={userInfoCache[conv.address].avatarUrl!} />
                                                )}
                                                <AvatarFallback className="text-xs bg-zinc-100 dark:bg-zinc-800">
                                                    {getDisplayName(conv.address).slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    {getDisplayName(conv.address)}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {conv.lastMessage.content}
                                                </p>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground font-mono">
                                                {formatDistanceToNow(conv.lastMessage.timestamp, { addSuffix: false })}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Browse Community Link */}
                            <div className="p-3 border-t border-zinc-100 dark:border-zinc-800">
                                <Link href="/community">
                                    <Button variant="outline" className="w-full rounded-sm text-xs" size="sm">
                                        <Users className="h-3 w-3 mr-2" />
                                        Browse Community
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Conversation */}
                    <Card className="lg:col-span-2 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-refined">
                        <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 p-4">
                            {selectedUser ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            {selectedUserInfo?.avatarUrl && (
                                                <AvatarImage src={selectedUserInfo.avatarUrl} />
                                            )}
                                            <AvatarFallback className="text-xs bg-zinc-100 dark:bg-zinc-800">
                                                {getDisplayName(selectedUser).slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold">{getDisplayName(selectedUser)}</p>
                                            <p className="text-xs text-muted-foreground font-mono">
                                                {truncateAddress(selectedUser)}
                                            </p>
                                        </div>
                                    </div>
                                    {getUserId(selectedUser) && (
                                        <Link href={`/profile/${getUserId(selectedUser)}`}>
                                            <Button variant="outline" size="sm" className="rounded-sm">
                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                View Profile
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <CardTitle className="font-mono uppercase tracking-widest text-sm text-muted-foreground">
                                    Select a conversation
                                </CardTitle>
                            )}
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Messages */}
                            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-zinc-50/30 dark:bg-zinc-900/30">
                                {!selectedUser ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                                            <p className="text-muted-foreground font-mono text-sm">
                                                SELECT_A_CONVERSATION
                                            </p>
                                        </div>
                                    </div>
                                ) : conversation.length === 0 ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="text-center">
                                            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                                            <p className="text-muted-foreground font-mono text-sm">
                                                NO_MESSAGES_YET
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Send a message to start the conversation
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
                                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                                                >
                                                    <div
                                                        className={`max-w-[70%] p-3 rounded-md border relative ${isOwn
                                                            ? 'bg-foreground text-background border-foreground'
                                                            : 'bg-background text-foreground border-zinc-200 dark:border-zinc-700 shadow-sm'
                                                            }`}
                                                    >
                                                        <p className="text-sm break-words">{msg.content}</p>
                                                        <p className={`text-[10px] mt-1 font-mono ${isOwn ? 'text-background/70' : 'text-muted-foreground'}`}>
                                                            {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                                                        </p>

                                                        {/* Delete button */}
                                                        <button
                                                            onClick={() => handleDeleteMessage(msg.id)}
                                                            className={`absolute -top-2 ${isOwn ? '-left-2' : '-right-2'} opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-red-500 text-white hover:bg-red-600`}
                                                            title="Delete message"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
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
                            Messages are sent via Waku, a decentralized P2P network. Both users must be online for real-time delivery. Messages are stored locally.
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
