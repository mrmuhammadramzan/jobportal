"use client";
/**
 * /dashboard/apply/[jobId] — Multi-step job application flow.
 *
 * Steps:
 *   1. Upload CV — attach PDF/DOC CV for this application
 *   2. Payment   — send PKR {APP_FEE_PKR} via JazzCash/Easypaisa, upload receipt screenshot
 *   3. Submitted — confirmation with application status
 *
 * UI/UX SOP §5.1 (map flow before designing):
 *   Step 1 → must complete before proceeding
 *   Step 2 → payment instructions shown with admin's configured details,
 *             then receipt upload (image/PDF)
 *   Step 3 → success state, application is "Pending Payment Approval"
 *
 * Frontend SOP §7: every input has visible label.
 * Frontend SOP §Hard Rule 1: file upload validation is UX only — server re-validates.
 * UI/UX SOP §Hard Rule 1: all 4 states per step (empty, filled, loading, error).
 * UI/UX SOP §Hard Rule 3: contrast via tokens throughout.
 * UI/UX SOP §Hard Rule 4: step indicator uses number + label, not just colour.
 * DRY: StepIndicator, UploadBox — local sub-components (tightly coupled, used once here).
 */
import React, { useState, useCallback, useEffect } from "react";
import Link   from "next/link";
import Button from "@/components/Button";
import { ROUTES }        from "@/lib/routes";
import { useFee } from "@/hooks/useFee";
import { useProfileCompleteness } from "@/hooks/useProfileCompleteness";

/* ── Payment config shape ── */
interface PaymentConfig {
  method: string; phone: string; name: string; address: string;
  label: string;  logo: string;  color: string;
}

const METHOD_META: Record<string, { label: string; logo: string; color: string }> = {
  JazzCash:  { label:"JazzCash",  logo:"JC", color:"bg-[#cc2229]" },
  Easypaisa: { label:"Easypaisa", logo:"EP", color:"bg-[#3d7f41]" },
};

/* ────────────────────────────────────────────────────────
   SVG icon helper
   ──────────────────────────────────────────────────────── */
