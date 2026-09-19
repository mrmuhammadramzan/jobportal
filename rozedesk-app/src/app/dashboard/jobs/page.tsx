"use client";
/**
 * /dashboard/jobs — Browse jobs within the seeker dashboard layout.
 *
 * Shows all active jobs. Each card shows:
 *   - Job title, company, location, type
 *   - "Applied" badge if the seeker has already applied
 *   - "Apply Now" CTA if not yet applied
 *
 * Wired to:
 *   GET /api/jobs?sort=latest&limit=50   — all active jobs
 *   GET /api/seeker/applications          — to check applied status
 *
 * Frontend SOP §6.1: loading / empty / populated states.
 * DRY: token(), Icon, CATEGORIES — each defined once.
 */
import React, { useState, useEffect, useMemo } from "react";
import Button         from "@/components/Button";
import Badge           from "@/components/Badge";
import SkeletonCard    from "@/components/dashboard/SkeletonCard";
import SaveJobButton   from "@/components/SaveJobButton";
import { dashboardJobUrl, applyJobUrl } from "@/lib/routes";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function token() {
  return typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
}

interface Job {
  id: string; title: string; company: string; location: string;
  type: string; category: string; postedAt: string; applicants: number;
  salaryMin?: number; salaryMax?: number;
}

const APP_STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment", PAYMENT_UNDER_REVIEW: "Payment Review",
  CV_UNDER_REVIEW: "CV Review", SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected", HIRED: "Hired 🎉", PAYMENT_REJECTED: "Payment Rejected",
};
const APP_STATUS_BADGE: Record<string, "brand"|"warning"|"success"|"error"|"neutral"> = {
  PENDING_PAYMENT:"brand", PAYMENT_UNDER_REVIEW:"warning", CV_UNDER_REVIEW:"warning",
  SHORTLISTED:"success", REJECTED:"error", HIRED:"success", PAYMENT_REJECTED:"error",
};

const CATEGORIES = ["All","Technology","Design","Marketing","Finance","Healthcare","Education","Operations"];
const JOB_TYPES  = ["All","Full-time","Part-time","Contract","Remote","Internship"];

