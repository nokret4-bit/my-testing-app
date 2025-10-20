# Create Admin User Script
# This script creates an admin user with email: admin@clickstay.local and password: admin123

Write-Host "Creating admin user..." -ForegroundColor Cyan

# Create a simple Node.js script to hash the password and insert into database
$script = @"
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // Delete existing admin if exists
    await prisma.users.deleteMany({
      where: { email: 'admin@clickstay.local' }
    });
    
    // Create new admin
    const admin = await prisma.users.create({
      data: {
        id: 'admin001',
        name: 'Admin User',
        email: 'admin@clickstay.local',
        passwordHash: passwordHash,
        role: 'ADMIN',
        isActive: true,
      }
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    await prisma.\`$disconnect\`();
  }
}

createAdmin();
"@

# Write the script to a temporary file
$script | Out-File -FilePath "temp_create_admin.js" -Encoding UTF8

# Run the script
Write-Host "Running admin creation script..." -ForegroundColor Yellow
node temp_create_admin.js

# Clean up
Remove-Item "temp_create_admin.js" -ErrorAction SilentlyContinue

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "Admin Login Credentials:" -ForegroundColor Green
Write-Host "Email: admin@clickstay.local" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host "================================================" -ForegroundColor Cyan
