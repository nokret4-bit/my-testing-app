# Setup Admin Account - Quick Guide

## 🚀 Quick Setup (3 Steps)

### Step 1: Apply Database Migration

First, apply the database changes:

```bash
npx prisma migrate dev --name add_login_logs_and_staff_permissions
```

This will:
- Create the `LoginLog` table
- Add `permissions` and `isActive` fields to `User` table
- Fix all TypeScript errors

### Step 2: Create Admin Account

Run the admin creation script:

```bash
npm run create-admin
```

This will create an admin user with:
- **Email:** `admin@manuelresort.com`
- **Password:** `Admin@123456`
- **Role:** ADMIN

### Step 3: Login

1. Start your development server (if not running):
   ```bash
   npm run dev
   ```

2. Go to: http://localhost:3000/login

3. Login with:
   - Email: `admin@manuelresort.com`
   - Password: `Admin@123456`

4. **Important:** Change your password after first login!

---

## ✅ After Login

You should now see:

### In the Navbar:
- ✅ "Admin Dashboard" button (instead of "My Bookings")
- ✅ No "My Bookings" link (removed for admin)

### In Admin Dashboard:
- ✅ Reservations
- ✅ Facilities
- ✅ Pricing
- ✅ Reports
- ✅ **Staff Management** (NEW - admin only)
- ✅ **Login Logs** (NEW - admin only)

### In Reservations Page:
- ✅ **Edit** button on each booking (admin only)
- ✅ **Void/Delete** button on each booking (admin only)

### On Home Page:
- ✅ **Booking Checker** section (public access)

---

## 🔧 Troubleshooting

### "Cannot access admin panel"
- Make sure you ran the migration first
- Verify you're logged in with the admin account
- Check the user role in the database

### "Script fails to create admin"
- Ensure database is running
- Check `.env` file has correct `DATABASE_URL`
- Run `npx prisma db push` to sync schema

### "Admin already exists"
- The script will tell you if admin exists
- Use the existing credentials to login
- Or update the email in `scripts/create-admin.js`

### "TypeScript errors"
- Run the migration first: `npx prisma migrate dev`
- Restart your IDE/editor
- Run `npx prisma generate` manually if needed

---

## 🔐 Change Default Password

After first login:

1. Go to `/admin/staff`
2. Find your admin account
3. Click "Edit"
4. Update your details
5. For password change, you may need to use database tools or create a password change feature

**Recommended:** Change the password in the database directly:

```bash
npx prisma studio
```

Then update the `passwordHash` field with a new bcrypt hash.

---

## 👥 Create Additional Staff

Once logged in as admin:

1. Go to **Admin Dashboard** → **Staff Management**
2. Click **"Create Staff Account"**
3. Fill in the form:
   - Name
   - Email
   - Password
   - Role (Staff or Admin)
   - Permissions (if Staff)
4. Click **"Create Account"**

---

## 📋 Test All New Features

### 1. Booking Checker (Home Page)
- Go to http://localhost:3000
- Find "Booking Checker" section
- Enter a valid booking code
- Test viewing and cancelling

### 2. Login Logs
- Go to http://localhost:3000/admin/login-logs
- Verify your login is recorded
- Check date, time, IP address

### 3. Staff Management
- Go to http://localhost:3000/admin/staff
- Create a test staff account
- Edit permissions
- Test deactivating account

### 4. Edit Booking
- Go to http://localhost:3000/admin/reservations
- Click "Edit" on any booking
- Modify details
- Save changes

### 5. Delete Booking
- Go to http://localhost:3000/admin/reservations
- Click "Void/Delete" on a test booking
- Confirm deletion
- Verify it's removed

---

## 🎯 What's Different Now?

### For Admin Users:
- ❌ No "My Bookings" in navbar
- ✅ Can manage staff accounts
- ✅ Can view login logs
- ✅ Can edit bookings
- ✅ Can delete bookings
- ✅ Full access to all features

### For Staff Users:
- ❌ No "My Bookings" in navbar
- ❌ Cannot manage staff
- ❌ Cannot view login logs
- ❌ Cannot edit/delete bookings
- ✅ Access based on permissions

### For Guest Users:
- ✅ Can see "My Bookings"
- ✅ Can use Booking Checker
- ✅ Can cancel own bookings
- ❌ No admin access

---

## 📞 Need Help?

Check these files:
- `MIGRATION_GUIDE.md` - Detailed migration steps
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `ADMIN_QUICK_REFERENCE.md` - Admin feature guide
- `CHANGES_OVERVIEW.md` - Visual overview

---

## 🔄 Complete Setup Checklist

- [ ] Run database migration
- [ ] Create admin account
- [ ] Login successfully
- [ ] Access admin dashboard
- [ ] Test Staff Management
- [ ] Test Login Logs
- [ ] Test Edit Booking
- [ ] Test Delete Booking
- [ ] Test Booking Checker on home page
- [ ] Verify "My Bookings" removed from admin navbar
- [ ] Change default admin password

---

## 🎉 You're All Set!

Your admin panel is now fully enhanced with:
- ✅ Booking Checker for customers
- ✅ Login activity tracking
- ✅ Staff management system
- ✅ Booking edit/delete capabilities
- ✅ Role-based access control

Enjoy your upgraded booking system! 🚀
