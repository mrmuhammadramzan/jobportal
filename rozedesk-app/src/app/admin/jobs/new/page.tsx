"use client";
/**
 * /admin/jobs/new — Post a new job listing.
 *
 * THEME FIX (LESSONS.md 2026-09-13):
 *   All hardcoded bg-[var(--gray-800)], text-white, text-white/N, border-white/N
 *   replaced with CSS token classes so the page responds to ThemeToggle.
 *
 * Frontend SOP §7: visible labels, blur validation, all 3 async states.
 * Frontend SOP §Hard Rule 1: client validation is UX only — server re-validates.
 * DRY: FieldGroup pattern, token-based FIELD constant.
 * UI/UX SOP §Hard Rule 3: contrast verified with token classes in both modes.
 */
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link   from "next/link";
import Button from "@/components/Button";
import { ROUTES } from "@/lib/routes";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/* ── Token-based field styles — responds to ThemeToggle ── */
const FIELD_BASE = [
  "w-full rounded-[var(--radius-md)] border",
  "bg-[var(--bg-elevated)]",
  "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
  "outline-none transition-all duration-[var(--dur-fast)]",
  "focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20",
].join(" ");

const FIELD_DEFAULT = "border-[var(--border-default)] hover:border-[var(--border-hover)]";
const FIELD_ERROR   = "border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/20";

interface JobForm {
  title: string; company: string; category: string; location: string; jobType: string;
  salaryMin: string; salaryMax: string; description: string;
  requirements: string; benefits: string; deadline: string;
}
interface FormErrors { [key: string]: string | undefined }
type SubmitState = "idle" | "loading" | "success" | "error";

const CATEGORIES = ["Technology","Design","Marketing","Finance","Healthcare","Education","Operations","Other"];
const JOB_TYPES  = ["Full-time","Part-time","Contract","Remote","Internship"];

function validate(f: JobForm): FormErrors {
  const errors: FormErrors = {};
  if (!f.title.trim())                   errors.title       = "Job title is required.";
  if (!f.company.trim())                 errors.company     = "Company name is required.";
  if (!f.category)                       errors.category    = "Please select a category.";
  if (!f.location.trim())                errors.location    = "Location is required.";
  if (!f.jobType)                        errors.jobType     = "Please select a job type.";
  if (!f.description.trim())             errors.description = "Job description is required.";
  if (f.description.trim().length < 50)  errors.description = "Description should be at least 50 characters.";
  return errors;
}

