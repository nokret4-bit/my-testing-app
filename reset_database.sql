-- ═══════════════════════════════════════════════════════════════════════════
-- FRESH DATABASE SETUP - Simplified Schema
-- Run this in pgAdmin to create a clean database
-- ═══════════════════════════════════════════════════════════════════════════

-- Drop all existing tables and types
DROP TABLE IF EXISTS "payments" CASCADE;
DROP TABLE IF EXISTS "bookings" CASCADE;
DROP TABLE IF EXISTS "facilities" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "accounts" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "verification_tokens" CASCADE;
DROP TABLE IF EXISTS "login_logs" CASCADE;
DROP TABLE IF EXISTS "customer_profiles" CASCADE;
DROP TABLE IF EXISTS "facility_types" CASCADE;
DROP TABLE IF EXISTS "facility_units" CASCADE;
DROP TABLE IF EXISTS "rate_plans" CASCADE;
DROP TABLE IF EXISTS "availability_blocks" CASCADE;
DROP TABLE IF EXISTS "inventory_calendar" CASCADE;
DROP TABLE IF EXISTS "audit_logs" CASCADE;
DROP TABLE IF EXISTS "notifications" CASCADE;

DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "FacilityKind" CASCADE;
DROP TYPE IF EXISTS "BookingStatus" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "BlockType" CASCADE;
DROP TYPE IF EXISTS "PaymentProvider" CASCADE;
DROP TYPE IF EXISTS "PriceType" CASCADE;

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
-- SAMPLE DATA (Optional - Remove if not needed)
-- ═══════════════════════════════════════════════════════════════════════════

-- Insert sample admin user
INSERT INTO "users" ("id", "name", "email", "passwordHash", "role", "createdAt", "updatedAt")
VALUES ('admin001', 'Admin User', 'admin@manuel.com', '$2a$10$example', 'ADMIN', NOW(), NOW());

-- Insert sample facilities
INSERT INTO "facilities" ("id", "name", "kind", "description", "capacity", "price", "photos", "amenities", "createdAt", "updatedAt")
VALUES 
    ('fac001', 'Deluxe Room 101', 'ROOM', 'Spacious room with ocean view', 2, 2500.00, ARRAY['room1.jpg'], ARRAY['WiFi', 'AC', 'TV'], NOW(), NOW()),
    ('fac002', 'Family Cottage A', 'COTTAGE', 'Cozy cottage for families', 6, 5000.00, ARRAY['cottage1.jpg'], ARRAY['Kitchen', 'WiFi', 'BBQ'], NOW(), NOW()),
    ('fac003', 'Event Hall', 'HALL', 'Large hall for events and gatherings', 100, 15000.00, ARRAY['hall1.jpg'], ARRAY['Sound System', 'AC', 'Stage'], NOW(), NOW());

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE!
-- ═══════════════════════════════════════════════════════════════════════════
