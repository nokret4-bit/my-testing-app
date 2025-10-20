import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = "admin@manuelresort.com";
    const password = "Admin@123456"; // Change this password!
    const name = "System Administrator";

    console.log("🔍 Checking for existing admin user...\n");

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("❌ Admin user already exists with email:", email);
      console.log("   User ID:", existingAdmin.id);
      console.log("   Role:", existingAdmin.role);
      
      if (existingAdmin.role !== "ADMIN") {
        console.log("\n🔄 Updating user to ADMIN role...");
        await prisma.user.update({
          where: { email },
          data: { 
            role: "ADMIN",
            isActive: true,
          },
        });
        console.log("✅ User updated to ADMIN role successfully!");
        console.log("\n📧 Email:", email);
        console.log("🔑 Password: (use your existing password)");
      } else {
        console.log("\n✅ Admin user is already set up correctly!");
        console.log("\n📧 Email:", email);
        console.log("🔑 Password: (use your existing password)");
      }
      
      console.log("\n🌐 Login at: http://localhost:3000/login");
      return;
    }

    console.log("📝 Creating new admin user...\n");

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        id: `admin${Date.now()}`,
        email,
        name,
        passwordHash,
        role: "ADMIN",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("\n" + "=".repeat(50));
    console.log("📧 Email:    ", email);
    console.log("🔑 Password: ", password);
    console.log("👤 Name:     ", name);
    console.log("🆔 User ID:  ", admin.id);
    console.log("=".repeat(50));
    console.log("\n⚠️  IMPORTANT: Change the password after first login!");
    console.log("\n🌐 Login at: http://localhost:3000/login");
    console.log("\n📋 After login, you can:");
    console.log("   • Access Admin Dashboard at /admin");
    console.log("   • Create staff accounts at /admin/staff");
    console.log("   • View login logs at /admin/login-logs");
    console.log("   • Manage bookings at /admin/reservations");
  } catch (error) {
    console.error("\n❌ Error creating admin:", error);
    console.error("\nTroubleshooting:");
    console.error("1. Make sure you've run: npx prisma migrate dev");
    console.error("2. Check your database connection in .env");
    console.error("3. Ensure the database is running");
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
