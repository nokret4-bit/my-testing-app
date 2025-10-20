# Quick Start - Apply Database Changes

## Step 1: Run Prisma Migration

Open your terminal in the project root directory and run:

```bash
npx prisma migrate dev --name add_login_logs_and_staff_permissions
```

This command will:
1. Create a new migration file
2. Apply the database schema changes
3. Regenerate the Prisma Client

## Step 2: Verify the Migration

After the migration completes, you should see:
- ✅ New `LoginLog` table created
- ✅ `User` table updated with `permissions` and `isActive` columns
- ✅ Prisma Client regenerated

## Step 3: Restart Your Development Server

Stop your current dev server (Ctrl+C) and restart it:

```bash
npm run dev
```

## Step 4: Test the New Features

1. **Home Page - Booking Checker:**
   - Visit http://localhost:3000
   - Look for the "Booking Checker" section
   - Enter a valid booking code to test

2. **Admin Panel - Login Logs:**
   - Login as an admin user
   - Visit http://localhost:3000/admin/login-logs
   - You should see your login entry

3. **Admin Panel - Staff Management:**
   - Visit http://localhost:3000/admin/staff
   - Click "Create Staff Account"
   - Fill in the form and create a test staff member

4. **Admin Panel - Edit/Delete Bookings:**
   - Visit http://localhost:3000/admin/reservations
   - You should see "Edit" and "Void/Delete" buttons for each booking

## Troubleshooting

### If migration fails:

1. **Check database connection:**
   ```bash
   npx prisma db pull
   ```

2. **Reset database (WARNING: deletes all data):**
   ```bash
   npx prisma migrate reset
   ```

3. **Generate Prisma Client manually:**
   ```bash
   npx prisma generate
   ```

### If you see TypeScript errors:

1. Restart your IDE/editor
2. Run `npm run build` to check for compilation errors
3. Make sure Prisma Client is regenerated

## What Changed?

### Database Schema:
- **User table:** Added `permissions` (JSON) and `isActive` (Boolean) columns
- **LoginLog table:** New table to track login activities

### New Features:
1. Booking Checker on home page (no login required)
2. Login Logs page (admin only)
3. Staff Management page (admin only)
4. Edit/Delete booking features (admin only)
5. "My Bookings" removed from admin/staff navbar

## Need Help?

See the detailed documentation:
- `IMPLEMENTATION_SUMMARY.md` - Complete overview of all changes
- `MIGRATION_GUIDE.md` - Detailed migration instructions
