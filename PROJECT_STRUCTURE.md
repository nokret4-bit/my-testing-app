# Manuel Online Booking - Clean Project Structure

## 📁 Project Organization

```
Manuel Online Booking/
├── 📁 src/                    # Application source code
│   ├── app/                   # Next.js App Router pages & API routes
│   ├── components/            # React components
│   ├── lib/                   # Core libraries (auth, prisma, email, payments)
│   ├── schemas/               # Zod validation schemas
│   └── types/                 # TypeScript type definitions
│
├── 📁 prisma/                 # Database
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed_simple.ts         # Database seeding script
│
├── 📁 scripts/                # Utility scripts
│   ├── create-admin.js        # Create admin user
│   ├── create-cashier.js      # Create cashier user
│   └── test-email.ts          # Test email configuration
│
├── 📁 docs/                   # All documentation (34 files)
│   └── *.md                   # Setup guides, changelogs, etc.
│
├── 📁 public/                 # Static assets
│
├── 📄 .env                    # Environment variables (DO NOT COMMIT)
├── 📄 .env.example            # Environment template
├── 📄 README.md               # Main documentation
├── 📄 package.json            # Dependencies & scripts
├── 📄 docker-compose.yml      # PostgreSQL database
├── 📄 update-env.ps1          # Quick .env updater
└── 📄 tsconfig.json           # TypeScript configuration
```

## 🚀 Quick Start Commands

### Database
```bash
docker compose up -d              # Start PostgreSQL
npm run prisma:migrate            # Run migrations
npm run prisma:seed               # Seed database
```

### Development
```bash
npm install                       # Install dependencies
npm run dev                       # Start dev server (http://localhost:3000)
```

### Admin Setup
```bash
npm run create-admin              # Create admin user
```

### Testing
```bash
npm run test-email                # Test email configuration
```

## 🔑 Admin Login

**Email:** `admin@clickstay.local`  
**Password:** `admin123`

## 📝 Environment Variables

Edit `.env` file or run `.\update-env.ps1` to update:

```env
DATABASE_URL="postgresql://postgres:admin@localhost:5433/clickstay1"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# PayMongo (GCash payments)
PAYMONGO_SECRET_KEY="sk_test_xxx"
PAYMONGO_PUBLIC_KEY="pk_test_xxx"
```

## 🗂️ Key Files to Know

### Configuration
- **`.env`** - Environment variables (database, email, PayMongo)
- **`prisma/schema.prisma`** - Database schema
- **`docker-compose.yml`** - Database configuration

### Source Code
- **`src/app/`** - Pages and API routes
- **`src/lib/prisma.ts`** - Database client
- **`src/lib/auth.ts`** - Authentication
- **`src/lib/email/`** - Email service
- **`src/lib/payments/`** - PayMongo integration

### Scripts
- **`update-env.ps1`** - Update environment variables
- **`scripts/create-admin.js`** - Create admin user
- **`cleanup-project.ps1`** - Clean up project (already run)

## 🐛 Common Issues & Fixes

### Database Connection Error
```bash
# 1. Check if database is running
docker compose ps

# 2. Start database
docker compose up -d

# 3. Verify .env has correct DATABASE_URL
# Port: 5433, Password: admin, Database: clickstay1
```

### Admin Can't Login
```bash
# Reset admin password
npm run create-admin
```

### Payment Errors
- Check PayMongo keys in `.env`
- See server logs for detailed error messages
- Verify keys at https://dashboard.paymongo.com/

## 📚 Documentation

All detailed documentation is now in the `docs/` folder:
- Setup guides
- Feature documentation
- Troubleshooting
- API references

## 🧹 Project Maintenance

The project has been cleaned up:
- ✅ All documentation moved to `docs/` folder
- ✅ Obsolete scripts removed
- ✅ Duplicate files removed
- ✅ Clean root directory

To re-run cleanup: `.\cleanup-project.ps1`

## 🆘 Need Help?

1. Check `README.md` for overview
2. Check `docs/` folder for detailed guides
3. Check server logs for error details
4. Verify `.env` configuration

---

**Last Updated:** October 20, 2025  
**Status:** ✅ Clean and organized