/* ── FieldGroup — consistent label + field + error layout ── */
function FieldGroup({ id, label, required, error, hint, children }: {
  id: string; label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)]">
        {label}
        {required && <span className="text-[var(--color-error)]" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-error)]">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function PostJobPage() {
  const router = useRouter();

  const EMPTY: JobForm = {
    title:"", company:"", category:"", location:"", jobType:"",
    salaryMin:"", salaryMax:"", description:"", requirements:"", benefits:"", deadline:"",
  };

  const [form,        setForm]        = useState<JobForm>(EMPTY);
  const [errors,      setErrors]      = useState<FormErrors>({});
  const [touched,     setTouched]     = useState<Partial<Record<keyof JobForm, boolean>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const handleChange = useCallback((field: keyof JobForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.value;
      setForm(prev => ({ ...prev, [field]: val }));
      if (touched[field]) {
        const errs = validate({ ...form, [field]: val });
        setErrors(prev => ({ ...prev, [field]: errs[field] }));
      }
    }, [form, touched]
  );

  const handleBlur = useCallback((field: keyof JobForm) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errs = validate(form);
    setErrors(prev => ({ ...prev, [field]: errs[field] }));
  }, [form]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(EMPTY).map(k => [k, true]));
    setTouched(allTouched as Partial<Record<keyof JobForm, boolean>>);
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitState("loading");
    try {
      const token = localStorage.getItem("rozedesk-token") ?? "";
      const res   = await fetch("/api/admin/jobs", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
          deadline:     form.deadline  ? new Date(form.deadline).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to post job.");
      setSubmitState("success");
      setTimeout(() => router.push(ROUTES.adminJobs), 1500);
    } catch (e: unknown) {
      setSubmitState("error");
      setErrors({ _form: e instanceof Error ? e.message : "Something went wrong." });
    }
  }, [form, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLoading = submitState === "loading";
  const isSuccess = submitState === "success";

  /* ── Success state ── */
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--color-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          {/* text-[var(--text-primary)] adapts to theme */}
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Job Posted!</h2>
          <p className="text-[var(--text-muted)] text-sm">Your listing is now live. Redirecting to job listings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Page header */}
      <div className="flex items-center gap-3">
        {/* Back button — token-based */}
        <Link href={ROUTES.adminJobs}
          className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all">
          <Icon path="M15 19l-7-7 7-7" className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Post New Job</h2>
          <p className="text-[var(--text-muted)] text-sm">
            Fields marked <span className="text-[var(--color-error)]">*</span> are required.
          </p>
        </div>
      </div>

      {/* Form card — token-based background and border */}
      <form onSubmit={handleSubmit} noValidate aria-label="Post new job listing"
        className="flex flex-col gap-6 p-6 rounded-[var(--radius-2xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">

        {/* Form-level error */}
        {submitState === "error" && (
          <div role="alert"
            className="flex items-start gap-3 p-3.5 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_25%,transparent)]">
            <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0 mt-0.5" />
            <p className="text-[var(--color-error)] text-sm font-medium">{errors._form ?? "Something went wrong. Please try again."}</p>
          </div>
        )}

        {/* Job Title */}
        <FieldGroup id="job-title" label="Job Title" required error={errors.title}>
          <input id="job-title" type="text" value={form.title}
            onChange={handleChange("title")} onBlur={handleBlur("title")}
            placeholder="e.g. Senior React Developer"
            className={`${FIELD_BASE} h-11 px-3 text-sm ${errors.title ? FIELD_ERROR : FIELD_DEFAULT}`}
            aria-invalid={Boolean(errors.title)} aria-required="true" />
        </FieldGroup>

        {/* Company */}
        <FieldGroup id="job-company" label="Company / Organisation" required error={errors.company}>
          <input id="job-company" type="text" value={form.company}
            onChange={handleChange("company")} onBlur={handleBlur("company")}
            placeholder="e.g. Systems Ltd"
            className={`${FIELD_BASE} h-11 px-3 text-sm ${errors.company ? FIELD_ERROR : FIELD_DEFAULT}`}
            aria-invalid={Boolean(errors.company)} aria-required="true" />
        </FieldGroup>

        {/* Category + Job Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldGroup id="job-category" label="Category" required error={errors.category}>
            <select id="job-category" value={form.category}
              onChange={handleChange("category")} onBlur={handleBlur("category")}
              className={`${FIELD_BASE} h-11 px-3 text-sm appearance-none cursor-pointer ${errors.category ? FIELD_ERROR : FIELD_DEFAULT}`}
              aria-invalid={Boolean(errors.category)} aria-required="true">
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FieldGroup>
          <FieldGroup id="job-type" label="Job Type" required error={errors.jobType}>
            <select id="job-type" value={form.jobType}
              onChange={handleChange("jobType")} onBlur={handleBlur("jobType")}
              className={`${FIELD_BASE} h-11 px-3 text-sm appearance-none cursor-pointer ${errors.jobType ? FIELD_ERROR : FIELD_DEFAULT}`}
              aria-invalid={Boolean(errors.jobType)} aria-required="true">
              <option value="">Select type…</option>
              {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FieldGroup>
        </div>

        {/* Location + Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldGroup id="job-location" label="Location" required error={errors.location}>
            <input id="job-location" type="text" value={form.location}
              onChange={handleChange("location")} onBlur={handleBlur("location")}
              placeholder="e.g. Lahore or Remote"
              className={`${FIELD_BASE} h-11 px-3 text-sm ${errors.location ? FIELD_ERROR : FIELD_DEFAULT}`}
              aria-invalid={Boolean(errors.location)} aria-required="true" />
          </FieldGroup>
          <FieldGroup id="job-deadline" label="Application Deadline">
            <input id="job-deadline" type="date" value={form.deadline}
              onChange={handleChange("deadline")}
              className={`${FIELD_BASE} h-11 px-3 text-sm ${FIELD_DEFAULT}`} />
          </FieldGroup>
        </div>

        {/* Salary range */}
        <fieldset>
          <legend className="text-sm font-medium text-[var(--text-secondary)] mb-2">
            Salary Range{" "}
            <span className="text-[var(--text-muted)] font-normal">(optional, PKR/month)</span>
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="salary-min" className="sr-only">Minimum salary</label>
              <input id="salary-min" type="number" value={form.salaryMin}
                onChange={handleChange("salaryMin")} placeholder="Min e.g. 80,000"
                className={`${FIELD_BASE} h-11 px-3 text-sm ${FIELD_DEFAULT}`} />
            </div>
            <div>
              <label htmlFor="salary-max" className="sr-only">Maximum salary</label>
              <input id="salary-max" type="number" value={form.salaryMax}
                onChange={handleChange("salaryMax")} placeholder="Max e.g. 150,000"
                className={`${FIELD_BASE} h-11 px-3 text-sm ${FIELD_DEFAULT}`} />
            </div>
          </div>
        </fieldset>

        {/* Job Description */}
        <FieldGroup id="job-description" label="Job Description" required error={errors.description}>
          <textarea id="job-description" rows={6} value={form.description}
            onChange={handleChange("description")} onBlur={handleBlur("description")}
            placeholder="Describe the role, responsibilities, and what a successful candidate looks like…"
            className={`${FIELD_BASE} px-3 py-2.5 text-sm resize-y min-h-[140px] ${errors.description ? FIELD_ERROR : FIELD_DEFAULT}`}
            aria-invalid={Boolean(errors.description)} aria-required="true" />
          {/* Char count — token-based muted text */}
          <p className="text-xs text-[var(--text-muted)] self-end">{form.description.length} chars</p>
        </FieldGroup>

        {/* Requirements */}
        <FieldGroup id="job-requirements" label="Requirements"
          hint="One per line — e.g. '3+ years React experience'">
          <textarea id="job-requirements" rows={4} value={form.requirements}
            onChange={handleChange("requirements")}
            placeholder="3+ years React experience&#10;Strong TypeScript skills&#10;Experience with REST APIs"
            className={`${FIELD_BASE} px-3 py-2.5 text-sm resize-y min-h-[100px] ${FIELD_DEFAULT}`} />
        </FieldGroup>

        {/* Benefits */}
        <FieldGroup id="job-benefits" label="Benefits &amp; Perks"
          hint="One per line — e.g. 'Health insurance'">
          <textarea id="job-benefits" rows={3} value={form.benefits}
            onChange={handleChange("benefits")}
            placeholder="Competitive salary&#10;Remote-friendly&#10;Annual performance bonus"
            className={`${FIELD_BASE} px-3 py-2.5 text-sm resize-y min-h-[80px] ${FIELD_DEFAULT}`} />
        </FieldGroup>

        {/* Divider — token-based border */}
        <div className="border-t border-[var(--border-default)]" />

        {/* Form actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" href={ROUTES.adminJobs}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient" size="lg" loading={isLoading} pill glow
            iconLeft={<Icon path="M12 4v16m8-8H4" className="w-4 h-4" />}>
            {isLoading ? "Publishing…" : "Publish Job"}
          </Button>
        </div>
      </form>
    </div>
  );
}
