import { redirect } from "next/navigation";
import { getServerSession, isStaffOrAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Calendar, DollarSign, Users, BarChart3, UserCog, Activity, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookingStatus } from "@prisma/client";

export default async function AdminDashboard() {
  const session = await getServerSession();

  if (!isStaffOrAdmin(session)) {
    redirect("/");
  }

  // Fetch dashboard stats
  const [totalBookings, activeBookings, totalRevenue, totalFacilities] = await Promise.all([
    prisma.bookings.count(),
    prisma.bookings.count({
      where: {
        status: {
          in: [BookingStatus.CONFIRMED],
        },
      },
    }),
    prisma.bookings.aggregate({
      where: {
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        },
      },
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.facilities.count({
      where: { isActive: true },
    }),
  ]);

  const recentBookings = await prisma.bookings.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      facilities: true,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Link href="/">
              <Button variant="outline">Back to Site</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱{Number(totalRevenue._sum.totalAmount || 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Facilities</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFacilities}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/reservations">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Reservations</CardTitle>
                    <CardDescription>View and manage all bookings</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/facilities">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Facilities</CardTitle>
                    <CardDescription>Manage rooms, cottages, and halls</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/reports">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Reports</CardTitle>
                    <CardDescription>View revenue and occupancy reports</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {session?.user?.role === "ADMIN" && (
            <>
              <Link href="/admin/staff">
                <Card className="hover:bg-accent transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <UserCog className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle>Staff Management</CardTitle>
                        <CardDescription>Manage staff accounts and permissions</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/admin/activity-logs">
                <Card className="hover:bg-accent transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle>Activity Logs</CardTitle>
                        <CardDescription>Track all system activities</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </>
          )}
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest reservations in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-muted-foreground">No bookings yet</p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-semibold">{booking.code}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.facilities.name} - {booking.customerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₱{Number(booking.totalAmount).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{booking.status}</p>
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
