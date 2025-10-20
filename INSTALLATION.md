# ClickStay Installation Guide

Complete step-by-step instructions to get ClickStay running locally.

## Prerequisites Checklist

- [ ] Node.js 20.18.0 installed (via nvm)
- [ ] npm 10.9.0
- [ ] Docker Desktop installed (for PostgreSQL)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Step 1: Node.js Setup

```bash
# Install nvm if you don't have it
# Windows: Download from https://github.com/coreybutler/nvm-windows/releases

# Install and use Node 20.18.0
nvm install 20.18.0
nvm use 20.18.0

# Verify versions
node -v   # Should show v20.18.0
npm -v    # Should show 10.9.0 or compatible
```

## Step 2: Clone & Install Dependencies

```bash
# Navigate to project directory
cd c:/Users/PC/Desktop/Ecommerce

# Install all dependencies
npm install
```

This will install:
- Next.js 15 and React 18
- Prisma ORM
- Auth.js (NextAuth v5)
- Nodemailer & React Email
- Tailwind CSS & shadcn/ui components
- All TypeScript types

**Expected time:** 2-3 minutes

## Step 3: Environment Configuration

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` with your settings:

### Required Settings

```env
# Database (use default for local development)
DATABASE_URL="postgresql://clickstay:clickstay@localhost:5432/clickstay?schema=public"

# Auth Secret (generate a new one)
AUTH_SECRET="your-secret-here"  # Generate: openssl rand -base64 32
AUTH_URL="http://localhost:3000"

# Email (for development, use Ethereal)
USE_ETHEREAL_DEV="true"
SMTP_FROM="noreply@clickstay.local"

# PayMongo (use test keys)
PAYMONGO_PUBLIC_KEY="pk_test_your_key_here"
PAYMONGO_SECRET_KEY="sk_test_your_key_here"
PAYMONGO_WEBHOOK_SECRET="whsec_your_secret_here"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Generate AUTH_SECRET

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Git Bash / WSL:**
```bash
openssl rand -base64 32
```

### Get PayMongo Keys

1. Sign up at https://dashboard.paymongo.com/signup
2. Go to Developers → API Keys
3. Copy your test keys (pk_test_* and sk_test_*)
4. For webhook secret, create a webhook endpoint later

## Step 4: Start PostgreSQL Database

```bash
# Start PostgreSQL container
docker compose up -d

# Verify it's running
docker ps
```

You should see a container named `ecommerce-db-1` running on port 5432.

**Troubleshooting:**
- If port 5432 is in use, stop other PostgreSQL instances
- Check Docker Desktop is running
- View logs: `docker compose logs db`

## Step 5: Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed
```

**What gets created:**
- ✅ Database schema with all tables
- ✅ 3 rooms (Deluxe, Standard, Family Suite)
- ✅ 2 cottages (Premium, Standard)
- ✅ 1 function hall (Grand Function Hall)
- ✅ Rate plans for all facility types
- ✅ 30 days of inventory
- ✅ Admin user: `admin@clickstay.local`

**Expected output:**
```
🌱 Seeding database...
✅ Created admin user: admin@clickstay.local
✅ Created facility types
✅ Created 3 rooms
✅ Created 2 cottages
✅ Created function hall
✅ Created rate plans
✅ Created 180 inventory calendar entries
🎉 Seeding completed successfully!
```

## Step 6: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 15.0.0
- Local:        http://localhost:3000
- Environments: .env

✓ Ready in 2.5s
📧 Email transport: Ethereal test account created
   User: [generated-email]
   Pass: [generated-password]
```

## Step 7: Verify Installation

Open your browser and test these pages:

### Public Pages
- ✅ **Home:** http://localhost:3000
- ✅ **Browse Facilities:** http://localhost:3000/browse
- ✅ **Login:** http://localhost:3000/login

