import protobuf from 'protobufjs'

// Define the message structure for Side B private messaging
export const SideBMessage = new protobuf.Type('SideBMessage')
  .add(new protobuf.Field('timestamp', 1, 'uint64'))
  .add(new protobuf.Field('senderId', 2, 'string'))
  .add(new protobuf.Field('senderAddress', 3, 'string'))
  .add(new protobuf.Field('senderName', 4, 'string'))
  .add(new protobuf.Field('receiverId', 5, 'string'))
  .add(new protobuf.Field('receiverAddress', 6, 'string'))
  .add(new protobuf.Field('content', 7, 'string'))
  .add(new protobuf.Field('messageId', 8, 'string'))

// Content topics for different conversation channels
export const createContentTopic = (userAddress1: string, userAddress2: string): string => {
  // Sort addresses to ensure consistent topic naming regardless of sender/receiver
  const addresses = [userAddress1.toLowerCase(), userAddress2.toLowerCase()].sort()
  return `/side-b/1/dm-${addresses[0]}-${addresses[1]}/proto`
}

// Generate a unique message ID
export const generateMessageId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Encode a message for Waku transmission
export const encodeMessage = (message: {
  senderId: string
  senderAddress: string
  senderName: string
  receiverId: string
  receiverAddress: string
  content: string
}): Uint8Array => {
  const protoMessage = SideBMessage.create({
    timestamp: Date.now(),
    senderId: message.senderId,
    senderAddress: message.senderAddress,
    senderName: message.senderName,
    receiverId: message.receiverId,
    receiverAddress: message.receiverAddress,
    content: message.content,
    messageId: generateMessageId(),
  })

  return SideBMessage.encode(protoMessage).finish()
}

// Decode a received Waku message
export const decodeMessage = (payload: Uint8Array): any => {
  try {
    return SideBMessage.decode(payload)
  } catch (error) {
    console.error('Failed to decode message:', error)
    return null
  }
}
