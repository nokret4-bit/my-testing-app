"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

interface FacilityCardProps {
  facility: {
    id: string;
    name: string;
    kind: string;
    description: string | null;
    capacity: number;
    price: number;
    photos: string[];
  };
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const [imageError, setImageError] = useState(false);
  const photos = facility.photos || [];
  const firstPhoto = photos[0];
  const kindLabel = facility.kind.charAt(0) + facility.kind.slice(1).toLowerCase();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {firstPhoto && !imageError ? (
          <img 
            src={firstPhoto} 
            alt={facility.name} 
            className="object-cover w-full h-full"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-white text-4xl font-bold">{facility.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-xl">{facility.name}</CardTitle>
            <Badge variant="secondary" className="mt-2">
              {kindLabel}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(Number(facility.price), "PHP")}
            </div>
            <div className="text-xs text-muted-foreground">per night</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {facility.description && (
          <CardDescription className="mb-4 line-clamp-2">{facility.description}</CardDescription>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Users className="h-4 w-4" />
          <span>Capacity: {facility.capacity} guests</span>
        </div>
        <Link href={`/unit/${facility.id}`}>
          <Button className="w-full" size="lg">View Details & Book</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
