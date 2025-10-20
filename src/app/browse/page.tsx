import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FacilityCard } from "@/components/facility-card";

async function FacilitiesList({ search }: { search: string | undefined }) {
  const facilities = await prisma.facilities.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  const q = (search || "").toLowerCase().trim();
  const filtered = q
    ? facilities.filter(
        (f) => f.name.toLowerCase().includes(q) || f.kind.toLowerCase().includes(q)
      )
    : facilities;

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No facilities available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((facility) => (
        <FacilityCard 
          key={facility.id} 
          facility={{
            id: facility.id,
            name: facility.name,
            kind: facility.kind,
            description: facility.description,
            capacity: facility.capacity,
            price: Number(facility.price),
            photos: facility.photos,
          }} 
        />
      ))}
    </div>
  );
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params.search;
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Facilities</h1>
          <p className="text-muted-foreground">Explore our rooms, cottages, and function halls</p>
        </div>

        <form action="/browse" method="get" className="mb-6 flex gap-2">
          <Input name="search" placeholder="Search by name or type" defaultValue={search} />
          <Button type="submit">Search</Button>
        </form>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-full mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <FacilitiesList search={search} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
