import { NextRequest, NextResponse } from "next/server";
import { BookingQuoteSchema } from "@/schemas/booking";
import { checkAvailability } from "@/lib/availability";
import { calculatePrice } from "@/lib/pricing";
import { parseISO } from "date-fns";
import { generateBookingCode } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = BookingQuoteSchema.parse(body);

    const startDate = parseISO(validated.startDate);
    const endDate = parseISO(validated.endDate);

    // Check availability
    const availCheck = await checkAvailability(validated.unitId, startDate, endDate);
    if (!availCheck.available) {
      return NextResponse.json(
        { error: availCheck.reason || "Facility not available" },
        { status: 400 }
      );
    }

    // Calculate pricing
    const pricing = await calculatePrice(validated.unitId, startDate, endDate);

    // Generate a hold ID (can be used to track the quote)
    const holdId = generateBookingCode();

    return NextResponse.json({
      ...pricing,
      holdId,
    });
  } catch (error) {
    console.error("Quote API error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to generate quote" },
      { status: 500 }
    );
  }
}
