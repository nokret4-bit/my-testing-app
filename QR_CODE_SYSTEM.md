# QR Code Check-in System

## Overview

This system provides automatic QR code generation for bookings and a Cashier Dashboard for quick guest verification and check-in.

## Features

### 1. Automatic QR Code Generation
- **When**: QR codes are automatically generated for bookings with status `CONFIRMED` or `PAID`
- **Where**: Displayed on the booking detail page (`/booking/[code]`)
- **Contains**: 
  - Booking ID
  - Booking Code
  - Customer Name
  - Facility Unit Name
  - Check-in Date

### 2. Booking Detail Page Enhancement
- Customers can view their QR code on the booking detail page
- QR code is displayed prominently with the booking code below it
- Download button allows customers to save the QR code image
- Only shown for confirmed or paid bookings

### 3. Cashier Dashboard
- **Access**: `/cashier` (requires CASHIER, STAFF, or ADMIN role)
- **Two Check-in Methods**:
  1. **Manual Code Entry**: Type the booking code to verify
  2. **QR Code Scan**: Paste scanned QR data for instant check-in

### 4. Check-in Process
1. Customer arrives at facility with QR code
2. Cashier scans QR code or enters booking code manually
3. System displays booking details for verification
4. Cashier confirms check-in
5. System records check-in timestamp
6. Booking status updated to "Checked In"

## User Roles

### CASHIER
- New role added specifically for front desk staff
- Can access Cashier Dashboard
- Can verify bookings
- Can check in guests
- Cannot access Admin Dashboard

### STAFF & ADMIN
- Have all CASHIER permissions
- Plus additional administrative capabilities

## API Endpoints

### Generate QR Code
```
GET /api/bookings/[id]/qrcode
```
- Generates QR code for a specific booking
- Returns base64 data URL of QR code image
- Requires authentication

### Verify Booking
```
GET /api/cashier/verify?code=[bookingCode]
```
- Verifies booking by code
- Returns booking details and check-in eligibility
- Requires CASHIER, STAFF, or ADMIN role

### Check-in Guest
```
POST /api/cashier/checkin
Body: { qrData: string }
```
- Processes check-in from QR code data
- Updates booking with check-in timestamp
- Creates audit log entry
- Requires CASHIER, STAFF, or ADMIN role

## Database Changes

### Booking Model
- Added `checkedInAt` field (DateTime, nullable)
- Tracks when guest checked in at facility

### Role Enum
- Added `CASHIER` role for front desk staff

## Components

### BookingQRCode (`/src/components/booking-qrcode.tsx`)
- Client component for displaying QR codes
- Fetches QR code from API
- Provides download functionality
- Shows booking code prominently

### CashierScanner (`/src/components/cashier-scanner.tsx`)
- Client component for cashier operations
- Supports manual code entry and QR scanning
- Displays booking information
- Handles check-in process
- Shows success/error alerts

## Security

- All cashier endpoints require authentication
- Role-based access control (CASHIER, STAFF, ADMIN only)
- QR codes contain booking ID for verification
- Audit logs track all check-in actions
- Booking code validation prevents unauthorized check-ins

## Usage Instructions

### For Customers
1. Complete booking and payment
2. Navigate to booking detail page
3. View QR code displayed on page
4. Download QR code or screenshot it
5. Present QR code at facility entrance

### For Cashiers
1. Log in with CASHIER credentials
2. Navigate to Cashier Dashboard
3. Choose check-in method:
   - **Manual**: Enter booking code and click Search
   - **QR Scan**: Use QR scanner app, paste data, and click Scan
4. Review booking details
5. Click "Confirm Check-in" button
6. System confirms successful check-in

## Installation

The system has been fully installed with:
- `qrcode` library for QR generation
- Database migration applied
- All components and API endpoints created

## Testing

To test the system:
1. Create a test booking
2. Mark it as CONFIRMED or PAID
3. View the booking detail page to see QR code
4. Use Cashier Dashboard to check in the guest
5. Verify check-in timestamp is recorded

## Future Enhancements

Potential improvements:
- Real-time QR code scanning with camera
- Mobile app for cashiers
- Check-out tracking
- Guest notification on check-in
- Analytics dashboard for check-ins
- QR code expiration for security