function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  if (min && max)   return `PKR ${min.toLocaleString()} – ${max.toLocaleString()}`;
  if (min)          return `From PKR ${min.toLocaleString()}`;
  return `Up to PKR ${max!.toLocaleString()}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-PK", { day:"numeric", month:"short" });
}

export default function DashboardJobsPage() {
  const [jobs,        setJobs]        = useState<Job[]>([]);
  const [appliedMap,  setAppliedMap]  = useState<Record<string, string>>({}); // jobId → status
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("All");
  const [jobType,     setJobType]     = useState("All");

  /* Load jobs + applied status in parallel */
  useEffect(() => {
    Promise.all([
      fetch("/api/jobs?sort=latest&limit=50")
        .then(r => r.ok ? r.json() : { jobs: [] }),
      fetch("/api/seeker/applications", {
        credentials: "include",
        headers: { Authorization: `Bearer ${token()}` },
      }).then(r => r.ok ? r.json() : []),
    ])
      .then(([jobsData, appsData]) => {
        setJobs(jobsData.jobs ?? []);
        const map: Record<string, string> = {};
        (Array.isArray(appsData) ? appsData : []).forEach((a: { jobId: string; status: string }) => {
          map[a.jobId] = a.status;
        });
        setAppliedMap(map);
      })
      .catch(e => setError(e.message ?? "Failed to load jobs."))
      .finally(() => setLoading(false));
  }, []);

  /* Client-side filter */
  const filtered = useMemo(() =>
    jobs.filter(j => {
      const matchSearch   = search === "" ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || j.category === category;
      const matchType     = jobType   === "All" || j.type === jobType;
      return matchSearch && matchCategory && matchType;
    }),
    [jobs, search, category, jobType]
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Browse Jobs</h2>
        <p className="text-[var(--text-muted)] text-sm mt-0.5">
          {loading ? "Loading…" : `${filtered.length} job${filtered.length !== 1 ? "s" : ""} available`}
        </p>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)]"/>
          <p className="text-xs font-medium text-[var(--color-error)] flex-1">{error}</p>
          <button type="button" onClick={() => window.location.reload()} className="text-xs font-semibold text-[var(--brand-500)] hover:underline">Retry</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <label htmlFor="djobs-search" className="sr-only">Search jobs</label>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4"/>
          </div>
          <input id="djobs-search" type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or company…"
            className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all"/>
        </div>
        {/* Category */}
        <div>
          <label htmlFor="djobs-cat" className="sr-only">Category</label>
          <select id="djobs-cat" value={category} onChange={e => setCategory(e.target.value)}
            className="h-9 px-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-500)] appearance-none cursor-pointer min-w-[130px]">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {/* Type */}
        <div>
          <label htmlFor="djobs-type" className="sr-only">Job type</label>
          <select id="djobs-type" value={jobType} onChange={e => setJobType(e.target.value)}
            className="h-9 px-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-500)] appearance-none cursor-pointer min-w-[130px]">
            {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        {/* Clear */}
        {(search || category !== "All" || jobType !== "All") && (
          <button type="button" onClick={() => { setSearch(""); setCategory("All"); setJobType("All"); }}
            className="text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 self-center whitespace-nowrap">
            Clear filters
          </button>
        )}
      </div>

      {/* Jobs list */}
      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3,4,5].map(i => <SkeletonCard key={i} lines={2} showIcon/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
          <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-8 h-8 text-[var(--text-muted)]"/>
          <p className="font-semibold text-[var(--text-primary)]">No jobs match your filters</p>
          <button type="button" onClick={() => { setSearch(""); setCategory("All"); setJobType("All"); }}
            className="text-sm font-semibold text-[var(--brand-500)] hover:underline underline-offset-2">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(job => {
            const appStatus = appliedMap[job.id];
            const hasApplied = Boolean(appStatus);
            const salary = formatSalary(job.salaryMin, job.salaryMax);

            return (
              <div key={job.id}
                className="flex items-start gap-4 p-5 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--brand-300)] hover:shadow-[var(--shadow-1)] transition-all">

                {/* Avatar */}
                <div className="w-11 h-11 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {(job.company?.[0] ?? "?").toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <a href={dashboardJobUrl(job.id)}
                        className="font-bold text-[var(--text-primary)] text-base hover:text-[var(--brand-500)] transition-colors truncate block hover:underline underline-offset-2">
                        {job.title}
                      </a>
                      <p className="text-[var(--text-secondary)] text-sm">{job.company}</p>
                    </div>
                    {/* Applied status badge */}
                    {hasApplied && (
                      <Badge variant={APP_STATUS_BADGE[appStatus] ?? "neutral"} size="sm" dot>
                        {APP_STATUS_LABEL[appStatus] ?? appStatus}
                      </Badge>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                      {job.location}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--brand-100)] text-[var(--brand-700)] border border-[var(--brand-200)]">
                      {job.type}
                    </span>
                    {job.category && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-default)]">
                        {job.category}
                      </span>
                    )}
                    {salary && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--color-success)_10%,transparent)] text-[var(--color-success)] border border-[color-mix(in_srgb,var(--color-success)_20%,transparent)]">
                        {salary}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-xs text-[var(--text-muted)]">{formatDate(job.postedAt)}</span>
                  <span className="text-xs text-[var(--text-muted)]">{job.applicants} applied</span>
                  {hasApplied ? (
                    <a href={`/dashboard/applications`}
                      className="text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2">
                      Track →
                    </a>
                  ) : (
                    <>
                      <Button variant="gradient" size="sm" href={applyJobUrl(job.id)} pill>
                        Apply Now
                      </Button>
                      <SaveJobButton jobId={job.id} variant="card" />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-center text-xs text-[var(--text-muted)]">
          Showing {filtered.length} of {jobs.length} active job{jobs.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
