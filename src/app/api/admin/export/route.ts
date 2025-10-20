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
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: {
      createdAt?: { gte: Date; lte: Date };
    } = {};

    if (from && to) {
      where.createdAt = {
        gte: new Date(from),
        lte: new Date(to),
      };
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
            name: true,
            email: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Generate CSV
    const headers = [
      "Booking Code",
      "Status",
      "Customer Name",
      "Customer Email",
      "Facility",
      "Type",
      "Start Date",
      "End Date",
      "Total Amount",
      "Created At",
    ];

    const rows = bookings.map((booking) => [
      booking.code,
      booking.status,
      booking.customerName,
      booking.customerEmail,
      booking.facilityUnit.name,
      booking.facilityUnit.facilityType.kind,
      booking.startDate.toISOString(),
      booking.endDate.toISOString(),
      booking.totalAmount.toString(),
      booking.createdAt.toISOString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="bookings-export-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error("Admin export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
