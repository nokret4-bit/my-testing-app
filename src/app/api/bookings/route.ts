import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { CreateBookingSchema } from "@/schemas/booking";
import { BookingStatus } from "@prisma/client";
import { calculatePrice } from "@/lib/pricing";
import { generateBookingCode } from "@/lib/utils";
import { addMinutes } from "date-fns";
import crypto from "crypto";
import { parseISO } from "date-fns";
import { checkAvailability } from "@/lib/availability";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreateBookingSchema.parse(body);
    const session = await getServerSession();

    const startDate = parseISO(validated.startDate);
    const endDate = parseISO(validated.endDate);

    // Check availability
    const isAvailable = await checkAvailability(validated.unitId, startDate, endDate);
    if (!isAvailable) {
      return NextResponse.json(
        { error: "Facility not available" },
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
        id: crypto.randomUUID(),
        code: bookingCode,
        userId: session?.user?.id,
        facilityId: validated.unitId,
        startDate,
        endDate,
        guests: 1,
        status: BookingStatus.PENDING,
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        customerPhone: validated.customerPhone,
        totalAmount: pricing.totalAmount,
        notes: validated.specialRequests,
        updatedAt: new Date(),
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id || "",
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
        facility: true,
        payment: true,
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
