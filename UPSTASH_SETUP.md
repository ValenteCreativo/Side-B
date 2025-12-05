# 🛡️ Upstash Redis Rate Limiting Setup Guide

## Quick Setup (10 minutes)

### 1. Create Upstash Redis Database

1. Go to [Upstash Console](https://console.upstash.com/)
2. Sign up or log in
3. Click **"Create Database"**
4. Configure:
   - **Name**: `side-b-ratelimit`
   - **Type**: **Regional** (recommended for lower latency)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - **TLS**: Enabled (default)
5. Click **"Create"**

### 2. Get API Credentials

After creating the database:
1. Click on your database name
2. Scroll to **"REST API"** section
3. Copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 3. Add Environment Variables

#### Local Development (`.env.local`)
```bash
UPSTASH_REDIS_REST_URL="https://your-database.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token-here"
```

#### Vercel Production
1. Go to Vercel Dashboard → Your Project
2. **Settings** → **Environment Variables**
3. Add both variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Select environments: **Production**, **Preview**, **Development**
5. Click **"Save"**

### 4. Redeploy

```bash
# Local: Restart dev server
npm run dev

# Production: Push to trigger deploy
git push origin main
```

---

## 🎯 Rate Limits Configured

### Critical Endpoints

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| `/api/payments/confirm` | 10 req | 1 minute | Prevent payment spam |
| `/api/upload/audio` | 5 req | 1 hour | Prevent upload abuse |
| `/api/wallet/send` | 20 req | 1 minute | Protect wallet operations |
| `/api/wallet/transactions` | 20 req | 1 minute | Prevent transaction spam |
| `/api/sessions` (POST) | 30 req | 1 minute | Prevent session spam |
| `/api/users` (POST) | 30 req | 1 minute | Prevent user creation spam |

### Rate Limit Headers

All rate-limited endpoints return these headers:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1638360000
```

### Error Response (429 Too Many Requests)

```json
{
  "error": "Too many payment requests. Please try again later.",
  "limit": 10,
  "reset": 1638360000
}
```

---

## 🔧 How It Works

### Architecture

```
User Request
    ↓
Rate Limit Check (Upstash Redis)
    ↓
  Allowed? ────→ Yes ────→ Process Request
    ↓
   No
    ↓
Return 429 Error
```

### Sliding Window Algorithm

- **Accurate**: Counts requests in a sliding time window
- **Fair**: Prevents burst attacks
- **Efficient**: Uses Redis for fast lookups

### Identifier Strategy

Rate limits are applied per IP address:
```typescript
// Checks these headers in order:
1. x-forwarded-for (proxy/CDN)
2. x-real-ip (nginx)
3. cf-connecting-ip (Cloudflare)
4. Fallback: 'anonymous'
```

---

## 📊 Upstash Free Tier

**Generous limits for MVP:**
- **10,000 commands/day** (resets daily)
- **256 MB storage**
- **TLS encryption**
- **Global replication** (optional)

**Cost after free tier:**
- $0.20 per 100K commands
- Very affordable for most apps

---

## 🧪 Testing Rate Limits

### Local Testing

```bash
# Test payment endpoint (10 req/min limit)
for i in {1..12}; do
  curl -X POST http://localhost:3000/api/payments/confirm \
    -H "Content-Type: application/json" \
    -d '{"sessionId":"test","buyerId":"test","txHash":"0x1234567890123456789012345678901234567890123456789012345678901234"}'
  echo "\nRequest $i"
  sleep 1
done

# Should see 429 error on requests 11-12
```

### Check Rate Limit Status

```bash
# See remaining requests
curl -i http://localhost:3000/api/sessions

# Check headers:
# X-RateLimit-Limit: 30
# X-RateLimit-Remaining: 29
```

---

## 🚨 Troubleshooting

### Rate Limiting Not Working

**Symptom**: All requests pass through, no rate limiting

**Solutions**:
1. Check environment variables are set:
   ```bash
   echo $UPSTASH_REDIS_REST_URL
   echo $UPSTASH_REDIS_REST_TOKEN
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

3. Check console for warnings:
   ```
   ⚠️  Rate limiting not configured. Set UPSTASH_REDIS_REST_URL...
   ```

### 429 Errors in Development

**Symptom**: Getting rate limited while testing

**Solutions**:
1. **Temporary**: Comment out rate limit check
2. **Better**: Increase limits in `lib/rate-limit.ts`:
   ```typescript
   limiter: Ratelimit.slidingWindow(100, '1 m'), // Higher limit for dev
   ```

3. **Best**: Use different Redis database for dev/prod

### Redis Connection Errors

**Symptom**: `Failed to connect to Upstash`

**Solutions**:
1. Verify credentials are correct
2. Check Upstash dashboard - database is active
3. Verify TLS is enabled
4. Check firewall/network settings

---

## 🔐 Security Best Practices

### 1. Protect Credentials
- ✅ Never commit `.env.local` to git
- ✅ Use Vercel environment variables
- ✅ Rotate tokens periodically

### 2. Monitor Usage
- Check Upstash dashboard daily
- Set up alerts for unusual activity
- Monitor 429 error rates

### 3. Adjust Limits
- Start conservative
- Increase based on real usage
- Different limits for authenticated vs anonymous

### 4. Fail Open
- If Redis is down, allow requests
- Log errors for investigation
- Don't block legitimate users

---

## 📈 Monitoring

### Upstash Dashboard

View real-time metrics:
- **Commands/sec**: Request rate
- **Storage**: Data usage
- **Latency**: Response times
- **Errors**: Connection issues

### Application Logs

Rate limit events are logged:
```
🚫 Rate limit exceeded for 192.168.1.1
✅ Rate limit check passed (9/10 remaining)
⚠️  Rate limiting not configured
```

---

## 🎯 Next Steps

After setup:
1. ✅ Test locally with curl
2. ✅ Deploy to Vercel
3. ✅ Monitor first 24 hours
4. ✅ Adjust limits if needed
5. ✅ Add more endpoints as needed

---

## 💡 Advanced Configuration

### Per-User Rate Limiting

Instead of IP-based, use user ID:
```typescript
const identifier = user?.id || getClientIdentifier(request)
```

### Dynamic Limits

Adjust limits based on user tier:
```typescript
const limit = user?.isPremium ? 100 : 10
```

### Custom Error Messages

Personalize by endpoint:
```typescript
error: 'Upload limit reached. Upgrade to premium for unlimited uploads.'
```

---

## 📚 Resources

- [Upstash Documentation](https://docs.upstash.com/)
- [Ratelimit SDK](https://github.com/upstash/ratelimit)
- [Vercel Rate Limiting Guide](https://vercel.com/docs/functions/edge-middleware/middleware-api#rate-limiting)

---

## ✅ Checklist

- [ ] Created Upstash Redis database
- [ ] Copied REST API credentials
- [ ] Added environment variables (local)
- [ ] Added environment variables (Vercel)
- [ ] Tested locally
- [ ] Deployed to production
- [ ] Verified rate limiting works
- [ ] Monitored for 24 hours
- [ ] Adjusted limits if needed

**Rate limiting is now protecting your API!** 🛡️
