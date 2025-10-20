const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    console.log('Checking admin user...\n');
    
    const admin = await prisma.users.findUnique({
      where: { email: 'admin@clickstay.local' }
    });
    
    if (!admin) {
      console.log('❌ Admin user NOT found!');
      console.log('Run: node create_admin_simple.cjs');
      return;
    }
    
    console.log('✅ Admin user found!');
    console.log('ID:', admin.id);
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Active:', admin.isActive);
    console.log('Has password hash:', !!admin.passwordHash);
    
    // Test password
    if (admin.passwordHash) {
      const testPassword = 'admin123';
      const isValid = await bcrypt.compare(testPassword, admin.passwordHash);
      console.log('\n🔑 Password test:');
      console.log('Testing password "admin123":', isValid ? '✅ VALID' : '❌ INVALID');
      
      if (!isValid) {
        console.log('\n⚠️  Password hash does not match "admin123"');
        console.log('Run: node create_admin_simple.cjs to recreate admin with correct password');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
