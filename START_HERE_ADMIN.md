# 🎯 START HERE - Admin Setup Guide

## ⚡ Quick Start (Copy & Paste These Commands)

Open your terminal in the project folder and run these commands **in order**:

### 1️⃣ Apply Database Changes
```bash
npx prisma migrate dev --name add_login_logs_and_staff_permissions
```
**Wait for it to complete** ✅

### 2️⃣ Create Admin Account
```bash
npm run create-admin
```
**You'll see admin credentials** 📧

### 3️⃣ Start Development Server
```bash
npm run dev
```
**Server starts on http://localhost:3000** 🚀

### 4️⃣ Login as Admin
- Open: http://localhost:3000/login
- Email: `admin@manuelresort.com`
- Password: `Admin@123456`

---

## ✨ What You'll See After Login

### Navbar Changes:
```
Before: [Browse Facilities] [My Bookings] [Admin Dashboard] [Sign Out]
After:  [Browse Facilities] [Admin Dashboard] [Sign Out]
        ↑ "My Bookings" is GONE for admin users
```

### Admin Dashboard - New Cards:
```
┌─────────────────┬─────────────────┬─────────────────┐
│  Reservations   │   Facilities    │     Pricing     │
├─────────────────┼─────────────────┼─────────────────┤
│     Reports     │ Staff Mgmt 🆕   │  Login Logs 🆕  │
└─────────────────┴─────────────────┴─────────────────┘
```

### Home Page - New Section:
```
┌──────────────────────────────────────────────┐
│         🔍 Booking Checker                   │
│  ┌────────────────────────────────────────┐  │
│  │ Enter Booking ID: [____________] [Check]│  │
│  └────────────────────────────────────────┘  │
│  Check your booking without logging in!      │
└──────────────────────────────────────────────┘
```

---

## 🎮 Try These Features Now

### Feature 1: Staff Management
1. Click **"Staff Management"** in admin dashboard
2. Click **"Create Staff Account"** button
3. Fill in:
   - Name: `Test Staff`
   - Email: `staff@test.com`
   - Password: `Staff@123`
   - Role: `Staff`
   - Enable some permissions
4. Click **"Create Account"**
5. ✅ Staff created!

### Feature 2: Login Logs
1. Click **"Login Logs"** in admin dashboard
2. See your login entry with:
   - Date & Time
   - Your email
   - Role: ADMIN
   - Success status
3. ✅ Login tracked!

### Feature 3: Edit Booking
1. Go to **"Reservations"**
2. Find any booking
3. Click **"Edit"** button
4. Change customer name or dates
5. Click **"Update Booking"**
6. ✅ Booking updated!

