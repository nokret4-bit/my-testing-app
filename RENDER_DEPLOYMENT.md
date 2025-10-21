# Render Deployment Guide

## Current Status

✅ **Build Script Updated** - Migrations now run automatically during deployment
✅ **TypeScript Errors Fixed** - All type errors resolved
✅ **Next.js Config Updated** - Removed deprecated experimental flags

## Post-Deployment Steps

After your Render deployment completes successfully, you need to seed the database with initial data.

### 1. Access Render Shell

Go to your Render dashboard:
1. Navigate to your web service
2. Click on the **Shell** tab
3. This opens a terminal connected to your deployed application

### 2. Run Database Seed

In the Render shell, run:

```bash
npm run prisma:seed
```

This will create:
- **Admin user**: `admin@clickstay.local` (password from `ADMIN_PASSWORD` env var or default: `admin123`)
- **6 sample facilities**: Rooms, Cottages, and Function Hall

### 3. Verify Deployment

Visit your Render URL and check:
- `/browse` - Should show the facilities
- `/admin` - Should allow login with admin credentials

## Environment Variables Required on Render

Make sure these are set in your Render dashboard under **Environment**:

- `DATABASE_URL` - PostgreSQL connection string with pooling parameters:
  ```
  postgresql://USER:PASSWORD@HOST/DATABASE?pgbouncer=true&connection_limit=1&pool_timeout=30
  ```
- `DIRECT_URL` - Direct database URL for migrations (without pooling):
  ```
  postgresql://USER:PASSWORD@HOST/DATABASE?connect_timeout=30
  ```
- `NEXTAUTH_SECRET` - Secret for NextAuth.js authentication
- `NEXTAUTH_URL` - Your Render app URL (e.g., `https://your-app.onrender.com`)
- `ADMIN_PASSWORD` - (Optional) Custom admin password, defaults to `admin123`
- `RENDER` - Set to `true` (for environment detection)

## Build Command

Current build command in `package.json`:
```json
"build": "prisma migrate deploy && prisma generate && next build"
```

This ensures:
1. Database migrations are applied
2. Prisma Client is generated
3. Next.js app is built

## Troubleshooting

### Database Connection Timeout (P1002 Error)

If you see: `Error: P1002 - The database server was reached but timed out`

**Cause**: Render's free-tier PostgreSQL databases spin down after inactivity, causing connection timeouts during migrations.

**Solution**:
1. In Render Dashboard → Your PostgreSQL Database → Info tab
2. Copy the **Internal Database URL**
3. In your Web Service → Environment tab, update:
   - `DATABASE_URL`: Add `?pgbouncer=true&connection_limit=1&pool_timeout=30`
   - `DIRECT_URL`: Add `?connect_timeout=30` (use same base URL as DATABASE_URL)
4. Redeploy your service

Example:
```
DATABASE_URL=postgresql://user:pass@host/db?pgbouncer=true&connection_limit=1&pool_timeout=30
DIRECT_URL=postgresql://user:pass@host/db?connect_timeout=30
```

### If migrations fail:
- Check that `DATABASE_URL` and `DIRECT_URL` are correctly set
- Verify the PostgreSQL database is accessible and not suspended
- Check Render build logs for specific errors
- Ensure your database is on a paid plan or recently active (free tier spins down)

### If tables still don't exist:
- Manually run in Render shell: `npx prisma migrate deploy`
- Then seed: `npm run prisma:seed`

### If admin login doesn't work:
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your Render URL
- Re-run seed to ensure admin user exists

## Latest Deployment

**Commit**: `b28be59` - Added database migration to build script
**Previous**: `6f526dc` - Fixed TypeScript errors

Monitor your deployment at: https://dashboard.render.com
