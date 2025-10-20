# Database Configuration Guide

Your app now has enhanced database configuration that automatically detects and adapts to both **Local** and **Render** environments.

## 🎯 Features

✅ **Auto-Environment Detection**
- Detects Render vs Local automatically
- Configures SSL for Render PostgreSQL
- Logs connection status with environment info

✅ **Dual Support**
- **Prisma ORM** (default, currently used)
- **pg (node-postgres)** (optional, for raw queries)

✅ **Security**
- Never logs credentials
- Only shows database host
- Proper error handling

✅ **Connection Testing**
- Tests connection on startup
- Provides clear success/error messages
- Exports utility function for health checks

## 📁 Files Created

1. **`src/lib/db.ts`** - New comprehensive database configuration
2. **`src/lib/prisma.ts`** - Enhanced existing Prisma client (backward compatible)

## 🔧 Usage

### Option 1: Use Existing Prisma Client (Recommended)

Your existing code continues to work without changes:

```typescript
import { prisma } from "@/lib/prisma";

// Query examples
const facilities = await prisma.facility.findMany();
const booking = await prisma.booking.create({ data: {...} });
```

### Option 2: Use New db.ts (Advanced)

For more control or to use pg directly:

```typescript
import { prisma, pool, checkConnection } from "@/lib/db";

// Use Prisma (default)
const facilities = await prisma.facility.findMany();

// Or use pg pool for raw queries (if USE_PRISMA=false)
const result = await pool.query('SELECT * FROM facility');

// Check connection health
const isConnected = await checkConnection();
```

## 🌍 Environment Variables

### Local Development (.env)

```bash
DATABASE_URL="postgresql://postgres:admin@localhost:5433/clickstay1"
NODE_ENV="development"
```

### Render Production

Add these in Render Dashboard → Environment:

```bash
DATABASE_URL=postgresql://clickstay_db_user:RU8PQtkCHM0DRiEOnxQtvrxfBGVJUCjz@dpg-d3r1ihodl3ps73canb30-a.oregon-postgres.render.com/clickstay_db
NODE_ENV=production
RENDER=true  # Automatically set by Render
```

### Optional: Switch to pg

If you want to use raw pg instead of Prisma:

```bash
USE_PRISMA=false
```

## 📊 Connection Logs

### Local Environment
```
✅ Connected to Local PostgreSQL: localhost
```

### Render Environment
```
✅ Connected to Render PostgreSQL: dpg-d3r1ihodl3ps73canb30-a.oregon-postgres.render.com
```

### Connection Failure
```
❌ Database connection failed: connection refused
```

## 🔍 How It Works

### Environment Detection

```typescript
const isRender = !!process.env.RENDER;
```

- **Render**: Sets `RENDER=true` automatically
- **Local**: No `RENDER` variable exists

### SSL Configuration

```typescript
ssl: isRender ? { rejectUnauthorized: false } : false
```

- **Render**: Enables SSL with `rejectUnauthorized: false`
- **Local**: Disables SSL

### Host Extraction (Safe Logging)

```typescript
// From: postgresql://user:pass@host:5432/db
// Logs: ✅ Connected to Render PostgreSQL: host
```

Only the hostname is logged - no credentials exposed!

## 🧪 Testing Connection

### Check if database is connected

```typescript
import { checkConnection } from "@/lib/db";

const isHealthy = await checkConnection();
if (isHealthy) {
  console.log("Database is healthy");
} else {
  console.log("Database connection failed");
}
```

### Get environment info

```typescript
import { dbInfo } from "@/lib/db";

console.log(dbInfo);
// {
//   environment: "Render",
//   host: "dpg-xxx.oregon-postgres.render.com",
//   isRender: true,
//   usePrisma: true
// }
```

## 🚀 Deployment Checklist

### For Render:

1. ✅ Add `DATABASE_URL` in Render environment variables
2. ✅ Ensure `NODE_ENV=production`
3. ✅ `RENDER=true` is set automatically
4. ✅ Run migrations: `npx prisma migrate deploy`
5. ✅ Check logs for connection success message

### For Local:

1. ✅ Ensure PostgreSQL is running
2. ✅ Update `.env` with correct `DATABASE_URL`
3. ✅ Run migrations: `npx prisma migrate dev`
4. ✅ Start dev server: `npm run dev`

## 🔧 Troubleshooting

### "DATABASE_URL is missing"
- Check your `.env` file (local)
- Check Render environment variables (production)

### "Database connection failed"
- **Local**: Ensure PostgreSQL is running
- **Render**: Verify DATABASE_URL is correct
- Check if database exists and is accessible

### "SSL connection error"
- This is handled automatically
- Render uses SSL, local doesn't
- No action needed

### TypeScript errors about 'pg'
- Already fixed! `@types/pg` is installed
- Restart your TypeScript server if needed

## 📝 Migration from Old Setup

Your existing code **continues to work** without changes! The new configuration is backward compatible.

If you want to use the new features:

```typescript
// Old way (still works)
import { prisma } from "@/lib/prisma";

// New way (more features)
import { prisma, checkConnection, dbInfo } from "@/lib/db";
```

## 🎉 Benefits

1. **Automatic Environment Detection** - No manual configuration
2. **Better Logging** - Know exactly where you're connected
3. **Secure** - No credentials in logs
4. **Flexible** - Switch between Prisma and pg easily
5. **Production Ready** - SSL configured for Render
6. **Health Checks** - Built-in connection testing

---

**Your database is now configured for both local development and Render production! 🚀**
