# Waku Integration - Side B Encrypted Messaging

## Overview

Side B now features **privacy-preserving, decentralized messaging** powered by the [Waku protocol](https://waku.org/), part of the Logos messaging stack. This provides end-to-end encrypted, peer-to-peer communication without centralized servers.

## What is Waku?

Waku is a decentralized communication protocol that provides:
- **Privacy**: End-to-end encrypted messaging
- **Decentralization**: No single point of failure or control
- **Censorship Resistance**: Cannot be blocked or shut down
- **Scalability**: Designed for Web3 applications

## Architecture

### Components

1. **Protocol Layer** (`/lib/waku/protocol.ts`)
   - Protobuf message schema for Side B messages
   - Content topic generation for conversation channels
   - Message encoding/decoding utilities

2. **Configuration** (`/lib/waku/config.ts`)
   - Waku node options with default bootstrap
   - Network configuration settings

3. **Provider** (`/components/waku/WakuProvider.tsx`)
   - React context wrapper using `@waku/react`
   - Manages Waku Light Node lifecycle

4. **Custom Hook** (`/hooks/useWakuMessaging.ts`)
   - `useWakuMessaging()` - Main messaging interface
   - Handles sending via Light Push protocol
   - Receives messages via Filter protocol
   - Auto-manages peer connections

5. **UI** (`/app/waku-messages/page.tsx`)
   - Conversation list with search
   - Real-time encrypted messaging
   - Network status indicators
   - Brutalist design matching Side B aesthetic

6. **API** (`/app/api/messages/conversations/route.ts`)
   - Conversation history from database
   - Hybrid approach: Waku for live messages, DB for history

### Message Flow

```
User A                    Waku Network                User B
   |                           |                         |
   |--[Encode Message]-------->|                         |
   |   (Protobuf)              |                         |
   |                           |                         |
   |--[Light Push]------------>|                         |
   |   (Send to Network)       |                         |
   |                           |                         |
   |                           |--[Filter Subscribe]-----|
   |                           |   (Receive Messages)    |
   |                           |                         |
   |                           |--[Decode Message]------>|
   |                           |   (Protobuf)            |
```

## Key Features

### 1. End-to-End Encryption
- Messages encrypted at protocol level
- Only sender and recipient can decrypt
- No intermediary can read message content

### 2. Decentralized Architecture
- Uses Light Node for resource efficiency
- Connects to Waku network via bootstrap nodes
- No centralized server dependency

### 3. Content Topic System
- Unique topic per conversation pair
- Format: `/side-b/1/dm-{addr1}-{addr2}/proto`
- Addresses sorted alphabetically for consistency

### 4. Dual Storage Approach
- **Waku**: Live, encrypted messages in real-time
- **Database**: Conversation history and metadata
- Best of both worlds: privacy + persistence

## Usage

### For Users

1. Navigate to **Waku Messages** in sidebar
2. Select a conversation from existing contacts
3. Wait for "CONNECTED" status (green badge)
4. Send encrypted messages in real-time
5. Messages are private and cannot be intercepted

### For Developers

#### Send a Message

```typescript
import { useWakuMessaging } from '@/hooks/useWakuMessaging'

function MessageComponent() {
  const { sendMessage, isReady } = useWakuMessaging(recipientAddress)

  const handleSend = async () => {
    if (!isReady) return

    const success = await sendMessage(
      recipientId,
      recipientAddress,
      'Hello via Waku!'
    )
  }
}
```

#### Receive Messages

```typescript
const { messages } = useWakuMessaging(recipientAddress)

// Messages automatically update as they arrive
messages.map(msg => (
  <div key={msg.messageId}>{msg.content}</div>
))
```

## Technical Details

### Protocols Used

- **Light Push**: Send messages from light nodes (resource-efficient)
- **Filter**: Receive messages on light nodes
- **Store**: (Future) Retrieve historical messages from network

### Message Schema (Protobuf)

```protobuf
message SideBMessage {
  uint64 timestamp = 1;
  string senderId = 2;
  string senderAddress = 3;
  string senderName = 4;
  string receiverId = 5;
  string receiverAddress = 6;
  string content = 7;
  string messageId = 8;
}
```

### Network Configuration

- **Bootstrap**: Auto-discovery via DNS
- **Protocols**: Light Push + Filter enabled
- **Content Topics**: Per-conversation isolation
- **Ephemeral**: Messages not stored on network (privacy)

## Benefits Over Traditional Messaging

| Feature | Traditional | Waku |
|---------|-------------|------|
| **Privacy** | Server can read messages | End-to-end encrypted |
| **Censorship** | Can be blocked/shut down | Decentralized, resistant |
| **Ownership** | Platform controls data | Users own their messages |
| **Downtime** | Single point of failure | Distributed network |
| **Surveillance** | Possible via server logs | Cryptographically private |

## Future Enhancements

1. **Store Protocol Integration**
   - Retrieve message history from Waku network
   - Reduce database dependency

2. **Group Messaging**
   - Multi-party encrypted conversations
   - Shared content topics

3. **File Sharing**
   - Send encrypted files via Waku
   - IPFS integration for large files

4. **Push Notifications**
   - Service worker integration
   - Alert users to new encrypted messages

5. **Message Reactions**
   - React to messages with emojis
   - Maintain privacy with encrypted reactions

## Resources

- **Waku Documentation**: https://docs.waku.org/build/javascript/
- **@waku/sdk**: https://www.npmjs.com/package/@waku/sdk
- **@waku/react**: https://www.npmjs.com/package/@waku/react
- **GitHub Examples**: https://github.com/waku-org/js-waku-examples
- **Protocol Specs**: https://rfc.vac.dev/

## Security Considerations

1. **Network Status**: Always check `isReady` before sending
2. **Message Validation**: Verify sender addresses
3. **Content Sanitization**: Escape user input to prevent XSS
4. **Rate Limiting**: Consider implementing send limits
5. **Backup Strategy**: Database stores conversation history

## Troubleshooting

### "Connecting..." Forever
- Check browser console for WebSocket errors
- Verify network firewall allows WebSocket connections
- Try refreshing the page to reconnect

### Messages Not Appearing
- Ensure both users are connected (green "ONLINE" badge)
- Verify content topic matches (addresses sorted correctly)
- Check browser console for decoding errors

### Slow Message Delivery
- Light nodes require peer discovery (can take 10-30s initially)
- Network congestion may delay delivery
- Consider implementing retry logic for critical messages

## Development Notes

### Testing Locally

1. Both users must have Waku provider active
2. Messages appear in real-time when both connected
3. Database stores backup for conversation history
4. Use browser console to monitor Waku logs

### Production Considerations

- Waku uses WebSocket connections (ensure hosting supports)
- Light nodes are resource-efficient (suitable for browsers)
- Consider adding message queue for offline scenarios
- Monitor network health via status indicators

---

**Built with privacy and decentralization at its core. Powered by Waku Protocol.**
