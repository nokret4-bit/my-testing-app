import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession, isStaffOrAdmin } from "@/lib/auth";
import { CreateAvailabilityBlockSchema } from "@/schemas/admin";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!isStaffOrAdmin(session)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const blocks = await prisma.availabilityBlock.findMany({
      include: {
        facilityUnit: {
          include: {
            facilityType: true,
          },
        },
      },
      orderBy: { startDate: "desc" },
    });

    return NextResponse.json({ blocks });
  } catch (error) {
    console.error("Admin availability GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability blocks" },
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
    const validated = CreateAvailabilityBlockSchema.parse(body);

    const block = await prisma.availabilityBlock.create({
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
      },
      include: {
        facilityUnit: true,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id,
        action: "CREATE_AVAILABILITY_BLOCK",
        entity: "AvailabilityBlock",
        entityId: block.id,
        data: { blockType: block.blockType, reason: block.reason },
      },
    });

    return NextResponse.json({ block });
  } catch (error) {
    console.error("Admin availability POST error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create availability block" },
      { status: 500 }
    );
  }
}
