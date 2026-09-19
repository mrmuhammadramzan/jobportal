"use client";
/**
 * /dashboard/applications — Job Seeker application tracker.
 *
 * Wired to:
 *   GET /api/seeker/applications — load all applications
 *
 * Features:
 *   - Filter by status tab (All / Active / Shortlisted / Hired / Rejected)
 *   - Search by job title or company
 *   - Expandable row: shows payment status, CV link, status timeline
 *   - Error state + retry
 *   - Empty state with Browse CTA
 *
 * Frontend SOP §6.1: loading / error / empty / populated states.
 * Frontend SOP §7: search has sr-only label, all inputs accessible.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens.
 * DRY: token(), Icon, STATUS_BADGE, STATUS_LABEL, TIMELINE — each defined once.
 */
import React, { useState, useMemo, useEffect } from "react";
import Button from "@/components/Button";
import Badge  from "@/components/Badge";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import { ROUTES, jobUrl } from "@/lib/routes";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function token(): string {
  return typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : "";
}

/* ── Status config ── */
const STATUS_BADGE: Record<string, "success"|"warning"|"brand"|"error"|"neutral"> = {
  SHORTLISTED:"success", CV_UNDER_REVIEW:"warning", PAYMENT_UNDER_REVIEW:"warning",
  PENDING_PAYMENT:"brand", PAYMENT_REJECTED:"error", REJECTED:"error", HIRED:"success",
};
const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT:      "Pending Payment",
  PAYMENT_UNDER_REVIEW: "Payment Review",
  PAYMENT_REJECTED:     "Payment Rejected",
  CV_UNDER_REVIEW:      "CV Under Review",
  SHORTLISTED:          "Shortlisted",
  REJECTED:             "Rejected",
  HIRED:                "Hired 🎉",
};

/* Timeline steps — what each status means to the seeker */
const STATUS_TIMELINE = [
  { key:"PENDING_PAYMENT",       label:"Applied",         desc:"Submit your payment receipt to continue." },
  { key:"PAYMENT_UNDER_REVIEW",  label:"Payment Review",  desc:"Admin is verifying your payment receipt." },
  { key:"CV_UNDER_REVIEW",       label:"CV Under Review", desc:"Hiring team is reviewing your CV." },
  { key:"SHORTLISTED",           label:"Shortlisted",     desc:"You're shortlisted! Await next steps." },
  { key:"HIRED",                 label:"Hired",           desc:"Congratulations — you got the job! 🎉" },
];
const STATUS_ORDER = STATUS_TIMELINE.map(s => s.key);

type FilterTab = "All" | "Active" | "Shortlisted" | "Hired" | "Rejected";

function matchesFilter(status: string, filter: FilterTab): boolean {
  if (filter === "All")         return true;
  if (filter === "Active")      return ["PENDING_PAYMENT","PAYMENT_UNDER_REVIEW","CV_UNDER_REVIEW"].includes(status);
  if (filter === "Shortlisted") return status === "SHORTLISTED";
  if (filter === "Hired")       return status === "HIRED";
  if (filter === "Rejected")    return ["REJECTED","PAYMENT_REJECTED"].includes(status);
  return true;
}

interface Application {
  id: string; jobId: string; jobTitle: string; company: string;
  location: string; type: string; status: string;
  appliedDate: string; paymentStatus: string | null;
}

