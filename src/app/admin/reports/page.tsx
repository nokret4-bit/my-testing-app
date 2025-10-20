import { redirect } from "next/navigation";
import { getServerSession, isStaffOrAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Download,
  Users,
  Building2
} from "lucide-react";
import { BookingStatus } from "@prisma/client";
import { startOfMonth, endOfMonth, format } from "date-fns";

export default async function AdminReportsPage() {
  const session = await getServerSession();
  if (!isStaffOrAdmin(session)) redirect("/");

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Fetch current month stats
  const [
    totalRevenue,
    monthlyRevenue,
    totalBookings,
    monthlyBookings,
    confirmedBookings,
    cancelledBookings,
    facilities,
  ] = await Promise.all([
    prisma.booking.aggregate({
      where: {
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
      },
      _sum: { totalAmount: true },
    }),
    prisma.booking.aggregate({
      where: {
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
        confirmedAt: { gte: monthStart, lte: monthEnd },
      },
      _sum: { totalAmount: true },
    }),
    prisma.booking.count(),
    prisma.booking.count({
      where: {
        createdAt: { gte: monthStart, lte: monthEnd },
      },
    }),
    prisma.booking.count({
      where: { status: BookingStatus.CONFIRMED },
    }),
    prisma.booking.count({
      where: { status: BookingStatus.CANCELLED },
    }),
    prisma.facility.count({ where: { isActive: true } }),
  ]);

  // Bookings by facility type
  const bookingsByType = await prisma.booking.groupBy({
    by: ["facilityId"],
    where: {
      status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
    },
    _count: true,
    _sum: { totalAmount: true },
  });

  const facilityData = await prisma.facility.findMany({
    where: {
      id: { in: bookingsByType.map((b) => b.facilityId) },
    },
  });

  const typeStats = bookingsByType.map((booking) => {
    const facility = facilityData.find((f) => f.id === booking.facilityId);
    return {
      type: facility?.kind || "Unknown",
      count: booking._count,
      revenue: Number(booking._sum.totalAmount || 0),
    };
  });

  // Recent bookings
  const recentBookings = await prisma.booking.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      facility: true,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Reports & Analytics</h1>
              <p className="text-sm text-muted-foreground">
                {format(now, "MMMM yyyy")} Overview
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/admin">Back to Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/api/admin/export">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱{Number(totalRevenue._sum.totalAmount || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱{Number(monthlyRevenue._sum.totalAmount || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {monthlyBookings} bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {confirmedBookings} confirmed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Facilities</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{facilities}</div>
              <p className="text-xs text-muted-foreground mt-1">Available for booking</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue by Facility Type */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Facility Type</CardTitle>
              <CardDescription>Breakdown of earnings by category</CardDescription>
            </CardHeader>
            <CardContent>
              {typeStats.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No data available</p>
              ) : (
                <div className="space-y-4">
                  {typeStats.map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{stat.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {stat.count} bookings
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₱{stat.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
              <CardDescription>Current booking distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Confirmed</Badge>
                    <span className="text-sm text-muted-foreground">Active bookings</span>
                  </div>
                  <span className="font-bold">{confirmedBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Cancelled</Badge>
                    <span className="text-sm text-muted-foreground">Cancelled bookings</span>
                  </div>
                  <span className="font-bold">{cancelledBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Total</Badge>
                    <span className="text-sm text-muted-foreground">All bookings</span>
                  </div>
                  <span className="font-bold">{totalBookings}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest 10 reservations</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{booking.code}</p>
                        <Badge
                          variant={
                            booking.status === "CONFIRMED"
                              ? "default"
                              : booking.status === "CANCELLED"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.facility.name} • {booking.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(booking.createdAt, "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ₱{Number(booking.totalAmount).toLocaleString()}
                      </p>
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
