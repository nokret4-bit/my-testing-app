import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseQRCodeData } from "@/lib/qrcode";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only CASHIER, STAFF, and ADMIN can check in guests
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

    const body = await request.json();
    const { qrData } = body;

    if (!qrData) {
      return NextResponse.json(
        { error: "QR code data is required" },
        { status: 400 }
      );
    }

    // Parse QR code data
    let parsedData;
    try {
      parsedData = parseQRCodeData(qrData);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid QR code format" },
        { status: 400 }
      );
    }

    // Find booking
    const booking = await prisma.booking.findUnique({
      where: { id: parsedData.bookingId },
      include: {
        facilityUnit: {
          include: {
            facilityType: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify booking code matches
    if (booking.code !== parsedData.bookingCode) {
      return NextResponse.json(
        { error: "Invalid booking code" },
        { status: 400 }
      );
    }

    // Check if booking is in valid status for check-in
    if (booking.status !== "CONFIRMED" && booking.status !== "PAID") {
      return NextResponse.json(
        {
          error: `Cannot check in - booking status is ${booking.status}`,
          status: booking.status,
        },
        { status: 400 }
      );
    }

    // Check if already checked in
    if (booking.checkedInAt) {
      return NextResponse.json(
        {
          message: "Guest already checked in",
          booking: {
            id: booking.id,
            code: booking.code,
            customerName: booking.customerName,
            facilityUnit: booking.facilityUnit.name,
            checkedInAt: booking.checkedInAt,
            status: "ALREADY_CHECKED_IN",
          },
        },
        { status: 200 }
      );
    }

    // Update booking with check-in timestamp
    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        checkedInAt: new Date(),
      },
      include: {
        facilityUnit: {
          include: {
            facilityType: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "BOOKING_CHECKED_IN",
        entity: "Booking",
        entityId: booking.id,
        data: {
          bookingCode: booking.code,
          customerName: booking.customerName,
          checkedInBy: session.user.email,
        },
      },
    });

    return NextResponse.json({
      message: "Check-in successful",
      booking: {
        id: updatedBooking.id,
        code: updatedBooking.code,
        customerName: updatedBooking.customerName,
        customerEmail: updatedBooking.customerEmail,
        customerPhone: updatedBooking.customerPhone,
        facilityUnit: updatedBooking.facilityUnit.name,
        facilityType: updatedBooking.facilityUnit.facilityType.name,
        startDate: updatedBooking.startDate,
        endDate: updatedBooking.endDate,
        checkedInAt: updatedBooking.checkedInAt,
        status: "CHECKED_IN",
      },
    });
  } catch (error) {
    console.error("Error during check-in:", error);
    return NextResponse.json(
      { error: "Failed to process check-in" },
      { status: 500 }
    );
  }
}
