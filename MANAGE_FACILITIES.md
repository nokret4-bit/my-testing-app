# 📝 How to Manage Facilities

## Current Status

The **Edit** and **Delete** buttons are currently **disabled** because those features require additional pages/components to be built.

For now, you can manage facilities directly in the database using pgAdmin.

---

## 🔧 How to Edit a Facility

### **Update Price:**

```sql
-- Update facility price
UPDATE facilities 
SET price = 3000, "updatedAt" = NOW()
WHERE id = 'fac001';
```

### **Update Name:**

```sql
-- Update facility name
UPDATE facilities 
SET name = 'Premium Room 101', "updatedAt" = NOW()
WHERE id = 'fac001';
```

### **Update Description:**

```sql
-- Update facility description
UPDATE facilities 
SET description = 'Newly renovated room with modern amenities', "updatedAt" = NOW()
WHERE id = 'fac001';
```

### **Update Capacity:**

```sql
-- Update facility capacity
UPDATE facilities 
SET capacity = 4, "updatedAt" = NOW()
WHERE id = 'fac001';
```

---

## 🗑️ How to Delete a Facility

### **Option 1: Soft Delete (Recommended)**

Set `isActive = false` to hide it from the system:

```sql
-- Disable a facility (soft delete)
UPDATE facilities 
SET "isActive" = false, "updatedAt" = NOW()
WHERE id = 'fac001';
```

### **Option 2: Hard Delete**

Permanently remove from database:

```sql
-- Delete a facility (permanent)
DELETE FROM facilities 
WHERE id = 'fac001';
```

**⚠️ Warning:** Hard delete will fail if there are bookings for this facility!

---

## ➕ How to Add a New Facility

```sql
-- Add a new facility
INSERT INTO facilities (id, name, kind, description, capacity, price, photos, amenities, "isActive", "createdAt", "updatedAt")
VALUES (
  'fac005',  -- Unique ID
  'VIP Suite',  -- Name
  'ROOM',  -- Kind: ROOM, COTTAGE, or HALL
  'Luxurious suite with premium amenities',  -- Description
  2,  -- Capacity
  5000,  -- Price
  ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'],  -- Photos
  ARRAY['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'],  -- Amenities
  true,  -- isActive
  NOW(),  -- createdAt
  NOW()  -- updatedAt
);
```

---

## 📊 View All Facilities

```sql
-- View all facilities
SELECT id, name, kind, capacity, price, "isActive"
FROM facilities
ORDER BY name;
```

---

## 🔍 Find Specific Facility

```sql
-- Find by name
SELECT * FROM facilities 
WHERE name LIKE '%Room%';

-- Find by kind
SELECT * FROM facilities 
WHERE kind = 'COTTAGE';

-- Find active only
SELECT * FROM facilities 
WHERE "isActive" = true;
```

---

## 💡 Quick Tips

### **To Update Multiple Fields:**

```sql
UPDATE facilities 
SET 
  name = 'Updated Name',
  price = 2800,
  capacity = 3,
  description = 'New description',
  "updatedAt" = NOW()
WHERE id = 'fac001';
```

### **To Reactivate a Disabled Facility:**

```sql
UPDATE facilities 
SET "isActive" = true, "updatedAt" = NOW()
WHERE id = 'fac001';
```

### **To Update Amenities:**

```sql
UPDATE facilities 
SET amenities = ARRAY['WiFi', 'AC', 'TV', 'Pool Access', 'BBQ'], 
    "updatedAt" = NOW()
WHERE id = 'fac001';
```

---

## 🚀 Future Enhancement

To add Edit/Delete functionality in the admin panel, you would need to create:

1. **Edit Page:** `/admin/facilities/[id]/edit/page.tsx`
2. **Delete API:** `/api/admin/facilities/[id]/delete/route.ts`
3. **Form Components:** For editing facility details

For now, managing through pgAdmin is the quickest way!

---

## ✅ Summary

**Current Workaround:**
- ✅ **View** - Works (click View button)
- ⚠️ **Edit** - Use pgAdmin SQL queries
- ⚠️ **Delete** - Use pgAdmin SQL queries
- ✅ **Add** - Use SQL INSERT statement

**The View button works perfectly** - you can see all facility details on the public page!