const CARD = "rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [filter,       setFilter]       = useState<FilterTab>("All");
  const [search,       setSearch]       = useState("");
  const [expanded,     setExpanded]     = useState<string | null>(null);

  /* ── Load applications with auth header ── */
  useEffect(() => {
    fetch("/api/seeker/applications", {
      credentials: "include",
      headers: { Authorization: `Bearer ${token()}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to load applications")))
      .then(data => setApplications(Array.isArray(data) ? data : []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  /* ── Filter + search ── */
  const filtered = useMemo(() =>
    applications.filter(a => {
      const matchStatus = matchesFilter(a.status, filter);
      const matchSearch = search === "" ||
        a.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
        a.company.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    }),
    [applications, filter, search]
  );

  /* ── Tab counts ── */
  const counts = useMemo(() => ({
    All:         applications.length,
    Active:      applications.filter(a => ["PENDING_PAYMENT","PAYMENT_UNDER_REVIEW","CV_UNDER_REVIEW"].includes(a.status)).length,
    Shortlisted: applications.filter(a => a.status === "SHORTLISTED").length,
    Hired:       applications.filter(a => a.status === "HIRED").length,
    Rejected:    applications.filter(a => ["REJECTED","PAYMENT_REJECTED"].includes(a.status)).length,
  }), [applications]);

  const FILTER_TABS: FilterTab[] = ["All", "Active", "Shortlisted", "Hired", "Rejected"];

  /* ── Get current timeline step index ── */
  function getTimelineStep(status: string): number {
    const idx = STATUS_ORDER.indexOf(status);
    return idx === -1 ? 0 : idx;
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">My Applications</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-0.5">
            {loading ? "Loading…" : `${applications.length} total application${applications.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button variant="gradient" size="md" href={ROUTES.jobs} pill
          iconRight={<Icon path="M9 5l7 7-7 7" className="w-4 h-4"/>}>
          Find More Jobs
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

      {/* Filter tabs + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-1 p-1 rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-default)] overflow-x-auto flex-shrink-0"
          role="tablist" aria-label="Filter applications by status">
          {FILTER_TABS.map(tab => (
            <button key={tab} type="button" role="tab" aria-selected={filter === tab}
              onClick={() => setFilter(tab)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold whitespace-nowrap",
                "transition-all duration-[var(--dur-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                filter === tab
                  ? "bg-[var(--brand-500)] text-white shadow-[var(--shadow-brand)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]",
              ].join(" ")}>
              {tab}
              <span className={["text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                filter===tab?"bg-white/20 text-white":"bg-[var(--bg-elevated)] text-[var(--text-muted)]"].join(" ")}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-1 min-w-0">
          <label htmlFor="app-search" className="sr-only">Search applications</label>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4"/>
          </div>
          <input id="app-search" type="search" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by job title or company…"
            className="w-full h-9 pl-9 pr-3 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all"/>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-3">{[1,2,3,4].map(i=><SkeletonCard key={i} lines={2} showIcon/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
            <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" className="w-5 h-5 text-[var(--text-muted)]"/>
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">
              {search ? "No applications match your search" : "No applications yet"}
            </p>
            <p className="text-[var(--text-secondary)] text-sm mt-0.5">
              {search ? "Try different keywords." : "Browse open jobs and apply in one click."}
            </p>
          </div>
          {!search && <Button variant="gradient" size="md" href={ROUTES.jobs} pill>Browse Jobs</Button>}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(app => {
            const isExpanded   = expanded === app.id;
            const stepIndex    = getTimelineStep(app.status);
            const isRejected   = ["REJECTED","PAYMENT_REJECTED"].includes(app.status);
            const timelineSteps = isRejected ? STATUS_TIMELINE.slice(0, stepIndex + 1) : STATUS_TIMELINE;

            return (
              <div key={app.id} className={`${CARD} overflow-hidden hover:border-[var(--border-hover)] transition-all`}>

                {/* Row — click to expand */}
                <button type="button" onClick={() => setExpanded(isExpanded ? null : app.id)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--bg-surface)] transition-colors">
                  {/* Company avatar */}
                  <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {app.company?.[0]?.toUpperCase() ?? "?"}
                  </div>

                  {/* Job info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--text-primary)] text-sm truncate">{app.jobTitle}</p>
                    <p className="text-[var(--text-secondary)] text-xs truncate">
                      {app.company}
                      {app.location ? ` · ${app.location}` : ""}
                      {app.type ? ` · ${app.type}` : ""}
                    </p>
                  </div>

                  {/* Status + date */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge variant={STATUS_BADGE[app.status] ?? "neutral"} size="sm" dot>
                      {STATUS_LABEL[app.status] ?? app.status}
                    </Badge>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {new Date(app.appliedDate).toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric" })}
                    </span>
                  </div>

                  {/* Expand chevron */}
                  <Icon path="M9 5l7 7-7 7"
                    className={`w-4 h-4 text-[var(--text-muted)] flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}/>
                </button>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div className="border-t border-[var(--border-default)] px-4 pb-5 pt-4 flex flex-col gap-5 bg-[var(--bg-surface)]">

                    {/* Application progress timeline */}
                    <div>
                      <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Application Progress</p>
                      <div className="flex items-start gap-0">
                        {timelineSteps.map((step, i) => {
                          const isDone    = i < stepIndex || (i === stepIndex && !isRejected);
                          const isCurrent = i === stepIndex;
                          const isLast    = i === timelineSteps.length - 1;
                          return (
                            <div key={step.key} className="flex flex-col items-center flex-1 min-w-0">
                              {/* Line + dot row */}
                              <div className="flex items-center w-full">
                                {/* Left line */}
                                <div className={`h-0.5 flex-1 ${i === 0 ? "invisible" : isDone ? "bg-[var(--brand-500)]" : "bg-[var(--border-default)]"}`} />
                                {/* Dot */}
                                <div className={[
                                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all",
                                  isDone && !isRejected
                                    ? "bg-[var(--brand-500)] border-[var(--brand-500)]"
                                    : isCurrent && isRejected
                                      ? "bg-[var(--color-error)] border-[var(--color-error)]"
                                      : isCurrent
                                        ? "bg-[var(--brand-500)] border-[var(--brand-500)]"
                                        : "bg-[var(--bg-elevated)] border-[var(--border-default)]",
                                ].join(" ")}>
                                  {(isDone || isCurrent) ? (
                                    <Icon path={isRejected && isCurrent ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"}
                                      className="w-3 h-3 text-white"/>
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-[var(--border-default)]"/>
                                  )}
                                </div>
                                {/* Right line */}
                                <div className={`h-0.5 flex-1 ${isLast ? "invisible" : isDone ? "bg-[var(--brand-500)]" : "bg-[var(--border-default)]"}`} />
                              </div>
                              {/* Label */}
                              <p className={`text-[10px] font-semibold mt-1.5 text-center leading-tight ${
                                isCurrent ? (isRejected ? "text-[var(--color-error)]" : "text-[var(--brand-500)]")
                                : isDone ? "text-[var(--text-primary)]"
                                : "text-[var(--text-muted)]"
                              }`}>
                                {step.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Current step description */}
                      {STATUS_TIMELINE[stepIndex] && (
                        <p className={`text-xs mt-3 px-3 py-2 rounded-[var(--radius-md)] ${
                          isRejected
                            ? "bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] text-[var(--color-error)]"
                            : app.status === "HIRED"
                              ? "bg-[color-mix(in_srgb,var(--color-success)_8%,transparent)] text-[var(--color-success)]"
                              : "bg-[color-mix(in_srgb,var(--brand-500)_6%,transparent)] text-[var(--text-secondary)]"
                        }`}>
                          {isRejected
                            ? "Your application was not successful. Keep applying — more jobs are available."
                            : STATUS_TIMELINE[stepIndex].desc}
                        </p>
                      )}
                    </div>

                    {/* Meta details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label:"Applied",     value: new Date(app.appliedDate).toLocaleDateString("en-PK",{day:"numeric",month:"long",year:"numeric"}) },
                        { label:"Payment",     value: app.paymentStatus
                            ? (app.paymentStatus === "APPROVED" ? "✓ Approved" : app.paymentStatus === "REJECTED" ? "✗ Rejected" : "Pending review")
                            : "Not submitted" },
                        { label:"Job Type",    value: app.type ?? "—" },
                      ].map(f => (
                        <div key={f.label} className="flex flex-col gap-0.5 p-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)]">
                          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">{f.label}</p>
                          <p className="text-sm font-semibold text-[var(--text-primary)]">{f.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Button variant="outline" size="sm" href={jobUrl(app.jobId)} pill>
                        View Job Listing
                      </Button>
                      {app.status === "PENDING_PAYMENT" && (
                        <Button variant="gradient" size="sm" href={`/dashboard/apply/${app.jobId}`} pill>
                          Continue Application →
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-center text-xs text-[var(--text-muted)]">
          Showing {filtered.length} of {applications.length} application{applications.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
