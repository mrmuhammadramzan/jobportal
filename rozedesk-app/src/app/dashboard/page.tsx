"use client";
/**
 * /dashboard — Job Seeker Overview
 *
 * Fully wired to real APIs:
 *   GET /api/seeker/applications — seeker's own applications (auth required)
 *   GET /api/jobs?sort=latest&limit=3 — latest 3 jobs (public)
 *
 * Frontend SOP §6.1: loading / empty / populated states for every section.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens.
 * DRY: token(), Icon, STATUS_BADGE, STATUS_LABEL — each defined once.
 */
import React, { useState, useEffect, useMemo } from "react";
import Link      from "next/link";
import Button    from "@/components/Button";
import Badge     from "@/components/Badge";
import MiniChart from "@/components/dashboard/MiniChart";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import { ROUTES, jobUrl, applyJobUrl } from "@/lib/routes";
import { useAuth } from "@/context/AuthContext";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const STATUS_BADGE: Record<string, "success"|"warning"|"brand"|"error"|"neutral"> = {
  SHORTLISTED:"success", CV_UNDER_REVIEW:"warning", PAYMENT_UNDER_REVIEW:"warning",
  PENDING_PAYMENT:"brand", PAYMENT_REJECTED:"error", REJECTED:"error", HIRED:"success",
};
const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT:"Pending Payment", PAYMENT_UNDER_REVIEW:"Payment Review",
  PAYMENT_REJECTED:"Payment Rejected", CV_UNDER_REVIEW:"CV Under Review",
  SHORTLISTED:"Shortlisted", REJECTED:"Rejected", HIRED:"Hired",
};

interface Application {
  id: string; jobId: string; jobTitle: string; company: string;
  status: string; appliedDate: string;
}
interface Job {
  id: string; title: string; company: string; location: string;
  type: string; postedAt: string; applicants: number;
}

/** Get auth token from localStorage — used for API calls that require auth */
function token(): string {
  return typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
}

/** Build daily application chart data for the last 7 days */
function buildWeeklyChart(applications: Application[]): number[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const day   = new Date(today);
    day.setDate(today.getDate() - (6 - i));
    const from  = new Date(day); from.setHours(0, 0, 0, 0);
    const to    = new Date(day); to.setHours(23, 59, 59, 999);
    return applications.filter(a => {
      const d = new Date(a.appliedDate);
      return d >= from && d <= to;
    }).length;
  });
}

