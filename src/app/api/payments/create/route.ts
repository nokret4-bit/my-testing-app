import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreatePaymentSchema } from "@/schemas/payment";
import { createPaymentIntent } from "@/lib/payments/paymongo";
import { BookingStatus, PaymentProvider, PaymentStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = CreatePaymentSchema.parse(body);

    // Find booking
    const booking = await prisma.booking.findUnique({
      where: { id: validated.bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== BookingStatus.AWAITING_PAYMENT) {
      return NextResponse.json(
        { error: "Booking is not awaiting payment" },
        { status: 400 }
      );
    }

    // Create payment intent with PayMongo
    const intent = await createPaymentIntent({
      amount: Number(booking.totalAmount),
      currency: "PHP",
      bookingId: booking.id,
      returnUrl: validated.returnUrl,
    });

    // Store payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: PaymentProvider.PAYMONGO,
        intentId: intent.intentId,
        status: PaymentStatus.PENDING,
        amount: booking.totalAmount,
        currency: booking.currency,
        rawData: intent,
      },
    });

    return NextResponse.json({
      checkoutUrl: intent.checkoutUrl,
      clientSecret: intent.clientSecret,
      provider: intent.provider,
    });
  } catch (error) {
    console.error("Create payment API error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
