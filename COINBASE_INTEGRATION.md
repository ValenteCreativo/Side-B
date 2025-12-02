# Coinbase Embedded Wallets Integration

## 🎯 Overview

Side B Sessions is configured to use **Coinbase Developer Platform (CDP) Embedded Wallets** for seamless email-based authentication. Users can sign in with their email, receive an OTP code, and automatically get an Ethereum wallet created for them.

---

## 📦 What's Already Set Up

### 1. SDK Installation
✅ Installed packages:
```bash
@coinbase/cdp-react
@coinbase/cdp-core
@coinbase/cdp-hooks
```

### 2. Provider Configuration
✅ Created `CoinbaseProvider` wrapper component ([components/providers/CoinbaseProvider.tsx](components/providers/CoinbaseProvider.tsx))
✅ Integrated into app layout with proper client-side rendering

### 3. Authentication Components
✅ **CoinbaseAuth Component** ([components/auth/CoinbaseAuth.tsx](components/auth/CoinbaseAuth.tsx))
   - Email/OTP flow with Coinbase CDP hooks
   - `useSignInWithEmail` for sending verification codes
   - `useVerifyEmailOTP` for code validation
   - `useIsSignedIn` and `useUser` for session management
   - Automatic wallet address retrieval

✅ **AuthModal Component** ([components/auth/AuthModal.tsx](components/auth/AuthModal.tsx))
   - Role selection (Musician vs Creator)
   - Integration with CoinbaseAuth for wallet connection
   - Seamless handoff to UserContext after authentication

✅ **AuthGate Component** ([components/auth/AuthGate.tsx](components/auth/AuthGate.tsx))
   - Protected route wrapper
   - Automatic auth modal display for unauthenticated users
   - Role-based access control

### 4. Database Integration
✅ User model stores wallet addresses from Coinbase
✅ API routes ready to accept Coinbase wallet addresses
✅ Session management with `UserContext`

---

## 🔑 Getting Your Coinbase Project ID

### Step 1: Create a Coinbase Developer Account

