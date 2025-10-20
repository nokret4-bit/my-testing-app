# ClickStay - Project Index

Quick reference guide to navigate the ClickStay codebase.

## 📚 Documentation

| File | Purpose |
|------|---------|
| [README.md](README.md) | Main project documentation |
| [INSTALLATION.md](INSTALLATION.md) | Detailed installation guide |
| [QUICKSTART.md](QUICKSTART.md) | 5-minute quick start |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Technical overview & architecture |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Production deployment guide |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [LICENSE](LICENSE) | MIT License |

## 🗂️ Project Structure

### Configuration Files

```
Root Directory
├── .env.example              # Environment variables template
├── .env.local.example        # Local development template
├── .nvmrc                    # Node version (20.18.0)
├── .node-version             # Node version for asdf
├── .npmrc                    # npm configuration
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── next.config.mjs           # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── postcss.config.mjs        # PostCSS configuration
├── .eslintrc.json            # ESLint rules
├── .prettierrc               # Prettier formatting
├── docker-compose.yml        # PostgreSQL container
├── vercel.json               # Vercel deployment config
└── .gitignore                # Git ignore rules
```

### Database

```
prisma/
├── schema.prisma             # Database schema (15 models)
└── seed.ts                   # Sample data seeding script
```

**Key Models:**
- User, Account, Session (Auth)
- FacilityType, FacilityUnit (Facilities)
- RatePlan, InventoryCalendar (Pricing)
- Booking, Payment (Transactions)
- AuditLog, Notification (Logging)

### Source Code

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   ├── admin/                # Admin Dashboard
│   ├── (public pages)        # User-facing pages
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
│
├── components/               # React Components
│   ├── ui/                   # shadcn/ui components
│   ├── navbar.tsx            # Site navigation
│   ├── footer.tsx            # Site footer
│   └── status-badge.tsx      # Booking status display
│
├── lib/                      # Core Libraries
│   ├── auth.ts               # Auth.js configuration
│   ├── prisma.ts             # Prisma client
│   ├── utils.ts              # Utility functions
│   ├── availability.ts       # Availability logic
│   ├── pricing.ts            # Pricing logic
│   ├── email/                # Email service
│   └── payments/             # PayMongo integration
│
├── schemas/                  # Zod Validation
│   ├── booking.ts            # Booking schemas
│   ├── payment.ts            # Payment schemas
│   └── admin.ts              # Admin schemas
│
├── types/                    # TypeScript Types
│   ├── index.ts              # Common types
│   └── next-auth.d.ts        # Auth type extensions
│
└── middleware.ts             # Auth middleware
```

## 🔌 API Endpoints

### Public API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/facilities` | GET | List facilities with availability |
| `/api/bookings/quote` | POST | Get price quote |
| `/api/bookings` | POST | Create booking |
| `/api/bookings` | GET | List user bookings |
| `/api/bookings/:id` | GET | Get booking details |
| `/api/bookings/:id/cancel` | POST | Cancel booking |
| `/api/payments/create` | POST | Create payment intent |
| `/api/webhooks/paymongo` | POST | PayMongo webhook |

**Files:**
- `src/app/api/facilities/route.ts`
- `src/app/api/bookings/route.ts`
- `src/app/api/bookings/quote/route.ts`
- `src/app/api/bookings/[id]/route.ts`
- `src/app/api/bookings/[id]/cancel/route.ts`
- `src/app/api/payments/create/route.ts`
- `src/app/api/webhooks/paymongo/route.ts`

### Admin API (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/facilities` | GET/POST | Manage facilities |
| `/api/admin/facilities/:id` | PATCH/DELETE | Update/delete facility |
| `/api/admin/rates` | GET/POST | Manage rate plans |
| `/api/admin/availability` | GET/POST | Manage blocks |
| `/api/admin/reservations` | GET | List all bookings |
| `/api/admin/reports` | GET | Generate reports |
| `/api/admin/export` | GET | Export CSV |

**Files:**
- `src/app/api/admin/facilities/route.ts`
- `src/app/api/admin/facilities/[id]/route.ts`
- `src/app/api/admin/rates/route.ts`
- `src/app/api/admin/availability/route.ts`
- `src/app/api/admin/reservations/route.ts`
- `src/app/api/admin/reports/route.ts`
- `src/app/api/admin/export/route.ts`

## 🌐 Pages

### Public Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `src/app/page.tsx` | Home page |
| `/browse` | `src/app/browse/page.tsx` | Facility listing |
| `/unit/:id` | `src/app/unit/[id]/page.tsx` | Facility details |
| `/checkout` | `src/app/checkout/page.tsx` | Booking form |
| `/booking/:code` | `src/app/booking/[code]/page.tsx` | Booking details |
| `/bookings` | `src/app/bookings/page.tsx` | User bookings list |
| `/login` | `src/app/login/page.tsx` | Sign in page |
| `/login/verify` | `src/app/login/verify/page.tsx` | Email verification |

