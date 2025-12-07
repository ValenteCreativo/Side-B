<div align="center">

<img src="https://red-causal-armadillo-397.mypinata.cloud/ipfs/bafybeifioittq7aoty5mduzvki3wwhqzrtgwvyhinzqkhb25zd4rqzpa5y" alt="Side B Sessions" width="80" />

# 🎵 SIDE B SESSIONS

### *On-chain IP for independent music*

**Built for musicians who won't play the influencer game — and creators who need real music.**

</div>

---

## 🎧 The Essence

<div align="center">

> **The Problem**
> Musicians don't meaningfully profit from streaming unless they become content creators or influencers.
> The algorithm rewards personal brand over artistry. Practice hours and songwriting don't pay bills.

</div>

**Our Solution:** Side B Sessions transforms voice notes, jams, and under-monetized tracks into licensable IP assets that filmmakers, content creators, and indie game studios can discover and license directly.

This is a **marketplace** where musicians and visual artists meet — not just a licensing platform. It's also a **collaboration space** where sonic creatives who excel musically but struggle with video can connect with visual artists who understand their sound and co-create together.

**IP rights are the foundation:** We use [Story Protocol](https://story.foundation) to guarantee that rights, provenance, and payouts are handled correctly — on-chain, transparent, and automatic. Every upload becomes a registered IP asset. Every license is traceable. Every payment settles fairly.

<div align="center">

> *We honor practice hours and songwriting, not follower counts — IP rights flow from the music itself.*

</div>

---

## 🎬 How It Works

<details open>
<summary><b>User Flow — From Upload to Payout</b></summary>

<br/>

**For Musicians:**
1. **Sign in** with email/OTP → get a non-custodial wallet automatically (Coinbase CDP)
2. **Upload** your track or jam → audio stored on Vercel Blob, validated, pinned to IPFS via Pinata
3. **Register** as IP asset → Story Protocol creates on-chain provenance for your work
4. **Set pricing** → define licensing terms and prices in USDC/ETH
5. **Track analytics** → see who licenses your music, how much you earn, usage stats

**For Creators:**
1. **Browse** the catalog → discover IP-verified tracks ready for licensing
2. **Preview & License** → stream previews, purchase licenses with USDC/ETH on Base L2
3. **Fiat on-ramp** → use credit card via Halliday if you don't have crypto
4. **Payment verified** → smart contract confirms transfer before unlocking downloads
5. **Download & Use** → commercial-grade licenses for film, content, games, etc.

**For Collaboration:**
- **Encrypted messaging** via Waku → coordinate custom work, negotiate extras, plan visual collaborations privately
- **Direct connections** → musicians find visual artists, filmmakers discover sound designers

</details>

---

## 🏗️ Architecture Overview

<details>
<summary><b>System Diagram — Full Stack Flow</b></summary>

<br/>

```mermaid
flowchart TB
    %% Musician Flow
    subgraph MUSICIAN["🎤 Musician Journey"]
        A[Email/OTP Login<br/>Coinbase CDP]
        B[Wallet Created<br/>Base L2 EOA]
        C[Upload Audio<br/>Vercel Blob]
        D[Metadata & Pricing<br/>PostgreSQL/Prisma]
        E[Pin to IPFS<br/>Pinata Gateway]
        F[Register IP Asset<br/>Story Protocol]
        G[Dashboard<br/>Licenses · Revenue · Analytics]
    end

    %% Creator Flow
    subgraph CREATOR["🎬 Creator Journey"]
        H[Browse Catalog<br/>IP-verified Tracks]
        I[License Purchase<br/>USDC/ETH on Base]
        J[Payment Splitter<br/>Smart Contract]
        K[Musician Payout<br/>Automated Split]
        L[Platform Fee<br/>Revenue Share]
    end

    %% Messaging
    subgraph MESSAGING["💬 Collaboration"]
        M[Encrypted Chat<br/>Waku P2P Messaging]
    end

    %% Fiat Bridge
    subgraph FIAT["💳 Fiat Gateway"]
        N[Halliday On-Ramp<br/>Card → USDC/ETH]
    end

    %% Connections
    A --> B --> C --> D --> E --> F --> G
    F --> H
    H --> I --> J
    J --> K
    J --> L

    %% Messaging flows
    K -. "custom work" .-> M
    H -. "collaboration" .-> M

    %% Fiat funding
    N -. "fund wallet" .-> I
```

</details>

---

## 🔧 Tech Stack

<div align="center">

> **One stack. Full IP lifecycle. Web3 UX that feels like Web2.**

</div>

### Web3 & IP Infrastructure

[![Story Protocol](https://img.shields.io/badge/Story_Protocol-IP_Registry-8B5CF6?style=for-the-badge&logo=ethereum&logoColor=white)](https://story.foundation)
[![Base L2](https://img.shields.io/badge/Base_L2-Payment_Chain-0052FF?style=for-the-badge&logo=base&logoColor=white)](https://base.org)
[![Coinbase CDP](https://img.shields.io/badge/Coinbase_CDP-Email_Wallets-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)](https://coinbase.com/cloud)
[![Halliday](https://img.shields.io/badge/Halliday-Fiat_Gateway-00C853?style=for-the-badge)](https://halliday.xyz/)
[![Waku](https://img.shields.io/badge/Waku-P2P_Messaging-000000?style=for-the-badge)](https://waku.org)

- **Story Protocol SDK** — IP asset registration, licensing workflows, on-chain provenance
- **Base L2** — USDC/ETH payments, low fees, Story Protocol alignment
- **Coinbase CDP** — Email/OTP authentication, non-custodial wallets, no seed phrases
- **Halliday** — Credit card → crypto on-ramp for seamless fiat purchases
- **Waku** — Decentralized P2P messaging with end-to-end encryption

### Frontend & User Experience

[![Next.js](https://img.shields.io/badge/Next.js_14-App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_18-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

- **Next.js 14** — App Router, server components, optimized routing
- **React 18** — TypeScript-first, modern hooks, concurrent features
- **Tailwind + shadcn/ui** — Rapid UI development with accessible components
- **Particles.js** — Interactive visual effects for artist branding

### Smart Contracts & Security

[![Foundry](https://img.shields.io/badge/Foundry-Forge_·_Cast-7E3BF2?style=for-the-badge&logo=rust&logoColor=white)](https://github.com/foundry-rs/foundry)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-Contracts-00A3FF?style=for-the-badge&logo=openzeppelin&logoColor=white)](https://openzeppelin.com/contracts/)
[![Viem](https://img.shields.io/badge/Viem-Ethereum_Client-4B5563?style=for-the-badge)](https://viem.sh)

- **Foundry** — Solidity testing, deployment, contract scripting
- **OpenZeppelin** — Battle-tested ERC-20, payment splitter contracts
- **Viem** — Type-safe Ethereum interactions, transaction verification

### Storage, Database & Infrastructure

[![Pinata](https://img.shields.io/badge/Pinata-IPFS_Storage-13B5EC?style=for-the-badge)](https://pinata.cloud/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-24B47E?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

- **Pinata IPFS** — Permanent metadata and asset storage
- **Neon PostgreSQL** — Serverless database for catalog and analytics
- **Vercel Blob** — Audio upload intake and validation
- **Prisma** — Type-safe database ORM

---

## 🛠 For Devs: Setup & Code

<details>
<summary><b>Quick Start — Installation</b></summary>

<br/>

### Prerequisites
- Node.js 18+
- PostgreSQL (or use Neon serverless)
- API keys for: Coinbase CDP, Story Protocol, Pinata, Halliday

### Setup Steps

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Configure your .env with API keys
# See docs/INSTALLATION.md for detailed key setup

# 4. Initialize database
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev
```

### Environment Variables

Key integrations require these environment variables:

```bash
# Story Protocol
STORY_RPC_URL=
STORY_PRIVATE_KEY=
SPG_CONTRACT=

# Coinbase CDP
COINBASE_API_KEY_NAME=
COINBASE_API_KEY_SECRET=

# Base L2
BASE_RPC_URL=
BASE_PRIVATE_KEY=

# IPFS / Pinata
PINATA_JWT=
PINATA_GATEWAY=

# Halliday
HALLIDAY_API_KEY=

# Database
DATABASE_URL=

# Waku
WAKU_CONTENT_TOPIC=
```

Full setup guide: [`docs/INSTALLATION.md`](docs/INSTALLATION.md)

</details>

<details>
<summary><b>Documentation Vault</b></summary>

<br/>

> Comprehensive guides for every integration

```
docs/
├── 📘 INSTALLATION.md          Complete setup guide + .env.example
├── 🏗️  ARCHITECTURE.md          System design and data flow diagrams
├── 🔐 COINBASE_INTEGRATION.md  CDP wallet setup and authentication
├── 🎯 STORY_PROTOCOL.md         IP registration workflows
├── 💬 WAKU_MESSAGING.md         P2P messaging implementation
├── 💳 PAYMENT_FLOWS.md          ERC-20 verification + Halliday
├── 📦 SMART_CONTRACTS.md        Foundry setup + OpenZeppelin
└── 🚀 DEPLOYMENT.md             Production deployment checklist
```

**Start here:** [`docs/INSTALLATION.md`](docs/INSTALLATION.md) — full environment setup in under 5 minutes

</details>

<details>
<summary><b>Quick Code Example — Story Protocol IP Registration</b></summary>

<br/>

```typescript
import { StoryClient } from '@story-protocol/core-sdk'
import { http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// Initialize Story Protocol client
export const storyClient = StoryClient.newClient({
  transport: http(process.env.STORY_RPC_URL),
  chainId: 'aeneid',
  account: privateKeyToAccount(process.env.STORY_PRIVATE_KEY as `0x${string}`)
})

// Register track as IP asset
export async function registerIPAsset(
  ipfsHash: string,
  nftContract: string,
  tokenId: string
) {
  const response = await storyClient.ipAsset.register({
    nftContract,
    tokenId,
    metadata: {
      metadataURI: ipfsHash,
      metadataHash: keccak256(ipfsHash)
    }
  })

  return response.ipId // On-chain IP identifier
}
```

See full implementation: [`lib/story.ts`](lib/story.ts)

</details>

---

## 📂 Code Map — Key Integrations

<div align="center">

> **Every integration, one file. Clean separation of concerns.**

</div>

| Integration | Purpose | File Location |
|------------|---------|---------------|
| 🎯 **Story Protocol** | IP asset registration and licensing | [`lib/story.ts`](lib/story.ts) |
| 🔐 **Coinbase CDP** | Email/OTP authentication and wallet creation | [`components/providers/CoinbaseProvider.tsx`](components/providers/CoinbaseProvider.tsx) |
| 💬 **Waku Messaging** | P2P encrypted chat setup and message handling | [`components/waku/WakuProvider.tsx`](components/waku/WakuProvider.tsx) |
| 💰 **Payment Verification** | ERC-20 transfer validation before license unlock | [`lib/payment-verification.ts`](lib/payment-verification.ts) |
| 📌 **Pinata IPFS** | Metadata pinning and gateway access | [`lib/pinata.ts`](lib/pinata.ts) |
| 💳 **Halliday** | Fiat on-ramp integration for credit card purchases | [`lib/halliday.ts`](lib/halliday.ts) |
| 🎵 **Audio Upload** | Vercel Blob intake and validation pipeline | [`app/api/sessions/route.ts`](app/api/sessions/route.ts) |

<details>
<summary><b>View Code Snippets</b></summary>

<br/>

### Story Protocol — IP Registration
```typescript
// lib/story.ts
export async function registerTrack(ipfsHash: string, price: bigint) {
  return storyClient.ipAsset.register({
    nftContract: process.env.SPG_CONTRACT!,
    tokenId: generateTokenId(),
    metadata: {
      metadataURI: ipfsHash,
      licensingFee: price
    }
  })
}
```

### Coinbase CDP — Email Authentication
```typescript
// components/providers/CoinbaseProvider.tsx
const sdk = new CoinbaseWalletSDK({
  appName: 'Side B Sessions',
  enableCDP: true,
  cdpConfig: {
    apiKeyName: process.env.COINBASE_API_KEY_NAME!,
    apiKeySecret: process.env.COINBASE_API_KEY_SECRET!
  }
})

const provider = sdk.makeWeb3Provider()
await provider.request({
  method: 'eth_requestAccounts',
  params: { loginType: 'email' }
})
```

### Waku — Encrypted Messaging
```typescript
// components/waku/WakuProvider.tsx
const node = await createLightNode({
  defaultBootstrap: true,
  shardInfo: { contentTopics: ['/sideb/1/messages/proto'] }
})

await node.start()
await waitForRemotePeer(node, [Protocols.LightPush, Protocols.Filter])
```

### Payment Verification — Smart Contract
```typescript
// lib/payment-verification.ts
export async function verifyPayment(
  txHash: string,
  expectedAmount: bigint,
  recipient: string
) {
  const receipt = await client.getTransactionReceipt({ hash: txHash })
  const transferEvent = receipt.logs.find(
    log => log.topics[0] === keccak256('Transfer(address,address,uint256)')
  )

  return transferEvent?.topics[2] === recipient &&
         BigInt(transferEvent.data) >= expectedAmount
}
```

</details>

---

## 🎯 What Makes This Different

<div align="center">

> **Not another streaming platform. Not another NFT marketplace. A new music economy.**

</div>

- **🎵 Licensing over Streaming** — Musicians earn real money from usage rights, not fractions of a cent per play
- **🤝 Direct Marketplace** — Musicians and creators transact directly. No labels, no distributors, no middlemen taking cuts
- **🎨 Collaboration Built-In** — Musicians who can't do video meet filmmakers who need authentic sound. Private messaging enables real partnerships
- **✉️ Email = Web3 Wallet** — Your email is your wallet. No seed phrases to lose, no scary crypto UX
- **💳 Credit Cards Work** — Creators can pay with Visa/Mastercard via Halliday. Crypto is invisible infrastructure
- **🛡️ IP Rights First** — Every track is a Story Protocol IP asset. Rights are immutable, traceable, and enforceable
- **📊 Full Transparency** — Artists see every license sold, every dollar earned, every usage of their work
- **🔒 Private by Default** — Waku encrypted messaging means collaborations stay between you and your partner

**The vision:** A place where musicians who won't play the influencer game can monetize their art, and creators find authentic sounds instead of stock music library #47.

---

## 🗺️ Roadmap

<details>
<summary><b>Post-Hackathon Plans</b></summary>

<br/>

## 🛣️ Roadmap — Side B (Post Hackathon - 2026)

### **Q1 — Validate**
- Onboard early creators and filmmakers
- Analyze product usage, licensing flow, conversion funnels
- Stress test database, uploads, streaming, and payments
- Rapid iterations to fix friction and prove core value

### **Q2 — Scale**
- Infrastructure hardening for larger catalogs + higher traffic
- Improve discovery flow for fast matches (genres, moods, tags)
- Onboarding playbooks for small agencies and indie studios
- Priority: **More tracks, more buyers, more transactions**

### **Q3 — Grow**
- Marketing + partnerships with film schools & indie communities
- Curator playlists driving discovery and licensing momentum
- Creator revenue dashboards and simple catalog tools
- Target: sustainable marketplace liquidity

### **Q4 — Expand**
- Collaboration tools (royalty splits, showcases)
- Extended licensing options and negotiation flow
- Strategic expansions into new regions and integrations
- Prepare for mobile + ecosystem services in 2026

</details>

---

<div align="center">

🏆 Built at the <a href="https://www.encodeclub.com/programmes/surreal-world-assets-buildathon-2">
Surreal World Assets Buildathon 2025</a> — empowering musicians to earn from their craft and helping visual storytellers discover authentic sounds.

Born at a Buildathon — continuing for the artists who won't play the "personal brand" game, and for the storytellers who need music with soul.

**Built for musicians and artists — by one of them.**  
From México with ❤️‍🔥

</div>

---

[^story]: **Story Protocol** — Programmable IP infrastructure for on-chain assets and licensing. [docs.story.foundation](https://docs.story.foundation)

[^cdp]: **Coinbase Developer Platform** — Embedded wallets with email/OTP authentication. [docs.cdp.coinbase.com](https://docs.cdp.coinbase.com)

[^base]: **Base** — Ethereum L2 optimized for low-fee payments and Web3 applications. [docs.base.org](https://docs.base.org)

[^waku]: **Waku** — Decentralized P2P messaging protocol with end-to-end encryption. [docs.waku.org](https://docs.waku.org)

[^halliday]: **Halliday** — Fiat-to-crypto on-ramp for seamless credit card purchases. [halliday.xyz](https://halliday.xyz/)

[^pinata]: **Pinata** — IPFS pinning service for permanent decentralized storage. [pinata.cloud](https://pinata.cloud/)
