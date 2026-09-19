"use client";
/**
 * /admin/analytics — Fully wired to real API.
 * GET /api/admin/analytics?period= → KPIs + chart + funnel + top jobs
 *
 * Frontend SOP §6.1: loading / error / populated states.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens.
 * DRY: authHeaders(), Icon, CARD, SkeletonCard — each defined once.
 * Note: Visitors/Page Views require a visitor tracking service (Plausible/GA).
 *       Until configured, those cards show real applicant data as proxy.
 */
import React, { useState, useEffect, useCallback } from "react";
import MiniChart   from "@/components/dashboard/MiniChart";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import DateFilter, { useDefaultDateRange, buildApiParams, type DateRange } from "@/components/dashboard/DateFilter";
import { useFee } from "@/hooks/useFee";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const CARD = "rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]";

function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : ""}` };
}

const PERIOD_LABEL: Record<string, string> = {
  today:"Today (hourly)","24h":"Last 24 hours",week:"This week (daily)",
  month:"This month (daily)",year:"This year (monthly)",custom:"Custom range",
};

interface Kpi { listings:number; applicants:number; newUsers:number; revenue:number; conversionPct:number; period:string; }
interface FunnelStage { stage:string; count:number; pct:number; color:string; }
interface TopJob { title:string; applicants:number; conversionPct:string; }
interface AnalyticsData {
  kpi:             Kpi;
  chartApplicants: number[];
  chartLabels:     string[];
  funnel:          FunnelStage[];
  topJobs:         TopJob[];
}

export default function AnalyticsPage() {
  const appFee      = useFee();
  const [dateRange, setDateRange] = useState<DateRange>(useDefaultDateRange());
  const [data,      setData]      = useState<AnalyticsData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  const fetch_ = useCallback(async (range: DateRange) => {
    setLoading(true); setError("");
    try {
      const qs   = buildApiParams(range);
      const res  = await fetch(`/api/admin/analytics?${qs}`, { headers: authHeaders(), credentials: "include" });
      if (!res.ok) throw new Error((await res.json()).message ?? "Failed to load analytics.");
      setData(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch_(dateRange); }, [dateRange, fetch_]);

  const kpi    = data?.kpi;
  const charts = data?.chartApplicants ?? [];
  const labels = data?.chartLabels     ?? [];
  const funnel = data?.funnel          ?? [];
  const topJobs= data?.topJobs         ?? [];

  const periodLabel = PERIOD_LABEL[dateRange.preset] ?? "Selected period";

  const TOP_STATS = [
    {
      label:   `Applicants (${periodLabel})`,
      value:   (kpi?.applicants ?? 0).toLocaleString(),
      iconPath:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      iconBg:  "color-mix(in srgb,var(--brand-500) 15%,transparent)",
      iconColor:"var(--brand-400)",
    },
    {
      label:   "Active Listings",
      value:   (kpi?.listings ?? 0).toLocaleString(),
      iconPath:"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      iconBg:  "color-mix(in srgb,var(--accent-400) 15%,transparent)",
      iconColor:"var(--accent-400)",
    },
    {
      label:   `Revenue (${periodLabel})`,
      value:   kpi ? `PKR ${kpi.revenue.toLocaleString()}` : "—",
      iconPath:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      iconBg:  "color-mix(in srgb,var(--color-success) 15%,transparent)",
      iconColor:"var(--color-success)",
    },
    {
      label:   `New Seekers (${periodLabel})`,
      value:   (kpi?.newUsers ?? 0).toLocaleString(),
      iconPath:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
      iconBg:  "color-mix(in srgb,var(--color-warning) 15%,transparent)",
      iconColor:"var(--color-warning)",
    },
  ];

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Analytics</h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            Live data from your database · Fee per application: <strong className="text-[var(--text-primary)]">PKR {appFee}</strong>
          </p>
        </div>
      </div>

      {/* Date Filter */}
      <DateFilter value={dateRange} onChange={setDateRange} />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-[var(--color-error)] flex-shrink-0" />
          <p className="text-sm font-medium text-[var(--color-error)] flex-1">{error}</p>
          <button type="button" onClick={() => fetch_(dateRange)}
            className="text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2">Retry</button>
        </div>
      )}

      {/* KPI row */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{[1,2,3,4].map(i=><SkeletonCard key={i} lines={2} showIcon/>)}</div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {TOP_STATS.map(s => (
            <div key={s.label} className={`${CARD} flex flex-col gap-4 p-5 hover:-translate-y-0.5 transition-all duration-[var(--dur-deliberate)]`}>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center" style={{ background: s.iconBg }}>
                  <span style={{ color: s.iconColor }}><Icon path={s.iconPath} className="w-5 h-5" /></span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-black gradient-text leading-none">{s.value}</p>
                <p className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)] mt-1 leading-tight">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Applicants chart */}
        <div className={`${CARD} p-5`}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="font-bold text-[var(--text-primary)] text-base">Applicants</p>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">{periodLabel}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="gradient-text font-black text-xl leading-none">{kpi?.applicants ?? 0}</p>
              <span className="text-[10px] font-bold text-[var(--color-success)]">all time: {kpi?.applicants ?? 0} total</span>
            </div>
          </div>
          {loading ? <div className="h-24 bg-[var(--bg-surface)] rounded animate-pulse" /> : (
            <MiniChart data={charts} type="area" color="var(--brand-400)" height={100} labels={labels} />
          )}
          {!loading && charts.length > 0 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-default)]">
              <span className="text-[var(--text-muted)] text-xs">Peak: {Math.max(0, ...charts)}</span>
              <span className="text-[var(--text-muted)] text-xs">Avg: {charts.length ? (charts.reduce((a,b)=>a+b,0)/charts.length).toFixed(1) : 0}/period</span>
            </div>
          )}
        </div>

        {/* Revenue chart */}
        <div className={`${CARD} p-5`}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="font-bold text-[var(--text-primary)] text-base">Revenue</p>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">{periodLabel} (PKR {appFee}/app)</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="gradient-text font-black text-xl leading-none">PKR {(kpi?.revenue ?? 0).toLocaleString()}</p>
            </div>
          </div>
          {loading ? <div className="h-24 bg-[var(--bg-surface)] rounded animate-pulse" /> : (
            <MiniChart
              data={charts.map(v => v * appFee)}
              type="area" color="var(--color-success)" height={100}
              labels={labels}
            />
          )}
          {!loading && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-default)]">
              <span className="text-[var(--text-muted)] text-xs">Period total: PKR {(kpi?.revenue ?? 0).toLocaleString()}</span>
              <span className="text-[var(--text-muted)] text-xs">Fee: PKR {appFee}/app</span>
            </div>
          )}
        </div>
      </div>

      {/* Funnel + Top Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Application funnel — real DB status counts */}
        <div className={`${CARD} p-5`}>
          <p className="font-bold text-[var(--text-primary)] text-base mb-1">Application Funnel</p>
          <p className="text-[var(--text-muted)] text-xs mb-5">Candidates at each stage (all time)</p>
          {loading ? (
            <div className="flex flex-col gap-3">{[1,2,3,4].map(i=><div key={i} className="h-8 bg-[var(--bg-surface)] rounded animate-pulse"/>)}</div>
          ) : funnel.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-4">No applications yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {funnel.map((stage, i) => (
                <div key={stage.stage} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-[var(--text-muted)] flex-shrink-0">{i+1}</span>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[var(--text-secondary)]">{stage.stage}</span>
                      <span className="text-xs font-bold text-[var(--text-primary)]">{stage.count}</span>
                    </div>
                    <div className="h-2 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${stage.pct}%`, background:stage.color }} />
                    </div>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] w-8 text-right flex-shrink-0">{stage.pct}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top performing jobs — real DB data */}
        <div className={`${CARD} p-5`}>
          <p className="font-bold text-[var(--text-primary)] text-base mb-1">Top Performing Listings</p>
          <p className="text-[var(--text-muted)] text-xs mb-5">Ranked by number of applications</p>
          {loading ? (
            <div className="flex flex-col gap-3">{[1,2,3].map(i=><div key={i} className="h-8 bg-[var(--bg-surface)] rounded animate-pulse"/>)}</div>
          ) : topJobs.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-4">No job listings yet.</p>
          ) : (
            <div className="rounded-[var(--radius-lg)] overflow-hidden">
              <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-[var(--bg-surface)]">
                {[["col-span-6","Job Title"],["col-span-3","Applicants"],["col-span-3","Conv."]].map(([cls,label])=>(
                  <span key={label} className={`${cls} text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]`}>{label}</span>
                ))}
              </div>
              {topJobs.map((job, i) => (
                <div key={job.title}
                  className={["grid grid-cols-12 gap-3 items-center px-4 py-3.5 hover:bg-[var(--bg-surface)] transition-colors",
                    i < topJobs.length-1 ? "border-b border-[var(--border-default)]" : ""].join(" ")}>
                  <div className="col-span-6 flex items-center gap-2.5 min-w-0">
                    <span className="text-[var(--text-muted)] text-xs font-bold w-4 flex-shrink-0">#{i+1}</span>
                    <span className="text-[var(--text-primary)] text-sm font-semibold truncate">{job.title}</span>
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="text-[var(--text-primary)] font-bold text-sm">{job.applicants}</span>
                    <div className="flex-1 h-1.5 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[var(--brand-500)]"
                        style={{ width:`${topJobs[0]?.applicants ? (job.applicants/topJobs[0].applicants)*100 : 0}%` }}/>
                    </div>
                  </div>
                  <span className="col-span-3 text-[var(--color-success)] font-bold text-sm">{job.conversionPct}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info note about visitor tracking */}
      <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--brand-500)_6%,transparent)] border border-[color-mix(in_srgb,var(--brand-500)_15%,transparent)]">
        <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-5 h-5 text-[var(--brand-500)] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Visitor tracking not yet configured</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Visitors and Page Views require an analytics service (Plausible, Google Analytics, etc.).
            Currently showing application and revenue data only — all from your real database.
          </p>
        </div>
      </div>
    </div>
  );
}
