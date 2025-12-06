<div align="center">

<img src="https://red-causal-armadillo-397.mypinata.cloud/ipfs/bafybeifioittq7aoty5mduzvki3wwhqzrtgwvyhinzqkhb25zd4rqzpa5y" alt="Side B Sessions" width="60" />

# 🎵 SIDE B SESSIONS
### *The B-side of music IP — raw, authentic, unstoppable*

[![Story Protocol](https://img.shields.io/badge/Story_Protocol-v1.0_RC-8B5CF6?style=for-the-badge&logo=ethereum&logoColor=white)](https://story.foundation)
[![Coinbase CDP](https://img.shields.io/badge/Coinbase_CDP-Email/OTP-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)](https://coinbase.com/cloud)
[![Base L2](https://img.shields.io/badge/Base_L2-Mainnet-0052FF?style=for-the-badge&logo=ethereum&logoColor=white)](https://base.org)
[![Waku P2P](https://img.shields.io/badge/Waku-P2P_Encrypted-000000?style=for-the-badge)](https://waku.org)

**[Live Demo](https://side-b.vercel.app)** • **[docs/INSTALLATION.md](docs/INSTALLATION.md)**

</div>

---

## 🎧 The Essence

**Problem:** Musicians don’t meaningfully profit from streaming unless they turn into content creators / influencers.  
**Core idea:** Side B Sessions turns voice notes, jams, and under-monetized tracks into IP that can be licensed and downloaded by creators.

> [!NOTE]
> We honor practice hours and songwriting, not follower counts—IP rights and payouts flow from the music itself.

---

## 💿 Feature Grid

| Feature | What it does |
| --- | --- |
| 🎵 Story Protocol IP-backed catalog | Every upload becomes a registered IP asset with provenance preserved. |
| ✉️ Email → wallet (Coinbase CDP) | Email/OTP login issues a non-custodial wallet without seed phrases. |
| 📤 Audio upload + validation | Vercel Blob intake, format checks, then pinned to IPFS via Pinata. |
| 💸 Licensing & payments on Base | USDC/ETH licensing on Base with terms tied to each IP asset. |
| 🤝 Payment splitting / verification | Splitter verifies transfers before finalizing license delivery. |
| 🔒 Waku encrypted messaging | E2E P2P chat so musicians and creators can finalize collabs privately. |
| 📊 Analytics for musicians | Dashboard tracks licenses, payouts, and who is using each track. |

---

## 🏗️ Architecture Overview

```mermaid
flowchart LR
  subgraph Musician
    A[Email/OTP login] --> B[Wallet created (CDP)]
    B --> C[Audio upload]
    C --> D[Metadata + pricing]
    D --> E[IPFS + Story IP asset]
  end

  subgraph Creator
    F[Browse catalog] --> G[License purchase on Base]
    G --> H[Payment splitter]
    H --> I[Artist payout] & J[Platform share]
  end

  subgraph Messaging
    K[Waku encrypted chat]
  end

  E --> F
  H -. verification .-> E
  I -. follow-up .-> K
  G -. collaboration .-> K
```

---

## 🔧 Tech Stack

- **Frontend & UX** — Next.js 14 App Router, React 18, TypeScript, Tailwind + shadcn/ui for fast UI shipping.
- **Web3 & IP** — Story Protocol SDK for IP assets, Coinbase CDP for email wallets, Base L2 for licensing payments.
- **Data & Storage** — Prisma + PostgreSQL for catalog data, Vercel Blob for uploads, Pinata IPFS for permanence.
- **Messaging & Infra** — Waku P2P encrypted messaging, Viem clients for on-chain reads, Foundry/OpenZeppelin for splits.

---

<details>
<summary>🛠 For devs: Installation process</summary>

> [!IMPORTANT]
> Full IP lifecycle in one stack: upload → IP registration → licensing → payment verification → encrypted messaging.

1. `npm install` then `cp .env.example .env` — keys and env hints live in `docs/INSTALLATION.md`.
2. `npx prisma generate && npx prisma db push` — prepare the catalog database.
3. `npm run dev` — launches email/OTP auth, upload, licensing, and Waku chat locally.

```typescript
import { StoryClient } from '@story-protocol/core-sdk'
import { http } from 'viem'

const story = StoryClient.newClient({ transport: http(process.env.STORY_RPC_URL!) })

export async function registerTrack(ipfsHash: string, price: bigint) {
  return story.ipAsset.register({
    nftContract: process.env.SPG_CONTRACT!,
    tokenId: '1',
    metadata: { metadataURI: ipfsHash, licensingFee: price }
  })
}
```

Refs: Story[^story], CDP[^cdp], Base[^base], Waku[^waku].

</details>

---

## 📖 Documentation Vault

> Comprehensive integration guides, architecture diagrams, and API references.

```
docs/
├── 📘 INSTALLATION.md          Complete setup guide with .env.example
├── 🏗️  ARCHITECTURE.md          System design and data flow diagrams
├── 🔐 COINBASE_INTEGRATION.md  CDP wallet setup and authentication
├── 🎯 STORY_PROTOCOL.md         IP registration workflows and contracts
├── 💬 WAKU_MESSAGING.md         P2P messaging implementation details
├── 💳 PAYMENT_FLOWS.md          ERC-20 verification and Halliday integration
├── 📦 SMART_CONTRACTS.md        Foundry setup and OpenZeppelin usage
└── 🚀 DEPLOYMENT.md             Production deployment checklist
```

**Quick start:** `docs/INSTALLATION.md` — full environment setup in under 5 minutes.

---

## 📂 Key Integrations — The Code

<details>
<summary><b>🎯 Story Protocol IP Registration</b> — <code>lib/story.ts</code></summary>

```typescript
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { createPublicClient, createWalletClient, http } from 'viem'
import { aeneid } from '@story-protocol/core-sdk/chains'

export const storyClient = StoryClient.newClient({
  transport: http(process.env.STORY_RPC_URL),
  chainId: 'aeneid',
  account: privateKeyToAccount(process.env.STORY_PRIVATE_KEY as `0x${string}`)
})

export async function registerIPAsset(nftContract: string, tokenId: string, metadata: object) {
  const response = await storyClient.ipAsset.register({
    nftContract,
    tokenId,
    metadata: {
      metadataURI: ipfsHash,
      metadataHash: keccak256(ipfsHash),
      nftMetadataHash: keccak256(nftMetadata)
    }
  })

  return response.ipId
}
```

**Used in:** `app/api/sessions/route.ts`

</details>

<details>
<summary><b>🔐 Coinbase CDP Email Authentication</b> — <code>components/providers/CoinbaseProvider.tsx</code></summary>

```typescript
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'

const sdk = new CoinbaseWalletSDK({
  appName: 'Side B Sessions',
  enableCDP: true,
  cdpConfig: {
    apiKeyName: process.env.COINBASE_API_KEY_NAME!,
    apiKeySecret: process.env.COINBASE_API_KEY_SECRET!
  }
})

const provider = sdk.makeWeb3Provider()
await provider.request({ method: 'eth_requestAccounts', params: { loginType: 'email' } })
```

**Used in:** `components/auth/CoinbaseAuth.tsx`

</details>

<details>
<summary><b>💬 Waku P2P Encrypted Messaging</b> — <code>components/waku/WakuProvider.tsx</code></summary>

```typescript
import { createLightNode, waitForRemotePeer } from '@waku/sdk'
import { Protocols } from '@waku/interfaces'

const node = await createLightNode({
  defaultBootstrap: true,
  shardInfo: { contentTopics: ['/sideb/1/messages/proto'] }
})

await node.start()
await waitForRemotePeer(node, [Protocols.LightPush, Protocols.Filter])

await node.lightPush.send(encoder, { payload: encryptedMessage, timestamp: new Date() })
```

**Used in:** `hooks/useWakuMessaging.ts`

</details>

<details>
<summary><b>💰 ERC-20 Payment Verification</b> — <code>lib/payment-verification.ts</code></summary>

```typescript
import { createPublicClient, http, parseAbi } from 'viem'
import { base } from 'viem/chains'

const USDC_CONTRACT = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

export async function verifyPayment(txHash: string, expectedAmount: bigint, recipientAddress: string) {
  const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL) })
  const receipt = await client.getTransactionReceipt({ hash: txHash })
  const transferEvent = receipt.logs.find(log => log.topics[0] === keccak256('Transfer(address,address,uint256)'))

  return transferEvent &&
    transferEvent.topics[2] === recipientAddress &&
    BigInt(transferEvent.data) >= expectedAmount
}
```

**Used in:** `app/api/payments/confirm/route.ts`

</details>

<details>
<summary><b>📌 IPFS Metadata Pinning</b> — <code>lib/pinata.ts</code></summary>

```typescript
import { PinataSDK } from 'pinata-web3'

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: 'red-causal-armadillo-397.mypinata.cloud'
})

export async function pinMetadata(metadata: object) {
  const result = await pinata.upload.json(metadata)
  return {
    ipfsHash: result.IpfsHash,
    url: `https://red-causal-armadillo-397.mypinata.cloud/ipfs/${result.IpfsHash}`
  }
}
```

**Used in:** `app/api/sessions/route.ts`

</details>

---

## 🎯 What Makes This Different

**Beyond the hackathon:** we integrated the full Web3 stack, not just Story Protocol.

| Integration | Purpose | Why it matters |
| --- | --- | --- |
| Story Protocol[^story] | IP registry | Core blockchain IP infrastructure |
| Coinbase CDP[^cdp] | Email wallets | Makes crypto invisible to users |
| Waku Protocol[^waku] | Encrypted messaging | True decentralization + privacy |
| Halliday [^halliday] | Fiat on-ramp | Credit card → crypto seamlessly |
| Base L2[^base] | Payment chain | Low fees aligned with Story Protocol |
| IPFS/Pinata[^pinata] | Metadata storage | Permanent, decentralized storage |
| OpenZeppelin + Foundry | Smart contracts | Battle-tested ERC-20 libraries |

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/ValenteCreativo/Side-B.git
cd Side-B && npm install

# Environment (see docs/INSTALLATION.md for keys)
cp .env.example .env

# Database
npx prisma generate && npx prisma db push

# Run
npm run dev
```

Visit `http://localhost:3000` to test email/OTP, uploads, licensing, and messaging.

---

## 🏆 Built for Surreal World Assets

**[Surreal World Assets Buildathon 2025](https://www.encodeclub.com/programmes/surreal-world-assets-buildathon-2)** — proving Web3 IP rights can be as simple as email login.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MUSIC IS NOT CONTENT. IT'S ART. IT DESERVES BLOCKCHAIN RIGHTS.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**From México with** <img src="https://em-content.zobj.net/source/apple/391/fire_1f525.png" width="20" height="20" alt="" />

---

[^story]: Story Protocol — programmable IP infrastructure for on-chain assets and licensing. [docs.story.foundation](https://docs.story.foundation)
[^cdp]: Coinbase Developer Platform — embedded wallets with email/OTP auth. [docs.cdp.coinbase.com](https://docs.cdp.coinbase.com)
[^base]: Base — low-fee L2 for licensing payments and settlement. [docs.base.org](https://docs.base.org)
[^waku]: Waku — decentralized P2P messaging with end-to-end encryption. [docs.waku.org](https://docs.waku.org)
[^Halliday]: Halliday - Fiat to Crypto provider using Stripe. [Halliday.xyz](https://halliday.xyz/)
[^pinata]: Pinata - IPFS file storage. [Pinata.cloud](https://pinata.cloud/)