import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession, isStaffOrAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!isStaffOrAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const facilityTypes = await prisma.facilityType.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ facilityTypes });
  } catch (error) {
    console.error("Get facility types error:", error);
    return NextResponse.json({ error: "Failed to fetch facility types" }, { status: 500 });
  }
}
