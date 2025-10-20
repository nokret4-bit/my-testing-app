import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession, isStaffOrAdmin } from "@/lib/auth";
import { CreateRatePlanSchema } from "@/schemas/admin";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!isStaffOrAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ratePlans = await prisma.ratePlan.findMany({
      include: {
        facilityType: true,
        facilityUnit: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ratePlans });
  } catch (error) {
    console.error("Admin rates GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rate plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!isStaffOrAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validated = CreateRatePlanSchema.parse(body);

    const ratePlan = await prisma.ratePlan.create({
      data: {
        ...validated,
        effectiveFrom: new Date(validated.effectiveFrom),
        effectiveTo: validated.effectiveTo ? new Date(validated.effectiveTo) : null,
      },
      include: {
        facilityType: true,
        facilityUnit: true,
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
    console.error("Admin rates POST error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create rate plan" },
      { status: 500 }
    );
  }
}
