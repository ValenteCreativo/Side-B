<p align="center">
  <img src="public/catalog-art.png" alt="Side B Sessions" width="120" />
</p>

<h1 align="center">Side B Sessions</h1>
<p align="center"><em>Independent music IP registry and licensing marketplace</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/Story_Protocol-v1.0-8B5CF6?style=flat-square&logo=ethereum" alt="Story Protocol" />
  <img src="https://img.shields.io/badge/Coinbase_CDP-Email%2FOTP-0052FF?style=flat-square&logo=coinbase" alt="CDP" />
  <img src="https://img.shields.io/badge/Base_L2-Mainnet-0052FF?style=flat-square&logo=ethereum" alt="Base" />
  <img src="https://img.shields.io/badge/Waku-P2P-000000?style=flat-square" alt="Waku" />
  <img src="https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/IPFS-Storage-65C2CB?style=flat-square&logo=ipfs" alt="IPFS" />
</p>

<p align="center">🎧 ─── 📀 ─── 🎧</p>

---

## What It Does

Musicians upload sessions → automatic IP registration on Story Protocol → listed in catalog → creators license tracks with USDC/ETH on Base → payments split on-chain → both parties receive ownership verification and encrypted messaging access. Zero crypto knowledge required.

---

## Features

<table>
<tr><td>

🛡️ **Verified IP Rights** — Every upload mints an NFT and registers as IP asset via Story Protocol SPG

</td></tr>
<tr><td>

🎵 **Audio Upload Pipeline** — Blob storage + IPFS pinning with format validation and metadata extraction

</td></tr>
<tr><td>

💰 **On-Chain Licensing** — USDC/ETH payments on Base L2 with automated royalty splits via smart contracts

</td></tr>
<tr><td>

🔗 **Blockchain Verification** — Immutable ownership records with Story Protocol + Base transaction proofs

</td></tr>
<tr><td>

🔒 **Encrypted Messaging** — Waku-powered P2P communication between musicians and creators

</td></tr>
<tr><td>

📊 **Analytics Dashboard** — Real-time licensing metrics, revenue tracking, and audience insights

</td></tr>
<tr><td>

🤝 **Two-Sided Marketplace** — Musicians monetize sessions, creators license authentic sound with verified rights

</td></tr>
</table>

---

## Architecture

```mermaid
graph TB
    A[Audio Upload] -->|Vercel Blob| B[IPFS Pinning]
    B --> C[Story Protocol SPG]
    C -->|Mint + Register| D[IP Asset NFT]
    D --> E[Catalog Listing]
    E -->|Browse| F[License Purchase]
    F -->|USDC/ETH Base L2| G[Payment Splitter Contract]
    G -->|Royalty Split| H[Musician Wallet]
    G -->|Platform Fee| I[Protocol Treasury]
    D -.->|Verification| J[Analytics Dashboard]
    F -.->|Access| K[Waku Encrypted Chat]

    style C fill:#8B5CF6
    style D fill:#0052FF
    style G fill:#F59E0B
    style K fill:#000000,color:#FFFFFF
```

---

## Tech Stack

**Frontend & UX**
Next.js 14.2 App Router • React 18 Server Components • TypeScript • Tailwind CSS • shadcn/ui • Framer Motion • Refined Brutalism design system

**Web3 & IP Infrastructure**
Story Protocol SDK[^1] • Coinbase CDP[^2] wallet-as-a-service • Base Network[^3] L2 for settlements • Viem 2.21 Ethereum interactions • Foundry smart contract framework

**Data & Storage**
PostgreSQL with Prisma ORM • Vercel Blob for audio files • Pinata IPFS for decentralized permanence • Zod runtime validation

**Messaging & Infrastructure**
Waku Protocol for encrypted P2P messaging • Halliday fiat on-ramp integration • Story Protocol SPG NFT collections

---

<details>
<summary><strong>Advanced Developer Reference</strong></summary>

> [!IMPORTANT]
> Production deployment uses Coinbase CDP for seamless email/OTP authentication, eliminating seed phrase management while maintaining non-custodial wallet control. All IP registrations are verifiable on Story Protocol's Aeneid testnet.

**Story Protocol IP Asset Registration**

```typescript
import { StoryClient } from '@story-protocol/core-sdk'

const registerIPAsset = async (nftContract: string, tokenId: string) => {
  const ipAsset = await client.ipAsset.register({
    nftContract,
    tokenId,
    metadata: {
      name: session.title,
      description: session.description,
      attributes: [{ key: 'contentType', value: session.contentType }]
    }
  })
  return ipAsset.ipId // Returns permanent IP identifier
}
```

**Installation & Setup**
See [docs/INSTALLATION.md](docs/INSTALLATION.md) for complete development environment configuration including `.env.example`, database schema, and local blockchain setup.

**Reference Documentation**
[Story Protocol Docs](https://docs.story.foundation) • [Coinbase CDP Quickstart](https://docs.cdp.coinbase.com) • [Base Network Guide](https://docs.base.org)

</details>

---

<p align="center">
  <strong>Built for <a href="https://dorahacks.io/buidl/19768">Surreal World Assets Buildathon 2025</a></strong>
</p>

<p align="center">
  From México with ❤️‍🔥
</p>

---

[^1]: Story Protocol provides programmable IP infrastructure for registering creative works as on-chain assets with commercial rights management.
[^2]: Coinbase Developer Platform offers embedded wallet solutions with email/social authentication and gasless transactions.
[^3]: Base is Coinbase's Ethereum L2 optimized for low-cost transactions and seamless fiat-to-crypto on-ramps.
