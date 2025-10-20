# Testing the QR Code Check-in System

## Prerequisites
1. Database is running and migrated
2. At least one test booking exists with status `CONFIRMED` or `PAID`
3. A cashier user account has been created

## Step 1: Create a Cashier User

Run the following command:
```bash
npm run create-cashier
```

Enter the required information:
- Name: Test Cashier
- Email: cashier@test.com
- Password: (choose a secure password)

## Step 2: Test QR Code Generation

1. **Log in as a customer** with an existing booking
2. Navigate to **My Bookings** (`/bookings`)
3. Click on a booking with status `CONFIRMED` or `PAID`
4. **Verify**: You should see a QR Code section with:
   - QR code image displayed
   - Booking code shown below the QR code
   - "Download QR Code" button

5. **Test Download**: Click the download button
   - QR code should download as PNG file
   - Filename format: `booking-[CODE]-qrcode.png`

## Step 3: Test Cashier Dashboard Access

1. **Log out** from customer account
2. **Log in** with cashier credentials
3. Navigate to **Cashier Dashboard** (should see link in navbar)
4. **Verify**: Dashboard displays with two check-in methods:
   - Manual Code Entry
   - QR Code Scan

## Step 4: Test Manual Code Entry

1. In Cashier Dashboard, ensure **"Manual Code Entry"** is selected
2. Enter a valid booking code (e.g., from Step 2)
3. Click the **Search** button
4. **Verify**: Booking information displays showing:
   - Guest Information (name, email, phone)
   - Facility Information (facility name, type)
   - Booking Dates (check-in, check-out)
   - Status badges (Paid, Check-in eligible)
   - "Confirm Check-in" button (if eligible)

5. Click **"Confirm Check-in"**
6. **Verify**: 
   - Success alert appears
   - Check-in timestamp is displayed
   - "Checked In" badge appears
   - "Confirm Check-in" button is disabled

## Step 5: Test QR Code Scanning

1. Click **"Scan Next Guest"** to reset
2. Switch to **"QR Code Scan"** mode
3. Open the downloaded QR code image from Step 2
4. Use a QR code reader app/website to scan it
5. Copy the JSON data from the QR code
6. Paste into the "QR Code Data" field
7. Click **Scan** button
8. **Verify**: Same check-in process as manual entry

## Step 6: Test Already Checked-In Guest

1. Try to check in the same booking again
2. **Verify**: System shows:
   - "Guest already checked in" message
   - Check-in timestamp displayed
   - Cannot check in again

## Step 7: Test Invalid Scenarios

### Invalid Booking Code
1. Enter a non-existent booking code
2. **Verify**: Error message "Booking not found"

### Wrong Status Booking
1. Try to check in a booking with status `AWAITING_PAYMENT`
2. **Verify**: Error message about invalid status

### Invalid QR Data
1. Paste random text in QR scan field
2. **Verify**: Error message "Invalid QR code format"

## Step 8: Verify Database Updates

Check the database to confirm:
```sql
SELECT code, customerName, status, checkedInAt 
FROM "Booking" 
WHERE checkedInAt IS NOT NULL;
```

**Verify**: `checkedInAt` timestamp is recorded for checked-in bookings

## Step 9: Verify Audit Logs

Check audit logs:
```sql
SELECT action, entity, data, createdAt 
FROM "AuditLog" 
WHERE action = 'BOOKING_CHECKED_IN' 
ORDER BY createdAt DESC;
```

**Verify**: Check-in actions are logged with:
- Booking code
- Customer name
- Cashier email

## Expected Results Summary

✅ QR codes generate automatically for confirmed/paid bookings
✅ QR codes can be downloaded by customers
✅ Cashier dashboard is accessible to CASHIER/STAFF/ADMIN roles
✅ Manual code entry verifies and checks in guests
✅ QR code scanning processes check-ins instantly
✅ Already checked-in guests cannot be checked in again
✅ Invalid bookings show appropriate error messages
✅ Check-in timestamps are recorded in database
✅ Audit logs track all check-in activities

## Troubleshooting

### QR Code Not Showing
- Check booking status is `CONFIRMED` or `PAID`
- Verify API endpoint `/api/bookings/[id]/qrcode` is accessible
- Check browser console for errors

### Cannot Access Cashier Dashboard
- Verify user role is `CASHIER`, `STAFF`, or `ADMIN`
- Check database: `SELECT role FROM "User" WHERE email = 'your-email'`
- Ensure migration was run successfully

### Check-in Not Working
- Verify booking status allows check-in
- Check API endpoint `/api/cashier/checkin` is working
- Review server logs for errors
- Ensure Prisma client is regenerated after migration

## Performance Testing

For production readiness, test:
1. **Concurrent check-ins**: Multiple cashiers checking in guests simultaneously
2. **QR code generation speed**: Generate QR codes for 100+ bookings
3. **Database query performance**: Verify booking lookups are fast
4. **Error handling**: Network failures, timeout scenarios

## Security Testing

Verify:
1. **Authentication**: Unauthenticated users cannot access cashier endpoints
2. **Authorization**: GUEST role cannot access cashier dashboard
3. **Data validation**: Invalid QR data is rejected
4. **Audit trail**: All actions are logged with user information
