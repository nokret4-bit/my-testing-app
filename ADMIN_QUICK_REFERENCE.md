# Admin Quick Reference Card

## 🔑 Admin-Only Features

### Staff Management
**Location:** Admin Dashboard → Staff Management  
**URL:** `/admin/staff`

**Actions:**
- ➕ Create new staff accounts
- ✏️ Edit staff details and permissions
- 🔒 Activate/deactivate accounts
- 🗑️ Delete staff accounts

**Staff Permissions:**
- View Bookings
- Manage Bookings
- View Facilities
- Manage Facilities
- View Reports
- Manage Pricing

---

### Login Logs
**Location:** Admin Dashboard → Login Logs  
**URL:** `/admin/login-logs`

**Information Shown:**
- Date & Time
- User Name
- Email
- Role
- IP Address
- Success/Failure Status

**Note:** Shows last 100 login entries

---

### Edit Bookings
**Location:** Admin Dashboard → Reservations → Edit button  
**URL:** `/admin/reservations`

**Can Edit:**
- Customer name, email, phone
- Check-in and check-out dates
- Booking status
- Special requests

**Note:** Only admins can edit (not staff)

---

### Delete Bookings
**Location:** Admin Dashboard → Reservations → Void/Delete button  
**URL:** `/admin/reservations`

**Warning:** 
- Permanently removes booking record
- Deletes related payments and audit logs
- Cannot be undone
- Requires confirmation

**Note:** Only admins can delete (not staff)

---

## 👥 User Access Levels

### ADMIN
- Full access to all features
- Can create/edit/delete staff
- Can edit/delete bookings
- Can view login logs

### STAFF
- Access based on assigned permissions
- Cannot edit/delete bookings
- Cannot manage other staff
- Cannot view login logs

### GUEST
- Can view "My Bookings"
- Can use Booking Checker
- Can cancel own bookings

---

## 🏠 Public Features

### Booking Checker
**Location:** Home Page (below search bar)  
**URL:** `/` (home page)

**How to Use:**
1. Enter Booking ID
2. Click "Check"
3. View booking details
4. Cancel if needed

**Note:** No login required - anyone with a booking code can use this

---

## 🔒 Security Notes

1. **Cannot delete yourself:** Admin cannot delete their own account
2. **All actions logged:** Staff and booking changes are recorded in audit logs
3. **Failed logins tracked:** Security monitoring for unauthorized access attempts
4. **Role-based access:** Features automatically hidden based on user role

---

## 📋 Common Tasks

### Create a Staff Member
1. Go to `/admin/staff`
2. Click "Create Staff Account"
3. Fill in name, email, password
4. Select role (Staff or Admin)
5. Set permissions (if Staff)
6. Click "Create Account"

### Edit a Booking
1. Go to `/admin/reservations`
2. Find the booking
3. Click "Edit" button
4. Modify details
5. Click "Update Booking"

### View Login Activity
1. Go to `/admin/login-logs`
2. Review recent login entries
3. Check for failed attempts
4. Monitor user activity

### Deactivate a Staff Member
1. Go to `/admin/staff`
2. Find the staff member
3. Click "Edit"
4. Toggle "Account Active" to OFF
5. Click "Update Account"

---

## 🆘 Troubleshooting

### Staff can't access a feature?
- Check their permissions in Staff Management
- Verify their account is active
- Confirm they have the correct role

### Can't see Edit/Delete buttons?
- These are admin-only features
- Staff users cannot see these buttons
- Login with an admin account

### Login not appearing in logs?
- Only admin and staff logins are logged
- Guest user logins are not tracked
- Check if you're logged in as admin/staff

---

## 📞 Quick Links

- Admin Dashboard: `/admin`
- Reservations: `/admin/reservations`
- Staff Management: `/admin/staff`
- Login Logs: `/admin/login-logs`
- Facilities: `/admin/facilities`
- Pricing: `/admin/pricing`
- Reports: `/admin/reports`

---

## 💡 Tips

1. **Regular Monitoring:** Check login logs weekly for security
2. **Staff Permissions:** Give staff minimum required permissions
3. **Booking Edits:** Use sparingly - log why you edited
4. **Staff Accounts:** Deactivate instead of delete when possible
5. **Backup First:** Before deleting bookings, ensure you have backups

---

## 🔄 Updates Applied

Date: [Current Date]  
Version: 2.0  
Changes: Admin panel enhancements implemented

**New Features:**
- ✅ Booking Checker on home page
- ✅ Login Logs tracking
- ✅ Staff Management system
- ✅ Edit/Delete booking capabilities
- ✅ Removed "My Bookings" from admin navbar
