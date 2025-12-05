# 🚀 Vercel Deployment Setup Guide

## Database Configuration

Your app is now configured to use **PostgreSQL** in production (Vercel).

### Step-by-Step Instructions:

#### 1. Create Postgres Database in Vercel

1. Go to your Vercel Dashboard: https://vercel.com
2. Select your project: **side-b**
3. Click on the **"Storage"** tab
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Click **"Continue"** and accept the terms
7. Vercel will automatically:
   - Create the database
   - Add environment variables to your project
   - Connect it to all your deployments

#### 2. Run Database Migrations

After creating the database, you need to run migrations:

**Option A: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull environment variables (including DATABASE_URL)
vercel env pull .env.local

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma db push
```

**Option B: Automatic on Deploy**

Add this to your `package.json` scripts:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma db push && next build"
  }
}
```

Then redeploy:
```bash
git add .
git commit -m "Configure PostgreSQL for Vercel"
git push origin main
```

#### 3. Verify Database Connection

After deployment, check your Vercel logs:
1. Go to your project in Vercel
2. Click on "Deployments"
3. Click on the latest deployment
4. Check the "Build Logs" and "Function Logs"

### Environment Variables

Vercel automatically sets these when you create a Postgres database:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← This is your `DATABASE_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

Make sure `DATABASE_URL` is set to `POSTGRES_PRISMA_URL` in your Vercel environment variables.

### Local Development

For local development, you can still use SQLite:

1. Create a `.env.local` file:
```env
DATABASE_URL="file:./dev.db"
```

2. Temporarily change `schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"  // Change back to sqlite for local dev
  url      = env("DATABASE_URL")
}
```

3. Run migrations:
```bash
npx prisma db push
```

### Troubleshooting

**Error: "Failed to load sessions"**
- Make sure the database is created in Vercel Storage
- Check that migrations have run (`prisma db push`)
- Verify `DATABASE_URL` environment variable is set

**Error: "Can't reach database server"**
- The database might not be connected to your project
- Go to Storage → Your Database → Connect to Project

**Need to reset database?**
```bash
npx prisma db push --force-reset
```

### Next Steps

1. ✅ Create Postgres database in Vercel
2. ✅ Run migrations (Option A or B above)
3. ✅ Redeploy your app
4. ✅ Test login and sessions loading

Your app should now work in production! 🎉
