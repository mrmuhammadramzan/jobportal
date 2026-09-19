"use client";
/**
 * /admin/jobs/[id]/edit — Edit an existing job listing.
 * GET  /api/admin/jobs/[id] — pre-fill form on mount
 * PUT  /api/admin/jobs/[id] — save changes
 *
 * Frontend SOP §6.1: loading / error / populated / success states.
 * Frontend SOP §7: visible labels, blur validation, all async states.
 * DRY: FIELD_BASE, FieldGroup — same tokens as post-job form.
 * Next.js 16: params is a Promise — must be awaited.
 */
import React, { useState, useCallback, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link   from "next/link";
import Button from "@/components/Button";
import Badge  from "@/components/Badge";
import { ROUTES, adminJobApplicantsUrl } from "@/lib/routes";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const FIELD_BASE = [
  "w-full rounded-[var(--radius-md)] border",
  "bg-[var(--bg-elevated)] border-[var(--border-default)]",
  "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
  "outline-none transition-all duration-[var(--dur-fast)]",
  "focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20",
  "hover:border-[var(--border-hover)]",
].join(" ");

interface JobForm {
  title: string; company: string; category: string; location: string; jobType: string;
  salaryMin: string; salaryMax: string; description: string;
  requirements: string; benefits: string; deadline: string;
}

const EMPTY_FORM: JobForm = { title:"",company:"",category:"",location:"",jobType:"",salaryMin:"",salaryMax:"",description:"",requirements:"",benefits:"",deadline:"" };
const CATEGORIES = ["Technology","Design","Marketing","Finance","Healthcare","Education","Operations","Other"];
const JOB_TYPES  = ["Full-time","Part-time","Contract","Remote","Internship"];

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : ""}`,
  };
}

function FieldGroup({ id, label, required, error, hint, children }: { id:string; label:string; required?:boolean; error?:string; hint?:string; children:React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)]">
        {label}{required && <span className="text-[var(--color-error)]" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-error)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5" />{error}
        </p>
      )}
    </div>
  );
}

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }  = use(params);
  const router  = useRouter();

  const [form,        setForm]        = useState<JobForm>(EMPTY_FORM);
  const [errors,      setErrors]      = useState<Partial<JobForm>>({});
  const [loading,     setLoading]     = useState(true);
  const [loadError,   setLoadError]   = useState("");
  const [submitState, setSubmitState] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [submitError, setSubmitError] = useState("");

  /* Load existing job data */
  useEffect(() => {
    fetch(`/api/admin/jobs/${id}`, { headers: authHeaders(), credentials: "include" })
      .then(r => r.ok ? r.json() : Promise.reject(new Error("Job not found.")))
      .then(data => {
        setForm({
          title:        data.title       ?? "",
          company:      data.company     ?? "",
          category:     data.category    ?? "",
          location:     data.location    ?? "",
          jobType:      data.type        ?? "",
          salaryMin:    String(data.salaryMin ?? ""),
          salaryMax:    String(data.salaryMax ?? ""),
          description:  data.description ?? "",
          requirements: (data.requirements ?? []).join("\n"),
          benefits:     (data.benefits     ?? []).join("\n"),
          deadline:     data.deadline ? new Date(data.deadline).toISOString().slice(0, 10) : "",
        });
      })
      .catch(e => setLoadError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function change(field: keyof JobForm) {
    return (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Partial<JobForm> = {};
    if (!form.title.trim())       errs.title       = "Job title is required.";
    if (!form.company.trim())     errs.company     = "Company name is required.";
    if (!form.category)           errs.category    = "Please select a category.";
    if (!form.location.trim())    errs.location    = "Location is required.";
    if (!form.jobType)            errs.jobType     = "Please select a job type.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setErrors({}); setSubmitError(""); setSubmitState("loading");

    try {
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method:  "PUT",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({
          title:        form.title.trim(),
          company:      form.company.trim(),
          category:     form.category,
          location:     form.location.trim(),
          type:         form.jobType,
          description:  form.description.trim(),
          requirements: form.requirements.split("\n").map(s => s.trim()).filter(Boolean),
          benefits:     form.benefits.split("\n").map(s => s.trim()).filter(Boolean),
          salaryMin:    form.salaryMin ? parseInt(form.salaryMin, 10) : null,
          salaryMax:    form.salaryMax ? parseInt(form.salaryMax, 10) : null,
          deadline:     form.deadline ? new Date(form.deadline).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Save failed.");
      setSubmitState("success");
      setTimeout(() => router.push(ROUTES.adminJobs), 1200);
    } catch (e: unknown) {
      setSubmitState("error");
      setSubmitError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }, [form, id, router]);

  /* Loading skeleton */
  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 bg-[var(--bg-elevated)] rounded animate-pulse" />
        <div className="rounded-[var(--radius-2xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 h-96 animate-pulse" />
      </div>
    );
  }

  /* Load error */
  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
        <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-[var(--color-error)]" />
        <p className="font-semibold text-[var(--text-primary)]">{loadError}</p>
        <Button variant="gradient" size="md" href={ROUTES.adminJobs} pill>Back to Listings</Button>
      </div>
    );
  }

  /* Success */
  if (submitState === "success") {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] flex items-center justify-center">
          <Icon path="M20 6L9 17l-5-5" className="w-7 h-7 text-[var(--color-success)]" />
        </div>
        <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Job Updated!</h2>
        <p className="text-[var(--text-muted)] text-sm">Redirecting to job listings…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={ROUTES.adminJobs}
          className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all">
          <Icon path="M15 19l-7-7 7-7" className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Edit Job Listing</h2>
            <Badge variant="neutral" size="sm">ID: {id.slice(0, 8)}…</Badge>
          </div>
          <p className="text-[var(--text-muted)] text-sm">Fields marked <span className="text-[var(--color-error)]">*</span> are required.</p>
        </div>
        <div className="ml-auto">
          <Link href={adminJobApplicantsUrl(id)}
            className="text-sm font-semibold text-[var(--brand-500)] hover:underline underline-offset-2">
            View Applicants →
          </Link>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate
        className="flex flex-col gap-6 p-6 rounded-[var(--radius-2xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">

        {/* Form-level error */}
        {submitState === "error" && (
          <div role="alert" className="flex items-start gap-3 p-3.5 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_25%,transparent)]">
            <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0" />
            <p className="text-[var(--color-error)] text-sm font-medium">{submitError}</p>
          </div>
        )}

        <FieldGroup id="edit-title" label="Job Title" required error={errors.title}>
          <input id="edit-title" type="text" value={form.title} onChange={change("title")}
            placeholder="e.g. Senior React Developer" className={`${FIELD_BASE} h-11 px-3 text-sm`} />
        </FieldGroup>

        <FieldGroup id="edit-company" label="Company / Organisation" required error={errors.company}>
          <input id="edit-company" type="text" value={form.company} onChange={change("company")}
            placeholder="e.g. Systems Ltd" className={`${FIELD_BASE} h-11 px-3 text-sm`} />
        </FieldGroup>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldGroup id="edit-category" label="Category" required error={errors.category}>
            <select id="edit-category" value={form.category} onChange={change("category")}
              className={`${FIELD_BASE} h-11 px-3 text-sm appearance-none cursor-pointer`}>
              <option value="">Select…</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </FieldGroup>
          <FieldGroup id="edit-type" label="Job Type" required error={errors.jobType}>
            <select id="edit-type" value={form.jobType} onChange={change("jobType")}
              className={`${FIELD_BASE} h-11 px-3 text-sm appearance-none cursor-pointer`}>
              <option value="">Select…</option>
              {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </FieldGroup>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldGroup id="edit-location" label="Location" required error={errors.location}>
            <input id="edit-location" type="text" value={form.location} onChange={change("location")}
              placeholder="e.g. Lahore or Remote" className={`${FIELD_BASE} h-11 px-3 text-sm`} />
          </FieldGroup>
          <FieldGroup id="edit-deadline" label="Application Deadline">
            <input id="edit-deadline" type="date" value={form.deadline} onChange={change("deadline")}
              className={`${FIELD_BASE} h-11 px-3 text-sm`} />
          </FieldGroup>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-[var(--text-secondary)] mb-2">Salary Range (PKR/month)</legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-smin" className="sr-only">Min salary</label>
              <input id="edit-smin" type="number" value={form.salaryMin} onChange={change("salaryMin")}
                placeholder="Min" className={`${FIELD_BASE} h-11 px-3 text-sm`} />
            </div>
            <div>
              <label htmlFor="edit-smax" className="sr-only">Max salary</label>
              <input id="edit-smax" type="number" value={form.salaryMax} onChange={change("salaryMax")}
                placeholder="Max" className={`${FIELD_BASE} h-11 px-3 text-sm`} />
            </div>
          </div>
        </fieldset>

        <FieldGroup id="edit-desc" label="Job Description" required error={errors.description}>
          <textarea id="edit-desc" rows={6} value={form.description} onChange={change("description")}
            className={`${FIELD_BASE} px-3 py-2.5 text-sm resize-y min-h-[140px]`} />
          <p className="text-xs text-[var(--text-muted)] self-end">{form.description.length} chars</p>
        </FieldGroup>

        <FieldGroup id="edit-req" label="Requirements" hint="One per line.">
          <textarea id="edit-req" rows={4} value={form.requirements} onChange={change("requirements")}
            placeholder="3+ years React experience&#10;Strong TypeScript skills"
            className={`${FIELD_BASE} px-3 py-2.5 text-sm resize-y min-h-[100px]`} />
        </FieldGroup>

        <FieldGroup id="edit-benefits" label="Benefits &amp; Perks" hint="One per line.">
          <textarea id="edit-benefits" rows={3} value={form.benefits ?? ""} onChange={change("benefits")}
            placeholder="Competitive salary&#10;Remote-friendly&#10;Annual bonus"
            className={`${FIELD_BASE} px-3 py-2.5 text-sm resize-y min-h-[80px]`} />
        </FieldGroup>

        <div className="border-t border-[var(--border-default)]" />

        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" href={ROUTES.adminJobs}>Cancel</Button>
          <Button type="submit" variant="gradient" size="lg" loading={submitState === "loading"} pill glow
            iconLeft={<Icon path="M5 13l4 4L19 7" className="w-4 h-4" />}>
            {submitState === "loading" ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
