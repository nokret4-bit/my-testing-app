import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only CASHIER, STAFF, and ADMIN can verify bookings
    if (
      session.user.role !== "CASHIER" &&
      session.user.role !== "STAFF" &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const bookingCode = searchParams.get("code");

    if (!bookingCode) {
      return NextResponse.json(
        { error: "Booking code is required" },
        { status: 400 }
      );
    }

    // Find booking by code
    const booking = await prisma.booking.findUnique({
      where: { code: bookingCode },
      include: {
        facilityUnit: {
          include: {
            facilityType: true,
          },
        },
        payments: {
          where: {
            status: "SUCCEEDED",
          },
          orderBy: {
            paidAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Determine check-in eligibility
    const canCheckIn = 
      (booking.status === "CONFIRMED" || booking.status === "PAID") &&
      !booking.checkedInAt;

    return NextResponse.json({
      booking: {
        id: booking.id,
        code: booking.code,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        facilityUnit: booking.facilityUnit.name,
        facilityType: booking.facilityUnit.facilityType.name,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status,
        checkedInAt: booking.checkedInAt,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        canCheckIn,
        isPaid: booking.payments.length > 0,
      },
    });
  } catch (error) {
    console.error("Error verifying booking:", error);
    return NextResponse.json(
      { error: "Failed to verify booking" },
      { status: 500 }
    );
  }
}
