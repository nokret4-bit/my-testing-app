import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateBookingQRCode } from "@/lib/qrcode";
import { format } from "date-fns";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params;
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch booking with related data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        facility: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this booking
    if (
      booking.userId !== session.user.id &&
      session.user.role !== "ADMIN" &&
      session.user.role !== "STAFF"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Generate QR code
    const qrCodeDataUrl = await generateBookingQRCode({
      bookingId: booking.id,
      bookingCode: booking.code,
      customerName: booking.customerName,
      facilityUnit: booking.facility.name,
      checkInDate: format(booking.startDate, "yyyy-MM-dd"),
    });

    return NextResponse.json({
      qrCode: qrCodeDataUrl,
      bookingCode: booking.code,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
