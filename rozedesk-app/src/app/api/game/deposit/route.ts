/**
 * POST /api/game/deposit
 * Body: FormData { amount, method, screenshot (File) }
 * Creates a GameDeposit record. Admin must approve before balance updates.
 *
 * Backend SOP Hard Rules:
 *   1 — amount validated server-side, never trusted from client
 *   5 — screenshot stored as base64 fallback (matches existing pattern in storage.ts)
 *   §5.2 — amount looked up from body but bounds-checked here, not trusted raw
 */
import { NextRequest, NextResponse }     from "next/server";
import { db }                            from "@/lib/db";
import { requireAuth }                   from "@/lib/apiAuth";
import { createNotification }            from "@/lib/notify";
import { GAME }                          from "@/lib/gameConstants";
import { PaymentMethod }                 from "@/generated/prisma";

const ALLOWED_METHODS = new Set<string>(["JAZZCASH", "EASYPAISA"]);
const MAX_FILE_BYTES  = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);

    const form      = await req.formData();
    const amountRaw = form.get("amount");
    const method    = (form.get("method") as string | null)?.toUpperCase();
    const file      = form.get("screenshot") as File | null;

    /* ── Validation (Backend SOP §5.1) ── */
    if (!amountRaw || !method || !file) {
      return NextResponse.json({ message: "amount, method, and screenshot are required." }, { status: 400 });
    }
    const amount = parseInt(String(amountRaw), 10);
    if (isNaN(amount) || amount < GAME.MIN_DEPOSIT) {
      return NextResponse.json({
        message: `Minimum deposit is Rs. ${GAME.MIN_DEPOSIT}.`,
      }, { status: 400 });
    }
    if (!ALLOWED_METHODS.has(method)) {
      return NextResponse.json({ message: "Invalid payment method." }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ message: "Screenshot must be under 5 MB." }, { status: 400 });
    }
    const mime = file.type;
    if (!mime.startsWith("image/")) {
      return NextResponse.json({ message: "Screenshot must be an image file." }, { status: 400 });
    }

    /* ── Convert screenshot to base64 (matches existing receipt pattern) ── */
    const buf    = await file.arrayBuffer();
    const b64    = Buffer.from(buf).toString("base64");
    const dataUrl = `data:${mime};base64,${b64}`;

    /* ── Upsert wallet + create deposit in a transaction ── */
    const deposit = await db.$transaction(async (tx) => {
      const wallet = await tx.gameWallet.upsert({
        where:  { userId: auth.id },
        create: { userId: auth.id, balance: 0 },
        update: {},
      });

      return tx.gameDeposit.create({
        data: {
          walletId:      wallet.id,
          userId:        auth.id,
          amount,
          method:        method as PaymentMethod,
          screenshotUrl: dataUrl,
          status:        "PENDING",
        },
      });
    });

    /* ── Notify admin via system notification (non-fatal) ── */
    const admins = await db.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });
    await Promise.allSettled(
      admins.map((a) =>
        createNotification({
          userId: a.id,
          title:  "New Game Deposit",
          body:   `A user has submitted a deposit of Rs. ${amount} via ${method} for the game wallet.`,
          type:   "payment",
          link:   "/admin/game-deposits",
        }),
      ),
    );

    return NextResponse.json({ depositId: deposit.id, status: "PENDING" }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Response) return e;
    console.error("[POST /api/game/deposit]", e);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
