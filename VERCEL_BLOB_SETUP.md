# 🎵 Vercel Blob Storage Setup Guide

## Quick Setup (5 minutes)

### 1. Enable Vercel Blob Storage

1. Go to your Vercel Dashboard: https://vercel.com
2. Select your project: **side-b**
3. Click on the **"Storage"** tab
4. Click **"Create Database"**
5. Select **"Blob"** (not Postgres, not KV)
6. Click **"Continue"**
7. Vercel will automatically:
   - Create the Blob storage
   - Add `BLOB_READ_WRITE_TOKEN` to your environment variables
   - Connect it to all environments (Production, Preview, Development)

### 2. Verify Environment Variable

1. Go to **Settings** → **Environment Variables**
2. Confirm you see: `BLOB_READ_WRITE_TOKEN`
3. It should be available in: Production, Preview, Development

### 3. Redeploy

```bash
git push origin main
```

That's it! Vercel will automatically use the token for uploads.

---

## What You Get

**Free Tier:**
- 1GB storage
- 5GB bandwidth per month
- Perfect for MVP

**Features:**
- ✅ Global CDN (fast worldwide)
- ✅ Automatic HTTPS
- ✅ No configuration needed
- ✅ Works with all audio formats

---

## How It Works

**Upload Flow:**
1. User drags audio file to upload zone
2. Frontend validates file (type, size)
3. Sends to `/api/upload/audio`
4. API uploads to Vercel Blob
5. Returns public URL
6. URL saved in session metadata
7. Audio accessible globally via CDN

**Storage:**
- Files stored in Vercel's infrastructure
- NOT in your Neon database (saves space)
- Accessible via public URLs
- Automatic CDN distribution

---

## Testing Locally

For local development, you can pull the environment variables:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local
```

Then restart your dev server:
```bash
npm run dev
```

---

## Troubleshooting

**Error: "BLOB_READ_WRITE_TOKEN is not defined"**
- Make sure you created Blob storage in Vercel
- Redeploy after creating storage
- Check environment variables are set

**Upload fails with 500 error**
- Check Vercel function logs
- Verify token is correctly set
- Make sure file is under 50MB

**File uploads but doesn't play**
- Check the returned URL is accessible
- Verify file format is supported
- Try opening URL directly in browser

---

## Cost Estimate

**Free Tier (1GB):**
- ~200 songs at 5MB each
- ~100 songs at 10MB each (high quality)
- ~50 songs at 20MB each (lossless)

**Paid Tier ($0.15/GB):**
- Very affordable for scaling
- Only pay for what you use
- No minimum commitment

---

## Next Steps

1. ✅ Enable Blob storage in Vercel
2. ✅ Push code to trigger deploy
3. ✅ Test upload in production
4. 🎉 Start uploading music!
