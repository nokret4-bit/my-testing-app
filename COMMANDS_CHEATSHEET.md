# 🚀 Commands Cheat Sheet

## Essential Commands (Run in Order)

### 1. Apply Database Migration
```bash
npx prisma migrate dev --name add_login_logs_and_staff_permissions
```
**What it does:** Creates LoginLog table, adds permissions & isActive to User table

### 2. Create Admin Account
```bash
npm run create-admin
```
**What it does:** Creates admin@manuelresort.com with password Admin@123456

### 3. Start Development Server
```bash
npm run dev
```
**What it does:** Starts server at http://localhost:3000

---

## Other Useful Commands

### Database Commands
```bash
# View database in browser
npx prisma studio

# Regenerate Prisma Client
npx prisma generate

# Check database schema
npx prisma db pull

# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset
```

### Development Commands
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Check for errors
npm run lint
```

### Troubleshooting Commands
```bash
# If migration fails, try:
npx prisma migrate reset
npx prisma migrate dev

# If TypeScript errors persist:
npx prisma generate
# Then restart your IDE

# If admin creation fails:
npx prisma studio
# Check if user already exists
```

---

## Quick Access URLs

### Public Pages
- Home: http://localhost:3000
- Login: http://localhost:3000/login
- Browse: http://localhost:3000/browse

### Admin Pages (Login Required)
- Dashboard: http://localhost:3000/admin
- Reservations: http://localhost:3000/admin/reservations
- Facilities: http://localhost:3000/admin/facilities
- Pricing: http://localhost:3000/admin/pricing
- Reports: http://localhost:3000/admin/reports
- **Staff Management:** http://localhost:3000/admin/staff
- **Login Logs:** http://localhost:3000/admin/login-logs

---

## Default Admin Credentials

```
Email:    admin@manuelresort.com
Password: Admin@123456
```

**⚠️ Change password after first login!**

---

## File Locations

### Documentation
- `START_HERE_ADMIN.md` - **Start here!**
- `SETUP_ADMIN.md` - Setup guide
- `ADMIN_QUICK_REFERENCE.md` - Feature reference
- `MIGRATION_GUIDE.md` - Migration details
- `IMPLEMENTATION_SUMMARY.md` - Technical overview

### Scripts
- `scripts/create-admin.js` - Create admin user

### Key Files Modified
- `prisma/schema.prisma` - Database schema
- `src/lib/auth.ts` - Login logging
- `src/components/navbar.tsx` - Removed "My Bookings" for admin
- `src/app/page.tsx` - Added Booking Checker

---

## Quick Fixes

### "Cannot access admin"
```bash
npm run create-admin
```

### "TypeScript errors"
```bash
npx prisma generate
```

### "Migration failed"
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### "Database connection error"
Check `.env` file for `DATABASE_URL`

---

## Feature Checklist

After setup, verify:
- [ ] Can login as admin
- [ ] "My Bookings" hidden in navbar
- [ ] Booking Checker on home page
- [ ] Staff Management accessible
- [ ] Login Logs accessible
- [ ] Edit buttons on bookings
- [ ] Delete buttons on bookings

---

## Support

Need help? Check:
1. `START_HERE_ADMIN.md` - Visual guide
2. `SETUP_ADMIN.md` - Detailed setup
3. Error messages in terminal
4. Browser console (F12)

---

**Quick Start:** Run these 3 commands, then login!
```bash
npx prisma migrate dev --name add_login_logs_and_staff_permissions
npm run create-admin
npm run dev
```
