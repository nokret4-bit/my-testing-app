import { PrismaClient, FacilityKind, PriceType, Role } from "@prisma/client";
import { addDays } from "date-fns";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@clickstay.local" },
    update: {
      // ensure password gets set if user already exists from a prior seed
      passwordHash: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
    create: {
      email: "admin@clickstay.local",
      name: "Admin User",
      role: Role.ADMIN,
      emailVerified: new Date(),
      // store password hash for credentials login
      passwordHash: adminPassword,
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create facility types
  const roomType = await prisma.facility_types.upsert({
    where: { kind: FacilityKind.ROOM },
    update: {},
    create: {
      kind: FacilityKind.ROOM,
      name: "Guest Rooms",
      description: "Comfortable rooms with modern amenities",
      amenities: ["WiFi", "Air Conditioning", "TV", "Mini Fridge"],
      policies: {
        checkIn: "2:00 PM",
        checkOut: "12:00 PM",
        cancellation: "Free cancellation up to 24 hours before check-in",
      },
    },
  });

  const cottageType = await prisma.facility_types.upsert({
    where: { kind: FacilityKind.COTTAGE },
    update: {},
    create: {
      kind: FacilityKind.COTTAGE,
      name: "Pool Cottages",
      description: "Private cottages with pool access",
      amenities: ["Pool Access", "BBQ Grill", "Outdoor Seating", "WiFi"],
      policies: {
        checkIn: "10:00 AM",
        checkOut: "6:00 PM",
        cancellation: "Free cancellation up to 48 hours before reservation",
      },
    },
  });

  const hallType = await prisma.facility_types.upsert({
    where: { kind: FacilityKind.HALL },
    update: {},
    create: {
      kind: FacilityKind.HALL,
      name: "Function Halls",
      description: "Spacious halls for events and gatherings",
      amenities: ["Sound System", "Projector", "Tables & Chairs", "Air Conditioning"],
      policies: {
        minimumHours: 4,
        setup: "Setup time included in booking",
        cancellation: "50% refund if cancelled 7 days before event",
      },
    },
  });

  console.log("✅ Created facility types");

  // Create rooms
  const rooms = [
    {
      name: "Room 101 - Deluxe",
      description: "Spacious deluxe room with king-size bed and ocean view",
      capacity: 2,
      photos: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      ],
    },
    {
      name: "Room 102 - Standard",
      description: "Cozy standard room with queen-size bed",
      capacity: 2,
      photos: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800"],
    },
    {
      name: "Room 103 - Family Suite",
      description: "Large family suite with two queen beds",
      capacity: 4,
      photos: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"],
    },
  ];

  const createdRooms = [];
  for (const room of rooms) {
    const unit = await prisma.facility_units.create({
      data: {
        ...room,
        facilityTypeId: roomType.id,
        amenities: ["WiFi", "Air Conditioning", "TV", "Mini Fridge", "Hot Shower"],
      },
    });
    createdRooms.push(unit);
  }
  console.log(`✅ Created ${createdRooms.length} rooms`);

  // Create cottages
  const cottages = [
    {
      name: "Cottage A - Premium",
      description: "Premium cottage with direct pool access",
      capacity: 8,
      photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"],
    },
    {
      name: "Cottage B - Standard",
      description: "Standard cottage near the pool area",
      capacity: 6,
      photos: ["https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800"],
    },
  ];

  const createdCottages = [];
  for (const cottage of cottages) {
    const unit = await prisma.facility_units.create({
      data: {
        ...cottage,
        facilityTypeId: cottageType.id,
        amenities: ["Pool Access", "BBQ Grill", "Outdoor Seating", "WiFi", "Refrigerator"],
      },
    });
    createdCottages.push(unit);
  }
  console.log(`✅ Created ${createdCottages.length} cottages`);

  // Create function hall
  const hall = await prisma.facility_units.create({
    data: {
      name: "Grand Function Hall",
      description: "Elegant function hall perfect for weddings and corporate events",
      capacity: 100,
      facilityTypeId: hallType.id,
      photos: ["https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?w=800"],
      amenities: [
        "Sound System",
        "Projector & Screen",
        "Stage",
        "Tables & Chairs for 100",
        "Air Conditioning",
        "Kitchen Access",
      ],
    },
  });
  console.log("✅ Created function hall");

  // Create rate plans
  const today = new Date();
  const nextYear = addDays(today, 365);

  // Type-level rate plans
  await prisma.rate_plans.create({
    data: {
      name: "Standard Room Rate",
      description: "Default rate for all rooms",
      priceType: PriceType.PER_NIGHT,
      basePrice: 2500,
      currency: "PHP",
      effective_from: today,
      effective_to: nextYear,
      facility_type_id: roomType.id,
    },
  });

  await prisma.rate_plans.create({
    data: {
      name: "Standard Cottage Rate",
      description: "Default rate for cottages",
      price_type: PriceType.PER_SLOT,
      base_price: 5000,
      currency: "PHP",
      effective_from: today,
      effective_to: nextYear,
      facility_type_id: cottageType.id,
    },
  });

  await prisma.rate_plans.create({
    data: {
      name: "Function Hall Rate",
      description: "Per slot rate for function hall",
      priceType: PriceType.PER_SLOT,
      basePrice: 15000,
      currency: "PHP",
      effectiveFrom: today,
      effectiveTo: nextYear,
      facilityTypeId: hallType.id,
    },
  });

  // Unit-specific promo rate
  await prisma.rate_plans.create({
    data: {
      name: "Deluxe Room Promo",
      description: "Special promotional rate for Room 101",
      priceType: PriceType.PER_NIGHT,
      basePrice: 2000,
      currency: "PHP",
      effectiveFrom: today,
      effectiveTo: addDays(today, 90),
      facilityUnitId: createdRooms[0]?.id,
    },
  });

  console.log("✅ Created rate plans");

  // Create inventory calendar for next 30 days for all units
  const allUnits = [...createdRooms, ...createdCottages, hall];
  let inventoryCount = 0;

  for (const unit of allUnits) {
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      await prisma.inventory_calendar.create({
        data: {
          facilityUnitId: unit.id,
          date,
          allotment: 1,
          available: 1,
        },
      });
      inventoryCount++;
    }
  }

  console.log(`✅ Created ${inventoryCount} inventory calendar entries`);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
