/**
 * GET /api/admin/game-analytics
 *
 * Returns a single payload used by the admin game dashboard:
 *   kpi: { totalPlayers, pendingDeposits, totalSessions, totalPayout,
 *           totalWagered, avgScore, activeTodaySessions }
 *   sessionChart:  number[] — sessions per day (last 7 days)
 *   payoutChart:   number[] — PKR paid out per day (last 7 days)
 *   chartLabels:   string[] — day labels for both charts
 *   recentDeposits: last 8 PENDING deposits for the quick-action table
 *   recentSessions: last 8 completed sessions across all players
 *
 * Backend SOP Hard Rules:
 *   1  — requireAdmin on every request.
 *   6  — all aggregation in a single Promise.all, not sequential awaits.
 *   §5 — no secrets in code, no raw SQL strings.
 * OOP: resolveDayBuckets() is a pure static-style utility — defined once, DRY.
 */
import { NextRequest, NextResponse } from "next/server";
import { db }           from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

/* ── Build last-N-days bucket boundaries — pure function (DRY) ── */
function lastNDayBuckets(n: number): { start: Date; end: Date; label: string }[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    const start = new Date(d); start.setHours(0, 0, 0, 0);
    const end   = new Date(d); end.setHours(23, 59, 59, 999);
    return {
      start,
      end,
      label: d.toLocaleDateString("en-PK", { weekday: "short" }),
    };
  });
}

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);

    const buckets = lastNDayBuckets(7);

    /* ── All heavy reads in a single Promise.all — Backend SOP §6 ── */
    const [
      totalPlayers,
      pendingDepositCount,
      totalSessions,
      payoutAgg,
      wagerAgg,
      scoreAgg,
      todaySessions,
      recentDeposits,
      recentSessions,
      ...bucketData
    ] = await Promise.all([
      /* KPI: unique wallets = unique players who have a wallet */
      db.gameWallet.count(),

      /* KPI: pending deposit queue length */
      db.gameDeposit.count({ where: { status: "PENDING" } }),

      /* KPI: total completed sessions */
      db.gameSession.count({ where: { completed: true } }),

      /* KPI: total PKR paid out (sum of all session winnings) */
      db.gameSession.aggregate({
        _sum: { winAmount: true },
        where: { completed: true },
      }),

      /* KPI: total PKR wagered */
      db.gameSession.aggregate({
        _sum: { wagerAmount: true },
        where: { completed: true },
      }),

      /* KPI: average final score */
      db.gameSession.aggregate({
        _avg: { finalScore: true },
        where: { completed: true },
      }),

      /* KPI: sessions started today */
      db.gameSession.count({
        where: {
          startedAt: {
            gte: (() => { const d = new Date(); d.setHours(0,0,0,0); return d; })(),
          },
        },
      }),

      /* Recent pending deposits — for quick-action table */
      db.gameDeposit.findMany({
        where:   { status: "PENDING" },
        orderBy: { submittedAt: "desc" },
        take:    8,
        include: {
          wallet: {
            include: { user: { select: { id: true, name: true, email: true } } },
          },
        },
      }),

      /* Recent completed sessions across all players */
      db.gameSession.findMany({
        where:   { completed: true },
        orderBy: { endedAt: "desc" },
        take:    8,
        include: {
          wallet: {
            include: { user: { select: { name: true } } },
          },
        },
      }),

      /* 7-day session counts — one query per bucket (parallel) */
      ...buckets.map(b =>
        db.gameSession.count({ where: { startedAt: { gte: b.start, lte: b.end } } })
      ),

      /* 7-day payout sums — one aggregate per bucket (parallel) */
      ...buckets.map(b =>
        db.gameSession.aggregate({
          _sum: { winAmount: true },
          where: { endedAt: { gte: b.start, lte: b.end }, completed: true },
        })
      ),
    ]);

    /* Split bucketData: first 7 are session counts, next 7 are payout aggregates */
    const sessionChart = (bucketData.slice(0, 7) as number[]);
    const payoutChart  = (bucketData.slice(7, 14) as { _sum: { winAmount: number | null } }[])
      .map(r => r._sum.winAmount ?? 0);

    /* ── Shape response ── */
    return NextResponse.json({
      kpi: {
        totalPlayers,
        pendingDeposits:      pendingDepositCount,
        totalSessions,
        totalPayout:          payoutAgg._sum.winAmount    ?? 0,
        totalWagered:         wagerAgg._sum.wagerAmount   ?? 0,
        avgScore:             Math.round(scoreAgg._avg.finalScore ?? 0),
        activeTodaySessions:  todaySessions,
      },
      sessionChart,
      payoutChart,
      chartLabels: buckets.map(b => b.label),
      recentDeposits: recentDeposits.map(d => ({
        id:          d.id,
        userId:      d.userId,
        userName:    d.wallet.user.name,
        userEmail:   d.wallet.user.email,
        amount:      d.amount,
        method:      d.method,
        submittedAt: d.submittedAt,
      })),
      recentSessions: recentSessions.map(s => ({
        id:          s.id,
        userName:    s.wallet.user.name,
        wagerAmount: s.wagerAmount,
        finalScore:  s.finalScore,
        winAmount:   s.winAmount,
        endedAt:     s.endedAt,
      })),
    });

  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/game-analytics]", e);
    return NextResponse.json({ message: "Failed to load game analytics." }, { status: 500 });
  }
}
