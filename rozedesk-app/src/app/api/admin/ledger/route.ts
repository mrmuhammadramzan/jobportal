/**
 * GET /api/admin/ledger
 * Query params:
 *   period = today | 24h | week | month | year | custom (default: all)
 *   from   = YYYY-MM-DD  (required when period=custom)
 *   to     = YYYY-MM-DD  (optional when period=custom, defaults to today)
 *   status = PENDING | APPROVED | REJECTED | REFUNDED (optional)
 *   q      = search string (applicant name, job title)
 *
 * Returns: { transactions[], summary, revenueByJob[], chartData[] }
 *
 * Backend SOP Hard Rule 1: requireAdmin on every request.
 * Backend SOP Hard Rule 2: full error logging.
 * DRY: resolveDateRange() computed once, reused for both transactions and summary.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";
import { PLATFORM_CUT_PCT } from "@/lib/constants";

async function getPlatformCut(): Promise<number> {
  try {
    const row = await db.platformSetting.findUnique({ where: { key: "platformCut" } });
    const pct = row ? parseInt(row.value, 10) : NaN;
    return isNaN(pct) ? PLATFORM_CUT_PCT : pct;
  } catch { return PLATFORM_CUT_PCT; }
}

/**
 * Returns { from, to } Date pair — or null if no filter (all-time).
 * Matches the same logic as analytics API for consistency.
 */
function resolveDateRange(
  period: string,
  fromParam: string | null,
  toParam:   string | null,
): { from: Date; to: Date } | null {
  const now = new Date();
  if (period === "custom" && fromParam) {
    return {
      from: new Date(fromParam + "T00:00:00"),
      to:   toParam ? new Date(toParam + "T23:59:59") : now,
    };
  }
  switch (period) {
    case "today":  { const d = new Date(now); d.setHours(0, 0, 0, 0); return { from: d, to: now }; }
    case "24h":    return { from: new Date(now.getTime() - 24 * 60 * 60 * 1000), to: now };
    case "week":   return { from: new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000), to: now };
    case "month":  return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
    case "year":   return { from: new Date(now.getFullYear(), 0, 1), to: now };
    default:       return null; // "all" — no date filter
  }
}

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const { searchParams } = req.nextUrl;
    const period = searchParams.get("period") ?? "all";
    const status = searchParams.get("status") ?? "";
    const q      = searchParams.get("q")      ?? "";

    const dateRange = resolveDateRange(period, searchParams.get("from"), searchParams.get("to"));

    /* Get live platform cut from DB */
    const cutPct = await getPlatformCut();
    const cut    = (100 - cutPct) / 100; // e.g. 0.85

    /* Build where clause */
    const where: Record<string, unknown> = {};
    if (dateRange) {
      where.submittedAt = { gte: dateRange.from, lte: dateRange.to };
    }
    if (status) where.status = status.toUpperCase();

    /* Push text search into DB — avoids loading the entire payment table into memory */
    const searchFilter = q ? {
      OR: [
        { application: { user: { name: { contains: q } } } },
        { application: { job:  { title: { contains: q } } } },
        { id: { contains: q } },
      ],
    } : {};

    const payments = await db.payment.findMany({
      where:   { ...where, ...searchFilter },
      orderBy: { submittedAt: "desc" },
      include: {
        application: {
          include: {
            user: { select: { id: true, name: true } },
            job:  { select: { id: true, title: true } },
          },
        },
      },
    });

    /* `filtered` is now the full DB result — no second JS filter pass */
    const filtered = payments;

    /* Map transactions */
    const transactions = filtered.map(p => {
      const net = p.status === "APPROVED" ? Math.round(p.amount * cut) : 0;
      return {
        id:            p.id,
        applicantName: p.application.user.name,
        applicantInitials: p.application.user.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
        jobTitle:      p.application.job.title,
        jobId:         p.application.job.id,
        amount:        p.amount,
        net,
        method:        p.method,
        receiptRef:    p.receiptRef,
        status:        p.status.toLowerCase() as "pending" | "approved" | "rejected" | "refunded",
        submittedAt:   p.submittedAt,
      };
    });

    /* Summary stats */
    const approved  = filtered.filter(p => p.status === "APPROVED");
    const pending   = filtered.filter(p => p.status === "PENDING");
    const totalGross = approved.reduce((s, p) => s + p.amount, 0);
    const totalNet   = approved.reduce((s, p) => s + Math.round(p.amount * cut), 0);
    const pendingAmt = pending.reduce((s, p) => s + p.amount, 0);

    /* Revenue by job — all time regardless of period filter for the chart */
    const allApproved = await db.payment.findMany({
      where: { status: "APPROVED" },
      include: { application: { include: { job: { select: { id: true, title: true } } } } },
    });

    const revenueMap = new Map<string, { title: string; applicants: number; gross: number; net: number }>();
    allApproved.forEach(p => {
      const jobId = p.application.job.id;
      const cur   = revenueMap.get(jobId) ?? { title: p.application.job.title, applicants: 0, gross: 0, net: 0 };
      cur.applicants++;
      cur.gross += p.amount;
      cur.net   += Math.round(p.amount * cut);
      revenueMap.set(jobId, cur);
    });
    const revenueByJob = Array.from(revenueMap.entries())
      .map(([jobId, v]) => ({ jobId, ...v }))
      .sort((a, b) => b.net - a.net)
      .slice(0, 10);

    /* Daily chart — last 14 days of approved earnings */
    const chartData: number[] = Array.from({ length: 14 }, (_, i) => {
      const day  = new Date();
      day.setDate(day.getDate() - (13 - i));
      const from = new Date(day); from.setHours(0, 0, 0, 0);
      const to   = new Date(day); to.setHours(23, 59, 59, 999);
      return allApproved
        .filter(p => new Date(p.submittedAt) >= from && new Date(p.submittedAt) <= to)
        .reduce((s, p) => s + Math.round(p.amount * cut), 0);
    });

    return NextResponse.json({
      transactions,
      summary: {
        totalGross, totalNet, pendingAmt,
        approvedCount: approved.length,
        pendingCount:  pending.length,
        avgDaily: Math.round(chartData.reduce((s, v) => s + v, 0) / 14),
        cutPct,
      },
      revenueByJob,
      chartData,
    });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/ledger]", e);
    return NextResponse.json({ message: "Failed to load ledger." }, { status: 500 });
  }
}
