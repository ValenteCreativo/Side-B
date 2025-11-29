# Setup Instructions 🛠️

Detailed setup guide for **Side B Sessions** - from installation to production deployment.

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- A code editor (VS Code recommended)

---

## 🚀 Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Side-B

# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with the following configuration:

```env
# Database
DATABASE_URL="file:./dev.db"

# Story Protocol (REQUIRED FOR IP REGISTRATION)
STORY_API_KEY=""                    # Get from https://www.story.foundation/build
STORY_NETWORK="iliad"               # "iliad" for testnet, "mainnet" for production
STORY_CHAIN_ID="1513"               # Story Iliad testnet chain ID
STORY_RPC_URL=""                    # Story RPC endpoint
STORY_PRIVATE_KEY=""                # Wallet private key for IP registration

# Coinbase Embedded Wallets (REQUIRED FOR AUTHENTICATION)
COINBASE_API_KEY=""                 # Get from https://docs.cdp.coinbase.com/
COINBASE_API_SECRET=""              # Coinbase API secret
COINBASE_PROJECT_ID=""              # Your Coinbase project ID

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🔑 Getting API Keys

### Story Protocol Setup

1. **Visit Story Protocol**:
   - Go to [https://www.story.foundation/build](https://www.story.foundation/build)
   - Sign up for a developer account

2. **Get Testnet Access**:
   - Request access to Story Iliad testnet
   - Get your API key and RPC URL

3. **Create a Wallet**:
   - Generate a new wallet for IP registration
   - Fund it with testnet tokens from the faucet
   - Add the private key to `.env` as `STORY_PRIVATE_KEY`

4. **Configure Environment**:
   ```env
   STORY_API_KEY="your_api_key_here"
   STORY_NETWORK="iliad"
   STORY_CHAIN_ID="1513"
   STORY_RPC_URL="https://rpc.iliad.story.foundation"
   STORY_PRIVATE_KEY="0x..."
   ```

**Documentation**:
- [Story Protocol Docs](https://docs.story.foundation/)
- [TypeScript SDK](https://docs.story.foundation/developers/typescript-sdk/overview)

---

### Coinbase Embedded Wallets Setup

1. **Create Coinbase Developer Account**:
   - Go to [https://www.coinbase.com/cloud](https://www.coinbase.com/cloud)
   - Sign up and create a new project

2. **Generate API Keys**:
   - Navigate to API Keys section
   - Create new API key with appropriate permissions
   - Copy API Key, API Secret, and Project ID

3. **Configure Environment**:
   ```env
   COINBASE_API_KEY="your_api_key"
   COINBASE_API_SECRET="your_api_secret"
   COINBASE_PROJECT_ID="your_project_id"
   ```

**Documentation**:
- [Coinbase Developer Platform](https://docs.cdp.coinbase.com/)
- [Embedded Wallets Guide](https://docs.cdp.coinbase.com/wallet-sdk/docs/welcome)

---

## 💾 Database Setup

### Development (SQLite)

```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### Production (PostgreSQL)

1. **Get a PostgreSQL database**:
   - Use [Vercel Postgres](https://vercel.com/storage/postgres)
   - Or [Supabase](https://supabase.com/)
   - Or any PostgreSQL provider

2. **Update DATABASE_URL**:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   ```

3. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```

---

## 🏃 Running the App

### Development Mode

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the app
npm run build

# Start production server
npm start
```

---

## 🧪 Testing the App

### Without API Keys (Mock Mode)

The app will work in mock mode if API keys are not configured:

- **Authentication**: Uses local storage mock
- **Story Protocol**: Returns mock IP asset IDs
- **All features work** except actual blockchain interactions

### With API Keys (Full Mode)

With proper configuration:

- **Real wallet creation** via Coinbase
- **Actual IP registration** on Story Protocol
- **On-chain transactions** tracked

---

## 📦 Deployment

### Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git add -A
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables**:
   - Add all `.env` variables in Vercel dashboard
   - Ensure `DATABASE_URL` points to production database

4. **Deploy**:
   - Vercel will automatically build and deploy
   - Set up your custom domain (optional)

### Environment Variables in Vercel

In your Vercel project dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add each variable from your `.env` file
3. Choose appropriate environments (Production, Preview, Development)
4. Save and redeploy

---

## 🔧 Common Issues

### Database Connection Errors

**Problem**: `Can't reach database server`

**Solution**:
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database
npx prisma db push --force-reset
```

### Story Protocol Registration Fails

**Problem**: `Story Protocol client initialization failed`

**Solution**:
1. Check `STORY_PRIVATE_KEY` is set correctly
2. Ensure wallet has testnet funds
3. Verify `STORY_RPC_URL` is accessible
4. Check Story Protocol API status

### Coinbase Authentication Fails

**Problem**: `Coinbase authentication failed`

**Solution**:
1. Verify API keys are correct
2. Check project is active in Coinbase dashboard
3. Ensure API permissions are set properly
4. Use mock mode for development if needed

### Build Errors

**Problem**: TypeScript or build errors

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

---

## 📚 Additional Resources

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Story Protocol
- [Developer Portal](https://www.story.foundation/build)
- [TypeScript SDK](https://docs.story.foundation/developers/typescript-sdk/overview)
- [Discord Community](https://discord.gg/storyprotocol)

### Coinbase
- [Developer Platform](https://docs.cdp.coinbase.com/)
- [Embedded Wallets](https://docs.cdp.coinbase.com/wallet-sdk/docs/welcome)

---

## 🆘 Getting Help

1. **Check this guide** for common issues
2. **Review the code comments** in:
   - `lib/story.ts` - Story Protocol integration
   - `lib/coinbase.ts` - Coinbase integration
   - API routes in `app/api/`
3. **Open an issue** on GitHub
4. **Join the Story Protocol Discord** for community support

---

## 🎯 Next Steps After Setup

1. **Create a test musician account**
   - Sign in as musician from landing page
   - Upload a test track
   - Verify IP registration on Story Protocol

2. **Create a test creator account**
   - Sign in as creator (use different browser/incognito)
   - Browse the catalog
   - License a track

3. **Explore the codebase**
   - Read through component files
   - Understand the API routes
   - Review database schema

4. **Customize for your needs**
   - Update branding and copy
   - Add custom features
   - Enhance UI/UX

---

## 📝 Development Workflow

```bash
# Start development
npm run dev

# Make changes to code
# Files auto-reload on save

# View database
npx prisma studio

# Run type checking
npx tsc --noEmit

# Build for production
npm run build

# Test production build
npm start
```

---

**Happy Building! 🚀**

For questions or issues, refer to the main [README.md](./README.md) or open an issue on GitHub.
