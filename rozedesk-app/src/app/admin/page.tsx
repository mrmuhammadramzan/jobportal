"use client";
/**
 * /admin — Overview Dashboard, fully wired to real APIs.
 * GET /api/admin/analytics?period= → KPI cards + charts
 * GET /api/admin/jobs → Active listings table
 * GET /api/admin/applicants?limit=5 → Recent applicants
 *
 * Frontend SOP §6.1: loading / empty / populated states.
 * DRY: authHeaders(), CARD, Icon — each defined once.
 */
import React, { useState, useEffect, useCallback } from "react";
import Link      from "next/link";
import Button    from "@/components/Button";
import Badge     from "@/components/Badge";
import MiniChart from "@/components/dashboard/MiniChart";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import DateFilter, { useDefaultDateRange, buildApiParams, type DateRange } from "@/components/dashboard/DateFilter";
import { ROUTES, adminEditJobUrl, adminJobApplicantsUrl } from "@/lib/routes";
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

interface AnalyticsData {
  listings: number; applicants: number; newUsers: number; revenue: number;
}
interface Job { id: string; title: string; location: string; status: string; createdAt: string; applicants: number; }
interface Applicant { id: string; applicantName: string; jobTitle: string; status: string; appliedDate: string; }

const APP_BADGE: Record<string,"brand"|"neutral"|"success"|"warning"|"error"> = {
  PENDING_PAYMENT:"brand", PAYMENT_UNDER_REVIEW:"warning", CV_UNDER_REVIEW:"warning",
  SHORTLISTED:"success", REJECTED:"error", HIRED:"success", PAYMENT_REJECTED:"error",
};
const STATUS_LABEL: Record<string,string> = {
  PENDING_PAYMENT:"Pending Payment", PAYMENT_UNDER_REVIEW:"Payment Review", CV_UNDER_REVIEW:"CV Review",
  SHORTLISTED:"Shortlisted", REJECTED:"Rejected", HIRED:"Hired", PAYMENT_REJECTED:"Payment Rejected",
};
const PRESETS_LABEL: Record<string,string> = {
  today:"Today (hourly)","24h":"Last 24 hours",week:"This week",month:"This month",year:"This year",custom:"Custom",
};

