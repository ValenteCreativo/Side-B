<div align="center">

  <img src="https://red-causal-armadillo-397.mypinata.cloud/ipfs/bafybeifioittq7aoty5mduzvki3wwhqzrtgwvyhinzqkhb25zd4rqzpa5y" alt="Side B Sessions" width="44" />

  <h1>Side B Sessions</h1>
  <p><i>Licensing the music that algorithms ignore.</i></p>

  <p>
    <a href="https://story.foundation">
      <img src="https://img.shields.io/badge/Story_Protocol-IP_Layer-8B5CF6?style=flat-square&logo=ethereum&logoColor=white" alt="Story Protocol" />
    </a>
    <a href="https://docs.cdp.coinbase.com/">
      <img src="https://img.shields.io/badge/Coinbase_CDP-Embedded_Wallets-0052FF?style=flat-square&logo=coinbase&logoColor=white" alt="Coinbase CDP" />
    </a>
    <a href="https://base.org">
      <img src="https://img.shields.io/badge/Base-L2_Network-0052FF?style=flat-square&logo=base&logoColor=white" alt="Base L2" />
    </a>
    <a href="https://waku.org">
      <img src="https://img.shields.io/badge/Waku-Encrypted_P2P-000000?style=flat-square" alt="Waku" />
    </a>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
    </a>
  </p>

  <p align="center">🎧 ─── 📀 ─── 🎧</p>

</div>

> [!NOTE]
> Most musicians will never see real income from Spotify or YouTube unless they become content creators and build a personal brand.  
> **Side B Sessions** exists for the other path: honor the hours of practice, turn voice notes and sessions into IP, and make them licensable in one place.

---

## 🎧 What is Side B Sessions?

Side B Sessions is a Web3-native platform where independent musicians can upload **voice notes, jams, rehearsals, and finished tracks**, register them as **on-chain IP on Story Protocol**, and offer **non-exclusive licenses** to filmmakers, game devs, and content creators.

Creators can **browse, preview, license, and download** tracks. Musicians keep ownership, track usage, and see how their catalog performs over time—without ever touching MetaMask or building an influencer persona.

---

## 💿 Core Features

| 🎛️ Feature                         | Description                                                                                   |
|------------------------------------|-----------------------------------------------------------------------------------------------|
| 🎵 IP-backed music catalog         | Audio uploads are registered as IP assets on **Story Protocol**, tied to the artist’s wallet. |
| 📨 Email → wallet onboarding       | **Coinbase CDP Embedded Wallets** create an EOA from an email/OTP flow—no seed phrases.      |
| 📤 Audio upload pipeline           | Upload via **Vercel Blob**, validated with **Zod**, and referenced via **IPFS/Pinata**.      |
| 💸 Licensing & payments on Base    | Non-exclusive licenses paid in **USDC/ETH on Base L2**, with verified on-chain transfers.     |
| 🧮 Revenue & performance insights  | Dashboard showing sessions, licenses sold, and revenue over time.                            |
| 💬 Encrypted collab messaging      | **Waku** P2P encrypted messaging between musicians and creators for follow-up and custom work.|
| 💳 Fiat bridge                     | **Halliday** on-ramp lets users move from card/fiat to on-chain payments where needed.       |

---

## 🏗️ Architecture Overview

```mermaid
flowchart LR
    subgraph Musician
      A[Email/OTP Login<br/>Coinbase CDP] --> B[Auto Wallet (EOA)]
      B --> C[Upload Audio<br/>Vercel Blob]
      C --> D[Metadata + Pricing<br/>PostgreSQL/Prisma]
      D --> E[Pin Metadata<br/>IPFS / Pinata]
      E --> F[Register IP Asset<br/>Story Protocol SDK]
    end

    subgraph Catalog & Licensing
      F --> G[Public Catalog<br/>IP-verified tracks]
      G --> H[License Request<br/>Creator UI]
      H --> I[USDC/ETH Payment<br/>Base L2]
      I --> J[Payment Splitter<br/>SideBPaymentSplitter]
      J --> K[Artist & Platform<br/>Payouts]
    end

    subgraph Collaboration
      G -. Session Access .-> L[Waku P2P Messaging]
      K -. Follow-up work .-> L
      L --> M[Encrypted chat<br/>No central server]
    end

    
---

🧩 Tech Stack
Frontend & UX
Next.js 14 (App Router) · React 18 · TypeScript · TailwindCSS · shadcn/ui · Framer Motion

Web3 & IP
Story Protocol TypeScript SDK · Coinbase CDP Embedded Wallets · Base L2 · viem · Solidity (Foundry) · SideBPaymentSplitter

Data & Storage
Prisma + PostgreSQL · Vercel Blob (audio) · IPFS/Pinata (metadata) · Zod (runtime validation)

Messaging & Infra
Waku SDK (light node + protobuf) · Next.js Route Handlers · optional rate limiting · Halliday fiat on-ramp

---

<details> <summary><b>🛠 More for devs</b> — Story + CDP in one flow</summary>
[!IMPORTANT]
Side B Sessions is built as a full IP licensing flow: from raw audio to Story IP asset, to verified Base L2 payment, to Waku-backed collaboration.


// lib/storyClient.ts
import { StoryClient } from '@story-protocol/core-sdk'
import { http } from 'viem'

export const storyClient = StoryClient.newClient({
  transport: http(process.env.STORY_RPC_URL!),
  chainId: 'aeneid',
  account: process.env.STORY_PRIVATE_KEY as `0x${string}`
})

// Register a track as IP asset
export async function registerTrackAsIP(params: {
  nftContract: `0x${string}`
  tokenId: string
  metadataURI: string
  metadataHash: `0x${string}`
}) {
  return storyClient.ipAsset.register({
    nftContract: params.nftContract,
    tokenId: params.tokenId,
    metadata: {
      metadataURI: params.metadataURI,
      metadataHash: params.metadataHash
    }
  })
}


// components/auth/CdpEmailLogin.tsx
import { useCdpAuth } from '@coinbase/cdp-react'

export function CdpEmailLogin() {
  const { loginWithEmail } = useCdpAuth()

  return (
    <button
      onClick={() => loginWithEmail({ emailRedirectTo: window.location.href })}
      className="rounded-full px-4 py-2 text-sm border"
    >
      Sign in with email
    </button>
  )
}
Docs: Story Protocol1 · Coinbase CDP2 · Base3 · Waku4

---

</details>
🏆 Buildathon
Built for the Surreal World Assets Buildathon 2025 on Story Protocol.

---

<p align="center"> From México with ❤️‍🔥 </p>

---

Footnotes
Story Protocol docs — https://docs.story.foundation ↩

Coinbase Developer Platform docs — https://docs.cdp.coinbase.com/ ↩

Base network docs — https://docs.base.org/ ↩

Waku protocol docs — https://docs.waku.org/ ↩