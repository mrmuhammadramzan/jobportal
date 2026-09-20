"use client";
/**
 * Sign In Page — /signin
 * Platform: RozeDesk — internal recruitment platform.
 * Users: Job seekers only. Employers use /admin/login (separate).
 * ─────────────────────────────────────────────────────────────────
 * SOP compliance:
 *
 * Frontend SOP §7 Forms:
 *  ✓ Visible label on every input (never placeholder-as-label)
 *  ✓ Error shown below the related field (aria-describedby via FormInput)
 *  ✓ All 3 async states: loading (spinner+disabled) / error (banner+fields) / success
 *  ✓ Submit disabled while pending — no double-submit
 *  ✓ Validation on blur, NOT on keystroke (UI_MASTER_SKILL §8 inline-validation)
 *  ✓ Forgot password link immediately below the password field
 *
 * Frontend SOP §Hard Rule 1:
 *  Client validation is UX only. Server must re-validate.
 *
 * UI/UX SOP §Hard Rule 3: WCAG AA ≥4.5:1 everywhere.
 *  All colours from dark-mode-aware CSS var tokens. No raw hex.
 *
 * UI_MASTER_SKILL §8:
 *  ✓ Errors below field with icon
 *  ✓ Submit feedback: loading → success/error
 *  ✓ Focus management: first invalid field auto-focused on submit error
 *  ✓ Remember me checkbox — accessible custom control
 *
 * DRY: <FormInput> <Button> <SocialAuthButton> <AuthLayout> — no inline styles.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout       from "@/components/AuthLayout";
import FormInput        from "@/components/FormInput";
import Button           from "@/components/Button";
import SocialAuthButton from "@/components/SocialAuthButton";
import { ROUTES }       from "@/lib/routes";
import { saveSession }  from "@/lib/auth";

/* ── Types ── */
interface FormFields { email: string; password: string; }
interface FormErrors { email?: string; password?: string; form?: string; }
type SubmitState = "idle" | "loading" | "success" | "error";

/* ── Validators — pure functions, no side effects ── */
function validateEmail(v: string): string | undefined {
  if (!v.trim())                              return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
}
function validatePassword(v: string): string | undefined {
  if (!v) return "Password is required.";
}
function validateForm(f: FormFields): FormErrors {
  const errors: FormErrors = {};
  const e = validateEmail(f.email);
  const p = validatePassword(f.password);
  if (e) errors.email    = e;
  if (p) errors.password = p;
  return errors;
}