export default function AdminOverview() {
  const appFee = useFee();
  const [dateRange, setDateRange] = useState<DateRange>(useDefaultDateRange());
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chartData,  setChartData]  = useState<number[]>([]);
  const [jobs,       setJobs]       = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading,    setLoading]    = useState(true);

  const fetchData = useCallback(async (range: DateRange) => {
    setLoading(true);
    try {
      const qs = buildApiParams(range);
      const [analyticsRes, jobsRes, appsRes] = await Promise.all([
        fetch(`/api/admin/analytics?${qs}`, { headers: authHeaders(), credentials: "include" }),
        fetch("/api/admin/jobs",             { headers: authHeaders(), credentials: "include" }),
        fetch("/api/admin/applicants?limit=5",{ headers: authHeaders(), credentials: "include" }),
      ]);
      if (analyticsRes.ok) {
        const json = await analyticsRes.json();
        /* Analytics API wraps stats in { kpi, chartApplicants, ... }
           Overview page uses a flat shape — extract kpi into analytics state */
        setAnalytics(json.kpi ?? json);
        /* Store chart data for the overview charts */
        setChartData(json.chartApplicants ?? []);
      }
      if (jobsRes.ok)      setJobs((await jobsRes.json()).slice(0, 5));
      if (appsRes.ok)      setApplicants(await appsRes.json());
    } catch (e) { console.error("Overview fetch error:", e); }
    finally     { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(dateRange); }, [dateRange, fetchData]);

  const a = analytics;

  const STATS = [
    { label:"Active Listings",  value:String(a?.listings    ?? "—"), iconPath:"M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", iconBg:"color-mix(in srgb,var(--brand-500) 15%,transparent)",   iconColor:"var(--brand-400)"    },
    { label:"Applicants",       value:String(a?.applicants  ?? "—"), iconPath:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",  iconBg:"color-mix(in srgb,var(--accent-400) 15%,transparent)", iconColor:"var(--accent-400)"   },
    { label:"New Users",        value:String(a?.newUsers    ?? "—"), iconPath:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",                                                                                                                                              iconBg:"color-mix(in srgb,var(--color-success) 15%,transparent)",iconColor:"var(--color-success)" },
    { label:"Revenue",          value:a ? `PKR ${(a.revenue ?? 0).toLocaleString()}` : "—", iconPath:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", iconBg:"color-mix(in srgb,var(--color-warning) 15%,transparent)",iconColor:"var(--color-warning)" },
    { label:"Fee/App",          value:`PKR ${appFee}`,               iconPath:"M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", iconBg:"color-mix(in srgb,var(--brand-500) 8%,transparent)",  iconColor:"var(--brand-400)" },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Dashboard Overview</h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">{new Date().toLocaleDateString("en-PK",{weekday:"long",year:"numeric",month:"long",day:"numeric"})} · Live data</p>
        </div>
        <Button variant="gradient" size="md" href={ROUTES.adminPostJob} pill glow
          iconLeft={<Icon path="M12 4v16m8-8H4" className="w-4 h-4" />}>
          Post New Job
        </Button>
      </div>

      <DateFilter value={dateRange} onChange={setDateRange} />

      {/* KPI cards */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">{[1,2,3,4,5].map(i=><SkeletonCard key={i} lines={2} showIcon/>)}</div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
          {STATS.map(s => (
            <div key={s.label} className={`${CARD} flex flex-col gap-4 p-5 hover:-translate-y-0.5 transition-all duration-[var(--dur-deliberate)]`}>
              <div className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center" style={{ background: s.iconBg }}>
                <span style={{ color: s.iconColor }}><Icon path={s.iconPath} className="w-5 h-5" /></span>
              </div>
              <div>
                <p className="text-[clamp(1.4rem,3vw,2rem)] font-black leading-none tracking-tight gradient-text">{s.value}</p>
                <p className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)] mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className={`${CARD} p-5`}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="font-bold text-[var(--text-primary)] text-base">Applicants</p>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">{PRESETS_LABEL[dateRange.preset]}</p>
            </div>
            <span className="gradient-text font-black text-xl leading-none">{a?.applicants ?? 0}</span>
          </div>
          {loading ? <div className="h-24 bg-[var(--bg-surface)] rounded animate-pulse" /> :
            <MiniChart data={chartData.length ? chartData : [0]} type="area" color="var(--brand-400)" height={90} labels={[]} />
          }
        </div>
        <div className={`${CARD} p-5`}>
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="font-bold text-[var(--text-primary)] text-base">Revenue</p>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">{PRESETS_LABEL[dateRange.preset]}</p>
            </div>
            <span className="gradient-text font-black text-xl leading-none">PKR {(a?.revenue ?? 0).toLocaleString()}</span>
          </div>
          {loading ? <div className="h-24 bg-[var(--bg-surface)] rounded animate-pulse" /> :
            <MiniChart data={chartData.length ? chartData.map(v => v * appFee) : [0]} type="area" color="var(--color-success)" height={90} labels={[]} />
          }
        </div>
      </div>

      {/* Job listings table */}
      <section aria-labelledby="jobs-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="jobs-heading" className="font-bold text-lg text-[var(--text-primary)]">Active Job Listings</h2>
          <Link href={ROUTES.adminJobs} className="text-sm font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 transition-colors">Manage all →</Link>
        </div>
        {loading ? (
          <div className="flex flex-col gap-2">{[1,2,3].map(i=><SkeletonCard key={i} lines={2}/>)}</div>
        ) : jobs.length === 0 ? (
          <div className={`${CARD} flex flex-col items-center gap-3 py-10 text-center`}>
            <p className="text-[var(--text-muted)] text-sm">No job listings yet.</p>
            <Button variant="gradient" size="sm" href={ROUTES.adminPostJob} pill>Post First Job</Button>
          </div>
        ) : (
          <div className={`${CARD} overflow-hidden`}>
            <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
              {[["col-span-5","Job Title"],["col-span-2 hidden md:block","Location"],["col-span-2","Applicants"],["col-span-1 hidden sm:block","Status"],["col-span-2","Actions"]].map(([cls,label])=>(
                <span key={label} className={`${cls} text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]`}>{label}</span>
              ))}
            </div>
            {jobs.map((job, i) => (
              <div key={job.id} className={["grid grid-cols-12 gap-3 items-center px-5 py-3.5","hover:bg-[var(--bg-surface)] transition-colors",i<jobs.length-1?"border-b border-[var(--border-default)]":""].join(" ")}>
                <div className="col-span-5 flex flex-col gap-0.5 min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] text-sm truncate">{job.title}</p>
                  <p className="text-[var(--text-muted)] text-xs">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="col-span-2 text-[var(--text-secondary)] text-sm hidden md:block truncate">{job.location}</p>
                <span className="col-span-2 font-bold text-sm text-[var(--text-primary)]">{job.applicants}</span>
                <div className="col-span-1 hidden sm:block">
                  <Badge variant={job.status==="ACTIVE"?"success":"neutral"} size="sm" dot>{job.status==="ACTIVE"?"Active":"Closed"}</Badge>
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <Link href={adminJobApplicantsUrl(job.id)} className="text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 transition-colors">View</Link>
                  <Link href={adminEditJobUrl(job.id)}       className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent applicants */}
      <section aria-labelledby="recent-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="recent-heading" className="font-bold text-lg text-[var(--text-primary)]">Recent Applicants</h2>
          <Link href={ROUTES.adminApplicants} className="text-sm font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 transition-colors">View all →</Link>
        </div>
        {loading ? (
          <div className="flex flex-col gap-2">{[1,2,3].map(i=><SkeletonCard key={i} lines={2} showIcon/>)}</div>
        ) : applicants.length === 0 ? (
          <div className={`${CARD} py-10 text-center`}>
            <p className="text-[var(--text-muted)] text-sm">No applications yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {applicants.map(app => (
              <div key={app.id} className={`${CARD} flex items-center gap-4 p-4 hover:shadow-[var(--shadow-1)] transition-all`}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {app.applicantName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] text-sm truncate">{app.applicantName}</p>
                  <p className="text-[var(--text-muted)] text-xs truncate">Applied for {app.jobTitle}</p>
                </div>
                <span className="text-[var(--text-muted)] text-xs flex-shrink-0 hidden sm:inline">{new Date(app.appliedDate).toLocaleDateString()}</span>
                <Badge variant={APP_BADGE[app.status]??"neutral"} size="sm" dot>{STATUS_LABEL[app.status]??app.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
