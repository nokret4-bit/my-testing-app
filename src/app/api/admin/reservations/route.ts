import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession, isStaffOrAdmin } from "@/lib/auth";
import { BookingStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!isStaffOrAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as BookingStatus | null;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: {
      status?: BookingStatus;
      startDate?: { gte: Date };
      endDate?: { lte: Date };
    } = {};

    if (status) {
      where.status = status;
    }

    if (from) {
      where.startDate = { gte: new Date(from) };
    }

    if (to) {
      where.endDate = { lte: new Date(to) };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        facilityUnit: {
          include: {
            facilityType: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Admin reservations GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}