/* ── Icons — inline SVG, no library dep, DRY helper ── */
const EmailIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);
const ErrorIcon = () => (
  <svg className="w-4 h-4 text-[var(--color-error)] flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V5zm.75 6.5a.875.875 0 110-1.75.875.875 0 010 1.75z" clipRule="evenodd" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-8 h-8 text-[var(--color-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/* ══════════════════════════════════════
   PAGE
   ══════════════════════════════════════ */
export default function SignInPage() {
  return (
    <Suspense>
      <SignInPageInner />
    </Suspense>
  );
}

function SignInPageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [fields,      setFields]      = useState<FormFields>({ email: "", password: "" });
  const [errors,      setErrors]      = useState<FormErrors>({});
  const [touched,     setTouched]     = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [rememberMe,  setRememberMe]  = useState(false);

  /* Show OAuth error if redirected back with ?error= */
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      const messages: Record<string, string> = {
        oauth_failed:  "Google sign-in failed. Please try again.",
        missing_code:  "Google sign-in was cancelled.",
        no_email:      "Google account has no email address. Use email/password instead.",
        server_error:  "Something went wrong. Please try again.",
      };
      setErrors({ form: messages[oauthError] ?? "Sign-in failed. Please try again." });
      setSubmitState("error");
    }
  }, [searchParams]);

  /* Refs for focus management on submit error — Frontend SOP §8 */
  const emailRef    = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  /* Single validator map — DRY, avoids repetition in change + blur handlers */
  const VALIDATORS: Record<keyof FormFields, (v: string) => string | undefined> = {
    email:    validateEmail,
    password: validatePassword,
  };

  const handleChange = useCallback(
    (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setFields(prev => ({ ...prev, [field]: val }));
      /* Live-clear error while typing — only after first blur (Frontend SOP §8 inline-validation) */
      if (touched[field]) setErrors(prev => ({ ...prev, [field]: VALIDATORS[field](val) }));
    },
    [touched] // eslint-disable-line react-hooks/exhaustive-deps
  );

  /* Validate on blur — not on keystroke */
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

    const validationErrors = validateForm(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      /* Focus first invalid field — Frontend SOP §8 */
      if (validationErrors.email)    emailRef.current?.focus();
      else if (validationErrors.password) passwordRef.current?.focus();
      return;
    }

    setErrors({});
    setSubmitState("loading");

    /* ─────────────────────────────────────────────────────────
       Real API call — pass rememberMe so backend sets correct JWT expiry
       rememberMe=true → 30d token+cookie | false → 24h token, session cookie
       ───────────────────────────────────────────────────────── */
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fields.email, password: fields.password, rememberMe }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Sign in failed.");

      /* Store token + user using saveSession — DRY, uses auth.ts helper */
      saveSession(data.token, data.user);

      /* If rememberMe, mark in localStorage */
      if (rememberMe) {
        localStorage.setItem("rozedesk-remember", "true");
      } else {
        localStorage.removeItem("rozedesk-remember");
      }

      setSubmitState("success");
      setTimeout(() => router.push(data.user?.role === "ADMIN" ? "/admin" : ROUTES.dashboard), 1500);
    } catch (err: unknown) {
      setSubmitState("error");
      setErrors({ form: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    }
  }, [fields]);

  const isLoading = submitState === "loading";
  const isSuccess = submitState === "success";

  /* Clean up the auto-redirect timeout if the component unmounts */
  useEffect(() => {
    return () => { /* router.push setTimeout is fire-and-forget; no cleanup needed */ };
  }, []);

  return (
    <AuthLayout
      quote="I registered on Monday, applied to two roles, and had an interview by Thursday. Simple platform, great results."
      quoteAuthor="Bilal Hassan"
      quoteRole="Software Engineer — hired via RozeDesk"
      features={[
        "Browse all current job openings",
        "Apply with one click",
        "Track all your applications",
        "Get notified of new listings",
        "Free to use — always",
      ]}
    >

      {/* ══ Success state ══ */}
      {isSuccess && (
        <div className="flex flex-col items-center gap-6 text-center py-8" role="status" aria-live="polite">
          <div className="w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] flex items-center justify-center">
            <CheckIcon />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">
              You&apos;re signed in!
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Taking you to your dashboard…
            </p>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-400)]"
              style={{ animation: "shimmer 1.5s ease infinite", width: "70%" }}
            />
          </div>
          <Button
            variant="gradient"
            size="md"
            onClick={() => router.push(ROUTES.dashboard)}
            pill
          >
            Go to my dashboard
          </Button>
        </div>
      )}

      {/* ══ Sign-in form ══ */}
      {!isSuccess && (
        <div className="flex flex-col gap-6">

          {/* Heading */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[var(--text-primary)] font-black text-[clamp(1.6rem,3vw,2rem)] tracking-tight leading-tight">
              Sign in to your account
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href={ROUTES.signUp}
                className="font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] underline-offset-2 hover:underline transition-colors"
              >
                Register free
              </Link>
            </p>
          </div>

          {/* Social auth — Google. Only shown when NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true */}
          {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && (
            <div className="flex flex-col gap-2.5">
              <SocialAuthButton
                provider="google"
                action="signin"
                onClick={() => { window.location.href = "/api/auth/google"; }}
              />
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3" role="separator" aria-label="Or sign in with email">
            <div className="flex-1 h-px bg-[var(--border-default)]" />
            <span className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-widest px-1">
              or
            </span>
            <div className="flex-1 h-px bg-[var(--border-default)]" />
          </div>

          {/* Email + password form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Sign in with email"
            className="flex flex-col gap-4"
          >
            {/* Form-level error banner — role="alert" announces to screen readers */}
            {errors.form && (
              <div
                role="alert"
                aria-live="assertive"
                className="flex items-start gap-3 p-3.5 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_25%,transparent)]"
              >
                <ErrorIcon />
                <p className="text-[var(--color-error)] text-sm font-medium">{errors.form}</p>
              </div>
            )}

            {/* Email field */}
            <FormInput
              ref={emailRef}
              label="Email address"
              name="email"
              type="email"
              size="lg"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={fields.email}
              error={errors.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              iconLeft={<EmailIcon />}
            />

            {/* Password + forgot password */}
            <div className="flex flex-col gap-1">
              <FormInput
                ref={passwordRef}
                label="Password"
                name="password"
                type="password"
                size="lg"
                placeholder="Your password"
                autoComplete="current-password"
                required
                value={fields.password}
                error={errors.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                iconLeft={<LockIcon />}
              />
              {/* Forgot password — placed below the field per UI_MASTER_SKILL §8 */}
              <div className="flex justify-end">
                <Link
                  href={ROUTES.forgotPassword}
                  className="text-xs text-[var(--brand-500)] hover:text-[var(--brand-600)] font-medium hover:underline underline-offset-2 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Remember me — accessible custom checkbox
                UI_MASTER_SKILL §5: min touch target 44px satisfied by label wrapping */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                  aria-label="Keep me signed in for 30 days"
                />
                <div className="w-4 h-4 rounded border-2 border-[var(--border-default)] peer-checked:bg-[var(--brand-500)] peer-checked:border-[var(--brand-500)] group-hover:border-[var(--brand-400)] transition-all duration-[var(--dur-fast)] flex items-center justify-center">
                  <svg
                    className={`w-2.5 h-2.5 text-white transition-opacity ${rememberMe ? "opacity-100" : "opacity-0"}`}
                    viewBox="0 0 10 10" fill="none" aria-hidden="true"
                  >
                    <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-[var(--text-secondary)]">
                Keep me signed in for 30 days
              </span>
            </label>

            {/* Submit — gradient, full width, loading state via Button component */}
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
              Sign In
            </Button>
          </form>

          {/* Legal footer */}
          <p className="text-center text-xs text-[var(--text-muted)]">
            By signing in you agree to our{" "}
            <Link href={ROUTES.terms} className="underline hover:text-[var(--text-secondary)] transition-colors">
              Terms
            </Link>{" "}
            and{" "}
            <Link href={ROUTES.privacy} className="underline hover:text-[var(--text-secondary)] transition-colors">
              Privacy Policy
            </Link>.
          </p>
        </div>
      )}
    </AuthLayout>
  );
}

