# ClickStay - Quick Start (5 Minutes)

Get ClickStay running in 5 minutes with these commands.

## Prerequisites

- Node.js 20.18.0 (install via nvm)
- Docker Desktop running
- Windows with PowerShell or Git Bash

## Installation Commands

```bash
# 1. Use correct Node version
nvm install 20.18.0
nvm use 20.18.0

# 2. Install dependencies
cd c:/Users/PC/Desktop/Ecommerce
npm install

# 3. Setup environment
cp .env.example .env

# 4. Generate AUTH_SECRET (PowerShell)
# Copy the output and paste into .env as AUTH_SECRET
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# 5. Start PostgreSQL
docker compose up -d

# 6. Setup database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 7. Start dev server
npm run dev
```

## Open in Browser

- **Home:** http://localhost:3000
- **Browse:** http://localhost:3000/browse
- **Admin:** http://localhost:3000/admin (after promoting user to admin)

## Default Admin User

Email: `admin@clickstay.local`

To sign in:
1. Go to http://localhost:3000/login
2. Enter `admin@clickstay.local`
3. Check server console for email preview URL
4. Click the magic link

## Test Booking

1. Browse facilities: http://localhost:3000/browse
2. Select a facility
3. Click "Check Availability"
4. Fill dates and guest info
5. Proceed to payment (test mode)

## Environment Variables

Edit `.env` and set:

```env
# Required
AUTH_SECRET="[generated-from-step-4]"
USE_ETHEREAL_DEV="true"

# Optional (for production)
PAYMONGO_PUBLIC_KEY="pk_test_xxx"
PAYMONGO_SECRET_KEY="sk_test_xxx"
```

## Common Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run prisma:studio    # Open database GUI
npm run db:reset         # Reset database
docker compose logs db   # View database logs
```

## Troubleshooting

**Port 3000 in use?**
```bash
npx kill-port 3000
```

**Database connection error?**
```bash
docker compose restart
```

**TypeScript errors?**
```bash
npm run prisma:generate
```

## What's Included

- ✅ 6 sample facilities (rooms, cottages, hall)
- ✅ 30 days of inventory
- ✅ Rate plans with pricing
- ✅ Admin user account
- ✅ Email templates
- ✅ Payment integration (test mode)

## Next Steps

See **INSTALLATION.md** for detailed setup instructions and **README.md** for full documentation.

---

**Ready to go!** 🚀
