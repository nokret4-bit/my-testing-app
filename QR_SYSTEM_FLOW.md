# QR Code Check-in System Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     QR CODE CHECK-IN SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   CUSTOMER SIDE      │         │    CASHIER SIDE      │
└──────────────────────┘         └──────────────────────┘
```

## Customer Journey

```
1. BOOKING CREATION
   ┌─────────────┐
   │ Make Booking│
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Pay & Confirm│
   └──────┬──────┘
          │
          ▼

2. QR CODE GENERATION
   ┌──────────────────────┐
   │ Booking Detail Page  │
   │  /booking/[code]     │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ API: Generate QR     │
   │ GET /api/bookings/   │
   │     [id]/qrcode      │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ Display QR Code      │
   │ ┌────────────┐       │
   │ │ [QR IMAGE] │       │
   │ │ BK-ABC123  │       │
   │ └────────────┘       │
   │ [Download Button]    │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ Customer Downloads   │
   │ or Screenshots QR    │
   └──────────────────────┘
```

## Cashier Check-in Flow

```
3. ARRIVAL AT FACILITY
   ┌──────────────────────┐
   │ Customer Arrives     │
   │ with QR Code         │
   └──────┬───────────────┘
          │
          ▼

4. CASHIER VERIFICATION
   ┌──────────────────────────────────────┐
   │      Cashier Dashboard               │
   │         /cashier                     │
   └──────┬───────────────────────────────┘
          │
          ├─────────────┬─────────────┐
          ▼             ▼             ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ Manual   │  │   OR     │  │ QR Scan  │
   │  Entry   │  │          │  │  Method  │
   └────┬─────┘  └──────────┘  └────┬─────┘
        │                            │
        ▼                            ▼
   ┌──────────┐              ┌──────────┐
   │ Enter    │              │ Scan &   │
   │ Booking  │              │ Paste QR │
   │ Code     │              │ Data     │
   └────┬─────┘              └────┬─────┘
        │                         │
        ▼                         ▼
   ┌──────────────────────────────────────┐
   │ API: Verify Booking                  │
   │ GET /api/cashier/verify?code=X       │
   │        OR                            │
   │ POST /api/cashier/checkin            │
   └──────┬───────────────────────────────┘
          │
          ▼

5. DISPLAY BOOKING INFO
   ┌──────────────────────────────────────┐
   │ Booking Information Card             │
   │ ┌──────────────────────────────────┐ │
   │ │ Guest: John Doe                  │ │
   │ │ Email: john@example.com          │ │
   │ │ Facility: Deluxe Room 101        │ │
   │ │ Check-in: Oct 15, 2025 2:00 PM  │ │
   │ │ Status: ✓ PAID                   │ │
   │ └──────────────────────────────────┘ │
   │                                      │
   │ [Confirm Check-in Button]            │
   └──────┬───────────────────────────────┘
          │
          ▼

6. CHECK-IN CONFIRMATION
   ┌──────────────────────┐
   │ Cashier Clicks       │
   │ "Confirm Check-in"   │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ API: Process Check-in│
   │ POST /api/cashier/   │
   │      checkin         │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ Update Database      │
   │ - Set checkedInAt    │
   │ - Create Audit Log   │
   └──────┬───────────────┘
          │
          ▼
   ┌──────────────────────┐
   │ ✓ Success Message    │
   │ "Check-in Successful"│
   │ Timestamp: 2:15 PM   │
   └──────────────────────┘
```

## Data Flow Diagram

```
┌─────────────┐
│  Customer   │
└──────┬──────┘
       │ 1. Views booking
       ▼
┌─────────────────────┐
│ Booking Detail Page │
└──────┬──────────────┘
       │ 2. Requests QR
       ▼
┌─────────────────────┐
│ QR Code API         │
│ /api/bookings/[id]/ │
│ qrcode              │
└──────┬──────────────┘
       │ 3. Generates QR
       ▼
┌─────────────────────┐
│ QR Code Library     │
│ (qrcode npm)        │
└──────┬──────────────┘
       │ 4. Returns base64
       ▼
┌─────────────────────┐
│ Display QR to       │
│ Customer            │
└─────────────────────┘


┌─────────────┐
│   Cashier   │
└──────┬──────┘
       │ 1. Scans/Enters code
       ▼
┌─────────────────────┐
│ Cashier Dashboard   │
└──────┬──────────────┘
       │ 2. Sends request
       ▼
