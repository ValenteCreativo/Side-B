'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/components/auth/UserContext'
import { AppShell } from '@/components/layout/AppShell'
import { PageHero } from '@/components/ui/PageHero'
import { VinylFlip } from '@/components/ui/VinylFlip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { truncateAddress } from '@/lib/utils'
import { useWakuMessaging } from '@/hooks/useWakuMessaging'
import { Lock, Send, Loader2, Shield, Users, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Conversation {
  userId: string
  userAddress: string
  userName: string
  lastMessage?: string
  lastMessageTime?: number
  unreadCount: number
}

export default function WakuMessagesPage() {
  const { user } = useUser()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)

  // Initialize Waku messaging for selected conversation
  const {
    messages,
    sendMessage,
    isSending,
    isReady,
    wakuError,
    wakuLoading
  } = useWakuMessaging(selectedConversation?.userAddress)

  // Load existing conversations from database
  useEffect(() => {
    if (!user) return

    const loadConversations = async () => {
      try {
        // Get unique conversation partners from existing messages
        const response = await fetch(`/api/messages/conversations?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setConversations(data)
        }
      } catch (error) {
        console.error('Failed to load conversations:', error)
      } finally {
        setIsLoadingConversations(false)
      }
    }

    loadConversations()
  }, [user])

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !user) return

    const success = await sendMessage(
      selectedConversation.userId,
      selectedConversation.userAddress,
      messageInput.trim()
    )

    if (success) {
      setMessageInput('')

      // Also save to database for conversation history
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedConversation.userId,
          content: messageInput.trim(),
        }),
      })
    }
  }

  const filteredConversations = conversations.filter(c =>
    c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.userAddress.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) {
    return (
      <AppShell>
        <div className="min-h-screen bg-background">
          <PageHero
            title="ENCRYPTED MESSAGES"
            subtitle="WAKU_PROTOCOL"
            description="Privacy-preserving peer-to-peer messaging powered by Waku"
            sideText="SIDE B"
          >
            <VinylFlip
              className="w-64 h-64 ml-auto"
              front={
                <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                  <Lock className="w-32 h-32" />
                </div>
              }
              back={
                <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                  <span className="font-mono text-sm font-bold tracking-widest">
                    END-TO-END
                    <br />
                    ENCRYPTED
                    <br />
                    MESSAGING
                  </span>
                </div>
              }
            />
          </PageHero>
          <div className="container mx-auto px-4 py-12">
            <p className="text-center text-muted-foreground font-mono">PLEASE_SIGN_IN_TO_ACCESS_MESSAGES</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-background">
        <PageHero
          title="ENCRYPTED MESSAGES"
          subtitle="WAKU_PROTOCOL"
          description="Privacy-preserving peer-to-peer messaging powered by Waku"
          sideText="SIDE B"
        >
          <VinylFlip
            className="w-64 h-64 ml-auto"
            front={
              <div className="w-full h-full flex items-center justify-center bg-foreground text-background">
                <Lock className="w-32 h-32" />
              </div>
            }
            back={
              <div className="w-full h-full flex items-center justify-center bg-background text-foreground border-2 border-foreground p-4 text-center">
                <span className="font-mono text-sm font-bold tracking-widest">
                  {isReady ? 'CONNECTED' : wakuLoading ? 'CONNECTING' : 'OFFLINE'}
                  <br />
                  TO
                  <br />
                  NETWORK
                </span>
              </div>
            }
          />
        </PageHero>

        <div className="container mx-auto px-4 py-12">
          {/* Waku Status Banner */}
          <div className="mb-6">
            <Card className="rounded-none border-2 border-foreground">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    <div>
                      <p className="font-mono font-bold uppercase text-sm">Waku Network Status</p>
                      <p className="text-xs text-muted-foreground">
                        {wakuLoading && 'Connecting to decentralized network...'}
                        {isReady && 'Connected - Messages are end-to-end encrypted'}
                        {wakuError && 'Connection error - Please refresh'}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`rounded-none ${
                      isReady
                        ? 'bg-green-500 text-white'
                        : wakuLoading
                        ? 'bg-yellow-500 text-black'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {isReady ? 'ONLINE' : wakuLoading ? 'CONNECTING' : 'OFFLINE'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <Card className="lg:col-span-1 rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <CardHeader className="border-b-2 border-foreground">
                <CardTitle className="flex items-center gap-2 font-mono uppercase tracking-widest">
                  <Users className="h-5 w-5" />
                  Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Search */}
                <div className="p-4 border-b-2 border-foreground">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="SEARCH_CONVERSATIONS..."
                      className="rounded-none border-2 border-foreground pl-10"
                    />
                  </div>
                </div>

                {/* Conversation List */}
                <div className="max-h-[500px] overflow-y-auto">
                  {isLoadingConversations ? (
                    <div className="p-8 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-muted-foreground font-mono">
                        NO_CONVERSATIONS_YET
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <div
                        key={conv.userId}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-4 border-b-2 border-foreground/20 cursor-pointer hover:bg-secondary transition-colors ${
                          selectedConversation?.userId === conv.userId ? 'bg-secondary' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 rounded-none border-2 border-foreground">
                            <AvatarFallback className="rounded-none bg-foreground text-background font-mono">
                              {conv.userName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-sm truncate">{conv.userName}</p>
                              {conv.unreadCount > 0 && (
                                <Badge className="rounded-none bg-foreground text-background">
                                  {conv.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground font-mono truncate">
                              {truncateAddress(conv.userAddress)}
                            </p>
                            {conv.lastMessage && (
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {conv.lastMessage}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Message Thread */}
            <Card className="lg:col-span-2 rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              {selectedConversation ? (
                <>
                  <CardHeader className="border-b-2 border-foreground">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 rounded-none border-2 border-foreground">
                        <AvatarFallback className="rounded-none bg-foreground text-background font-mono">
                          {selectedConversation.userName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="font-mono uppercase tracking-widest">
                          {selectedConversation.userName}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground font-mono">
                          {truncateAddress(selectedConversation.userAddress)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    {/* Messages */}
                    <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground font-mono text-sm">
                            NO_MESSAGES_YET - START_A_CONVERSATION
                          </p>
                        </div>
                      ) : (
                        messages.map((msg) => {
                          const isOwn = msg.senderAddress === user.walletAddress

                          return (
                            <div
                              key={msg.messageId}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] p-3 border-2 border-foreground rounded-none ${
                                  isOwn
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
                        })
                      )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t-2 border-foreground">
                      <div className="flex gap-2">
                        <Textarea
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                          placeholder={
                            isReady
                              ? 'TYPE_YOUR_ENCRYPTED_MESSAGE...'
                              : 'WAITING_FOR_NETWORK...'
                          }
                          disabled={!isReady || isSending}
                          className="rounded-none border-2 border-foreground resize-none"
                          rows={2}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim() || !isReady || isSending}
                          className="rounded-none border-2 border-foreground"
                        >
                          {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Messages are encrypted and transmitted via Waku network
                      </p>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-12 text-center">
                  <Lock className="h-16 w-16 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <p className="text-muted-foreground font-mono">
                    SELECT_A_CONVERSATION_TO_START_MESSAGING
                  </p>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
