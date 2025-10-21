# Database Connection Timeout Fix

## Problem
Your Render deployment is failing with:
```
Error: P1002
The database server at `dpg-d3r1ihodl3ps73canb30-a.oregon-postgres.render.com:5432` was reached but timed out.
Context: Timed out trying to acquire a postgres advisory lock (SELECT pg_advisory_lock(72707369)). Elapsed: 10000ms.
```

## Root Cause
Render's free-tier PostgreSQL databases spin down after 15 minutes of inactivity. When your build starts, the database needs time to wake up, but Prisma's default 10-second timeout isn't enough.

## Solution: Update Environment Variables

### Step 1: Get Your Database URL
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Navigate to your **PostgreSQL database** (not your web service)
3. Click on the **Info** tab
4. Copy the **Internal Database URL** - it looks like:
   ```
   postgresql://clickstay_db_user:RU8PQtkCHM0DRiEOnxQtvrxfBGVJUCjz@dpg-d3r1ihodl3ps73canb30-a.oregon-postgres.render.com/clickstay_db
   ```

### Step 2: Update Your Web Service Environment Variables
1. Go to your **Web Service** in Render Dashboard
2. Click on **Environment** in the left sidebar
3. Find the `DATABASE_URL` variable and click Edit
4. Update it to include connection timeout parameters:

#### DATABASE_URL
```
postgresql://clickstay_db_user:RU8PQtkCHM0DRiEOnxQtvrxfBGVJUCjz@dpg-d3r1ihodl3ps73canb30-a.oregon-postgres.render.com/clickstay_db?connect_timeout=30&pool_timeout=30
```

**What this does:**
- `connect_timeout=30` - Waits 30 seconds for database to wake up (fixes migration timeout)
- `pool_timeout=30` - Waits 30 seconds for a connection from the pool

### Step 3: Commit and Push Changes
The code changes have been made to:
- `prisma/schema.prisma` - Added `directUrl` support
- `.env.example` - Updated with new connection string format

Commit these changes:
```bash
git add .
git commit -m "Fix database connection timeout with pooling and direct URL"
git push origin main
```

### Step 4: Trigger Redeploy
After pushing, Render will automatically redeploy. The build should now succeed because:
1. Prisma will use `DIRECT_URL` for migrations (with 30s timeout)
2. Your app will use `DATABASE_URL` for queries (with connection pooling)

## Alternative: Wake Up Database First

If you still have issues, you can manually wake up the database before deploying:

1. Go to your PostgreSQL database in Render
2. Click **Shell** tab
3. Run: `SELECT 1;`
4. This wakes up the database
5. Immediately trigger a redeploy of your web service

## Verify the Fix

After deployment succeeds:
1. Check build logs - migrations should complete
2. Visit your app URL
3. Run the seed command in the web service shell:
   ```bash
   npm run prisma:seed
   ```

## Long-term Solution

Consider upgrading to Render's paid PostgreSQL plan ($7/month) which:
- Never spins down
- Has better performance
- Supports more connections
- Has automated backups

## Need Help?

If this doesn't work:
1. Check that both `DATABASE_URL` and `DIRECT_URL` are set correctly
2. Verify your database is not suspended (check Render dashboard)
3. Try manually running migrations in the web service shell after deployment:
   ```bash
   npx prisma migrate deploy
   ```
