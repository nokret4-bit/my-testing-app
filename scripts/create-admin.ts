import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = "admin@manuelresort.com";
    const password = "Admin@123456"; // Change this password!
    const name = "System Administrator";

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("❌ Admin user already exists with email:", email);
      console.log("   User ID:", existingAdmin.id);
      console.log("   Role:", existingAdmin.role);
      
      if (existingAdmin.role !== Role.ADMIN) {
        console.log("\n🔄 Updating user to ADMIN role...");
        await prisma.user.update({
          where: { email },
          data: { 
            role: Role.ADMIN,
            isActive: true,
          },
        });
        console.log("✅ User updated to ADMIN role successfully!");
      }
      
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: Role.ADMIN,
        isActive: true,
        emailVerified: new Date(),
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("\n📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("👤 Name:", name);
    console.log("🆔 User ID:", admin.id);
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");
    console.log("\n🌐 Login at: http://localhost:3000/login");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
