import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // PayMongo webhook processing is not implemented yet
    return NextResponse.json(
      { error: "PayMongo webhook processing is not yet implemented" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
