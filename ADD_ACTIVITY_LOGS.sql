-- Add Activity Logs Table to Track All Admin/Staff Actions
-- Run this in pgAdmin on clickstay_db database

-- Create ActivityType enum
CREATE TYPE "ActivityType" AS ENUM (
  'LOGIN',
  'LOGOUT',
  'CREATE_BOOKING',
  'UPDATE_BOOKING',
  'DELETE_BOOKING',
  'CHECKIN_BOOKING',
  'CHECKOUT_BOOKING',
  'CREATE_FACILITY',
  'UPDATE_FACILITY',
  'DELETE_FACILITY',
  'CREATE_USER',
  'UPDATE_USER',
  'DELETE_USER',
  'CREATE_PAYMENT',
  'UPDATE_PAYMENT',
  'DELETE_PAYMENT'
);

-- Create activity_logs table
CREATE TABLE "activity_logs" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "action" "ActivityType" NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "description" TEXT NOT NULL,
  "metadata" JSONB,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");
CREATE INDEX "activity_logs_entityType_idx" ON "activity_logs"("entityType");
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt");

-- Add some sample activity logs
INSERT INTO "activity_logs" (id, "userId", action, "entityType", "entityId", description, "createdAt")
VALUES 
  ('log' || EXTRACT(EPOCH FROM NOW())::BIGINT || '001', 'admin001', 'LOGIN', 'user', 'admin001', 'Admin logged in', NOW()),
  ('log' || EXTRACT(EPOCH FROM NOW())::BIGINT || '002', 'admin001', 'CREATE_FACILITY', 'facility', NULL, 'Created new facility', NOW() - INTERVAL '1 hour');

SELECT 'Activity logs table created successfully!' as status;
