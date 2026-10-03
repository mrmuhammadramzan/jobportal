"use client";
/**
 * /jobs — Public job listings.
 * Fetches from /api/jobs with query params for search/filter/sort.
 * DRY: NavBar, Footer, Button, Badge — all from components.
 * LESSON: useSearchParams requires Suspense boundary in Next.js 16 for static prerender.
 */
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavBar        from "@/components/NavBar";
import Footer        from "@/components/Footer";
import Button        from "@/components/Button";
import SkeletonCard  from "@/components/dashboard/SkeletonCard";
import SaveJobButton from "@/components/SaveJobButton";
import { ROUTES, jobUrl, applyJobUrl } from "@/lib/routes";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const CATEGORIES = ["All","Technology","Design","Marketing","Finance","Healthcare","Education"];
const LOCATIONS  = ["All","Lahore","Karachi","Islamabad","Remote"];
const JOB_TYPES  = ["All","Full-time","Part-time","Contract","Remote","Internship"];

interface Job {
  id: string; title: string; company: string; location: string;
  type: string; category: string; postedAt: string; applicants: number;
}

function JobsPageInner() {
  const searchParams = useSearchParams();

  const [search,   setSearch]   = useState(searchParams.get("q")        ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All");
  const [location, setLocation] = useState("All");
  const [jobType,  setJobType]  = useState("All");
  const [sortBy,   setSortBy]   = useState<"latest"|"applicants">("latest");
  const [jobs,     setJobs]     = useState<Job[]>([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Sync URL query params on mount */
  useEffect(() => {
    const q = searchParams.get("q");
    const c = searchParams.get("category");
    if (q) setSearch(q);
    if (c) setCategory(c);
  }, [searchParams]);

  /* Fetch jobs whenever filters change.
     Search input is debounced 300ms to avoid a DB hit on every keystroke.
     Category/location/type/sort changes are instant (button clicks, not typing). */
  useEffect(() => {
    /* Immediate fetch for non-search filter changes */
    const DEBOUNCE = 300;

    const doFetch = () => {
      const params = new URLSearchParams();
      if (search && search !== "")  params.set("q",        search);
      if (category !== "All")       params.set("category", category);
      if (location !== "All")       params.set("location", location);
      if (jobType  !== "All")       params.set("type",     jobType);
      params.set("sort",  sortBy);
      params.set("limit", "50");

      setLoading(true);
      fetch(`/api/jobs?${params.toString()}`)
        .then(r => r.ok ? r.json() : { jobs: [], total: 0 })
        .then(data => { setJobs(data.jobs ?? []); setTotal(data.total ?? 0); })
        .catch(() => { setJobs([]); setTotal(0); })
        .finally(() => setLoading(false));
    };

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(doFetch, DEBOUNCE);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, category, location, jobType, sortBy]);

  function formatDate(iso: string) {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  }

  return (
    <>
      <NavBar />
      <main id="main-content" className="pt-16 min-h-screen bg-[var(--bg-base)]">

        {/* Hero search strip */}
        <div className="bg-gradient-to-r from-[var(--brand-700)] to-[var(--brand-500)] py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-white font-black text-3xl tracking-tight mb-4">Browse Jobs</h1>
            <div className="flex gap-2 max-w-2xl">
              <div className="flex-1 relative">
                <label htmlFor="jobs-search" className="sr-only">Search jobs</label>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                  <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4"/>
                </div>
                <input
                  id="jobs-search"
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Job title, keyword, or company…"
                  className="w-full h-11 pl-9 pr-3 rounded-[var(--radius-lg)] bg-white/15 border border-white/25 text-white placeholder:text-white/50 text-sm outline-none focus:bg-white/25 focus:border-white/50 transition-all"
                />
              </div>
              <Button variant="secondary" size="md" pill
                className="!bg-white !text-[var(--brand-700)] hover:!bg-[var(--gray-50)] flex-shrink-0"
                onClick={() => setSearch(search)}>
                Search
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar filters */}
            <aside className="lg:w-56 flex-shrink-0" aria-label="Filter jobs">
              <div className="flex flex-col gap-4 lg:sticky lg:top-24">

                {[
                  { label:"Category", value:category, set:setCategory, options:CATEGORIES },
                  { label:"Location", value:location, set:setLocation, options:LOCATIONS  },
                  { label:"Job Type", value:jobType,  set:setJobType,  options:JOB_TYPES  },
                ].map(filter => (
                  <div key={filter.label} className="flex flex-col gap-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      {filter.label}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {filter.options.map(opt => (
                        <button key={opt} type="button" onClick={() => filter.set(opt)}
                          className={[
                            "text-left px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-[var(--dur-fast)]",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                            filter.value === opt
                              ? "bg-[var(--brand-500)] text-white shadow-[var(--shadow-brand)]"
                              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]",
                          ].join(" ")}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Sort */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Sort By</p>
                  {[{k:"latest",l:"Latest First"},{k:"applicants",l:"Most Popular"}].map(s=>(
                    <button key={s.k} type="button" onClick={() => setSortBy(s.k as "latest"|"applicants")}
                      className={["text-left px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                        sortBy===s.k ? "bg-[var(--brand-500)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                      ].join(" ")}>
                      {s.l}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Job cards */}
            <div className="flex-1 min-w-0">

              <div className="flex items-center justify-between mb-4">
                <p className="text-[var(--text-secondary)] text-sm">
                  {loading ? "Loading…" : (
                    <><strong className="text-[var(--text-primary)]">{total || jobs.length}</strong> jobs found</>
                  )}
                </p>
                {!loading && (category !== "All" || location !== "All" || jobType !== "All" || search) && (
                  <button type="button" onClick={() => { setSearch(""); setCategory("All"); setLocation("All"); setJobType("All"); }}
                    className="text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 transition-colors">
                    Clear filters
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex flex-col gap-3">
                  {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} lines={3} showIcon />)}
                </div>
              ) : jobs.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
                  <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-8 h-8 text-[var(--text-muted)]"/>
                  <p className="font-semibold text-[var(--text-primary)]">No jobs match your filters</p>
                  <p className="text-[var(--text-muted)] text-sm">Try different keywords or clear your filters.</p>
                  <Button variant="outline" size="md" pill
                    onClick={() => { setSearch(""); setCategory("All"); setLocation("All"); setJobType("All"); }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {jobs.map(job => (
                    /* FIX: div not <a> — title is the nav link, Apply is the CTA */
                    <div key={job.id}
                      className="group flex items-start gap-4 p-5 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[var(--brand-400)] hover:shadow-[var(--shadow-2)] transition-all duration-[var(--dur-deliberate)]">
                      {/* Company avatar — clicks to job detail */}
                      <a href={jobUrl(job.id)} tabIndex={-1} aria-hidden="true"
                        className="w-12 h-12 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-black text-base flex-shrink-0">
                        {job.company[0]}
                      </a>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <a href={jobUrl(job.id)} className="font-bold text-[var(--text-primary)] text-base group-hover:text-[var(--brand-500)] transition-colors truncate block hover:underline underline-offset-2">
                          {job.title}
                        </a>
                        <p className="text-[var(--text-secondary)] text-sm">{job.company}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)]">{job.location}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--brand-100)] text-[var(--brand-700)] border border-[var(--brand-200)]">{job.type}</span>
                          {job.category && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-muted)] border border-[var(--border-default)]">{job.category}</span>}
                        </div>
                      </div>
                      {/* Meta + Apply */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0 hidden sm:flex">
                        <span className="text-xs text-[var(--text-muted)]">{formatDate(job.postedAt)}</span>
                        <span className="text-xs text-[var(--text-muted)]">{job.applicants} applied</span>
                        <Button variant="gradient" size="sm" href={applyJobUrl(job.id)} pill>
                          Apply
                        </Button>
                        <SaveJobButton jobId={job.id} variant="card" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--brand-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <JobsPageInner />
    </Suspense>
  );
}
