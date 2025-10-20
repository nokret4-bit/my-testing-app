import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FacilityQuerySchema } from "@/schemas/admin";
import { getAvailabilityForRange } from "@/lib/availability";
import { calculatePrice } from "@/lib/pricing";
import { parseISO, addDays } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      type: searchParams.get("type") || undefined,
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined,
      capacity: searchParams.get("capacity") || undefined,
    };

    const validated = FacilityQuerySchema.parse(queryParams);

    const where: {
      isActive: boolean;
      facilityType?: { kind: typeof validated.type };
      capacity?: { gte: number };
    } = {
      isActive: true,
    };

    if (validated.type) {
      where.facilityType = { kind: validated.type };
    }

    if (validated.capacity) {
      where.capacity = { gte: validated.capacity };
    }

    const facilities = await prisma.facilityUnit.findMany({
      where,
      include: {
        facilityType: {
          select: {
            kind: true,
            name: true,
            description: true,
            amenities: true,
            policies: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // If date range provided, calculate availability and pricing
    const availability: Record<
      string,
      Array<{ date: string; available: boolean; price: number }>
    > = {};

    if (validated.from && validated.to) {
      const startDate = parseISO(validated.from);
      const endDate = parseISO(validated.to);

      for (const facility of facilities) {
        const availMap = await getAvailabilityForRange(facility.id, startDate, endDate);
        const priceInfo = await calculatePrice(facility.id, startDate, endDate);

        availability[facility.id] = Array.from(availMap.entries()).map(([date, avail]) => ({
          date,
          available: avail,
          price: priceInfo.totalAmount,
        }));
      }
    }

    return NextResponse.json({
      items: facilities,
      availability,
    });
  } catch (error) {
    console.error("Facilities API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch facilities" },
      { status: 500 }
    );
  }
}
