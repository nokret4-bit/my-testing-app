# 🔧 Remaining Pages to Fix

The following admin pages still need to be updated for the simplified schema:

## ❌ Pages with Errors

### 1. **Reservations Page** (`src/app/admin/reservations/page.tsx`)
- Change: `prisma.booking` → `prisma.bookings`
- Remove: `facilityUnit` and `facilityType` includes
- Add: `facilities` include

### 2. **Facilities Page** (`src/app/admin/facilities/page.tsx`)
- Change: `prisma.facilityUnit` → `prisma.facilities`
- Remove: `facilityType` include
- Remove: `_count` for bookings

### 3. **Pricing Page** (`src/app/admin/pricing/page.tsx`)
- **This page won't work** - The simplified schema doesn't have `ratePlan` table
- Price is now directly in the `facilities` table
- Consider removing this page or redesigning it

### 4. **Reports Page** (`src/app/admin/reports/page.tsx`)
- Change: `prisma.booking` → `prisma.bookings`
- Change: `prisma.facilityUnit` → `prisma.facilities`
- Update: `facilityUnitId` → `facilityId`

### 5. **Login Logs Page** (`src/app/admin/login-logs/page.tsx`)
- **This page won't work** - The simplified schema doesn't have `loginLog` table
- Consider removing this page

---

## 🎯 Recommendation

Since you're using the **simplified 4-table schema**, some admin features won't work:

### **Features That Work:**
- ✅ Dashboard
- ✅ Staff Management
- ✅ Reservations (after fix)
- ✅ Facilities (after fix)

### **Features That Need Removal:**
- ❌ Pricing/Rate Plans (no `rate_plans` table)
- ❌ Login Logs (no `login_logs` table)
- ❌ Reports (needs major redesign)

---

## 🚀 Quick Fix Option

Would you like me to:
1. **Fix** the pages that can work (Reservations, Facilities, Reports)
2. **Remove** or **disable** the pages that can't work (Pricing, Login Logs)

This will give you a fully functional admin panel with the simplified schema!
