import { redirect } from "next/navigation";
import { getServerSession, isStaffOrAdmin, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditBookingButton } from "@/components/edit-booking-button";
import { DeleteBookingButton } from "@/components/delete-booking-button";

export default async function AdminReservationsPage() {
  const session = await getServerSession();

  if (!isStaffOrAdmin(session)) {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    include: {
      facility: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Reservations</h1>
            <Link href="/admin">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Reservations</CardTitle>
            <CardDescription>Manage all bookings in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground">No reservations found</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.code}</h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.customerName} ({booking.customerEmail})
                        </p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Facility</p>
                        <p className="font-medium">{booking.facility.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Check-in</p>
                        <p className="font-medium">{formatDate(booking.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Check-out</p>
                        <p className="font-medium">{formatDate(booking.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-medium">
                          {formatCurrency(Number(booking.totalAmount))}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link href={`/booking/${booking.code}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                      {isAdmin(session) && (
                        <>
                          <EditBookingButton
                            booking={{
                              id: booking.id,
                              code: booking.code,
                              customerName: booking.customerName,
                              customerEmail: booking.customerEmail,
                              customerPhone: booking.customerPhone,
                              startDate: booking.startDate,
                              endDate: booking.endDate,
                              specialRequests: booking.notes,
                              status: booking.status,
                            }}
                          />
                          <DeleteBookingButton
                            bookingId={booking.id}
                            bookingCode={booking.code}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
