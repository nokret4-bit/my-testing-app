import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession, isStaffOrAdmin } from "@/lib/auth";
import { BookingStatus } from "@prisma/client";
import { startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!isStaffOrAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const reportType = searchParams.get("type") || "revenue";
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const startDate = from ? new Date(from) : startOfMonth(new Date());
    const endDate = to ? new Date(to) : endOfMonth(new Date());

    if (reportType === "revenue") {
      return await getRevenueReport(startDate, endDate);
    } else if (reportType === "bookings") {
      return await getBookingsReport(startDate, endDate);
    } else if (reportType === "occupancy") {
      return await getOccupancyReport(startDate, endDate);
    }

    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
  } catch (error) {
    console.error("Admin reports GET error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

async function getRevenueReport(startDate: Date, endDate: Date) {
  const bookings = await prisma.booking.findMany({
    where: {
      status: {
        in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
      },
      confirmedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      facilityUnit: {
        include: {
          facilityType: true,
        },
      },
      payments: true,
    },
  });

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + Number(booking.totalAmount),
    0
  );

  const revenueByType = bookings.reduce(
    (acc, booking) => {
      const type = booking.facilityUnit.facilityType.kind;
      acc[type] = (acc[type] || 0) + Number(booking.totalAmount);
      return acc;
    },
    {} as Record<string, number>
  );

  return NextResponse.json({
    reportType: "revenue",
    period: { from: startDate, to: endDate },
    totalRevenue,
    revenueByType,
    bookingsCount: bookings.length,
  });
}

async function getBookingsReport(startDate: Date, endDate: Date) {
  const bookings = await prisma.booking.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      facilityUnit: {
        include: {
          facilityType: true,
        },
      },
    },
  });

  const bookingsByStatus = bookings.reduce(
    (acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const bookingsByType = bookings.reduce(
    (acc, booking) => {
      const type = booking.facilityUnit.facilityType.kind;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return NextResponse.json({
    reportType: "bookings",
    period: { from: startDate, to: endDate },
    totalBookings: bookings.length,
    bookingsByStatus,
    bookingsByType,
  });
}

async function getOccupancyReport(startDate: Date, endDate: Date) {
  const facilities = await prisma.facilityUnit.findMany({
    where: { isActive: true },
    include: {
      facilityType: true,
      bookings: {
        where: {
          status: {
            in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
          },
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      },
    },
  });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const totalDays = days.length;
  const totalUnits = facilities.length;
  const totalCapacity = totalDays * totalUnits;

  let occupiedDays = 0;
  facilities.forEach((facility) => {
    facility.bookings.forEach((booking) => {
      const bookingDays = eachDayOfInterval({
        start: booking.startDate > startDate ? booking.startDate : startDate,
        end: booking.endDate < endDate ? booking.endDate : endDate,
      });
      occupiedDays += bookingDays.length;
    });
  });

  const occupancyRate = totalCapacity > 0 ? (occupiedDays / totalCapacity) * 100 : 0;

  return NextResponse.json({
    reportType: "occupancy",
    period: { from: startDate, to: endDate },
    totalUnits,
    totalDays,
    occupiedDays,
    occupancyRate: Math.round(occupancyRate * 100) / 100,
  });
}
