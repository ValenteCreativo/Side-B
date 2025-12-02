# Quick Start Guide 🚀

Get **Side B Sessions** running in 5 minutes!

---

## ⚡ Fastest Path to Running

```bash
# Install dependencies (includes automatic Prisma generation)
npm install

# Set up database
npx prisma db push

# Run the app
npm run dev
```

**That's it!** Open [http://localhost:3000](http://localhost:3000)

> **Note**: `npm install` automatically runs `prisma generate` via the postinstall script

The app works in **mock mode** - you can test all features without any API keys.

---

## 🧪 Testing the App (Mock Mode)

### Try as a Musician:
1. Click **"I'm a Musician"** on the landing page
2. Mock wallet will be created automatically
3. Upload a test session:
   - Title: "My First Track"
   - Description: "Testing the upload"
   - Content Type: Produced
   - Price: 9.99
   - Leave audio URL empty (will use placeholder)
4. Click **"Upload & Register"**
5. See your session in the list with a mock Story Protocol asset ID

### Try as a Creator:
1. Open new **incognito/private window**
2. Click **"I'm a Creator"** on the landing page
3. Browse the catalog
4. Use filters to search
5. Click **"License"** on a track
6. License acquired! (mock payment)

---

## 🔑 Adding Real API Keys (Optional)

### For Story Protocol Integration

1. **Get API keys** from [Story Protocol](https://www.story.foundation/build)

2. **Edit `.env`**:
```env
STORY_API_KEY="your_api_key"
STORY_RPC_URL="https://rpc.iliad.story.foundation"
STORY_PRIVATE_KEY="0x..." # Your wallet private key
```

3. **Restart the server**:
```bash
npm run dev
```

Now all uploads will be **registered on Story Protocol for real**!

### For Coinbase Embedded Wallets

1. **Get API keys** from [Coinbase](https://www.coinbase.com/cloud)

2. **Edit `.env`**:
```env
COINBASE_API_KEY="your_api_key"
COINBASE_API_SECRET="your_secret"
COINBASE_PROJECT_ID="your_project_id"
```

3. **Restart the server**

Now authentication uses **real Coinbase wallets**!

---

## 📁 Project Tour

### Key Files to Explore

**Story Protocol Integration**:
- [`lib/story.ts`](./lib/story.ts) - IP registration logic

**Coinbase Integration**:
- [`lib/coinbase.ts`](./lib/coinbase.ts) - Wallet authentication

**API Routes**:
- [`app/api/sessions/route.ts`](./app/api/sessions/route.ts) - Upload + IP registration
- [`app/api/licenses/route.ts`](./app/api/licenses/route.ts) - Licensing logic

**Pages**:
- [`app/page.tsx`](./app/page.tsx) - Landing page
- [`app/studio/page.tsx`](./app/studio/page.tsx) - Musician dashboard
- [`app/catalog/page.tsx`](./app/catalog/page.tsx) - Creator marketplace

---

## 🛠️ Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production build

# Database
npx prisma studio    # View/edit database in browser
npx prisma db push   # Update database schema
npx prisma generate  # Regenerate Prisma client

# Code Quality
npx tsc --noEmit     # Type checking
npm run lint         # Lint code
```

---

## 🎯 What to Do Next

1. **Explore the app** - Try both musician and creator flows
2. **Read the code** - Check out the integration wrappers
3. **Add API keys** - Enable real blockchain features
4. **Customize** - Make it your own!
5. **Deploy** - Push to Vercel

---

## 📚 Full Documentation

- [README.md](./README.md) - Project overview
- [INSTRUCTIONS.md](./INSTRUCTIONS.md) - Detailed setup
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - What's included

---

## 🆘 Need Help?

**App not starting?**
```bash
rm -rf node_modules .next
npm install
npm run dev
```

**Database errors?**
```bash
npx prisma db push --force-reset
```

**Still stuck?**
- Check [INSTRUCTIONS.md](./INSTRUCTIONS.md) for detailed troubleshooting
- Review code comments in `lib/story.ts` and `lib/coinbase.ts`

---

**You're all set! 🎉**

Now go build something amazing for the Story Buildathon! 🚀
