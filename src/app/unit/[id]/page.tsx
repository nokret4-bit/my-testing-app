import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Wifi, Wind } from "lucide-react";

interface UnitPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UnitPage({ params }: UnitPageProps) {
  const { id } = await params;
  const facility = await prisma.facility.findUnique({
    where: { id, isActive: true },
  });

  if (!facility) {
    notFound();
  }

  const photos = facility.photos || [];
  const amenities = facility.amenities || [];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Photo Gallery */}
            {photos.length > 0 && (
              <div className="mb-8">
                <div className="aspect-video bg-muted rounded-2xl overflow-hidden mb-4">
                  <img
                    src={photos[0] as string}
                    alt={facility.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                {photos.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {photos.slice(1, 4).map((photo, idx) => (
                      <div key={idx} className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={photo as string}
                          alt={`${facility.name} ${idx + 2}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold">{facility.name}</h1>
                <Badge variant="secondary">{facility.kind}</Badge>
              </div>
              <p className="text-muted-foreground text-lg">{facility.description}</p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-primary" />
                        <span>{amenity as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Policies - Removed in simplified schema */}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book This Facility</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold text-foreground">
                    ₱{Number(facility.price).toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" / night"}
                    </span>
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span>Up to {facility.capacity} guests</span>
                </div>

                <Link href={`/checkout?unitId=${facility.id}`}>
                  <Button className="w-full" size="lg">
                    Check Availability
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center">
                  You won&apos;t be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
