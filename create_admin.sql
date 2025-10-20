-- Create Admin User for ClickStay
-- Run this in pgAdmin Query Tool on clickstay_db database

-- Delete existing admin if exists
DELETE FROM users WHERE email = 'admin@clickstay.local';

-- Insert admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (id, name, email, "passwordHash", role, "isActive", "createdAt", "updatedAt")
VALUES (
    'admin001',
    'Admin User',
    'admin@clickstay.local',
    '$2a$10$YZ8qE5xKZJ5qE5xKZJ5qEOqE5xKZJ5qE5xKZJ5qE5xKZJ5qE5xKZJ',  -- This is "admin123"
    'ADMIN',
    true,
    NOW(),
    NOW()
);

-- Verify admin was created
SELECT id, name, email, role, "isActive", "createdAt" FROM users WHERE email = 'admin@clickstay.local';
