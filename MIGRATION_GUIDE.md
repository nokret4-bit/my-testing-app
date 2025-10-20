# Migration Guide - Admin Panel Enhancements

This guide explains how to apply the database changes for the new admin panel features.

## Changes Made

### 1. **Removed "My Booking" from Admin Panel**
   - Admin and Staff users no longer see "My Bookings" in the navbar
   - Only regular GUEST users can access the `/bookings` page

### 2. **Booking Checker on Home Page**
   - Added a new "Booking Checker" section on the home page
   - Users can enter their Booking ID to view details or cancel bookings
   - No login required - accessible to anyone with a booking code

### 3. **Login Logs**
   - New admin-only page at `/admin/login-logs`
   - Records all admin and staff login activities (date, time, user, IP address, success/failure)
   - Accessible only to ADMIN role

### 4. **Staff Management**
   - New admin-only page at `/admin/staff`
   - Create staff accounts with custom permissions
   - Edit staff roles and permissions
   - Activate/deactivate staff accounts
   - Delete staff accounts (cannot delete yourself)
   - Accessible only to ADMIN role

### 5. **Edit and Delete Booking Records**
   - Admin can edit booking details (customer info, dates, status)
   - Admin can void/delete booking records
   - Features accessible only to ADMIN role (not staff)
   - Available in the Reservations page

## Database Schema Changes

The following changes were made to `prisma/schema.prisma`:

1. **User Model Updates:**
   - Added `permissions` field (Json?) for granular staff permissions
   - Added `isActive` field (Boolean) to enable/disable accounts
   - Added `loginLogs` relation

2. **New LoginLog Model:**
   - Tracks login activities for admin and staff
   - Records userId, email, role, IP address, user agent, success status, and timestamp

## Migration Steps

### Step 1: Generate Prisma Migration

Run the following command to create a new migration:

```bash
npx prisma migrate dev --name add_login_logs_and_staff_permissions
```

This will:
- Create a new migration file
- Apply the changes to your database
- Regenerate the Prisma Client

### Step 2: Verify Migration

Check that the migration was successful:

```bash
npx prisma studio
```

Verify that:
- The `User` table has new `permissions` and `isActive` columns
- The `LoginLog` table exists with all required fields

### Step 3: Update Existing Users (Optional)

If you have existing admin/staff users, you may want to set their `isActive` status:

```sql
UPDATE "User" SET "isActive" = true WHERE role IN ('ADMIN', 'STAFF');
```

## New Routes

### Public Routes
- `/booking/[code]` - View booking details and cancel (enhanced with cancel button)

### Admin-Only Routes
- `/admin/login-logs` - View login activity logs
- `/admin/staff` - Manage staff accounts

### API Routes
- `GET /api/bookings/lookup?code=XXX` - Lookup booking by code
- `POST /api/admin/staff` - Create staff account
- `PATCH /api/admin/staff/[id]` - Update staff account
- `DELETE /api/admin/staff/[id]` - Delete staff account
- `PATCH /api/admin/bookings/[id]` - Edit booking (admin only)
- `DELETE /api/admin/bookings/[id]` - Delete booking (admin only)

## Staff Permissions

When creating staff accounts, you can assign the following permissions:

- **view_bookings** - View all bookings
- **manage_bookings** - Manage bookings (but not edit/delete)
- **view_facilities** - View facilities
- **manage_facilities** - Manage facilities
- **view_reports** - View reports
- **manage_pricing** - Manage pricing

Note: Edit and Delete booking features are restricted to ADMIN role only, regardless of staff permissions.

## Testing

After migration, test the following:

1. **Booking Checker:**
   - Go to home page
   - Enter a valid booking code
   - Verify it redirects to booking details
   - Test the cancel booking functionality

2. **Login Logs:**
   - Login as admin
   - Go to `/admin/login-logs`
   - Verify login entries are recorded

3. **Staff Management:**
   - Login as admin
   - Go to `/admin/staff`
   - Create a test staff account
   - Edit permissions
   - Test login with staff account

4. **Edit/Delete Bookings:**
   - Login as admin
   - Go to `/admin/reservations`
   - Test editing a booking
   - Test deleting a booking

## Rollback

If you need to rollback the migration:

```bash
npx prisma migrate reset
```

**Warning:** This will delete all data in your database!

For a safer rollback, create a database backup first, then manually drop the new columns and table.

## Notes

- The lint errors you see are expected until you run the Prisma migration
- After running the migration, restart your development server
- Login logs are only created for ADMIN and STAFF roles, not regular guests
- Failed login attempts are also logged for security monitoring
