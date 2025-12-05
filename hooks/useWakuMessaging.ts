'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWaku, useLightPush, useFilterMessages } from '@waku/react'
import { createEncoder, createDecoder, waitForRemotePeer, Protocols } from '@waku/sdk'
import { encodeMessage, decodeMessage, createContentTopic } from '@/lib/waku/protocol'
import { useUser } from '@/components/auth/UserContext'

interface WakuMessage {
  messageId: string
  timestamp: number
  senderId: string
  senderAddress: string
  senderName: string
  receiverId: string
  receiverAddress: string
  content: string
}

export function useWakuMessaging(recipientAddress?: string) {
  const { user } = useUser()
  const { node, error: wakuError, isLoading: wakuLoading } = useWaku()
  const [messages, setMessages] = useState<WakuMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Create content topic for this conversation
  const contentTopic = user && recipientAddress
    ? createContentTopic(user.walletAddress, recipientAddress)
    : null

  // Create encoder and decoder
  const encoder = contentTopic ? createEncoder({ contentTopic }) : null
  const decoder = contentTopic ? createDecoder(contentTopic) : null

  // Use Light Push for sending
  const { push } = useLightPush({ node, encoder: encoder || undefined })

  // Use Filter for receiving messages
  const { messages: wakuMessages } = useFilterMessages({
    node,
    decoder: decoder || undefined
  })

  // Wait for peers to be ready
  useEffect(() => {
    if (!node) return

    const initNode = async () => {
      try {
        await waitForRemotePeer(node, [Protocols.LightPush, Protocols.Filter])
        setIsReady(true)
      } catch (error) {
        console.error('Failed to connect to Waku peers:', error)
      }
    }

    initNode()
  }, [node])

  // Process incoming Waku messages
  useEffect(() => {
    if (!wakuMessages || wakuMessages.length === 0) return

    const newMessages: WakuMessage[] = []

    for (const wakuMsg of wakuMessages) {
      if (!wakuMsg.payload) continue

      const decoded = decodeMessage(wakuMsg.payload)
      if (!decoded) continue

      newMessages.push({
        messageId: decoded.messageId,
        timestamp: Number(decoded.timestamp),
        senderId: decoded.senderId,
        senderAddress: decoded.senderAddress,
        senderName: decoded.senderName,
        receiverId: decoded.receiverId,
        receiverAddress: decoded.receiverAddress,
        content: decoded.content,
      })
    }

    if (newMessages.length > 0) {
      setMessages(prev => {
        // Avoid duplicates based on messageId
        const existingIds = new Set(prev.map(m => m.messageId))
        const uniqueNew = newMessages.filter(m => !existingIds.has(m.messageId))
        return [...prev, ...uniqueNew].sort((a, b) => a.timestamp - b.timestamp)
      })
    }
  }, [wakuMessages])

  // Send a message
  const sendMessage = useCallback(async (
    recipientId: string,
    recipientAddress: string,
    content: string
  ): Promise<boolean> => {
    if (!user || !push || !isReady) {
      console.error('Waku not ready or user not authenticated')
      return false
    }

    setIsSending(true)

    try {
      const encodedPayload = encodeMessage({
        senderId: user.id,
        senderAddress: user.walletAddress,
        senderName: user.displayName || 'Anonymous',
        receiverId: recipientId,
        receiverAddress: recipientAddress,
        content,
      })

      await push({
        payload: encodedPayload,
        timestamp: new Date(),
      })

      console.log('Message sent via Waku')
      return true
    } catch (error) {
      console.error('Failed to send Waku message:', error)
      return false
    } finally {
      setIsSending(false)
    }
  }, [user, push, isReady])

  return {
    messages,
    sendMessage,
    isSending,
    isReady,
    wakuError,
    wakuLoading,
  }
}
