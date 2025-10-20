import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only STAFF and ADMIN can verify bookings
    if (
      session.user.role !== "STAFF" &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      );
    }

    // Cashier verify feature is not implemented yet
    return NextResponse.json(
      { error: "Cashier verify feature is not yet implemented" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error verifying booking:", error);
    return NextResponse.json(
      { error: "Failed to verify booking" },
      { status: 500 }
    );
  }
}
