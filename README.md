# Side B Sessions 🎵

A minimalist marketplace where independent musicians can upload and register their music as IP on Story Protocol, and creators can browse and license authentic sounds for their projects.

Built for the **Story Buildathon** with:
- 🛡️ **Story Protocol** - IP registration for all tracks
- 💼 **Coinbase Embedded Wallets** - Seamless Web3 authentication
- ⚡ **Next.js 14** - Modern full-stack framework
- 🎨 **TailwindCSS + shadcn/ui** - Beautiful, accessible components

---

## 🌟 Features

### For Musicians
- **Upload Sessions**: Jams, rehearsals, and produced tracks
- **Automatic IP Registration**: Each upload is registered on Story Protocol
- **Content Organization**: Group tracks into collections (EPs, themed sets)
- **Beautiful Dashboard**: Manage your catalog with ease

### For Creators
- **Browse & Filter**: Find music by mood, content type, and tags
- **Audio Previews**: Listen before licensing
- **Non-Exclusive Licensing**: Multiple creators can license the same track
- **IP Transparency**: See Story Protocol registration for each track

---

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Database**: Prisma ORM + SQLite (dev), PostgreSQL-ready
- **Authentication**: Coinbase Embedded Wallets (wrapped)
- **IP Registration**: Story Protocol TypeScript SDK
- **Deployment**: Vercel-ready

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

1. **Clone and install dependencies**:
```bash
git clone <your-repo-url>
cd Side-B
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys (see [INSTRUCTIONS.md](./INSTRUCTIONS.md) for details).

3. **Set up the database**:
```bash
npx prisma generate
npx prisma db push
```

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser**:
```
http://localhost:3000
```

---

## 🎯 Project Structure

```
Side-B/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── users/          # User authentication
│   │   ├── sessions/       # Session CRUD + IP registration
│   │   └── licenses/       # License creation
│   ├── studio/             # Musician dashboard
│   ├── catalog/            # Creator marketplace
│   └── page.tsx            # Landing page
├── components/
│   ├── auth/               # Authentication (AuthGate, UserContext)
│   ├── studio/             # Musician components
│   ├── catalog/            # Creator components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── db.ts               # Prisma client
│   ├── story.ts            # Story Protocol integration
│   ├── coinbase.ts         # Coinbase Embedded Wallets
│   └── utils.ts            # Helper functions
└── prisma/
    └── schema.prisma       # Database schema
```

---

## 🔑 Key Integration Points

### Story Protocol
All music uploads are registered as IP assets on Story Protocol. See [`lib/story.ts`](./lib/story.ts) for implementation details.

**What's implemented**:
- IP asset registration with metadata
- Transaction tracking
- Asset ID storage in database

**Ready for production**:
- Replace placeholder Story SDK calls with real API integration
- Add proper wallet configuration
- Implement licensing smart contracts

### Coinbase Embedded Wallets
User authentication and wallet management via Coinbase. See [`lib/coinbase.ts`](./lib/coinbase.ts) for implementation.

**What's implemented**:
- Authentication wrapper with mock mode
- Wallet address management
- User session persistence

**Ready for production**:
- Replace mock authentication with real Coinbase SDK
- Configure API keys
- Implement proper wallet creation flow

---

## 📝 Development Notes

### Database Schema
The app uses Prisma with SQLite for development. Key models:
- **User**: Musicians and creators with wallet addresses
- **Session**: Music tracks with IP registration details
- **Collection**: Grouped sessions (EPs, albums)
- **License**: Non-exclusive licenses for creators

### API Routes
- `POST /api/users` - Create/retrieve user
- `GET /api/sessions` - List all sessions
- `POST /api/sessions` - Upload & register IP
- `GET /api/sessions/[id]` - Get session details
- `POST /api/licenses` - Create license
- `GET /api/licenses?buyerId=X` - Get user's licenses

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
```bash
git push origin main
```

2. **Connect to Vercel**:
- Import your repository
- Set environment variables
- Deploy

3. **Update database**:
```bash
# Use PostgreSQL for production
DATABASE_URL="postgresql://..."
npx prisma migrate deploy
```

### Environment Variables
See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for required environment variables.

---

## 🔮 Future Enhancements

- [ ] Real file upload to IPFS/Arweave
- [ ] Payment processing (crypto + fiat)
- [ ] Royalty tracking and distribution
- [ ] Advanced search and recommendations
- [ ] Musician earnings dashboard
- [ ] Collection management UI
- [ ] License terms customization
- [ ] Multi-chain support

---

## 📄 License

MIT License - Built for Story Buildathon

---

## 🙏 Acknowledgments

- **Story Protocol** for IP infrastructure
- **Coinbase** for embedded wallet technology
- **Vercel** for Next.js and hosting
- **shadcn** for beautiful UI components

---

## 📞 Support

For setup help or questions, see [INSTRUCTIONS.md](./INSTRUCTIONS.md) or open an issue.

**Built with ❤️ for independent musicians and creators**