┌─────────────────────┐
│ Verify/Checkin API  │
│ /api/cashier/*      │
└──────┬──────────────┘
       │ 3. Validates
       ▼
┌─────────────────────┐
│ Database (Prisma)   │
│ - Find booking      │
│ - Update checkedInAt│
│ - Create audit log  │
└──────┬──────────────┘
       │ 4. Returns result
       ▼
┌─────────────────────┐
│ Display to Cashier  │
│ ✓ Success/Error     │
└─────────────────────┘
```

## QR Code Data Structure

```json
{
  "bookingId": "clxxx123456789",
  "bookingCode": "BK-ABC123",
  "customerName": "John Doe",
  "facilityUnit": "Deluxe Room 101",
  "checkInDate": "2025-10-15"
}
```

## Database Schema Relationships

```
┌─────────────────────┐
│      User           │
│ ─────────────────── │
│ id                  │
│ email               │
│ role (CASHIER)      │◄────┐
└─────────────────────┘     │
                             │
                             │ userId
                             │
┌─────────────────────┐     │
│     Booking         │     │
│ ─────────────────── │     │
│ id                  │     │
│ code                │     │
│ status              │     │
│ checkedInAt ◄───────┼─────┤ NEW FIELD
│ userId              │─────┘
└──────┬──────────────┘
       │
       │ bookingId
       ▼
┌─────────────────────┐
│    AuditLog         │
│ ─────────────────── │
│ id                  │
│ action              │
│ entity              │
│ entityId            │
│ data                │
│ userId              │
└─────────────────────┘
```

## Security Flow

```
┌─────────────────────┐
│ Request Received    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Check Session       │
│ (NextAuth)          │
└──────┬──────────────┘
       │
       ├─── No Session ──► 401 Unauthorized
       │
       ▼ Has Session
┌─────────────────────┐
│ Check User Role     │
└──────┬──────────────┘
       │
       ├─── Not Authorized ──► 403 Forbidden
       │
       ▼ Authorized
┌─────────────────────┐
│ Validate Input      │
└──────┬──────────────┘
       │
       ├─── Invalid ──► 400 Bad Request
       │
       ▼ Valid
┌─────────────────────┐
│ Process Request     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Return Response     │
└─────────────────────┘
```

## Component Hierarchy

```
App
│
├── Navbar
│   └── Cashier Dashboard Link (if authorized)
│
├── Customer Pages
│   └── /booking/[code]
│       └── BookingQRCode Component
│           ├── Fetches QR from API
│           ├── Displays QR Image
│           └── Download Button
│
└── Cashier Pages
    └── /cashier
        └── CashierScanner Component
            ├── Mode Selection (Manual/QR)
            ├── Input Fields
            ├── Booking Info Display
            │   ├── Guest Information
            │   ├── Facility Information
            │   ├── Booking Dates
            │   └── Status Badges
            └── Action Buttons
                ├── Confirm Check-in
                └── Scan Next Guest
```

## Error Handling Flow

```
┌─────────────────────┐
│ User Action         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Try API Call        │
└──────┬──────────────┘
       │
       ├─── Network Error ──► Display: "Connection failed"
       │
       ├─── 401 ──► Redirect to login
       │
       ├─── 403 ──► Display: "Access denied"
       │
       ├─── 404 ──► Display: "Booking not found"
       │
       ├─── 400 ──► Display: Validation error message
       │
       ├─── 500 ──► Display: "Server error"
       │
       └─── 200 ──► Process success
                    └─── Display success message
```

## State Management

```
CashierScanner Component State:
┌─────────────────────────────┐
│ bookingCode: string         │
│ qrData: string              │
│ loading: boolean            │
│ bookingInfo: BookingInfo?   │
│ error: string?              │
│ checkInSuccess: boolean     │
│ checkInMode: 'manual'|'qr'  │
└─────────────────────────────┘

BookingQRCode Component State:
┌─────────────────────────────┐
│ qrCode: string?             │
│ loading: boolean            │
│ error: string?              │
└─────────────────────────────┘
```

## API Response Examples

### Success Response (Verify)
```json
{
  "booking": {
    "id": "clxxx123",
    "code": "BK-ABC123",
    "customerName": "John Doe",
    "facilityUnit": "Deluxe Room 101",
    "status": "CONFIRMED",
    "canCheckIn": true,
    "isPaid": true
  }
}
```

### Success Response (Check-in)
```json
{
  "message": "Check-in successful",
  "booking": {
    "id": "clxxx123",
    "code": "BK-ABC123",
    "checkedInAt": "2025-10-15T14:15:00Z",
    "status": "CHECKED_IN"
  }
}
```

### Error Response
```json
{
  "error": "Booking not found"
}
```
