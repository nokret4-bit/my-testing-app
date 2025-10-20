import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession, isStaffOrAdmin } from "@/lib/auth";
import { PriceType } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!isStaffOrAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      priceType,
      basePrice,
      currency,
      effectiveFrom,
      effectiveTo,
      isActive,
      facilityTypeId,
      facilityUnitId,
    } = body;

    // Validation
    if (!name || !priceType || !basePrice || !effectiveFrom) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!facilityTypeId && !facilityUnitId) {
      return NextResponse.json(
        { error: "Must specify either facilityTypeId or facilityUnitId" },
        { status: 400 }
      );
    }

    // Create rate plan
    const ratePlan = await prisma.ratePlan.create({
      data: {
        name,
        description,
        priceType: priceType as PriceType,
        basePrice,
        currency: currency || "PHP",
        effectiveFrom: new Date(effectiveFrom),
        effectiveTo: effectiveTo ? new Date(effectiveTo) : null,
        isActive: isActive ?? true,
        facilityTypeId: facilityTypeId || null,
        facilityUnitId: facilityUnitId || null,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id,
        action: "CREATE_RATE_PLAN",
        entity: "RatePlan",
        entityId: ratePlan.id,
        data: { name: ratePlan.name },
      },
    });

    return NextResponse.json({ ratePlan });
  } catch (error) {
    console.error("Create rate plan error:", error);
    return NextResponse.json({ error: "Failed to create rate plan" }, { status: 500 });
  }
}
