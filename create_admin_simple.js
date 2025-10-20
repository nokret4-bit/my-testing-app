const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
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
    
    console.log('\n✅ Admin user created successfully!');
    console.log('================================================');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    console.log('================================================');
    
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
