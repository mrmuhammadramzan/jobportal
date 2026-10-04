"use client";
/**
 * Sign In Page — /signin
 * Auth identifier: Pakistani mobile number (03XXXXXXXXX), not email.
 *
 * SOP compliance:
 *  Frontend SOP §7: visible labels, blur validation, all 3 async states.
 *  Frontend SOP §Hard Rule 1: client validation is UX only — server re-validates.
 *  UI/UX SOP §Hard Rule 3: WCAG AA ≥4.5:1 — all colour tokens dark-mode-aware.
 *  UI_MASTER_SKILL §8: errors below field, focus management, loading state.
 *  Security: sensitive URL params stripped on mount.
 */
import React, { useState, useRef, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout  from "@/components/AuthLayout";
import FormInput   from "@/components/FormInput";
import Button      from "@/components/Button";
import { ROUTES }  from "@/lib/routes";
import { saveSession } from "@/lib/auth";
import { BRAND, GAME } from "@/lib/gameConstants";

/* ── Types ── */
interface FormFields { phone: string; password: string; }
interface FormErrors { phone?: string; password?: string; form?: string; }
type SubmitState = "idle" | "loading" | "success" | "error";

/* ── Validators — pure, no side effects ── */
function validatePhone(v: string): string | undefined {
  if (!v.trim()) return "Mobile number is required.";
  if (!/^03\d{9}$/.test(v.replace(/[\s\-]/g, "")))
    return "Enter a valid Pakistani mobile number (e.g. 03001234567).";
}
function validatePassword(v: string): string | undefined {
  if (!v) return "Password is required.";
}
function validateForm(f: FormFields): FormErrors {
  const errors: FormErrors = {};
  const ph = validatePhone(f.phone);
  const p  = validatePassword(f.password);
  if (ph) errors.phone    = ph;
  if (p)  errors.password = p;
  return errors;
}

/* ── Icons ── */
const PhoneIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
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
  <svg className="w-8 h-8 text-[var(--color-success)]" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/* ══════════════════════════════════════
   PAGE
   ══════════════════════════════════════ */
export default function SignInPage() {
  return <Suspense><SignInPageInner /></Suspense>;
}

function SignInPageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [fields,      setFields]      = useState<FormFields>({ phone: "", password: "" });
  const [errors,      setErrors]      = useState<FormErrors>({});
  const [touched,     setTouched]     = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [rememberMe,  setRememberMe]  = useState(false);

  /* Security: strip sensitive params accidentally added to URL */
  useEffect(() => {
    const sensitive = ["phone", "email", "password", "confirmPassword", "fullName"];
    if (sensitive.some(k => searchParams.has(k)) && typeof window !== "undefined") {
      const clean = new URL(window.location.href);
      sensitive.forEach(k => clean.searchParams.delete(k));
      window.history.replaceState({}, "", clean.pathname + (clean.search || ""));
    }
  }, [searchParams]);

  const phoneRef    = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const VALIDATORS: Record<keyof FormFields, (v: string) => string | undefined> = {
    phone:    validatePhone,
    password: validatePassword,
  };

  const handleChange = useCallback(
    (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setFields(prev => ({ ...prev, [field]: val }));
      if (touched[field]) setErrors(prev => ({ ...prev, [field]: VALIDATORS[field](val) }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [touched],
  );

  const handleBlur = useCallback(
    (field: keyof FormFields) => () => {
      setTouched(prev => ({ ...prev, [field]: true }));
      setErrors(prev => ({ ...prev, [field]: VALIDATORS[field](fields[field]) }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields],
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ phone: true, password: true });

    const vErrors = validateForm(fields);
    if (Object.keys(vErrors).length > 0) {
      setErrors(vErrors);
      if (vErrors.phone)    phoneRef.current?.focus();
      else if (vErrors.password) passwordRef.current?.focus();
      return;
    }

    setErrors({});
    setSubmitState("loading");

    try {
      const res  = await fetch("/api/auth/signin", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          phone:      fields.phone.replace(/[\s\-]/g, ""),
          password:   fields.password,
          rememberMe,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Sign in failed.");

      saveSession(data.token, data.user);
      if (rememberMe) localStorage.setItem("rozedesk-remember", "true");
      else            localStorage.removeItem("rozedesk-remember");

      setSubmitState("success");
      setTimeout(() => router.push(data.user?.role === "ADMIN" ? "/admin" : ROUTES.dashboard), 1500);
    } catch (err: unknown) {
      setSubmitState("error");
      setErrors({ form: err instanceof Error ? err.message : "Something went wrong. Please try again." });
    }
  }, [fields, rememberMe, router]);

  const isLoading = submitState === "loading";
  const isSuccess = submitState === "success";

  return (
    <AuthLayout
      quote={`I deposited Rs. 200, secured at 5× on my second hunt, and earned Rs. 1,000. ${BRAND.name} pays instantly.`}
      quoteAuthor="Bilal Hassan"
      quoteRole={`Hunter — ${BRAND.name}`}
      features={[
        `Deposit Rs. ${GAME.MIN_DEPOSIT} to start hunting`,
        "Watch the eagle fly — multiplier climbs live",
        "Press SECURE at any moment to lock your win",
        "Reward = your wager × multiplier",
        "Withdraw to JazzCash or Easypaisa anytime",
      ]}
    >
      {/* ── Success state ── */}
      {isSuccess && (
        <div className="flex flex-col items-center gap-6 text-center py-8" role="status" aria-live="polite">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "color-mix(in srgb,var(--color-success) 12%,transparent)" }}>
            <CheckIcon />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">
              You&apos;re signed in!
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">Taking you to your dashboard…</p>
          </div>
          <div className="w-full h-1 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-400)]"
              style={{ animation: "shimmer 1.5s ease infinite", width: "70%" }} />
          </div>
          <Button variant="gradient" size="md" onClick={() => router.push(ROUTES.dashboard)} pill>
            Go to my dashboard
          </Button>
        </div>
      )}

      {/* ── Sign-in form ── */}
      {!isSuccess && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[var(--text-primary)] font-black text-[clamp(1.6rem,3vw,2rem)] tracking-tight leading-tight">
              Sign in to your account
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Don&apos;t have an account?{" "}
              <Link href={ROUTES.signUp}
                className="font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] underline-offset-2 hover:underline transition-colors">
                Register free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate aria-label="Sign in with mobile number"
            className="flex flex-col gap-4">

            {/* Form-level error */}
            {errors.form && (
              <div role="alert" aria-live="assertive"
                className="flex items-start gap-3 p-3.5 rounded-[var(--radius-md)]"
                style={{
                  background: "color-mix(in srgb,var(--color-error) 10%,transparent)",
                  border: "1px solid color-mix(in srgb,var(--color-error) 25%,transparent)",
                }}>
                <ErrorIcon />
                <p className="text-[var(--color-error)] text-sm font-medium">{errors.form}</p>
              </div>
            )}

            <FormInput
              ref={phoneRef}
              label="Mobile number"
              name="phone"
              type="tel"
              size="lg"
              placeholder="03001234567"
              autoComplete="tel"
              required
              value={fields.phone}
              error={errors.phone}
              onChange={handleChange("phone")}
              onBlur={handleBlur("phone")}
              iconLeft={<PhoneIcon />}
            />

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

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <div className="relative flex-shrink-0">
                <input type="checkbox" checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                  aria-label="Keep me signed in for 30 days" />
                <div className="w-4 h-4 rounded border-2 border-[var(--border-default)] peer-checked:bg-[var(--brand-500)] peer-checked:border-[var(--brand-500)] group-hover:border-[var(--brand-400)] transition-all duration-[var(--dur-fast)] flex items-center justify-center">
                  <svg className={`w-2.5 h-2.5 text-white transition-opacity ${rememberMe ? "opacity-100" : "opacity-0"}`}
                    viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <span className="text-sm text-[var(--text-secondary)]">Keep me signed in for 30 days</span>
            </label>

            <Button type="submit" variant="gradient" size="lg" fullWidth loading={isLoading} pill glow className="mt-1">
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-[var(--text-muted)]">
            By signing in you agree to our{" "}
            <Link href={ROUTES.terms} className="underline hover:text-[var(--text-secondary)] transition-colors">Terms</Link>{" "}
            and{" "}
            <Link href={ROUTES.privacy} className="underline hover:text-[var(--text-secondary)] transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
