# Side B Optimization Implementation Plan

## ✅ Completed (Current Session)

### 1. Code Cleanup
- ✅ Removed Supabase packages (~200KB saved)
- ✅ Deleted unused messaging system
- ✅ Updated Prisma schema
- ✅ Updated navigation (Waku Messages → Messages)

### 2. Security Improvements
- ✅ **CRITICAL**: Completed USDC payment verification
  - ERC-20 Transfer event parsing
  - Multi-payment verification for split payments
  - Proper decimal handling (6 for USDC, 18 for ETH)
  - Amount and recipient validation

### 3. Input Validation (Phase 1 Complete)
- ✅ Installed Zod validation library
- ✅ Created comprehensive validation schemas (`lib/validations.ts`)
- ✅ Applied Zod validation to 6 critical endpoints:
  - ✅ `/api/payments/confirm/route.ts` - Payment confirmation
  - ✅ `/api/sessions/route.ts` - Session creation
  - ✅ `/api/licenses/route.ts` - License creation
  - ✅ `/api/users/route.ts` - User creation/update
  - ✅ `/api/follows/route.ts` - Follow relationships
  - ✅ `/api/wallet/balance/route.ts` - Wallet balance
- ⏳ **TODO**: Apply to remaining 12 API routes

### 4. Bundle Size Optimization
- ✅ Removed WakuProvider from root layout (~150KB saved)
  - Messaging feature not yet implemented
  - Can be lazy-loaded when needed

**Commits Created:**
1. `Add Zod validation to payments and sessions endpoints`
2. `Add Zod validation to licenses and follows endpoints`
3. `Add Zod validation to users endpoint`
4. `Remove WakuProvider from layout (messaging not yet implemented)`

---

## 🔴 High Priority (Week 1)

### 4. Complete Zod Validation Rollout
**Remaining Routes** (12 total):
```bash
# Payment Routes (CRITICAL - Security)
/app/api/payments/route.ts

# User Routes
/app/api/users/[id]/route.ts
/app/api/users/avatar/route.ts

# Session Routes
/app/api/sessions/[id]/route.ts

# Wallet Routes
/app/api/wallet/transactions/route.ts
/app/api/wallet/send/route.ts
/app/api/wallet/halliday-onramp/route.ts

# Social Routes
/app/api/analytics/route.ts

# Halliday Routes
/app/api/halliday/quotes/route.ts
/app/api/halliday/confirm/route.ts

# Upload Routes
/app/api/upload/audio/route.ts
```

**Implementation Pattern**:
```typescript
// 1. Import validation
import { validateRequest, createLicenseSchema } from '@/lib/validations'

// 2. Replace manual validation
const validation = await validateRequest(request, createLicenseSchema)
if (!validation.success) {
  return NextResponse.json({ error: validation.error }, { status: 400 })
}

const { sessionId, buyerId } = validation.data
```

**Estimated Time**: 4-6 hours

---

### 5. Rate Limiting Implementation
**Tools**: Vercel Rate Limiting or Upstash Redis

**Critical Endpoints**:
- `/api/payments/*` - 10 requests/minute per IP
- `/api/users/*` - 30 requests/minute per IP
- `/api/upload/audio` - 5 requests/hour per user
- `/api/wallet/*` - 20 requests/minute per IP

**Implementation** (Vercel):
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

// In API routes:
const { success } = await ratelimit.limit(ip)
if (!success) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
}
```

**Setup**:
1. Create Upstash Redis database (free tier: 10K commands/day)
2. `npm install @upstash/ratelimit @upstash/redis`
3. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to `.env`
4. Apply to critical endpoints

**Estimated Time**: 3-4 hours

---

### 6. Error Monitoring (Sentry)
**Setup**:
```bash
npx @sentry/wizard@latest -i nextjs
```

**Configuration**:
```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
```

**Benefits**:
- Real-time error tracking
- Performance monitoring
- User session replay
- Release tracking
- Custom alerts

**Estimated Time**: 2 hours

---

## 🟡 Medium Priority (Week 2)

### 7. Testing Framework Setup
**Stack**: Vitest + React Testing Library

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom \
  @vitejs/plugin-react jsdom @testing-library/user-event
```

**Configuration** (`vitest.config.ts`):
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

**Priority Test Coverage**:
1. **Payment Verification** (`lib/payment-verification.test.ts`)
   - USDC verification logic
   - Multi-payment splitting
   - Error cases

2. **Validation Schemas** (`lib/validations.test.ts`)
   - Schema validation rules
   - Edge cases
   - Error messages

3. **Critical API Routes** (80% coverage target)
   - `/api/payments/confirm` - Payment flow
   - `/api/licenses` - License creation
   - `/api/sessions` - Session upload

**Estimated Time**: 8-12 hours for 80% coverage

---

### 8. Database Query Optimization
**Current Issue**: Potential N+1 queries

**Optimization Examples**:

```typescript
// BEFORE (N+1 query)
const sessions = await prisma.session.findMany()
// Then fetch owner for each session

// AFTER (Single query with joins)
const sessions = await prisma.session.findMany({
  include: {
    owner: {
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
      },
    },
    licenses: {
      select: {
        buyerId: true,
        createdAt: true,
      },
    },
  },
  orderBy: { createdAt: 'desc' },
  take: 50, // Pagination
})
```

