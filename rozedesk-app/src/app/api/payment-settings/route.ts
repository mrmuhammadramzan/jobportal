/**
 * GET /api/payment-settings — public endpoint for active payment methods.
 * Used by the apply flow to show payment details to seekers.
 * No auth required — payment method details (phone, name) are public-facing.
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const settings = await db.paymentSetting.findMany({
      where:   { active: true },
      orderBy: { method: "asc" },
      select:  { method: true, phone: true, name: true, address: true, active: true },
    });
    return NextResponse.json(settings);
  } catch (e) {
    console.error("[GET /api/payment-settings]", e);
    return NextResponse.json([], { status: 200 }); // graceful fallback
  }
}
