-- ═══════════════════════════════════════════════════════════════════════════
-- COMPLETE DATABASE RESET - Run this in pgAdmin Query Tool
-- Database: clickstay_db
-- ═══════════════════════════════════════════════════════════════════════════

-- Drop EVERYTHING (including Prisma's migration table)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- ═══════════════════════════════════════════════════════════════════════════
-- CREATE ENUMS
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TYPE "Role" AS ENUM ('GUEST', 'STAFF', 'ADMIN');
CREATE TYPE "FacilityKind" AS ENUM ('ROOM', 'COTTAGE', 'HALL');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- ═══════════════════════════════════════════════════════════════════════════
-- CREATE TABLES
-- ═══════════════════════════════════════════════════════════════════════════

-- Users Table
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'GUEST',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");

-- Facilities Table
CREATE TABLE "facilities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "FacilityKind" NOT NULL,
    "description" TEXT,
    "capacity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "photos" TEXT[],
    "amenities" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "facilities_kind_idx" ON "facilities"("kind");
CREATE INDEX "facilities_isActive_idx" ON "facilities"("isActive");

-- Bookings Table
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "userId" TEXT,
    "facilityId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL DEFAULT 1,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "bookings_code_key" ON "bookings"("code");
CREATE INDEX "bookings_facilityId_startDate_endDate_idx" ON "bookings"("facilityId", "startDate", "endDate");
CREATE INDEX "bookings_status_idx" ON "bookings"("status");
CREATE INDEX "bookings_code_idx" ON "bookings"("code");
CREATE INDEX "bookings_customerEmail_idx" ON "bookings"("customerEmail");

-- Payments Table
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payments_bookingId_key" ON "payments"("bookingId");
CREATE INDEX "payments_status_idx" ON "payments"("status");
CREATE INDEX "payments_transactionId_idx" ON "payments"("transactionId");

-- ═══════════════════════════════════════════════════════════════════════════
-- ADD FOREIGN KEYS
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "bookings" ADD CONSTRAINT "bookings_facilityId_fkey" 
    FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_fkey" 
    FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ═══════════════════════════════════════════════════════════════════════════
-- SAMPLE DATA
-- ═══════════════════════════════════════════════════════════════════════════

-- Insert sample admin user (password: admin123)
INSERT INTO "users" ("id", "name", "email", "passwordHash", "role", "createdAt", "updatedAt")
VALUES ('cm2k1admin', 'Admin User', 'admin@manuel.com', '$2a$10$YourHashHere', 'ADMIN', NOW(), NOW());

-- Insert sample staff user
INSERT INTO "users" ("id", "name", "email", "phone", "passwordHash", "role", "createdAt", "updatedAt")
VALUES ('cm2k1staff', 'Staff Member', 'staff@manuel.com', '09123456789', '$2a$10$YourHashHere', 'STAFF', NOW(), NOW());

-- Insert sample facilities
INSERT INTO "facilities" ("id", "name", "kind", "description", "capacity", "price", "photos", "amenities", "createdAt", "updatedAt")
VALUES 
    ('cm2k1fac01', 'Deluxe Room 101', 'ROOM', 'Spacious room with ocean view', 2, 2500.00, 
     ARRAY['room1.jpg'], ARRAY['WiFi', 'Air Conditioning', 'TV', 'Mini Fridge'], NOW(), NOW()),
    
    ('cm2k1fac02', 'Deluxe Room 102', 'ROOM', 'Comfortable room with garden view', 2, 2000.00, 
     ARRAY['room2.jpg'], ARRAY['WiFi', 'Air Conditioning', 'TV'], NOW(), NOW()),
    
    ('cm2k1fac03', 'Family Cottage A', 'COTTAGE', 'Cozy cottage perfect for families', 6, 5000.00, 
     ARRAY['cottage1.jpg'], ARRAY['Kitchen', 'WiFi', 'BBQ Grill', 'Living Room'], NOW(), NOW()),
    
    ('cm2k1fac04', 'Family Cottage B', 'COTTAGE', 'Spacious cottage with pool access', 8, 6500.00, 
     ARRAY['cottage2.jpg'], ARRAY['Kitchen', 'WiFi', 'BBQ Grill', 'Pool Access'], NOW(), NOW()),
    
    ('cm2k1fac05', 'Grand Event Hall', 'HALL', 'Large hall for weddings and events', 100, 15000.00, 
     ARRAY['hall1.jpg'], ARRAY['Sound System', 'Air Conditioning', 'Stage', 'Tables & Chairs'], NOW(), NOW());

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE! Database is ready to use
-- ═══════════════════════════════════════════════════════════════════════════