**Files to Optimize**:
- `/app/api/sessions/route.ts` (GET)
- `/app/catalog/page.tsx`
- `/app/community/page.tsx`
- `/app/analytics/route.ts`

**Estimated Time**: 4-6 hours

---

### 9. API Route Caching
**Current**: All routes have `export const dynamic = 'force-dynamic'`

**Optimization Strategy**:
```typescript
// For static/cacheable data
export const revalidate = 60 // Revalidate every 60 seconds

// GET /api/sessions (public catalog)
export const revalidate = 30

// GET /api/users (user profiles)
export const revalidate = 300 // 5 minutes

// Keep dynamic for:
// - /api/wallet/* (real-time balances)
// - /api/payments/* (transaction verification)
// - /api/analytics/* (user-specific data)
```

**Expected Impact**: 50%+ faster catalog/community page loads

**Estimated Time**: 2-3 hours

---

## 🟢 Low Priority (Week 3)

### 10. Lazy Load Waku Provider ✅ COMPLETED
**Status**: WakuProvider removed from root layout

**What was done**:
- Removed WakuProvider from `app/layout.tsx`
- Saved ~150KB on initial bundle
- Messaging feature not yet implemented

**Future implementation** (when messaging is ready):
```typescript
// app/messages/page.tsx
'use client'
import dynamic from 'next/dynamic'

const WakuProvider = dynamic(() =>
  import('@/components/waku/WakuProvider').then(mod => mod.WakuProvider),
  { ssr: false }
)

export default function MessagesPage() {
  return (
    <WakuProvider>
      {/* Waku messages UI */}
    </WakuProvider>
  )
}
```

**Benefit**: ~150KB saved on non-messaging pages

---

### 11. Image Optimization
**Current**: Using `<img>` tags

**Conversion to Next.js `<Image>`**:
```typescript
// Before
<img src="/assets/catalog-art.png" alt="Side B" />

// After
import Image from 'next/image'
<Image
  src="/assets/catalog-art.png"
  alt="Side B"
  width={32}
  height={32}
  priority // For above-the-fold images
/>
```

**Files to Update**:
- `components/layout/AppSidebar.tsx`
- `components/catalog/VinylTrack.tsx`
- `components/studio/TrackCard.tsx`
- All avatar images

**Benefits**:
- Automatic WebP conversion
- Lazy loading
- Responsive images
- Better performance scores

**Estimated Time**: 3-4 hours

---

### 12. Bundle Size Analysis
**Setup**:
```bash
npm install -D @next/bundle-analyzer
```

**Configuration** (`next.config.mjs`):
```javascript
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer({
  // ... existing config
})
```

**Run**: `ANALYZE=true npm run build`

**Estimated Time**: 1 hour

---

## 📊 Expected Performance Improvements

| Optimization | Impact | Difficulty |
|-------------|--------|------------|
| Zod Validation | Security ++++, Performance - | Medium |
| Rate Limiting | Security ++++, Reliability +++ | Easy |
| Sentry | Debugging +++, Monitoring ++++ | Easy |
| Testing | Confidence ++++, Stability ++++ | Hard |
| DB Queries | Performance +++, UX +++ | Medium |
| API Caching | Performance ++++, Server Load --- | Easy |
| Lazy Load Waku | Bundle Size ---, Initial Load ++ | Easy |
| Image Optimization | Performance +++, SEO ++ | Easy |

---

## 🎯 Success Metrics

**Security**:
- ✅ USDC payment verification complete
- ⏳ All API routes validated (6/18 complete - 33%)
- ⏳ Rate limiting active
- ⏳ Error monitoring deployed

**Performance**:
- ✅ Bundle size: -150KB (WakuProvider removed)
- ⏳ Test coverage: 0% → 80%
- ⏳ API response time: -30-50% (cached routes)
- ⏳ Lighthouse score: +15-20 points

**Code Quality**:
- ✅ Dead code removed (~200KB)
- ⏳ Input validation: 33% (6/18 routes)
- ⏳ Type safety: Strict mode
- ⏳ Error handling: Centralized

---

## 🚀 Quick Win Commands

```bash
# Week 1: Security & Validation (16-20 hours)
npm install @upstash/ratelimit @upstash/redis
npx @sentry/wizard@latest -i nextjs
# Apply Zod validation to all API routes
# Implement rate limiting
# Configure Sentry

# Week 2: Testing & Performance (14-18 hours)
npm install -D vitest @testing-library/react @testing-library/jest-dom
# Write tests for critical paths
# Optimize database queries
# Enable API route caching

# Week 3: Polish & Optimization (7-10 hours)
npm install -D @next/bundle-analyzer
# Lazy load Waku
# Convert images to Next.js Image
# Run bundle analysis
# Final performance audit
```

---

## 📝 Notes

- All optimization changes should be committed incrementally
- Run `npm run build` after each major change to catch issues early
- Test locally before deploying to production
- Monitor Sentry after deployment for new errors
- Update README.md with new environment variables
