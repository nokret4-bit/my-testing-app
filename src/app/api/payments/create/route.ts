import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Payment processing feature is not implemented yet
    return NextResponse.json(
      { error: "Payment processing feature is not yet implemented" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
