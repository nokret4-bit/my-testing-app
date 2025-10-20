import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature, parseEvent } from "@/lib/payments/paymongo";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { sendMail } from "@/lib/email/transport";
import { render } from "@react-email/components";
import { BookingConfirmationEmail, PaymentReceivedEmail } from "@/lib/email/templates";
import { generateICS } from "@/lib/email/ics";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("paymongo-signature") || "";

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = parseEvent(payload);

    console.log("PayMongo webhook received:", event.type);

    // Handle different event types
    if (event.type === "source.chargeable") {
      await handlePaymentSuccess(event.id);
    } else if (event.type === "payment.paid") {
      await handlePaymentSuccess(event.id);
    } else if (event.type === "payment.failed") {
      await handlePaymentFailed(event.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(intentId: string) {
  // Find payment by intent ID
  const payment = await prisma.payment.findUnique({
    where: { intentId },
    include: {
      booking: {
        include: {
          facilityUnit: {
            include: {
              facilityType: true,
            },
          },
        },
      },
    },
  });

  if (!payment) {
    console.error("Payment not found for intent:", intentId);
    return;
  }

  // Idempotency check
  if (payment.status === PaymentStatus.SUCCEEDED) {
    console.log("Payment already processed:", intentId);
    return;
  }

  // Update payment status
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: PaymentStatus.SUCCEEDED,
      paidAt: new Date(),
    },
  });

  // Update booking status
  const booking = await prisma.booking.update({
    where: { id: payment.bookingId },
    data: {
      status: BookingStatus.CONFIRMED,
      confirmedAt: new Date(),
    },
  });

  // Log audit
  await prisma.auditLog.create({
    data: {
      action: "PAYMENT_SUCCESS",
      entity: "Payment",
      entityId: payment.id,
      data: { bookingId: booking.id, intentId },
    },
  });

  // Send confirmation emails
  const icsAttachment = generateICS({
    title: `Booking at ${booking.facilityUnit.name}`,
    description: `Your booking at Manuel Resort\nBooking Code: ${booking.code}`,
    location: "Manuel Resort, Philippines",
    startDate: booking.startDate,
    endDate: booking.endDate,
    organizerEmail: "reservations@clickstay.local",
    attendeeEmail: booking.customerEmail,
  });

  const confirmationHtml = render(
    BookingConfirmationEmail({
      bookingCode: booking.code,
      customerName: booking.customerName,
      facilityName: booking.facilityUnit.name,
      startDate: formatDate(booking.startDate),
      endDate: formatDate(booking.endDate),
      totalAmount: formatCurrency(Number(booking.totalAmount)),
      manageUrl: `${process.env.NEXT_PUBLIC_APP_URL}/booking/${booking.code}`,
    })
  );

  await sendMail({
    to: booking.customerEmail,
    subject: `Booking Confirmed - ${booking.code}`,
    html: confirmationHtml,
    icsAttachment,
  });

  const paymentHtml = render(
    PaymentReceivedEmail({
      bookingCode: booking.code,
      customerName: booking.customerName,
      amount: formatCurrency(Number(payment.amount)),
      paymentMethod: "GCash",
    })
  );

  await sendMail({
    to: booking.customerEmail,
    subject: `Payment Received - ${booking.code}`,
    html: paymentHtml,
  });

  console.log("Payment success processed:", intentId);
}

async function handlePaymentFailed(intentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { intentId },
    include: { booking: true },
  });

  if (!payment) {
    console.error("Payment not found for intent:", intentId);
    return;
  }

  // Update payment status
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: PaymentStatus.FAILED,
    },
  });

  // Cancel booking if payment failed
  await prisma.booking.update({
    where: { id: payment.bookingId },
    data: {
      status: BookingStatus.CANCELLED,
      cancelledAt: new Date(),
    },
  });

  // Log audit
  await prisma.auditLog.create({
    data: {
      action: "PAYMENT_FAILED",
      entity: "Payment",
      entityId: payment.id,
      data: { bookingId: payment.bookingId, intentId },
    },
  });

  console.log("Payment failed processed:", intentId);
}
