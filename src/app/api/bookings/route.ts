import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateBookingSchema } from "@/schemas/booking";
import { checkAvailability } from "@/lib/availability";
import { calculatePrice } from "@/lib/pricing";
import { generateBookingCode } from "@/lib/utils";
import { getServerSession } from "@/lib/auth";
import { parseISO, addMinutes } from "date-fns";
import { BookingStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateBookingSchema.parse(body);
    const session = await getServerSession();

    const startDate = parseISO(validated.startDate);
    const endDate = parseISO(validated.endDate);

    // Check availability
    const availCheck = await checkAvailability(validated.unitId, startDate, endDate);
    if (!availCheck.available) {
      return NextResponse.json(
        { error: availCheck.reason || "Facility not available" },
        { status: 400 }
      );
    }

    // Calculate pricing
    const pricing = await calculatePrice(validated.unitId, startDate, endDate);

    // Create booking with AWAITING_PAYMENT status
    const bookingCode = generateBookingCode();
    const expiresAt = addMinutes(new Date(), 15); // 15-minute hold

    const booking = await prisma.booking.create({
      data: {
        code: bookingCode,
        userId: session?.user?.id,
        facilityUnitId: validated.unitId,
        startDate,
        endDate,
        status: BookingStatus.AWAITING_PAYMENT,
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        customerPhone: validated.customerPhone,
        specialRequests: validated.specialRequests,
        subtotal: pricing.subtotal,
        taxAmount: pricing.taxAmount,
        feeAmount: pricing.feeAmount,
        totalAmount: pricing.totalAmount,
        currency: pricing.currency,
        expiresAt,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id,
        action: "CREATE_BOOKING",
        entity: "Booking",
        entityId: booking.id,
        data: { bookingCode, status: booking.status },
      },
    });

    return NextResponse.json({
      bookingId: booking.id,
      code: booking.code,
      status: booking.status,
      totalAmount: booking.totalAmount,
      expiresAt: booking.expiresAt,
    });
  } catch (error) {
    console.error("Create booking API error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        facilityUnit: {
          include: {
            facilityType: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Get bookings API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
