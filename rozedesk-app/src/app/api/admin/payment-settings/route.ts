/**
 * GET  /api/admin/payment-settings — read all payment methods
 * POST /api/admin/payment-settings — create or update a payment method
 *
 * Backend SOP Hard Rule 1: requireAdmin on every method.
 * Backend SOP Hard Rule 2: full error logging, never silent swallow.
 * DRY: upsert handles both create and update in one call.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const settings = await db.paymentSetting.findMany({ orderBy: { method: "asc" } });
    return NextResponse.json(settings);
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/payment-settings]", e);
    return NextResponse.json({ message: "Failed to load payment settings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json() as {
      method?: string; phone?: string; name?: string;
      address?: string; active?: boolean;
    };

    const { method, phone, name, address, active } = body;

    if (!method?.trim()) return NextResponse.json({ message: "Method is required."   }, { status: 400 });
    if (!phone?.trim())  return NextResponse.json({ message: "Phone is required."    }, { status: 400 });
    if (!name?.trim())   return NextResponse.json({ message: "Account name is required." }, { status: 400 });

    const setting = await db.paymentSetting.upsert({
      where:  { method },
      create: { method, phone: phone.trim(), name: name.trim(), address: address?.trim() ?? null, active: active ?? true },
      update: { phone: phone.trim(), name: name.trim(), address: address?.trim() ?? null, active: active ?? true },
    });

    return NextResponse.json(setting);
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[POST /api/admin/payment-settings]", e);
    return NextResponse.json({ message: "Failed to save payment settings." }, { status: 500 });
  }
}
