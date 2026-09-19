"use client";
/**
 * /jobs/[id] — Job detail page, wired to /api/jobs/[id].
 * Frontend SOP §6.1: loading / not-found / populated states.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens.
 * DRY: NavBar, Footer, Button, Badge — all imported.
 */
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link          from "next/link";
import NavBar        from "@/components/NavBar";
import Footer        from "@/components/Footer";
import Button        from "@/components/Button";
import Badge         from "@/components/Badge";
import SaveJobButton from "@/components/SaveJobButton";
import { ROUTES, applyJobUrl } from "@/lib/routes";
import { useFee } from "@/hooks/useFee";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

interface Job {
  id: string; title: string; company: string; location: string;
  type: string; category: string; description: string;
  requirements: string[]; benefits: string[];
  salaryMin?: number; salaryMax?: number;
  deadline?: string; status: string;
  createdAt: string; applicants: number;
}

function salaryLabel(min?: number, max?: number) {
  if (!min && !max) return null;
  if (min && max) return `PKR ${min.toLocaleString()} – ${max.toLocaleString()}/month`;
  if (min) return `From PKR ${min.toLocaleString()}/month`;
  return `Up to PKR ${max!.toLocaleString()}/month`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const appFee  = useFee();
  const [job,     setJob]     = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound,setNotFound]= useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/jobs/${id}`)
      .then(r => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then(data => { if (data) setJob(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <NavBar />
      <main id="main-content" className="pt-16 min-h-screen bg-[var(--bg-base)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6" aria-label="Breadcrumb">
            <Link href={ROUTES.jobs} className="hover:text-[var(--brand-500)] transition-colors">Jobs</Link>
            <span>/</span>
            <span className="text-[var(--text-secondary)]">{job?.title ?? "Job Detail"}</span>
          </nav>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col gap-4 animate-pulse">
                    <div className="h-6 w-2/3 bg-[var(--bg-surface)] rounded" />
                    <div className="h-4 w-full bg-[var(--bg-surface)] rounded" />
                    <div className="h-4 w-5/6 bg-[var(--bg-surface)] rounded" />
                  </div>
                ))}
              </div>
              <div className="lg:col-span-1">
                <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-5 h-64 animate-pulse" />
              </div>
            </div>
          )}

          {/* Not found */}
          {!loading && notFound && (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <Icon path="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-10 h-10 text-[var(--text-muted)]" />
              <p className="font-black text-[var(--text-primary)] text-xl">Job not found</p>
              <p className="text-[var(--text-secondary)] text-sm">This listing may have been closed or removed.</p>
              <Button variant="gradient" size="md" href={ROUTES.jobs} pill>Browse All Jobs</Button>
            </div>
          )}

          {/* Job detail */}
          {!loading && job && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Main */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* Header card */}
                <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                      {job.company[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">{job.title}</h1>
                      <p className="text-[var(--text-secondary)] text-base mt-0.5">{job.company}</p>
                    </div>
                    <Badge variant={job.status === "ACTIVE" ? "success" : "neutral"} size="sm">
                      {job.status === "ACTIVE" ? "Active" : job.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                      <Icon path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" className="w-4 h-4 text-[var(--text-muted)]" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                      <Icon path="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="w-4 h-4 text-[var(--text-muted)]" />
                      {job.type}
                    </div>
                    {salaryLabel(job.salaryMin, job.salaryMax) && (
                      <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                        <Icon path="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--text-muted)]" />
                        {salaryLabel(job.salaryMin, job.salaryMax)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col gap-4">
                  <h2 className="font-bold text-[var(--text-primary)] text-lg">Job Description</h2>
                  {job.description.split("\n\n").map((para, i) => (
                    <p key={i} className="text-[var(--text-secondary)] text-sm leading-relaxed">{para}</p>
                  ))}
                </div>

                {/* Requirements */}
                {job.requirements.length > 0 && (
                  <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col gap-4">
                    <h2 className="font-bold text-[var(--text-primary)] text-lg">Requirements</h2>
                    <ul className="flex flex-col gap-2">
                      {job.requirements.map(req => (
                        <li key={req} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                          <span className="w-5 h-5 rounded-full bg-[color-mix(in_srgb,var(--brand-500)_12%,transparent)] text-[var(--brand-500)] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon path="M20 6L9 17l-5-5" className="w-3 h-3" />
                          </span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits.length > 0 && (
                  <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col gap-4">
                    <h2 className="font-bold text-[var(--text-primary)] text-lg">Benefits</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {job.benefits.map(b => (
                        <li key={b} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                          <Icon path="M5 13l4 4L19 7" className="w-4 h-4 text-[var(--color-success)] flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 flex flex-col gap-4">

                {/* Apply CTA — sticky */}
                <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-5 flex flex-col gap-4 lg:sticky lg:top-24">
                  <div>
                    <p className="font-black text-[var(--text-primary)] text-lg">Ready to Apply?</p>
                    <p className="text-[var(--text-muted)] text-xs mt-0.5">
                      {job.applicants} {job.applicants === 1 ? "person has" : "people have"} already applied.
                    </p>
                  </div>

                  {/* Fee notice */}
                  <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-warning)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-warning)_20%,transparent)]">
                    <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      A <strong>PKR {appFee}</strong> application fee applies.
                      Pay via JazzCash/Easypaisa and upload your receipt to complete your application.
                    </p>
                  </div>

                  <Button variant="gradient" size="lg" href={applyJobUrl(job.id)} fullWidth pill glow>
                    Apply Now — PKR {appFee}
                  </Button>

                  {/* Save job button — shared component */}
                  <SaveJobButton jobId={job.id} variant="detail" />

                  <p className="text-center text-xs text-[var(--text-muted)]">
                    <Link href={ROUTES.signUp} className="text-[var(--brand-500)] hover:underline">Register free</Link>
                    {" "}to apply. Already registered?{" "}
                    <Link href={ROUTES.signIn} className="text-[var(--brand-500)] hover:underline">Sign in</Link>
                  </p>
                </div>

                {/* Job meta */}
                <div className="rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-5 flex flex-col gap-3">
                  {[
                    { label: "Posted",      value: formatDate(job.createdAt) },
                    ...(job.deadline ? [{ label: "Deadline", value: formatDate(job.deadline) }] : []),
                    { label: "Category",    value: job.category              },
                    { label: "Applicants",  value: String(job.applicants)    },
                    { label: "Job Type",    value: job.type                  },
                  ].map(m => (
                    <div key={m.label} className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-muted)]">{m.label}</span>
                      <span className="text-xs font-semibold text-[var(--text-primary)]">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