1. Go to [Coinbase Developer Platform](https://www.coinbase.com/cloud)
2. Click **"Get Started"** or **"Sign Up"**
3. Complete the registration process

### Step 2: Create a New Project

1. Log in to the [CDP Portal](https://portal.cdp.coinbase.com/)
2. Click **"Create Project"** or **"New Project"**
3. Give your project a name: **"Side B Sessions"**
4. Select project type: **"Embedded Wallets"**
5. Configure project settings:
   - App Name: `Side B Sessions`
   - Website URL: `http://localhost:3000` (for development)
   - Redirect URLs: `http://localhost:3000` (for development)

### Step 3: Get Your Project ID

1. In your project dashboard, find the **"API Keys"** or **"Credentials"** section
2. Copy your **Project ID** (it should look like: `a1b2c3d4-e5f6-7890-ab12-34cd56ef7890`)
3. Add it to your `.env` file:

```env
NEXT_PUBLIC_COINBASE_PROJECT_ID="your-project-id-here"
```

### Step 4: Configure for Production

For production deployment, update:
1. Website URL to your actual domain (e.g., `https://sidebsessions.com`)
2. Redirect URLs to match your production domain
3. Update `.env.production`:

```env
NEXT_PUBLIC_COINBASE_PROJECT_ID="your-production-project-id"
```

---

## 🚀 How It Works

### Authentication Flow

1. **User Arrives at Protected Route**
   - AuthGate detects no wallet connection
   - Shows AuthModal for role selection

2. **User Selects Role**
   - Chooses "Musician" or "Creator"
   - AuthModal displays CoinbaseAuth component

3. **Email Authentication**
   ```typescript
   // User enters email
   const { signInWithEmail } = useSignInWithEmail()
   const result = await signInWithEmail({ email: "user@example.com" })
   // Returns flowId for OTP verification
   ```

4. **OTP Verification**
   ```typescript
   // User enters 6-digit code from email
   const { verifyEmailOTP } = useVerifyEmailOTP()
   await verifyEmailOTP({ flowId, otp: "123456" })
   // Creates wallet and signs user in
   ```

5. **Wallet Address Retrieval**
   ```typescript
   const { user } = useUser()
   const walletAddress = user?.wallets?.[0]?.address
   // Ethereum address like: 0x742d...4321
   ```

6. **Database User Creation**
   ```typescript
   // POST /api/users
   await fetch('/api/users', {
     method: 'POST',
     body: JSON.stringify({
       walletAddress: user.wallets[0].address,
       role: selectedRole // 'MUSICIAN' or 'CREATOR'
     })
   })
   ```

7. **Session Persistence**
   - UserContext stores user data in localStorage
   - Automatic session restoration on page reload
   - Coinbase maintains wallet session

---

## 🔧 Technical Implementation

### CoinbaseProvider Component

```typescript
'use client'

import { CDPReactProvider } from '@coinbase/cdp-react'

export function CoinbaseProvider({ children }: { children: ReactNode }) {
  const projectId = process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID || ''

  return (
    <CDPReactProvider
      config={{
        projectId: projectId,
        ethereum: { createOnLogin: "eoa" }, // Create EOA wallet on login
        appName: "Side B Sessions"
      }}
    >
      {children}
    </CDPReactProvider>
  )
}
```

### CoinbaseAuth Hooks Usage

```typescript
import {
  useSignInWithEmail,
  useVerifyEmailOTP,
  useIsSignedIn,
  useUser
} from '@coinbase/cdp-hooks'

// Send OTP to email
const { signInWithEmail } = useSignInWithEmail()
const { flowId } = await signInWithEmail({ email })

// Verify OTP code
const { verifyEmailOTP } = useVerifyEmailOTP()
await verifyEmailOTP({ flowId, otp })

// Check authentication status
const { isSignedIn } = useIsSignedIn()

// Get user and wallet info
const { user } = useUser()
const address = user?.wallets?.[0]?.address
```

---

## 🎨 User Experience

### For New Users
1. Click "I'm a Musician" or "I'm a Creator"
2. Enter email address
3. Check email for 6-digit code
4. Enter code to verify
5. ✅ Wallet automatically created!
6. ✅ Signed in and ready to use the app

### For Returning Users
1. Coinbase remembers their session
2. Automatic wallet restoration
3. No need to re-enter email/OTP
4. Seamless app access

---

## 🔐 Security Features

### Email-Based Authentication
- No passwords to remember or manage
- One-time codes expire after use
- Secure email delivery through Coinbase infrastructure

### Wallet Security
- Private keys managed by Coinbase (custodial)
- Industry-standard encryption
- No user responsibility for key management
- Recovery options through Coinbase

### Session Management
- Secure session tokens
- Automatic expiration
- HTTPS-only in production

---

## ⚙️ Configuration Options

### Development Mode
```env
NEXT_PUBLIC_COINBASE_PROJECT_ID="your-dev-project-id"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Production Mode
```env
NEXT_PUBLIC_COINBASE_PROJECT_ID="your-prod-project-id"
NEXT_PUBLIC_APP_URL="https://your domain.com"
```

### Advanced Configuration

You can customize the CDP Provider config in [components/providers/CoinbaseProvider.tsx](components/providers/CoinbaseProvider.tsx):

```typescript
<CDPReactProvider
  config={{
    projectId: projectId,
    ethereum: {
      createOnLogin: "eoa", // or "smart-wallet" for smart contract wallets
    },
    solana: {
      createOnLogin: true, // Enable Solana support
    },
    appName: "Side B Sessions",
    appLogoUrl: "https://yourapp.com/logo.png", // Optional
    darkMode: true, // Optional
  }}
>
```

---

## 🧪 Testing the Integration

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to Studio or Catalog
Visit http://localhost:3000/studio or http://localhost:3000/catalog

### 3. Test Authentication Flow
1. Should see "Welcome to Side B Sessions" message
2. AuthModal automatically opens
3. Select your role (Musician or Creator)
4. Enter your email address
5. Check email for OTP code (6 digits)
6. Enter the code
7. Should see "Wallet Connected" message
8. Click "Continue" to proceed

### 4. Verify Database Integration
Check that user was created:
```bash
npx prisma studio
# Open Users table
# Should see new user with Coinbase wallet address
```

---

## 📚 Additional Resources

- [Coinbase Developer Platform Docs](https://docs.cdp.coinbase.com/)
- [Embedded Wallets Quickstart](https://docs.cdp.coinbase.com/embedded-wallets/quickstart)
- [CDP React SDK Reference](https://docs.cdp.coinbase.com/embedded-wallets/docs/react-sdk)
- [CDP Hooks Documentation](https://docs.cdp.coinbase.com/embedded-wallets/docs/hooks)

---

## 🎉 Benefits for Side B Sessions

### For Musicians
- ✅ **No wallet setup complexity** - Just enter email
- ✅ **No seed phrases to manage** - Coinbase handles security
- ✅ **Instant onboarding** - From email to wallet in seconds
- ✅ **Professional experience** - Trusted Coinbase infrastructure

### For Creators
- ✅ **Familiar email login** - No crypto knowledge needed
- ✅ **Automatic wallet** - Ready to license music immediately
- ✅ **Secure transactions** - Industry-standard security
- ✅ **Seamless payments** - Future integration with Coinbase payment rails

### For the Platform
- ✅ **Higher conversion rates** - Email is 10x easier than traditional Web3 onboarding
- ✅ **Lower support burden** - No "I lost my seed phrase" tickets
- ✅ **Better UX** - Feels like Web2, powered by Web3
- ✅ **Trusted infrastructure** - Built on Coinbase's battle-tested platform

---

## 🔄 Current Status

**Story Protocol Integration**: ✅ Fully functional with real blockchain transactions

**Coinbase Integration**: ⚠️ Configured and ready - needs Project ID from CDP Portal

**Next Steps**:
1. Get your Project ID from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Add it to `.env` as `NEXT_PUBLIC_COINBASE_PROJECT_ID`
3. Restart the dev server
4. Test the email authentication flow
5. Deploy to production with production Project ID

---

**Built with ❤️ for seamless Web3 onboarding**
