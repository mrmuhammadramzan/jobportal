"use client";
/**
 * /reset-password?token=... — Set new password after clicking email link.
 *
 * Frontend SOP §6.1: 4 states — loading token check / invalid / form / success.
 * Frontend SOP §7: visible labels, blur validation on all inputs.
 * UI/UX SOP §Hard Rule 3: all colours via CSS var tokens.
 * DRY: AuthLayout, FormInput, Button — all imported, nothing built inline.
 */
import React, { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import FormInput  from "@/components/FormInput";
import Button     from "@/components/Button";
import { ROUTES } from "@/lib/routes";

type PageState = "form" | "loading" | "success" | "error";

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );
}

function validate(pw: string, confirm: string): { pw?: string; confirm?: string } {
  const e: { pw?: string; confirm?: string } = {};
  if (!pw)          e.pw = "Password is required.";
  else if (pw.length < 8) e.pw = "Must be at least 8 characters.";
  else if (!/[A-Z]/.test(pw)) e.pw = "Add at least one uppercase letter.";
  else if (!/[0-9]/.test(pw)) e.pw = "Add at least one number.";
  if (!confirm)     e.confirm = "Please confirm your password.";
  else if (pw !== confirm) e.confirm = "Passwords do not match.";
  return e;
}

function ResetPasswordPageInner() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token") ?? "";

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [errors,    setErrors]    = useState<{ pw?: string; confirm?: string; form?: string }>({});
  const [touched,   setTouched]   = useState<{ pw?: boolean; confirm?: boolean }>({});
  const [pageState, setPageState] = useState<PageState>("form");

  /* Token missing — show error immediately */
  if (!token) {
    return (
      <AuthLayout
        quote="Simple, fast, and secure. RozeDesk makes job searching stress-free."
        quoteAuthor="Sara Ahmed"
        quoteRole="Finance Analyst — hired via RozeDesk"
        features={["Secure one-time reset links", "Links expire after 1 hour", "Request a new link anytime"]}
      >
        <div className="flex flex-col items-center gap-5 text-center py-8">
          <div className="w-14 h-14 rounded-full bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] flex items-center justify-center">
            <svg className="w-7 h-7 text-[var(--color-error)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 className="text-[var(--text-primary)] font-black text-2xl">Invalid Reset Link</h1>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs">
            This link is missing a token. Please request a new password reset.
          </p>
          <Button variant="gradient" size="md" href={ROUTES.forgotPassword} pill>Request New Link</Button>
        </div>
      </AuthLayout>
    );
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ pw: true, confirm: true });
    const errs = validate(password, confirm);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setPageState("loading");
    setErrors({});

    try {
      const res  = await fetch("/api/auth/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Reset failed.");
      setPageState("success");
      /* Redirect to signin after 2.5s */
      setTimeout(() => router.push(ROUTES.signIn), 2500);
    } catch (err: unknown) {
      setPageState("form");
      setErrors({ form: err instanceof Error ? err.message : "Something went wrong." });
    }
  }, [password, confirm, token, router]);

  /* ── Success state ── */
  if (pageState === "success") {
    return (
      <AuthLayout
        quote="Simple, fast, and secure. RozeDesk makes job searching stress-free."
        quoteAuthor="Sara Ahmed"
        quoteRole="Finance Analyst — hired via RozeDesk"
        features={["Password updated successfully", "Sign in with your new password", "Keep it safe this time!"]}
      >
        <div className="flex flex-col items-center gap-5 text-center py-8" role="status" aria-live="polite">
          <div className="w-14 h-14 rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] flex items-center justify-center">
            <svg className="w-7 h-7 text-[var(--color-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h1 className="text-[var(--text-primary)] font-black text-2xl">Password Updated!</h1>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs">
            Your password has been changed. Redirecting you to sign in…
          </p>
          {/* Progress bar */}
          <div className="w-full h-1 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-400)] animate-[shimmer_2.5s_ease_forwards]" style={{ width: "100%" }} />
          </div>
          <Button variant="gradient" size="md" href={ROUTES.signIn} pill>Sign In Now</Button>
        </div>
      </AuthLayout>
    );
  }

  /* ── Form state ── */
  return (
    <AuthLayout
      quote="Simple, fast, and secure. RozeDesk makes job searching stress-free."
      quoteAuthor="Sara Ahmed"
      quoteRole="Finance Analyst — hired via RozeDesk"
      features={["Secure one-time reset link", "Link expires in 1 hour", "Choose a strong password"]}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Set New Password</h1>
          <p className="text-[var(--text-secondary)] text-sm">
            Choose a strong password you haven't used before.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4" aria-label="Set new password">

          {/* Form-level error — expired/invalid token */}
          {errors.form && (
            <div role="alert" aria-live="assertive"
              className="flex items-start gap-3 p-3.5 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_25%,transparent)]">
              <svg className="w-4 h-4 text-[var(--color-error)] flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V5zm.75 6.5a.875.875 0 110-1.75.875.875 0 010 1.75z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="text-[var(--color-error)] text-sm font-medium">{errors.form}</p>
                {errors.form.includes("expired") || errors.form.includes("invalid") ? (
                  <Link href={ROUTES.forgotPassword}
                    className="text-xs text-[var(--brand-500)] hover:underline underline-offset-2 mt-1 inline-block">
                    Request a new reset link →
                  </Link>
                ) : null}
              </div>
            </div>
          )}

          <FormInput
            label="New Password"
            name="password"
            type="password"
            size="lg"
            placeholder="Create a strong password"
            autoComplete="new-password"
            required
            value={password}
            error={touched.pw ? errors.pw : undefined}
            onChange={e => {
              setPassword(e.target.value);
              if (touched.pw) setErrors(p => ({ ...p, pw: validate(e.target.value, confirm).pw }));
            }}
            onBlur={() => {
              setTouched(p => ({ ...p, pw: true }));
              setErrors(p => ({ ...p, pw: validate(password, confirm).pw }));
            }}
            iconLeft={<LockIcon />}
          />

          <FormInput
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            size="lg"
            placeholder="Repeat your new password"
            autoComplete="new-password"
            required
            value={confirm}
            error={touched.confirm ? errors.confirm : undefined}
            onChange={e => {
              setConfirm(e.target.value);
              if (touched.confirm) setErrors(p => ({ ...p, confirm: validate(password, e.target.value).confirm }));
            }}
            onBlur={() => {
              setTouched(p => ({ ...p, confirm: true }));
              setErrors(p => ({ ...p, confirm: validate(password, confirm).confirm }));
            }}
            iconLeft={<LockIcon />}
          />

          <Button type="submit" variant="gradient" size="lg" fullWidth pill glow loading={pageState === "loading"}>
            Update Password
          </Button>
        </form>

        <p className="text-center text-sm text-[var(--text-muted)]">
          <Link href={ROUTES.signIn} className="font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] hover:underline underline-offset-2 transition-colors">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordPageInner />
    </Suspense>
  );
}
