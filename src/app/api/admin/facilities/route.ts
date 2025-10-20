import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession, isStaffOrAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!isStaffOrAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const facilities = await prisma.facility.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ facilities });
  } catch (error) {
    console.error("Admin facilities GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch facilities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!isStaffOrAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const facility = await prisma.facility.create({
      data: {
        id: `fac${Date.now()}`,
        name: body.name,
        kind: body.kind,
        description: body.description || null,
        capacity: body.capacity,
        price: body.price,
        photos: body.photos || [],
        amenities: body.amenities || [],
        isActive: body.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ facility });
  } catch (error) {
    console.error("Admin facilities POST error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create facility" },
      { status: 500 }
    );
  }
}
