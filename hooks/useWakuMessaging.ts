'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWaku } from '@/components/waku/WakuProvider'
import { WAKU_CONFIG } from '@/lib/waku/config'
import { encodeMessage, decodeMessage, IDirectMessage } from '@/lib/waku/protocol'
import { createDecoder, createEncoder } from '@waku/sdk'

export function useWakuMessaging(userAddress: string) {
    const { node, isReady } = useWaku()
    const [messages, setMessages] = useState<IDirectMessage[]>([])
    const [isSending, setIsSending] = useState(false)

    // Subscribe to incoming messages
    useEffect(() => {
        if (!node || !isReady) return

        async function subscribe() {
            if (!node) return

            try {
                // Create decoder for the content topic
                const decoder = createDecoder(WAKU_CONFIG.CONTENT_TOPIC)

                const callback = async (wakuMessage: any) => {
                    if (!wakuMessage.payload) return

                    try {
                        const message = decodeMessage(wakuMessage.payload)

                        // Only process messages addressed to this user
                        if (message.to.toLowerCase() === userAddress.toLowerCase()) {
                            setMessages((prev) => {
                                // Avoid duplicates
                                if (prev.some((m) => m.id === message.id)) return prev
                                return [...prev, message].sort((a, b) => a.timestamp - b.timestamp)
                            })
                        }
                    } catch (err) {
                        console.error('Failed to decode message:', err)
                    }
                }

                // Subscribe to the content topic
                await node.filter.subscribe([decoder], callback)
                console.log('✅ Subscribed to Waku messages')
            } catch (err) {
                console.error('Failed to subscribe to messages:', err)
            }
        }

        subscribe()
    }, [node, isReady, userAddress])

    // Send a message
    const sendMessage = useCallback(
        async (to: string, content: string): Promise<boolean> => {
            if (!node || !isReady) {
                console.error('Waku node not ready')
                return false
            }

            setIsSending(true)
            try {
                const message: IDirectMessage = {
                    id: `${Date.now()}-${Math.random()}`,
                    from: userAddress,
                    to,
                    content,
                    timestamp: Date.now(),
                }

                const payload = encodeMessage(message)
                const encoder = createEncoder({ contentTopic: WAKU_CONFIG.CONTENT_TOPIC })

                await node.lightPush.send(encoder, { payload })

                // Add to local messages
                setMessages((prev) => [...prev, message])

                console.log('✅ Message sent')
                return true
            } catch (err) {
                console.error('Failed to send message:', err)
                return false
            } finally {
                setIsSending(false)
            }
        },
        [node, isReady, userAddress]
    )

    // Get messages for a specific conversation
    const getConversation = useCallback(
        (otherAddress: string) => {
            return messages.filter(
                (m) =>
                    (m.from.toLowerCase() === userAddress.toLowerCase() &&
                        m.to.toLowerCase() === otherAddress.toLowerCase()) ||
                    (m.from.toLowerCase() === otherAddress.toLowerCase() &&
                        m.to.toLowerCase() === userAddress.toLowerCase())
            )
        },
        [messages, userAddress]
    )

    return {
        messages,
        sendMessage,
        getConversation,
        isSending,
        isReady,
    }
}
