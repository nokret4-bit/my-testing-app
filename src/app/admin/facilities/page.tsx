import { redirect } from "next/navigation";
import { getServerSession, isStaffOrAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, Users, Eye, Edit, Plus } from "lucide-react";
import { DeleteFacilityButton } from "@/components/delete-facility-button";

export default async function AdminFacilitiesPage() {
  const session = await getServerSession();
  if (!isStaffOrAdmin(session)) redirect("/");

  const facilities = await prisma.facility.findMany({
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    total: facilities.length,
    active: facilities.filter((f) => f.isActive).length,
    inactive: facilities.filter((f) => !f.isActive).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Facility Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage rooms, cottages, and function halls
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/admin">Back to Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/admin/facilities/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Facility
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Building2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Inactive</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactive}</div>
            </CardContent>
          </Card>
        </div>

        {/* Facilities List */}
        <Card>
          <CardHeader>
            <CardTitle>All Facilities</CardTitle>
            <CardDescription>
              View and manage all facilities in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {facilities.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No facilities found</p>
                <Button asChild>
                  <Link href="/admin/facilities/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Facility
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {facilities.map((facility) => {
                  const photos = Array.isArray(facility.photos) ? facility.photos : [];
                  const firstPhoto = photos[0] as string | undefined;

                  return (
                    <div
                      key={facility.id}
                      className="border rounded-lg p-6 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-6">
                        {/* Photo Thumbnail */}
                        {firstPhoto ? (
                          <div className="w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={firstPhoto}
                              alt={facility.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-32 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}

                        {/* Facility Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold mb-1">{facility.name}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">
                                  {facility.kind}
                                </Badge>
                                <Badge variant={facility.isActive ? "default" : "outline"}>
                                  {facility.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {facility.description || "No description"}
                          </p>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Capacity</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Users className="h-3 w-3" />
                                <span className="text-sm font-medium">
                                  {facility.capacity} guests
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Price</p>
                              <p className="text-lg font-bold mt-1">
                                ₱{Number(facility.price).toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">per night</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/unit/${facility.id}`}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/facilities/${facility.id}/edit`}>
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Link>
                            </Button>
                            <DeleteFacilityButton 
                              facilityId={facility.id} 
                              facilityName={facility.name} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