function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────
   StepIndicator — shows progress, colour + number + text
   UI/UX SOP §Hard Rule 4: not colour alone
   ──────────────────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: "Upload CV"    },
  { n: 2, label: "Payment"      },
  { n: 3, label: "Submitted"    },
];

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <nav aria-label="Application steps" className="flex items-center gap-0 w-full max-w-sm mx-auto">
      {STEPS.map((step, i) => {
        const done   = step.n < current;
        const active = step.n === current;
        return (
          <React.Fragment key={step.n}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0" aria-current={active ? "step" : undefined}>
              <div className={[
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all duration-[var(--dur-deliberate)]",
                done   ? "bg-[var(--color-success)] text-white"                       : "",
                active ? "bg-[var(--brand-500)] text-white shadow-[var(--shadow-brand)]" : "",
                !done && !active ? "bg-[var(--bg-elevated)] border-2 border-[var(--border-default)] text-[var(--text-muted)]" : "",
              ].join(" ")}>
                {done
                  ? <Icon path="M20 6L9 17l-5-5" className="w-4 h-4"/>
                  : step.n}
              </div>
              <span className={`text-[10px] font-semibold whitespace-nowrap ${active ? "text-[var(--brand-500)]" : done ? "text-[var(--color-success)]" : "text-[var(--text-muted)]"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all duration-[var(--dur-deliberate)] ${step.n < current ? "bg-[var(--color-success)]" : "bg-[var(--border-default)]"}`} aria-hidden="true"/>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ────────────────────────────────────────────────────────
   UploadBox — accessible file drop zone
   Frontend SOP §7: label is always visible
   ──────────────────────────────────────────────────────── */
interface UploadBoxProps {
  id:         string;
  label:      string;
  accept:     string;
  helperText: string;
  value:      File | null;
  error?:     string;
  onChange:   (f: File | null) => void;
}

function UploadBox({ id, label, accept, helperText, value, error, onChange }: UploadBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files?.[0] ?? null);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onChange(f);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1">
        {label}
        <span className="text-[var(--color-error)]" aria-hidden="true">*</span>
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className={[
          "relative flex flex-col items-center justify-center gap-3 p-6 rounded-[var(--radius-xl)] border-2 border-dashed",
          "transition-all duration-[var(--dur-default)] cursor-pointer",
          error
            ? "border-[var(--color-error)] bg-[color-mix(in_srgb,var(--color-error)_5%,transparent)]"
            : value
              ? "border-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_5%,transparent)]"
              : "border-[var(--border-default)] bg-[var(--bg-elevated)] hover:border-[var(--brand-400)] hover:bg-[color-mix(in_srgb,var(--brand-500)_4%,transparent)]",
        ].join(" ")}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleChange}
          aria-label={label}
        />
        {value ? (
          <>
            <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-[var(--color-success)]"/>
            <div className="text-center">
              <p className="font-semibold text-sm text-[var(--text-primary)] truncate max-w-xs">{value.name}</p>
              <p className="text-xs text-[var(--text-muted)]">{(value.size / 1024).toFixed(1)} KB · Click to replace</p>
            </div>
          </>
        ) : (
          <>
            <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" className="w-8 h-8 text-[var(--text-muted)]"/>
            <div className="text-center">
              <p className="font-semibold text-sm text-[var(--text-primary)]">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-[var(--text-muted)]">{helperText}</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-[var(--color-error)] font-medium">
          <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5 flex-shrink-0"/>
          {error}
        </p>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   PAGE
   ════════════════════════════════════════ */
export default function ApplyPage({ params }: { params: Promise<{ jobId: string }> }) {
  /* Next.js 16: params is a Promise in page components — must use React.use() */
  const { jobId } = React.use(params);

  const appFee       = useFee();
  const completeness = useProfileCompleteness();

  /* ── Step state — ALL hooks MUST come before any conditional return ── */
  const [step, setStep] = useState<1|2|3>(1);

  /* ── Remote state ── */
  const [paymentConfig,  setPaymentConfig]  = useState<PaymentConfig[]>([]);
  const [job,            setJob]            = useState<{ title: string; company: string; location: string; type: string } | null>(null);
  const [loadError,      setLoadError]      = useState("");

  /* Load job info + payment settings on mount — uses public endpoint */
  useEffect(() => {
    Promise.all([
      fetch(`/api/jobs/${jobId}`).then(r => r.ok ? r.json() : null),
      fetch("/api/payment-settings").then(r => r.ok ? r.json() : []),
    ]).then(([jobData, payData]) => {
      if (jobData) setJob({ title: jobData.title, company: jobData.company, location: jobData.location, type: jobData.type });
      const active = (payData as {method:string;phone:string;name:string;address:string|null;active:boolean}[])
        .filter(p => p.active)
        .map(p => ({
          method:  p.method,
          phone:   p.phone,
          name:    p.name,
          address: p.address ?? "",
          ...(METHOD_META[p.method] ?? { label: p.method, logo: p.method.slice(0,2).toUpperCase(), color: "bg-[var(--brand-500)]" }),
        }));
      setPaymentConfig(active);
    }).catch(() => setLoadError("Could not load application details. Please refresh."));
  }, [jobId]);

  /* Step 1 state */
  const [cvFile,    setCvFile]    = useState<File | null>(null);
  const [cvError,   setCvError]   = useState("");

  /* Step 2 state */
  const [receiptFile,    setReceiptFile]    = useState<File | null>(null);
  const [receiptError,   setReceiptError]   = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [submitting,     setSubmitting]     = useState(false);
  const [submitError,    setSubmitError]    = useState("");

  /* ── Step 1: CV confirmed from profile — just advance to step 2 ── */
  const submitStep1 = useCallback(() => {
    setStep(2);
  }, []);

  /* ── Step 2: validate receipt and submit with real FormData ── */
  const submitStep2 = useCallback(async () => {
    if (!receiptFile) {
      setReceiptError("Please upload your payment receipt screenshot.");
      return;
    }
    const ext = receiptFile.name.split(".").pop()?.toLowerCase();
    if (!["jpg","jpeg","png","pdf"].includes(ext ?? "")) {
      setReceiptError("Only JPG, PNG, or PDF receipts are accepted.");
      return;
    }
    if (receiptFile.size > 10 * 1024 * 1024) {
      setReceiptError("File must be under 10 MB.");
      return;
    }
    setReceiptError(""); setSubmitError(""); setSubmitting(true);

    try {
      const token = localStorage.getItem("rozedesk-token") ?? "";

      /* Build multipart/form-data with receipt + profile CV marker */
      const fd = new FormData();
      fd.append("jobId",         jobId);
      fd.append("paymentMethod", (selectedMethod || paymentConfig[0]?.method) ?? "JazzCash");
      fd.append("cvFromProfile", "true");   /* CV generated from profile data */
      fd.append("receipt",       receiptFile, receiptFile.name);

      const res = await fetch("/api/applications", {
        method: "POST",
        /* NOTE: Do NOT set Content-Type — browser sets it with boundary automatically */
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Submission failed.");
      setStep(3);
      /* Toast is shown on the success step — no extra toast needed here */
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [receiptFile, jobId, selectedMethod, paymentConfig]);

  /* ── Fetch CV data from profile for Step 1 preview ── */
  const [cvData, setCvData] = useState<Record<string, unknown> | null>(null);
  const [cvLoading, setCvLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seeker/cv", {
      credentials: "include",
      headers: { Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("rozedesk-token") ?? "" : ""}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setCvData(d); })
      .catch(() => {})
      .finally(() => setCvLoading(false));
  }, []);
  useEffect(() => {
    if (paymentConfig.length > 0 && !selectedMethod) {
      setSelectedMethod(paymentConfig[0].method);
    }
  }, [paymentConfig, selectedMethod]);

  const selectedPayment = paymentConfig.length > 0
    ? (paymentConfig.find(p => p.method === selectedMethod) ?? paymentConfig[0])
    : null;

  /* ── Load error state ── */
  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
        <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-[var(--color-error)]" />
        <p className="font-semibold text-[var(--text-primary)]">{loadError}</p>
        <Button variant="outline" size="md" pill onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const jobTitle   = job?.title   ?? "Job Application";
  const jobCompany = job?.company ?? "";
  const jobMeta    = job ? `${job.company} · ${job.location} · ${job.type}` : "Loading…";

  /* ── Profile completeness gate — AFTER all hooks ── */
  if (!completeness.loading && !completeness.canApply) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] flex items-center justify-center">
          <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-8 h-8 text-[var(--color-warning)]"/>
        </div>
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-xl tracking-tight">Complete Your Profile First</h2>
          <p className="text-[var(--text-secondary)] text-sm mt-2 leading-relaxed">
            Your profile is <strong className="text-[var(--text-primary)]">{completeness.pct ?? 0}%</strong> complete.
            You need at least <strong className="text-[var(--text-primary)]">60%</strong> to apply.
          </p>
        </div>
        {(completeness.missing ?? []).length > 0 && (
          <div className="w-full p-4 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-left">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Missing:</p>
            <ul className="flex flex-col gap-1.5">
              {(completeness.missing ?? []).map(m => (
                <li key={m} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0"/>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button variant="gradient" size="lg" href={ROUTES.seekerProfile} pill fullWidth>
          Complete My Profile →
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page heading ── */}
      <div className="flex items-center gap-3">
        <Link href={ROUTES.jobs}
          className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all">
          <Icon path="M15 19l-7-7 7-7" className="w-4 h-4"/>
        </Link>
        <div>
          <h2 className="text-[var(--text-primary)] font-black text-xl tracking-tight">
            Apply for: {jobTitle}
          </h2>
          <p className="text-[var(--text-muted)] text-sm">{jobMeta}</p>
        </div>
      </div>

      {/* ── Step indicator ── */}
      <StepIndicator current={step} />

      {/* ═══════════════════════════════════
          STEP 1 — Review Profile CV
          ═══════════════════════════════════ */}
      {step === 1 && (
        <div className="rounded-[var(--radius-2xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col gap-6 max-w-2xl mx-auto w-full">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-black text-[var(--text-primary)] text-lg">Review Your CV</h3>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Your CV is generated from your profile. Review it, then continue to payment.
              </p>
            </div>
            <a href="/dashboard/profile" target="_blank"
              className="flex-shrink-0 text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2 whitespace-nowrap">
              Edit Profile →
            </a>
          </div>

          {/* Live CV Preview */}
          {cvLoading ? (
            <div className="h-64 bg-[var(--bg-surface)] rounded-[var(--radius-lg)] animate-pulse"/>
          ) : cvData ? (
            <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-white dark:bg-[var(--bg-base)] p-6 text-sm leading-relaxed font-sans overflow-y-auto max-h-[60vh]">
              {/* Header */}
              <h1 className="text-xl font-black text-[var(--text-primary)] mb-0.5">
                {(cvData.name as string) || "Your Name"}
              </h1>
              <div className="flex flex-wrap gap-3 text-xs text-[var(--text-secondary)] mb-4 border-b border-[var(--border-default)] pb-3">
                {(cvData.email as string) && <span>✉ {cvData.email as string}</span>}
                {(cvData.phone as string) && <span>📞 {cvData.phone as string}</span>}
                {(cvData.location as string) && <span>📍 {cvData.location as string}</span>}
                {(cvData.linkedin as string) && (
                  <a href={cvData.linkedin as string} target="_blank" rel="noopener noreferrer"
                    className="text-[var(--brand-500)] hover:underline">🔗 LinkedIn</a>
                )}
                {(cvData.github as string) && (
                  <a href={cvData.github as string} target="_blank" rel="noopener noreferrer"
                    className="text-[var(--brand-500)] hover:underline">🐙 GitHub</a>
                )}
                {(cvData.portfolio as string) && (
                  <a href={cvData.portfolio as string} target="_blank" rel="noopener noreferrer"
                    className="text-[var(--brand-500)] hover:underline">🌐 Portfolio</a>
                )}
              </div>

              {/* Summary */}
              {(cvData.summary as string) && (
                <div className="mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Summary</p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{cvData.summary as string}</p>
                </div>
              )}

              {/* Skills */}
              {Array.isArray(cvData.skills) && (cvData.skills as string[]).length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(cvData.skills as string[]).map((s: string) => (
                      <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--brand-100)] text-[var(--brand-700)] border border-[var(--brand-200)]">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {Array.isArray(cvData.education) && (cvData.education as unknown[]).length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1.5">Education</p>
                  <div className="flex flex-col gap-2">
                    {(cvData.education as Record<string, string>[]).map((e, i) => (
                      <div key={i} className="flex flex-col">
                        <p className="text-xs font-bold text-[var(--text-primary)]">{e.institution} — {e.level}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {[e.board, e.year, e.obtainedMarks && e.totalMarks ? `${e.obtainedMarks}/${e.totalMarks}` : "", e.grade].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {Array.isArray(cvData.experience) && (cvData.experience as unknown[]).length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1.5">Work Experience</p>
                  <div className="flex flex-col gap-3">
                    {(cvData.experience as Record<string, string | boolean>[]).map((e, i) => (
                      <div key={i}>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{e.title as string} — {e.company as string}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {e.startDate as string}{e.current ? " – Present" : e.endDate ? ` – ${e.endDate as string}` : ""}
                        </p>
                        {(e.description as string) && (
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{e.description as string}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Preferences */}
              {((cvData.jobType as string) || (cvData.desiredSalary as string)) && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Preferences</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {[
                      cvData.jobType as string,
                      cvData.desiredSalary ? `PKR ${cvData.desiredSalary}/month` : "",
                    ].filter(Boolean).join(" · ")}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8 text-center rounded-[var(--radius-lg)] bg-[var(--bg-surface)] border border-[var(--border-default)]">
              <p className="text-sm font-semibold text-[var(--text-primary)]">No CV data found</p>
              <p className="text-xs text-[var(--text-muted)]">Complete your profile to generate your CV.</p>
              <a href="/dashboard/profile"
                className="text-xs font-semibold text-[var(--brand-500)] hover:underline underline-offset-2">
                Complete Profile →
              </a>
            </div>
          )}

          {/* What happens next */}
          <div className="flex flex-col gap-2 p-4 rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--brand-500)_6%,transparent)] border border-[color-mix(in_srgb,var(--brand-500)_15%,transparent)]">
            <p className="text-xs font-semibold text-[var(--brand-500)]">What happens after you submit</p>
            <ul className="flex flex-col gap-1.5">
              {[
                `Step 2: Pay PKR ${appFee} via JazzCash or Easypaisa and upload receipt.`,
                "Admin verifies your payment within a few hours.",
                "Once approved, the hiring team reviews your CV.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                  <span className="w-4 h-4 rounded-full bg-[var(--brand-500)] text-white flex items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5">{i + 2}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Button variant="gradient" size="lg" fullWidth pill glow onClick={submitStep1}
            iconRight={<Icon path="M9 5l7 7-7 7" className="w-4 h-4"/>}>
            CV Looks Good — Continue to Payment
          </Button>
        </div>
      )}

      {/* ═══════════════════════════════════
          STEP 2 — Payment + Receipt Upload
          ═══════════════════════════════════ */}
      {step === 2 && (
        <div className="flex flex-col gap-5 max-w-xl mx-auto w-full">

          {/* Payment instructions card */}
          <div className="rounded-[var(--radius-2xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col gap-5">
            <div>
              <h3 className="font-black text-[var(--text-primary)] text-lg">Pay Application Fee</h3>
              <p className="text-[var(--text-muted)] text-sm mt-1">
                Send exactly{" "}
                <span className="font-bold text-[var(--text-primary)]">PKR {appFee}</span>
                {" "}to one of the accounts below, then upload your receipt.
              </p>
            </div>

            {/* Method selector */}
            <div className="flex flex-col gap-2" role="group" aria-label="Choose payment method">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">Choose payment method</p>
              {paymentConfig.length === 0 ? (
                <p className="text-sm text-[var(--color-warning)]">No payment methods configured. Contact admin.</p>
              ) : (
                <div className="flex gap-3 flex-wrap">
                  {paymentConfig.map(pm => (
                    <button key={pm.method} type="button" aria-pressed={selectedMethod === pm.method}
                      onClick={() => setSelectedMethod(pm.method)}
                      className={["flex items-center gap-2.5 px-4 py-2.5 rounded-[var(--radius-lg)] border-2 font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-500)]",
                        selectedMethod === pm.method
                          ? "border-[var(--brand-500)] bg-[color-mix(in_srgb,var(--brand-500)_8%,transparent)] text-[var(--brand-600)]"
                          : "border-[var(--border-default)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"].join(" ")}>
                      <span className={`w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center font-black text-xs text-white ${pm.color}`} aria-hidden="true">
                        {pm.logo}
                      </span>
                      {pm.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected account details — only shown when payment method exists */}
            {selectedPayment ? (
            <div className="rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                {selectedPayment.label} Account Details
              </p>
              {[
                { label:"Account / Till Number", value: selectedPayment.phone },
                { label:"Account Title",          value: selectedPayment.name  },
                { label:"Amount to Send", value: `PKR ${appFee}` },
                ...(selectedPayment.address ? [{ label:"Address", value: selectedPayment.address }] : []),
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-[var(--text-muted)] flex-shrink-0">{row.label}</span>
                  <span className="font-semibold text-sm text-[var(--text-primary)] text-right">{row.value}</span>
                </div>
              ))}
              <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 mt-1">
                <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5"/>
                Make sure the amount is exactly PKR {appFee}. Screenshots with wrong amounts will be rejected.
              </p>
            </div>
            ) : (
            <div className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--color-warning)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-warning)_20%,transparent)]">
              <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-4 h-4 text-[var(--color-warning)] flex-shrink-0 mt-0.5"/>
              <p className="text-xs text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">Payment methods not configured.</strong><br/>
                Admin needs to set up JazzCash/Easypaisa in Payment Settings before applicants can pay.
              </p>
            </div>
            )}

            {/* Receipt upload */}
            <UploadBox
              id="receipt-upload"
              label="Payment Receipt Screenshot"
              accept=".jpg,.jpeg,.png,.pdf"
              helperText="JPG, PNG, or PDF — max 10 MB. Screenshot of your transaction confirmation."
              value={receiptFile}
              error={receiptError}
              onChange={f => { setReceiptFile(f); setReceiptError(""); }}
            />

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2 border-t border-[var(--border-default)]">
              {submitError && (
                <p role="alert" className="text-xs font-medium text-[var(--color-error)] flex items-center gap-1.5">
                  <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5"/>
                  {submitError}
                </p>
              )}
              <div className="flex items-center justify-between gap-3">
                <Button variant="ghost" size="md" onClick={() => setStep(1)}>← Back</Button>
                <Button variant="gradient" size="lg" pill glow loading={submitting} onClick={submitStep2}
                  iconRight={!submitting ? <Icon path="M9 5l7 7-7 7" className="w-4 h-4"/> : undefined}>
                  {submitting ? "Submitting…" : "Submit Application"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════
          STEP 3 — Submitted confirmation
          ═══════════════════════════════════ */}
      {step === 3 && (
        <div className="flex flex-col items-center gap-6 py-8 text-center max-w-md mx-auto">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] flex items-center justify-center">
            <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-10 h-10 text-[var(--color-success)]"/>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">
              Application Submitted!
            </h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Your CV and payment receipt have been submitted for{" "}
              <strong className="text-[var(--text-primary)]">{jobTitle}</strong>.
            </p>
          </div>

          {/* Status timeline */}
          <div className="w-full flex flex-col gap-3 text-left">
            {[
              { icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", colorClass:"text-[var(--color-success)]", label:"Application received",       sub:"Your CV and receipt are submitted.", done:true  },
              { icon:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",   colorClass:"text-[var(--color-warning)]", label:"Payment under review",        sub:"Admin is verifying your receipt (few hours).", done:false },
              { icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2",colorClass:"text-[var(--text-muted)]",label:"CV Under Review", sub:"Hiring team reviews your CV once payment is approved.", done:false },
            ].map((s,i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
                <Icon path={s.icon} className={`w-5 h-5 flex-shrink-0 mt-0.5 ${s.colorClass}`}/>
                <div>
                  <p className={`font-semibold text-sm ${s.done ? "text-[var(--color-success)]" : "text-[var(--text-primary)]"}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button variant="gradient" size="lg" href={ROUTES.applications} pill fullWidth>
              View My Applications
            </Button>
            <Button variant="outline" size="lg" href={ROUTES.jobs} pill fullWidth>
              Browse More Jobs
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
