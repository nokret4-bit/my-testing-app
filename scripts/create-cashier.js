const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createCashier() {
  try {
    console.log("\n=== Create Cashier User ===\n");

    const name = await question("Enter cashier name: ");
    const email = await question("Enter cashier email: ");
    const password = await question("Enter password: ");

    if (!name || !email || !password) {
      console.error("All fields are required!");
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error(`User with email ${email} already exists!`);
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create cashier user
    const cashier = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "CASHIER",
        isActive: true,
      },
    });

    console.log("\n✅ Cashier user created successfully!");
    console.log(`Name: ${cashier.name}`);
    console.log(`Email: ${cashier.email}`);
    console.log(`Role: ${cashier.role}`);
    console.log(`\nThe cashier can now log in and access the Cashier Dashboard at /cashier`);
  } catch (error) {
    console.error("Error creating cashier:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

createCashier();