const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs,         setJobs]         = useState<Job[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true); setError("");
      try {
        const [appsRes, jobsRes] = await Promise.all([
          fetch("/api/seeker/applications", {
            credentials: "include",
            headers: { Authorization: `Bearer ${token()}` },
          }),
          fetch("/api/jobs?sort=latest&limit=3"),
        ]);

        const appsData = appsRes.ok  ? await appsRes.json()          : [];
        const jobsData = jobsRes.ok  ? await jobsRes.json()          : { jobs: [] };

        setApplications(Array.isArray(appsData) ? appsData : []);
        setJobs(jobsData.jobs ?? []);
      } catch (e) {
        console.error("Dashboard fetch failed:", e);
        setError("Could not load dashboard data. Please refresh.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* Derived stats */
  const shortlisted = applications.filter(a => a.status === "SHORTLISTED").length;
  const underReview = applications.filter(a =>
    ["CV_UNDER_REVIEW", "PAYMENT_UNDER_REVIEW"].includes(a.status)
  ).length;
  const total = applications.length;

  /* Real 7-day chart from actual application dates */
  const weeklyChart = useMemo(() => buildWeeklyChart(applications), [applications]);

  const STATS = [
    {
      label:"Applications Sent", value:String(total),
      iconBg:"color-mix(in srgb,var(--brand-500) 14%,transparent)", iconColor:"var(--brand-500)",
      icon:<Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>,
    },
    {
      label:"Shortlisted",        value:String(shortlisted),
      iconBg:"color-mix(in srgb,var(--color-success) 14%,transparent)", iconColor:"var(--color-success)",
      icon:<Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>,
    },
    {
      label:"Under Review",       value:String(underReview),
      iconBg:"color-mix(in srgb,var(--color-warning) 14%,transparent)", iconColor:"var(--color-warning)",
      icon:<Icon path="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>,
    },
    {
      label:"Jobs Available",     value:String(jobs.length),
      iconBg:"color-mix(in srgb,var(--brand-500) 14%,transparent)", iconColor:"var(--brand-500)",
      icon:<Icon path="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>,
    },
  ];

  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <div className="flex flex-col gap-8">

      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">
            Welcome back{firstName ? `, ${firstName}` : ""} 👋
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">
            {loading ? "Loading your dashboard…" :
              error ? "There was an error loading some data." :
              shortlisted > 0 ? `You have ${shortlisted} shortlisted application${shortlisted > 1 ? "s" : ""}.` :
              total > 0       ? `You have ${total} application${total > 1 ? "s" : ""} submitted.` :
              "Browse open jobs and apply today."
            }
          </p>
        </div>
        <Button variant="gradient" size="md" href={ROUTES.jobs} pill glow
          iconRight={<Icon path="M9 5l7 7-7 7" className="w-4 h-4"/>}>
          Browse Jobs
        </Button>
      </div>

      {/* Error banner */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0"/>
          <p className="text-xs font-medium text-[var(--color-error)] flex-1">{error}</p>
          <button type="button" onClick={() => window.location.reload()}
            className="text-xs font-semibold text-[var(--brand-500)] hover:underline">Retry</button>
        </div>
      )}

      {/* Stats row */}
      {loading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} lines={2} showIcon />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label}
              className="flex flex-col gap-3 p-5 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:-translate-y-0.5 transition-all duration-[var(--dur-deliberate)]">
              <div className="w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center"
                style={{ background: s.iconBg }}>
                <span style={{ color: s.iconColor }}>{s.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-black gradient-text leading-none">{s.value}</p>
                <p className="text-[var(--text-sm)] font-semibold text-[var(--text-primary)] mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity chart — real data from applications */}
      <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-bold text-[var(--text-primary)] text-base">Application Activity</p>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">Applications by day this week</p>
          </div>
          <span className="gradient-text font-black text-lg leading-none">{total}</span>
        </div>
        {loading ? (
          <div className="h-20 bg-[var(--bg-surface)] rounded animate-pulse" />
        ) : (
          <MiniChart
            data={weeklyChart}
            type="area"
            color="var(--brand-500)"
            height={80}
            labels={WEEK_LABELS}
          />
        )}
        {!loading && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-default)]">
            <span className="text-xs text-[var(--text-muted)]">
              This week: {weeklyChart.reduce((a,b)=>a+b,0)} application{weeklyChart.reduce((a,b)=>a+b,0) !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Peak day: {Math.max(0, ...weeklyChart)}
            </span>
          </div>
        )}
      </div>

      {/* Recent applications */}
      <section aria-labelledby="apps-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="apps-heading" className="font-bold text-lg text-[var(--text-primary)]">
            My Applications
          </h2>
          <Link href={ROUTES.applications}
            className="text-sm font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 transition-colors">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">{[1,2,3].map(i => <SkeletonCard key={i} lines={2} showIcon />)}</div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
            <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" className="w-8 h-8 text-[var(--text-muted)]"/>
            <p className="font-semibold text-[var(--text-primary)]">No applications yet</p>
            <p className="text-[var(--text-secondary)] text-sm">Apply to your first job and it will appear here.</p>
            <Button variant="gradient" size="md" href={ROUTES.jobs} pill>Browse Jobs</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.slice(0, 3).map(app => (
              <div key={app.id}
                className="flex items-center gap-4 p-4 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--brand-300)] transition-all">
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {(app.company?.[0] ?? "?").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] text-sm truncate">{app.jobTitle}</p>
                  <p className="text-[var(--text-secondary)] text-xs truncate">{app.company}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge variant={STATUS_BADGE[app.status] ?? "neutral"} size="sm" dot>
                    {STATUS_LABEL[app.status] ?? app.status}
                  </Badge>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {new Date(app.appliedDate).toLocaleDateString("en-PK", { day:"numeric", month:"short" })}
                  </span>
                </div>
              </div>
            ))}
            {applications.length > 3 && (
              <Link href={ROUTES.applications}
                className="text-center text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 py-2 transition-colors">
                View {applications.length - 3} more →
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Latest jobs */}
      <section aria-labelledby="jobs-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="jobs-heading" className="font-bold text-lg text-[var(--text-primary)]">
            Latest Job Listings
          </h2>
          <Link href={ROUTES.jobs}
            className="text-sm font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 transition-colors">
            Browse all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <SkeletonCard key={i} lines={3} showIcon />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
            <Icon path="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="w-8 h-8 text-[var(--text-muted)]"/>
            <p className="text-[var(--text-muted)] text-sm">No jobs available right now. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {jobs.map(job => (
              /* Card is <div> — prevents nested <a> hydration error (LESSON: 2026-09-15) */
              <div key={job.id}
                className="group flex flex-col gap-3 p-4 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--brand-400)] hover:shadow-[var(--shadow-2)] hover:-translate-y-0.5 transition-all duration-[var(--dur-deliberate)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                    {(job.company?.[0] ?? "?").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <a href={jobUrl(job.id)}
                      className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--brand-500)] transition-colors truncate block hover:underline underline-offset-2">
                      {job.title}
                    </a>
                    <p className="text-xs text-[var(--text-muted)] truncate">{job.company}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)]">{job.location}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--brand-100)] text-[var(--brand-700)] border border-[var(--brand-200)]">{job.type}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {job.applicants} applied
                  </span>
                  <Button variant="gradient" size="sm" href={applyJobUrl(job.id)} pill>
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