### Admin Pages

| Route | File | Description |
|-------|------|-------------|
| `/admin` | `src/app/admin/page.tsx` | Dashboard |
| `/admin/reservations` | `src/app/admin/reservations/page.tsx` | All bookings |
| `/admin/facilities` | `src/app/admin/facilities/page.tsx` | Facility management |
| `/admin/reports` | `src/app/admin/reports/page.tsx` | Reports |

## 🧩 Components

### UI Components (shadcn/ui)

Located in `src/components/ui/`:
- `button.tsx` - Button component
- `card.tsx` - Card container
- `input.tsx` - Form input
- `label.tsx` - Form label
- `badge.tsx` - Status badge
- `toast.tsx` - Toast notifications
- `use-toast.ts` - Toast hook
- `toaster.tsx` - Toast provider

### Custom Components

Located in `src/components/`:
- `navbar.tsx` - Site navigation with auth
- `footer.tsx` - Site footer
- `status-badge.tsx` - Booking status display

## 📦 Core Libraries

### Authentication
**File:** `src/lib/auth.ts`
- Auth.js configuration
- Email provider setup
- Session management
- Role checking utilities

### Database
**File:** `src/lib/prisma.ts`
- Prisma client singleton
- Connection pooling

### Email Service
**Files:** `src/lib/email/`
- `transport.ts` - Nodemailer setup
- `templates.tsx` - React Email templates
- `ics.ts` - Calendar invite generator

### Payment Integration
**File:** `src/lib/payments/paymongo.ts`
- PayMongo API client
- Payment intent creation
- Webhook verification
- Status checking

### Business Logic
**Files:**
- `src/lib/availability.ts` - Availability checking
- `src/lib/pricing.ts` - Price calculation
- `src/lib/utils.ts` - Utility functions

## 🔐 Validation Schemas

Located in `src/schemas/`:
- `booking.ts` - Booking validation
- `payment.ts` - Payment validation
- `admin.ts` - Admin operation validation

## 📝 Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
npm run db:reset         # Reset database

# Utilities
npx prisma studio        # Open database GUI
npx kill-port 3000       # Kill process on port 3000
```

## 🔧 Environment Variables

### Development
See `.env.example` or `.env.local.example`

### Production
See `DEPLOYMENT_CHECKLIST.md` for full list

### Required Variables
- `DATABASE_URL` - PostgreSQL connection
- `AUTH_SECRET` - Auth.js secret
- `AUTH_URL` - App URL
- `SMTP_*` - Email configuration
- `PAYMONGO_*` - Payment keys
- `NEXT_PUBLIC_APP_URL` - Public app URL

## 🎨 Styling

### Tailwind Configuration
**File:** `tailwind.config.ts`
- Custom color scheme
- Dark mode setup
- Component variants

### Global Styles
**File:** `src/app/globals.css`
- CSS variables
- Dark mode colors
- Base styles

## 🧪 Testing

### Manual Testing
See `INSTALLATION.md` Step 7

### Recommended Tools
- Prisma Studio - Database inspection
- Postman/Insomnia - API testing
- Browser DevTools - Frontend debugging

## 📊 Database Schema

### Main Tables
1. **User** - User accounts
2. **FacilityType** - Room/Cottage/Hall types
3. **FacilityUnit** - Individual facilities
4. **RatePlan** - Pricing rules
5. **Booking** - Reservations
6. **Payment** - Transactions
7. **InventoryCalendar** - Availability tracking

See `prisma/schema.prisma` for full schema

## 🚀 Deployment

### Vercel (Recommended)
See `DEPLOYMENT_CHECKLIST.md`

### Database Providers
- Vercel Postgres
- Supabase
- Neon
- Railway

## 🐛 Troubleshooting

### Common Issues
See `INSTALLATION.md` - "Common Issues & Solutions"

### Logs
- Server logs: Check terminal
- Database logs: `docker compose logs db`
- Build logs: Vercel dashboard

## 📖 Learning Resources

### Technologies Used
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Auth.js Docs](https://authjs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [PayMongo Docs](https://developers.paymongo.com)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

**Quick Links:**
- [Get Started](QUICKSTART.md) - 5-minute setup
- [Installation](INSTALLATION.md) - Detailed guide
- [Deploy](DEPLOYMENT_CHECKLIST.md) - Production deployment
- [Architecture](PROJECT_SUMMARY.md) - Technical details

**Need Help?**
- Check documentation files
- Review code comments
- Open an issue on GitHub
