/**
 * GET /api/admin/analytics
 *   period = today | 24h | week | month | year | custom
 *   from   = YYYY-MM-DD  (required when period=custom)
 *   to     = YYYY-MM-DD  (optional when period=custom, defaults to today)
 *
 * Returns:
 *   - kpi: { listings, applicants, newUsers, revenue, conversionPct }
 *   - chartApplicants: number[] — data points for chart
 *   - chartLabels:     string[] — x-axis labels
 *   - funnel:          { stage, count, pct }[] — application status funnel
 *   - topJobs:         { title, applicants, conversionPct }[]
 *
 * Backend SOP Hard Rule 1: requireAdmin on every request.
 * DRY: resolveDateRange() defined once, used for all time-filtered queries.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/apiAuth";

/** Returns { from, to } as Date objects for any period value. */
function resolveDateRange(
  period: string,
  fromParam: string | null,
  toParam:   string | null,
): { from: Date; to: Date } {
  const now = new Date();
  if (period === "custom" && fromParam) {
    const from = new Date(fromParam + "T00:00:00");
    const to   = toParam ? new Date(toParam + "T23:59:59") : now;
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return { from: new Date(now.getTime() - 24 * 60 * 60 * 1000), to: now };
    }
    return { from, to };
  }
  switch (period) {
    case "today":  { const d = new Date(now); d.setHours(0,0,0,0); return { from: d, to: now }; }
    case "24h":    return { from: new Date(now.getTime() - 24 * 60 * 60 * 1000), to: now };
    case "week":   return { from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), to: now };
    case "month":  return { from: new Date(now.getFullYear(), now.getMonth(), 1), to: now };
    case "year":   return { from: new Date(now.getFullYear(), 0, 1), to: now };
    default:       return { from: new Date(now.getTime() - 24 * 60 * 60 * 1000), to: now };
  }
}

