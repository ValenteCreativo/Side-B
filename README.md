# Side B Sessions 🎵

> **A blockchain-powered music marketplace where independent musicians register their work as IP and creators license authentic sounds—no crypto knowledge required.**

Built for the **Story Buildathon** • [Live Demo](#) • [Documentation](./COINBASE_INTEGRATION.md)

---

## ✨ What Makes This Special

**For Musicians** 🎸
- Drop your email, get an Ethereum wallet instantly via Coinbase
- Upload music and automatically register it as IP on Story Protocol blockchain
- Zero gas fees, zero wallet complexity, zero blockchain friction
- Your music becomes verifiable, tradeable intellectual property

**For Creators** 🎬
- Sign in with email (no MetaMask, no seed phrases)
- Browse royalty-free music with real IP rights
- License tracks for commercial use with blockchain proof
- All rights managed transparently on Story Protocol

---

## 🚀 Live Features

### ✅ Fully Functional Right Now

#### **Seamless Email Authentication** (Coinbase Embedded Wallets)
- Email → OTP code → Ethereum wallet created automatically
- No browser extensions, no seed phrases, no crypto knowledge needed
- Professional Web2 UX with Web3 infrastructure underneath
- Role-based access (Musician vs Creator)

#### **Real Blockchain IP Registration** (Story Protocol)
- Every music upload gets registered as an IP asset on Story Protocol
- Transaction IDs and IP Asset IDs stored in database
- Built on Story Aeneid Testnet (production-ready on mainnet)
- Complete metadata tracking with IPFS integration ready

#### **Professional Studio Dashboard**
- Musicians upload sessions with metadata (mood, tags, type)
- Real-time upload progress with audio preview
- Session management with Story Protocol registration status
- Beautiful UI with shadcn components and dark mode

#### **Creator Marketplace**
- Browse music catalog with filters and search
- Audio player with waveform visualization
- License purchasing with blockchain verification
- IP transparency: see Story Protocol registration for each track

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 (App Router) with TypeScript
- TailwindCSS + shadcn/ui components
- React Hook Form + Zod validation
- Lucide React icons

**Authentication & Wallets**
- Coinbase Developer Platform (CDP) Embedded Wallets
- Email/OTP authentication flow
- Automatic EOA (Externally Owned Account) creation
- No MetaMask or browser extension required

**Blockchain & IP**
- Story Protocol TypeScript SDK v1.0.0-rc.5
- Story Aeneid Testnet integration
- Real IP asset registration with transaction tracking
- Ready for mainnet deployment

**Storage & Database**
- Prisma ORM with SQLite (development)
- Supabase PostgreSQL (production-ready)
- Pinata IPFS for decentralized metadata storage
- Local audio file handling with planned IPFS migration

**Infrastructure**
- Vercel deployment-ready
- Environment-based configuration
- Server actions with 10MB body limit
- Optimized webpack configuration for CDP SDK

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Coinbase Developer Platform account ([Get one free](https://portal.cdp.coinbase.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Side-B.git
cd Side-B

# Install dependencies
npm install

# Set up environment variables (see .env section below)
cp .env.example .env
# Edit .env with your API keys

# Initialize database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Visit **http://localhost:3000** and you're live! 🎉

---

## 🔑 Environment Configuration

### Required Environment Variables

```env
# Story Protocol - Blockchain IP Registration
STORY_PRIVATE_KEY="your-wallet-private-key-here"
STORY_RPC_URL="https://aeneid.storyrpc.io"

# Coinbase Developer Platform - Embedded Wallets
NEXT_PUBLIC_COINBASE_PROJECT_ID="your-project-id"
COINBASE_API_KEY_NAME="your-api-key-name"
COINBASE_API_KEY_SECRET="your-api-key-secret"
NEXT_PUBLIC_COINBASE_CLIENT_API_KEY="your-client-api-key"

# Pinata - IPFS Storage (Optional but recommended)
PINATA_API_KEY="your-pinata-key"
PINATA_API_SECRET="your-pinata-secret"
PINATA_JWT="your-pinata-jwt"

# Supabase - Production Database (Optional)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### Getting API Keys

**Coinbase Developer Platform**
1. Visit [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Create a new project → Select "Embedded Wallets"
3. Copy your Project ID and API keys
4. See [COINBASE_INTEGRATION.md](./COINBASE_INTEGRATION.md) for detailed setup

**Story Protocol**
1. Get testnet ETH from [Story Faucet](https://faucet.story.foundation/)
2. Export your wallet private key
3. See [Story Protocol Docs](https://docs.story.foundation/) for details

**Pinata (IPFS)**
1. Sign up at [Pinata](https://pinata.cloud/)
2. Create API keys from dashboard
3. Copy JWT token for authentication

---

## 🏗️ Architecture

### Application Structure

```
Side-B/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── users/               # User creation & retrieval
│   │   ├── sessions/            # Music upload + IP registration
│   │   └── licenses/            # License creation
│   ├── studio/                  # Musician dashboard
│   ├── catalog/                 # Creator marketplace
│   └── layout.tsx               # Root layout with providers
│
├── components/
│   ├── auth/
│   │   ├── CoinbaseAuth.tsx    # Email/OTP authentication
│   │   ├── AuthModal.tsx       # Role selection modal
│   │   ├── AuthGate.tsx        # Protected route wrapper
│   │   └── UserContext.tsx     # User session management
│   ├── providers/
│   │   └── CoinbaseProvider.tsx # CDP React provider
│   ├── studio/                  # Musician components
│   ├── catalog/                 # Creator components
│   └── ui/                      # shadcn/ui components
│
├── lib/
│   ├── story.ts                 # Story Protocol SDK integration
│   ├── pinata.ts                # IPFS upload functions
│   ├── supabase.ts              # Supabase client
│   └── types.ts                 # TypeScript definitions
│
└── prisma/
    └── schema.prisma            # Database schema
```

### Key Integration Files

- **[CoinbaseProvider.tsx](./components/providers/CoinbaseProvider.tsx)** - CDP React wrapper with email authentication
- **[story.ts](./lib/story.ts)** - Real Story Protocol IP registration
- **[pinata.ts](./lib/pinata.ts)** - IPFS metadata and file uploads
- **[schema.prisma](./prisma/schema.prisma)** - Complete database schema

---

## 🎯 How It Works

### 1. User Authentication Flow

```
User enters email
    ↓
Coinbase sends OTP code
    ↓
User verifies code
    ↓
Ethereum wallet (EOA) created automatically
    ↓
User data stored with wallet address
    ↓
Session persisted in localStorage
```

**Implementation**: [CoinbaseAuth.tsx](./components/auth/CoinbaseAuth.tsx)

### 2. Music Upload & IP Registration

```
Musician uploads audio file
    ↓
Metadata form (mood, tags, type)
    ↓
Audio file stored locally
    ↓
Metadata uploaded to IPFS (Pinata)
    ↓
Story Protocol IP registration
    ↓
Session saved with IP Asset ID + Transaction ID
    ↓
Confirmation with blockchain proof
```

**Implementation**: [studio/page.tsx](./app/studio/page.tsx) + [api/sessions/route.ts](./app/api/sessions/route.ts)

### 3. Licensing Flow

```
Creator browses catalog
    ↓
Selects track for licensing
    ↓
Reviews IP registration details
    ↓
Initiates license creation
    ↓
License recorded on blockchain
    ↓
License stored with both user IDs
    ↓
Creator receives usage rights
```

**Implementation**: [catalog/page.tsx](./app/catalog/page.tsx) + [api/licenses/route.ts](./app/api/licenses/route.ts)

---

## 💡 Key Technical Achievements

### 1. TypeScript Module Resolution Fix
**Problem**: `x402-fetch` module not found error from Coinbase CDP SDK
**Solution**: Updated `tsconfig.json` with `moduleResolution: "node16"` + webpack fallback
**Files**: [tsconfig.json](./tsconfig.json), [next.config.mjs](./next.config.mjs)

### 2. Client/Server Component Architecture
**Challenge**: CDP SDK requires client-side rendering but Next.js 14 defaults to server components
**Solution**: Strategic `'use client'` directives with provider pattern
**Files**: [CoinbaseProvider.tsx](./components/providers/CoinbaseProvider.tsx), [layout.tsx](./app/layout.tsx)

### 3. Real Blockchain Integration
**Achievement**: Actual Story Protocol transactions on Aeneid testnet
**Evidence**: Transaction IDs and IP Asset IDs stored in database
**Files**: [story.ts](./lib/story.ts)

### 4. Seamless UX
**Goal**: Web3 benefits without Web3 complexity
**Result**: Email login → wallet creation → IP registration in <60 seconds
**User Experience**: No MetaMask, no gas fee UI, no blockchain jargon

---

## 🗄️ Database Schema

### User
```prisma
model User {
  id            String   @id @default(cuid())
  walletAddress String   @unique
  role          UserRole
  createdAt     DateTime @default(now())

  sessions      Session[]
  licenses      License[]
}
```

### Session (Music Track)
```prisma
model Session {
  id              String      @id @default(cuid())
  musicianId      String
  title           String
  audioUrl        String
  mood            String?
  tags            String      // JSON array
  contentType     SessionType
  ipAssetId       String?     // Story Protocol Asset ID
  txHash          String?     // Blockchain transaction hash
  ipfsMetadataUrl String?     // IPFS metadata CID
  createdAt       DateTime    @default(now())

  musician        User        @relation(fields: [musicianId], references: [id])
  licenses        License[]
}
```

### License
```prisma
model License {
  id          String   @id @default(cuid())
  sessionId   String
  buyerId     String
  licenseType String   @default("NON_EXCLUSIVE")
  createdAt   DateTime @default(now())

  session     Session  @relation(fields: [sessionId], references: [id])
  buyer       User     @relation(fields: [buyerId], references: [id])
}
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/users                    Create or retrieve user
Body:  { walletAddress, role }
```

### Music Management
```
GET    /api/sessions                 List all sessions
POST   /api/sessions                 Upload & register IP
GET    /api/sessions/[id]            Get session details
GET    /api/sessions?musicianId=X    Get musician's sessions
```

### Licensing
```
POST   /api/licenses                 Create license
Body:  { sessionId, buyerId }
GET    /api/licenses?buyerId=X       Get user's licenses
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import to Vercel
# - Connect GitHub repository
# - Add environment variables
# - Deploy

# 3. Update database for production
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### Environment Variables Checklist
- ✅ Story Protocol keys
- ✅ Coinbase CDP credentials (all 4 keys)
- ✅ Pinata IPFS keys
- ✅ Supabase connection string
- ✅ Next.js public URL

---

## 🎓 Documentation

- **[COINBASE_INTEGRATION.md](./COINBASE_INTEGRATION.md)** - Complete Coinbase setup guide
- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup for testing
- **[INSTRUCTIONS.md](./INSTRUCTIONS.md)** - Detailed setup instructions

---

## 🔮 Roadmap

### Phase 1: Core Features (✅ COMPLETE)
- [x] Email authentication with Coinbase
- [x] Story Protocol IP registration
- [x] Music upload and catalog
- [x] License creation
- [x] IPFS metadata storage

### Phase 2: Enhanced Features (In Progress)
- [ ] Audio file upload to IPFS (currently local)
- [ ] Royalty payment integration
- [ ] Advanced search and filtering
- [ ] Collection management UI
- [ ] Earnings dashboard for musicians

### Phase 3: Scaling
- [ ] Payment processing (crypto + fiat)
- [ ] Multi-chain support (Ethereum mainnet)
- [ ] Mobile-responsive optimization
- [ ] Analytics and insights
- [ ] Creator recommendation engine

---

## 🏆 Story Buildathon Submission

**Category**: Best IP Management dApp
**Story Protocol Integration**: ✅ Production-ready
- Real IP asset registration on Aeneid testnet
- Transaction tracking and verification
- Metadata storage with IPFS integration
- Ready for mainnet deployment

**Coinbase Integration**: ✅ Fully functional
- Email/OTP authentication
- Automatic wallet creation
- Zero-friction Web3 onboarding
- Professional UX

**Innovation**:
- First music marketplace with blockchain IP registration requiring ZERO crypto knowledge
- Email login → IP registration in under 60 seconds
- Proves Web3 can be as easy as Web2

---

## 🤝 Contributing

This project was built for the Story Buildathon. Contributions welcome!

```bash
# Fork the repo
# Create a feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

---

## 📄 License

MIT License - Free to use, modify, and distribute

---

## 🙏 Acknowledgments

- **[Story Protocol](https://story.foundation/)** - Blockchain IP infrastructure that actually works
- **[Coinbase Developer Platform](https://www.coinbase.com/cloud)** - Making Web3 accessible with embedded wallets
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible component library
- **[Vercel](https://vercel.com/)** - Seamless Next.js deployment
- **[Pinata](https://pinata.cloud/)** - Reliable IPFS storage

---

## 📞 Support & Contact

- **Setup Issues**: See [QUICKSTART.md](./QUICKSTART.md) or open an issue
- **Integration Help**: Check [COINBASE_INTEGRATION.md](./COINBASE_INTEGRATION.md)
- **Bug Reports**: [GitHub Issues](https://github.com/yourusername/Side-B/issues)

---

**Built with ❤️ for independent musicians and creators**
*Making blockchain IP rights as easy as hitting "upload"*

🎵 **[Try it Live](#)** | 📖 **[Read the Docs](./COINBASE_INTEGRATION.md)** | 🚀 **[Deploy Your Own](#deployment)**