### Test Booking Flow
1. Go to http://localhost:3000/browse
2. Click "View Details & Book" on any facility
3. Click "Check Availability"
4. Fill in dates and guest info
5. Click "Proceed to Payment"

### Test Email (Development)
1. Try to sign in at http://localhost:3000/login
2. Enter any email address
3. Check server console for Ethereal preview URL
4. Click the URL to see the email

### Admin Dashboard
1. Open Prisma Studio: `npx prisma studio`
2. Navigate to User table
3. Find your user and set `role` to `ADMIN`
4. Visit http://localhost:3000/admin

## Common Issues & Solutions

### Issue: "Cannot find module 'next'"
**Solution:** Run `npm install` again

### Issue: "Port 3000 already in use"
**Solution:** 
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

### Issue: "Database connection failed"
**Solution:**
```bash
# Check Docker container is running
docker ps

# Restart container
docker compose restart

# Check logs
docker compose logs db
```

### Issue: "Prisma Client not generated"
**Solution:**
```bash
npm run prisma:generate
```

### Issue: Email not sending
**Solution:** Check `.env` has `USE_ETHEREAL_DEV="true"` and check server console for preview URLs

### Issue: TypeScript errors
**Solution:**
```bash
# Restart TypeScript server in VS Code
# Press Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Or rebuild
npm run build
```

## Production Deployment (Vercel)

### 1. Prepare Database

Use a managed PostgreSQL provider:
- **Vercel Postgres** (recommended)
- **Supabase** (free tier available)
- **Neon** (serverless Postgres)

Get your production `DATABASE_URL`.

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 3. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
DATABASE_URL=postgresql://[production-url]
AUTH_SECRET=[generate-new-secret]
AUTH_URL=https://your-domain.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
PAYMONGO_PUBLIC_KEY=pk_live_*
PAYMONGO_SECRET_KEY=sk_live_*
PAYMONGO_WEBHOOK_SECRET=whsec_*
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4. Run Migrations

```bash
# In Vercel project settings, add build command:
prisma generate && prisma migrate deploy && next build

# Or run manually after deploy:
npx prisma migrate deploy
npx prisma db seed
```

### 5. Configure PayMongo Webhook

1. Go to PayMongo Dashboard → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/paymongo`
3. Subscribe to events:
   - `source.chargeable`
   - `payment.paid`
   - `payment.failed`
4. Copy webhook secret to Vercel env vars

## Development Workflow

```bash
# Start dev server
npm run dev

# Run linting
npm run lint

# Format code
npx prettier --write .

# View database
npx prisma studio

# Reset database (⚠️ deletes all data)
npm run db:reset

# Create new migration
npx prisma migrate dev --name your_migration_name
```

## Project Structure Reference

```
clickstay/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin pages
│   │   ├── (public pages)     # Home, browse, etc.
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── status-badge.tsx
│   ├── lib/
│   │   ├── auth.ts            # Auth.js config
│   │   ├── prisma.ts          # Prisma client
│   │   ├── utils.ts           # Utilities
│   │   ├── availability.ts    # Availability logic
│   │   ├── pricing.ts         # Pricing logic
│   │   ├── email/             # Email service
│   │   └── payments/          # PayMongo
│   ├── schemas/               # Zod schemas
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Auth middleware
├── .env                       # Environment variables
├── docker-compose.yml         # PostgreSQL container
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── tailwind.config.ts         # Tailwind config
```

## Next Steps

1. ✅ Customize facility data in `prisma/seed.ts`
2. ✅ Add your own images (update photo URLs in seed)
3. ✅ Configure production SMTP provider
4. ✅ Set up PayMongo live keys
5. ✅ Customize branding (colors, logo)
6. ✅ Add more admin features as needed

## Support

For issues or questions:
- Check the main README.md
- Review the code comments
- Check Prisma docs: https://www.prisma.io/docs
- Check Next.js docs: https://nextjs.org/docs

---

**Installation complete!** 🎉 You're ready to start developing ClickStay.