/** Build daily chart buckets between two dates (max 60 days). */
function dailyBuckets(from: Date, to: Date): { start: Date; end: Date; label: string }[] {
  const buckets: { start: Date; end: Date; label: string }[] = [];
  const cur = new Date(from); cur.setHours(0, 0, 0, 0);
  const end = new Date(to);   end.setHours(23, 59, 59, 999);
  while (cur <= end && buckets.length < 60) {
    const start = new Date(cur);
    const finish = new Date(cur); finish.setHours(23, 59, 59, 999);
    buckets.push({
      start,
      end:   finish,
      label: `${cur.getMonth() + 1}/${cur.getDate()}`,
    });
    cur.setDate(cur.getDate() + 1);
  }
  return buckets;
}

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const sp     = req.nextUrl.searchParams;
    const period = sp.get("period") ?? "today";
    const { from, to } = resolveDateRange(period, sp.get("from"), sp.get("to"));

    /* ── KPI counts — both from AND to bounds ── */
    const [listings, applicants, newUsers, revenueAgg] = await Promise.all([
      db.job.count({ where: { status: "ACTIVE" } }),
      db.application.count({ where: { createdAt: { gte: from, lte: to } } }),
      db.user.count({ where: { role: "SEEKER", createdAt: { gte: from, lte: to } } }),
      db.payment.aggregate({
        _sum: { amount: true },
        where: { status: "APPROVED", reviewedAt: { gte: from, lte: to } },
      }),
    ]);

    const revenue = revenueAgg._sum.amount ?? 0;

    /* ── Chart data — period-aware buckets ── */
    let chartApplicants: number[];
    let chartLabels:     string[];

    if (period === "today" || period === "24h") {
      /* Hourly buckets for last 14 hours */
      const buckets = Array.from({ length: 14 }, (_, i) => {
        const h = new Date();
        h.setMinutes(0, 0, 0);
        h.setHours(h.getHours() - (13 - i));
        return h;
      });
      chartApplicants = await Promise.all(
        buckets.map((h, i) => {
          const next = buckets[i + 1] ?? new Date();
          return db.application.count({ where: { createdAt: { gte: h, lt: next } } });
        })
      );
      chartLabels = buckets.map(h => `${h.getHours()}:00`);

    } else if (period === "week") {
      /* Daily buckets for last 7 days */
      chartApplicants = await Promise.all(
        Array.from({ length: 7 }, (_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (6 - i));
          const s = new Date(d); s.setHours(0, 0, 0, 0);
          const e = new Date(d); e.setHours(23, 59, 59, 999);
          return db.application.count({ where: { createdAt: { gte: s, lte: e } } });
        })
      );
      chartLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

    } else if (period === "month") {
      /* Daily buckets for last 30 days */
      chartApplicants = await Promise.all(
        Array.from({ length: 30 }, (_, i) => {
          const d = new Date(); d.setDate(d.getDate() - (29 - i));
          const s = new Date(d); s.setHours(0, 0, 0, 0);
          const e = new Date(d); e.setHours(23, 59, 59, 999);
          return db.application.count({ where: { createdAt: { gte: s, lte: e } } });
        })
      );
      chartLabels = Array.from({ length: 30 }, (_, i) => (i % 5 === 0 ? String(i + 1) : ""));

    } else if (period === "year") {
      /* Monthly buckets for this year */
      chartApplicants = await Promise.all(
        Array.from({ length: 12 }, (_, i) => {
          const s = new Date(new Date().getFullYear(), i, 1);
          const e = new Date(new Date().getFullYear(), i + 1, 0, 23, 59, 59, 999);
          return db.application.count({ where: { createdAt: { gte: s, lte: e } } });
        })
      );
      chartLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    } else {
      /* custom — daily buckets between from and to (capped at 60 days) */
      const buckets = dailyBuckets(from, to);
      chartApplicants = await Promise.all(
        buckets.map(b => db.application.count({ where: { createdAt: { gte: b.start, lte: b.end } } }))
      );
      /* Show every 5th label to avoid crowding */
      chartLabels = buckets.map((b, i) => (buckets.length <= 14 || i % Math.ceil(buckets.length / 14) === 0 ? b.label : ""));
    }

    /* Conversion rate: applicants who reached CV_UNDER_REVIEW or beyond ÷ total applicants.
       Previously this formula always returned 10% — meaningless metric. */
    const advancedCount = await db.application.count({
      where: {
        status: { in: ["CV_UNDER_REVIEW", "SHORTLISTED", "HIRED"] },
        createdAt: { gte: from, lte: to },
      },
    });
    const conversionPct = applicants > 0
      ? parseFloat(((advancedCount / applicants) * 100).toFixed(1))
      : 0;

    /* ── Application funnel — all-time status counts ── */
    const statusCounts = await db.application.groupBy({
      by:     ["status"],
      _count: { id: true },
    });

    const STATUS_ORDER = ["PENDING_PAYMENT","PAYMENT_UNDER_REVIEW","CV_UNDER_REVIEW","SHORTLISTED","REJECTED","HIRED"];
    const STAGE_LABELS: Record<string, string> = {
      PENDING_PAYMENT:"Applied", PAYMENT_UNDER_REVIEW:"Payment Review",
      CV_UNDER_REVIEW:"CV Review", SHORTLISTED:"Shortlisted",
      REJECTED:"Rejected", HIRED:"Hired",
    };
    const STAGE_COLORS: Record<string, string> = {
      PENDING_PAYMENT:"var(--brand-500)", PAYMENT_UNDER_REVIEW:"var(--color-warning)",
      CV_UNDER_REVIEW:"var(--accent-400)", SHORTLISTED:"var(--color-success)",
      REJECTED:"var(--color-error)", HIRED:"var(--color-success)",
    };

    const totalApps = statusCounts.reduce((s, r) => s + r._count.id, 0);
    const funnel = STATUS_ORDER.map(status => {
      const count = statusCounts.find(r => r.status === status)?._count.id ?? 0;
      return {
        stage: STAGE_LABELS[status] ?? status,
        count,
        pct:   totalApps > 0 ? Math.round((count / totalApps) * 100) : 0,
        color: STAGE_COLORS[status] ?? "var(--brand-500)",
      };
    }).filter(f => f.count > 0 || f.stage === "Applied");

    /* ── Top performing job listings ── */
    const topJobs = await db.job.findMany({
      take:    10,
      orderBy: { applications: { _count: "desc" } },
      select: {
        id: true, title: true,
        _count: { select: { applications: true } },
      },
    });

    const topJobsWithConversion = topJobs.map(j => ({
      title:         j.title,
      applicants:    j._count.applications,
      /* conversionPct — placeholder until per-job hire data is available */
      conversionPct: "—",
    }));

    return NextResponse.json({
      kpi: {
        listings,
        applicants,
        newUsers,
        revenue,
        conversionPct,
        period,
      },
      chartApplicants,
      chartLabels,
      funnel,
      topJobs: topJobsWithConversion,
    });

  } catch (e) {
    if (e instanceof Response) return e;
    console.error("[GET /api/admin/analytics]", e);
    return NextResponse.json({ message: "Failed to load analytics." }, { status: 500 });
  }
}
