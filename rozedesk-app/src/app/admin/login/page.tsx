"use client";
/**
 * /admin/login — Super Admin Sign In
 * ─────────────────────────────────────────────────────────────────
 * Who sees this: you and your internal team only.
 * This page is NOT linked from the public site — direct URL access only.
 * Public users sign in at /signin (job seekers only).
 *
 * Deliberately minimal and distinct from the public /signin page:
 *   - No social auth (Google/GitHub) — admin uses email+password only
 *   - No public registration link
 *   - Dark shell with "Admin" label so it's unmistakably internal
 *   - On success: routes to /admin (admin dashboard)
 *
 * Frontend SOP §7 Forms: visible labels, blur validation, all 3 async states.
 * Frontend SOP §Hard Rule 1: client validation is UX only — server re-validates.
 * UI/UX SOP §Hard Rule 3: WCAG AA ≥4.5:1 — tokens only, no raw hex.
 * DRY: FormInput, Button reused — zero inline form styles.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import Button    from "@/components/Button";
import Logo      from "@/components/Logo";
import { ROUTES }      from "@/lib/routes";
import { saveSession } from "@/lib/auth";

/* ── Types ── */
interface FormFields { email: string; password: string }
interface FormErrors { email?: string; password?: string; form?: string }
type SubmitState = "idle" | "loading" | "success" | "error";

/* ── Validators ── */
function validateEmail(v: string): string | undefined {
  if (!v.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
}
function validatePassword(v: string): string | undefined {
  if (!v) return "Password is required.";
}

/* ── Icons — inline SVG, no library dep ── */
function EmailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

/* ════════════════════════════════════════
   PAGE
   ════════════════════════════════════════ */
export default function AdminLoginPage() {
  const router = useRouter();

  const [fields,      setFields]      = useState<FormFields>({ email: "", password: "" });
  const [errors,      setErrors]      = useState<FormErrors>({});
  const [touched,     setTouched]     = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const emailRef    = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const VALIDATORS: Record<keyof FormFields, (v: string) => string | undefined> = {
    email:    validateEmail,
    password: validatePassword,
  };

  const handleChange = useCallback(
    (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setFields(prev => ({ ...prev, [field]: val }));
      if (touched[field]) setErrors(prev => ({ ...prev, [field]: VALIDATORS[field](val) }));
    },
    [touched] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleBlur = useCallback(
    (field: keyof FormFields) => () => {
      setTouched(prev => ({ ...prev, [field]: true }));
      setErrors(prev => ({ ...prev, [field]: VALIDATORS[field](fields[field]) }));
    },
    [fields] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const validationErrors: FormErrors = {};
    const eErr = validateEmail(fields.email);
    const pErr = validatePassword(fields.password);
    if (eErr) validationErrors.email    = eErr;
    if (pErr) validationErrors.password = pErr;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.email)    emailRef.current?.focus();
      else if (validationErrors.password) passwordRef.current?.focus();
      return;
    }

    setErrors({});
    setSubmitState("loading");

    /* Real admin auth — /api/auth/signin validates role=ADMIN server-side */
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fields.email, password: fields.password }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Invalid credentials.");
      if (data.user?.role !== "ADMIN") throw new Error("Access denied. Admin accounts only.");

      /* Use saveSession helper — DRY, same as signin page */
      saveSession(data.token, data.user);
      setSubmitState("success");
      setTimeout(() => router.push(ROUTES.admin), 1000);
    } catch (err: unknown) {
      setSubmitState("error");
      setErrors({ form: err instanceof Error ? err.message : "Sign in failed. Please try again." });
    }
  }, [fields, router]);

  const isLoading = submitState === "loading";
  const isSuccess = submitState === "success";

  return (
    /*
     * Standalone page — no public NavBar, no AuthLayout.
     * Deliberately distinct so it cannot be confused with the public sign-in.
     * Full-screen dark shell with centred card.
     */
    <div className="min-h-screen bg-[var(--gray-950)] flex flex-col items-center justify-center px-4 py-12">

      {/* Card */}
      <div className="w-full max-w-md flex flex-col gap-7">

        {/* Logo + admin label */}
        <div className="flex flex-col items-center gap-3">
          <Logo href={ROUTES.home} size="md" textColor="white" />
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-500)]/15 border border-[var(--brand-500)]/30">
            <ShieldIcon />
            <span className="text-[var(--brand-400)] text-xs font-bold uppercase tracking-widest">
              Admin Access
            </span>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-[var(--gray-900)] border border-white/10 rounded-[var(--radius-2xl)] p-7 flex flex-col gap-6">

          {/* Heading */}
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-white font-black text-xl tracking-tight">
              Admin Sign In
            </h1>
            <p className="text-white/50 text-sm">
              Internal access only — not for job seekers.
            </p>
          </div>

          {/* Success state */}
          {isSuccess && (
            <div
              className="flex flex-col items-center gap-3 py-4 text-center"
              role="status"
              aria-live="polite"
            >
              <div className="w-12 h-12 rounded-full bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--color-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-white font-semibold text-sm">Signed in — redirecting to dashboard…</p>
            </div>
          )}

          {/* Form */}
          {!isSuccess && (
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Admin sign in"
              className="flex flex-col gap-4"
            >
              {/* Form-level error */}
              {errors.form && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_30%,transparent)]"
                >
                  <svg className="w-4 h-4 text-[var(--color-error)] flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V5zm.75 6.5a.875.875 0 110-1.75.875.875 0 010 1.75z" clipRule="evenodd" />
                  </svg>
                  <p className="text-[var(--color-error)] text-sm font-medium">{errors.form}</p>
                </div>
              )}

              {/* Email */}
              <FormInput
                ref={emailRef}
                label="Admin email"
                name="email"
                type="email"
                size="lg"
                placeholder="admin@rozedesk.com"
                autoComplete="email"
                required
                value={fields.email}
                error={errors.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                iconLeft={<EmailIcon />}
              />

              {/* Password */}
              <FormInput
                ref={passwordRef}
                label="Password"
                name="password"
                type="password"
                size="lg"
                placeholder="Your admin password"
                autoComplete="current-password"
                required
                value={fields.password}
                error={errors.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                iconLeft={<LockIcon />}
              />

              {/* Submit */}
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                fullWidth
                loading={isLoading}
                pill
                glow
                className="mt-1"
              >
                Sign In to Admin
              </Button>
            </form>
          )}
        </div>

        {/* Back to public site */}
        <p className="text-center text-white/30 text-xs">
          Not an admin?{" "}
          <a
            href={ROUTES.signIn}
            className="text-white/50 hover:text-white/80 underline underline-offset-2 transition-colors"
          >
            Job seeker sign in →
          </a>
        </p>
      </div>
    </div>
  );
}
