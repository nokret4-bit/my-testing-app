import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession, isAdmin } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    // Only admins can edit bookings
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 });
    }

    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      startDate,
      endDate,
      specialRequests,
      status,
    } = body;

    // Update booking
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        customerName,
        customerEmail,
        customerPhone,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        specialRequests,
        status,
      },
    });

    // Log audit
    if (session?.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "UPDATE_BOOKING",
          entity: "Booking",
          entityId: booking.id,
          data: { code: booking.code, status },
        },
      });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    // Only admins can delete bookings
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Delete related records first
    await prisma.payment.deleteMany({
      where: { bookingId: params.id },
    });

    await prisma.auditLog.deleteMany({
      where: { entityId: params.id, entity: "Booking" },
    });

    // Delete booking
    await prisma.booking.delete({
      where: { id: params.id },
    });

    // Log audit
    if (session?.user?.id) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "DELETE_BOOKING",
          entity: "Booking",
          entityId: params.id,
          data: { code: booking.code },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
