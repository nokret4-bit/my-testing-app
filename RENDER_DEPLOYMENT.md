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

- `DATABASE_URL` - PostgreSQL connection string (auto-provided by Render)
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

### If migrations fail:
- Check that `DATABASE_URL` is correctly set
- Verify the PostgreSQL database is accessible
- Check Render build logs for specific errors

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
