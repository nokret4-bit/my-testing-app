import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CancelBookingButton } from "@/components/cancel-booking-button";
import { BookingQRCode } from "@/components/booking-qrcode";
import Link from "next/link";

interface BookingPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { code } = await params;
  const booking = await prisma.booking.findUnique({
    where: { code },
    include: {
      facility: true,
      payment: true,
    },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">Booking Details</h1>
              <StatusBadge status={booking.status} />
            </div>
            <p className="text-muted-foreground">Booking Code: {booking.code}</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Facility Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Facility:</span>
                  <span className="font-semibold">{booking.facility.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{booking.facility.kind}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in:</span>
                  <span>{formatDateTime(booking.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out:</span>
                  <span>{formatDateTime(booking.endDate)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{booking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{booking.customerEmail}</span>
                </div>
                {booking.customerPhone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{booking.customerPhone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(Number(booking.totalAmount))}</span>
                </div>
              </CardContent>
            </Card>

            {/* QR Code for Check-in */}
            {booking.status === "CONFIRMED" && (
              <BookingQRCode bookingId={booking.id} bookingCode={booking.code} />
            )}

            {booking.status === "PENDING" && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Payment Required</CardTitle>
                  <CardDescription>
                    Complete your payment to confirm this booking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/checkout?facilityId=${booking.facilityId}`}>
                      Complete Payment
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Cancel Booking Section */}
            {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Cancel Booking</CardTitle>
                  <CardDescription>
                    Need to cancel? You can cancel your booking here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CancelBookingButton 
                    bookingId={booking.id}
                    bookingCode={booking.code}
                    status={booking.status}
                  />
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Link href="/browse" className="flex-1">
                <Button variant="outline" className="w-full">
                  Browse More Facilities
                </Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
