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
    prisma.booking.count(),
    prisma.booking.count({
      where: {
        status: {
          in: [BookingStatus.CONFIRMED],
        },
      },
    }),
    prisma.booking.aggregate({
      where: {
        status: {
          in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
        },
      },
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.facility.count({
      where: { isActive: true },
    }),
  ]);

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      facility: true,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your resort operations</p>
            </div>
            <Link href="/">
              <Button 
                variant="outline" 
                size="lg"
                className="hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer border-2 font-semibold"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Site
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">All time reservations</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently confirmed</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                ₱{Number(totalRevenue._sum.totalAmount || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total earnings</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Facilities</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalFacilities}</div>
              <p className="text-xs text-muted-foreground mt-1">Available properties</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/reservations" className="group">
            <Card className="border-2 hover:shadow-xl hover:border-blue-400 hover:scale-105 transition-all duration-200 cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="h-7 w-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">Reservations</CardTitle>
                    <CardDescription className="text-sm">View and manage all bookings</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/facilities" className="group">
            <Card className="border-2 hover:shadow-xl hover:border-green-400 hover:scale-105 transition-all duration-200 cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="h-7 w-7 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">Facilities</CardTitle>
                    <CardDescription className="text-sm">Manage rooms, cottages, and halls</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/reports" className="group">
            <Card className="border-2 hover:shadow-xl hover:border-purple-400 hover:scale-105 transition-all duration-200 cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-7 w-7 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">Reports</CardTitle>
                    <CardDescription className="text-sm">View revenue and occupancy reports</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          {session?.user?.role === "ADMIN" && (
            <>
              <Link href="/admin/staff" className="group">
                <Card className="border-2 hover:shadow-xl hover:border-orange-400 hover:scale-105 transition-all duration-200 cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UserCog className="h-7 w-7 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">Staff Management</CardTitle>
                        <CardDescription className="text-sm">Manage staff accounts and permissions</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/admin/activity-logs" className="group">
                <Card className="border-2 hover:shadow-xl hover:border-indigo-400 hover:scale-105 transition-all duration-200 cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Activity className="h-7 w-7 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">Activity Logs</CardTitle>
                        <CardDescription className="text-sm">Track all system activities</CardDescription>
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
                        {booking.facility.name} - {booking.customerName}
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