### Feature 4: Booking Checker
1. Go to home page (http://localhost:3000)
2. Scroll to **"Booking Checker"** section
3. Enter a booking code (e.g., from reservations page)
4. Click **"Check"**
5. View booking details
6. ✅ Works without login!

---

## 🔥 Common Issues & Solutions

### Issue: "Cannot run migration"
**Solution:**
```bash
# Check if database is running
npx prisma db pull

# If that works, try migration again
npx prisma migrate dev --name add_login_logs_and_staff_permissions
```

### Issue: "Admin already exists"
**Solution:**
The script detected an existing admin. Use those credentials to login, or check the console output for details.

### Issue: "Can't see Edit/Delete buttons"
**Solution:**
- Make sure you're logged in as **ADMIN** (not STAFF)
- These buttons only appear for admin users
- Staff users won't see them

### Issue: "TypeScript errors everywhere"
**Solution:**
```bash
# Regenerate Prisma Client
npx prisma generate

# Restart your IDE
# Then restart dev server
npm run dev
```

### Issue: "Login Logs page is empty"
**Solution:**
- Login logs only track ADMIN and STAFF logins
- Guest user logins are not tracked
- Make sure you logged in as admin/staff

---

## 📊 Feature Access Matrix

| Feature | Guest | Staff | Admin |
|---------|-------|-------|-------|
| My Bookings | ✅ Yes | ❌ No | ❌ No |
| Booking Checker | ✅ Yes | ✅ Yes | ✅ Yes |
| View Reservations | ❌ No | ✅ Yes* | ✅ Yes |
| Edit Bookings | ❌ No | ❌ No | ✅ Yes |
| Delete Bookings | ❌ No | ❌ No | ✅ Yes |
| Staff Management | ❌ No | ❌ No | ✅ Yes |
| Login Logs | ❌ No | ❌ No | ✅ Yes |

*Staff access depends on permissions

---

## 🎨 Visual Guide to New Features

### 1. Home Page - Booking Checker
**Location:** Between hero section and features
```
┌─────────────────────────────────────────────────┐
│  Welcome to Manuel Resort                       │
│  [Search facilities...]                         │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  🔍 Booking Checker                        🆕   │
│  Enter your Booking ID to view details          │
│  [BK-ABC123________________] [Check]             │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  Why Choose ClickStay?                          │
│  [Features grid...]                             │
└─────────────────────────────────────────────────┘
```

### 2. Admin Dashboard - New Cards
```
Admin Dashboard
├── Reservations
├── Facilities  
├── Pricing
├── Reports
├── 🆕 Staff Management (Admin Only)
└── 🆕 Login Logs (Admin Only)
```

### 3. Reservations Page - New Buttons
```
Booking: BK-ABC123
Customer: John Doe
[View Details] [Edit 🆕] [Void/Delete 🆕]
                 ↑ Admin only buttons
```

---

## 🔐 Security Notes

### Default Admin Credentials:
```
Email:    admin@manuelresort.com
Password: Admin@123456
```

**⚠️ IMPORTANT:** Change this password immediately after first login!

### Password Requirements:
- Minimum 8 characters
- Mix of letters and numbers recommended
- Special characters allowed

### Staff Permissions:
When creating staff, you can control:
- ✓ View Bookings
- ✓ Manage Bookings
- ✓ View Facilities
- ✓ Manage Facilities
- ✓ View Reports
- ✓ Manage Pricing

Admin users have ALL permissions automatically.

---

## 📝 Next Steps

After setup, you should:

1. **Change Admin Password**
   - Important for security
   - Use a strong, unique password

2. **Create Staff Accounts**
   - Add your team members
   - Assign appropriate permissions
   - Test staff login

3. **Test All Features**
   - Use the checklist in `SETUP_ADMIN.md`
   - Verify everything works
   - Report any issues

4. **Configure Email** (if not done)
   - Set up SMTP settings
   - Test booking confirmations
   - Test cancellation emails

5. **Review Documentation**
   - `ADMIN_QUICK_REFERENCE.md` - Daily use guide
   - `IMPLEMENTATION_SUMMARY.md` - Technical details
   - `MIGRATION_GUIDE.md` - Database info

---

## 🎉 Success Checklist

- [ ] Migration completed without errors
- [ ] Admin account created
- [ ] Logged in successfully
- [ ] See "Admin Dashboard" button in navbar
- [ ] "My Bookings" is hidden
- [ ] Can access Staff Management
- [ ] Can access Login Logs
- [ ] Can see Edit/Delete buttons in Reservations
- [ ] Booking Checker works on home page
- [ ] Created a test staff account

---

## 🆘 Still Having Issues?

### Check These:
1. Database is running
2. `.env` file has correct `DATABASE_URL`
3. Ran migration successfully
4. Restarted dev server after migration
5. Using correct admin credentials

### Get Help:
- Review error messages carefully
- Check browser console for errors
- Verify database connection
- Try `npx prisma studio` to inspect database

---

## 🚀 You're Ready!

Your admin panel is now fully enhanced. Start by logging in and exploring the new features!

**Login URL:** http://localhost:3000/login

**Happy Managing! 🎊**
