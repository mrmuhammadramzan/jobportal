"use client";
/**
 * Sign Up Page — /signup
 * Auth identifier: Pakistani mobile number — no email required.
 * Fields: Full name · Mobile number · Password · Confirm password
 *
 * SOP compliance:
 *  Frontend SOP §7: visible labels, blur validation, all 3 async states.
 *  Frontend SOP §Hard Rule 1: client validation is UX only — server re-validates.
 *  UI/UX SOP §Hard Rule 3: WCAG AA ≥4.5:1 — all colour tokens dark-mode-aware.
 *  UI_MASTER_SKILL §8: strength meter, blur validation, error below field.
 *  Security: sensitive URL params stripped on mount.
 */
import React, { useState, useRef, useCallback, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthLayout  from "@/components/AuthLayout";
import FormInput   from "@/components/FormInput";
import Button      from "@/components/Button";
import { ROUTES }  from "@/lib/routes";
import { saveSession } from "@/lib/auth";
import { BRAND, GAME } from "@/lib/gameConstants";

/* ── Types ── */
interface FormFields {
  fullName:        string;
  phone:           string;
  password:        string;
  confirmPassword: string;
}
interface FormErrors {
  fullName?:        string;
  phone?:           string;
  password?:        string;
  confirmPassword?: string;
  form?:            string;
}
type SubmitState = "idle" | "loading" | "success" | "error";

/* ── Password strength ── */
interface StrengthResult { score: 0|1|2|3|4; label: string; colorVar: string; filledBars: number; }

function getPasswordStrength(pw: string): StrengthResult {
  if (!pw)           return { score: 0, label: "",       colorVar: "var(--gray-200)",      filledBars: 0 };
  if (pw.length < 6) return { score: 1, label: "Weak",   colorVar: "var(--color-error)",   filledBars: 1 };
  let s = 0;
  if (pw.length >= 8)            s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw))  s++;
  if (s <= 1) return { score: 1, label: "Weak",   colorVar: "var(--color-error)",   filledBars: 1 };
  if (s === 2) return { score: 2, label: "Fair",   colorVar: "var(--color-warning)", filledBars: 2 };
  if (s === 3) return { score: 3, label: "Good",   colorVar: "var(--accent-400)",    filledBars: 3 };
  return               { score: 4, label: "Strong", colorVar: "var(--color-success)", filledBars: 4 };
}

/* ── Validators — pure, no side effects ── */
function validateFullName(v: string)              { if (!v.trim()) return "Full name is required."; if (v.trim().length < 2) return "Enter your full name."; }
function validatePhone(v: string)                 { if (!v.trim()) return "Mobile number is required."; if (!/^03\d{9}$/.test(v.replace(/[\s\-]/g, ""))) return "Enter a valid Pakistani mobile number (e.g. 03001234567)."; }
function validatePassword(v: string)              { if (!v) return "Password is required."; if (v.length < 8) return "Must be at least 8 characters."; if (!/[A-Z]/.test(v)) return "Add at least one uppercase letter."; if (!/[0-9]/.test(v)) return "Add at least one number."; }
function validateConfirmPw(pw: string, c: string) { if (!c) return "Please confirm your password."; if (pw !== c) return "Passwords do not match."; }

function validateForm(f: FormFields): FormErrors {
  const errors: FormErrors = {};
  const n  = validateFullName(f.fullName);
  const ph = validatePhone(f.phone);
  const p  = validatePassword(f.password);
  const c  = validateConfirmPw(f.password, f.confirmPassword);
  if (n)  errors.fullName        = n;
  if (ph) errors.phone           = ph;
  if (p)  errors.password        = p;
  if (c)  errors.confirmPassword = c;
  return errors;
}

/* ── Password strength bar ── */
function StrengthBar({ password }: { password: string }) {
  const s = getPasswordStrength(password);
  if (!password) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1" role="img" aria-label={`Password strength: ${s.label}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-[var(--dur-deliberate)]"
            style={{ background: i < s.filledBars ? s.colorVar : "var(--bg-elevated)" }} />
        ))}
      </div>
      {s.label && (
        <p className="text-[var(--text-xs)] font-medium" style={{ color: s.colorVar }} aria-live="polite">
          {s.label}
          {s.score < 3 && (
            <span className="text-[var(--text-muted)] font-normal ml-1">
              — {s.score === 1 ? "use 8+ chars, numbers and letters" : "add uppercase or a symbol"}
            </span>
          )}
        </p>
      )}
    </div>
  );
}

/* ── Terms checkbox ── */
function TermsCheckbox({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: string; }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="agree-terms" className="flex items-start gap-2.5 cursor-pointer select-none group">
        <div className="relative flex-shrink-0 mt-0.5">
          <input id="agree-terms" type="checkbox" checked={checked}
            onChange={e => onChange(e.target.checked)}
            className="sr-only peer" aria-required="true" aria-invalid={Boolean(error) || undefined} />
          <div className={[
            "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-[var(--dur-fast)]",
            error ? "border-[var(--color-error)]" : "border-[var(--border-default)] group-hover:border-[var(--brand-400)]",
            checked ? "bg-[var(--brand-500)] border-[var(--brand-500)]" : "",
          ].join(" ")}>
            <svg className={`w-2.5 h-2.5 text-white transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
              viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <span className="text-sm text-[var(--text-secondary)] leading-snug">
          I agree to the{" "}
          <Link href={ROUTES.terms} className="text-[var(--brand-500)] hover:text-[var(--brand-600)] font-medium hover:underline underline-offset-2 transition-colors">Terms of Service</Link>{" "}
          and{" "}
          <Link href={ROUTES.privacy} className="text-[var(--brand-500)] hover:text-[var(--brand-600)] font-medium hover:underline underline-offset-2 transition-colors">Privacy Policy</Link>
        </span>
      </label>
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-[var(--text-xs)] text-[var(--color-error)] font-medium pl-6">
          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V5zm.75 6.5a.875.875 0 110-1.75.875.875 0 010 1.75z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   PAGE
   ════════════════════════════════════════ */
export default function SignUpPage() {
  return <Suspense><SignUpPageInner /></Suspense>;
}

function SignUpPageInner() {
  const searchParams = useSearchParams();
  const [fields, setFields] = useState<FormFields>({
    fullName: "", phone: "", password: "", confirmPassword: "",
  });

  /* Security: strip sensitive params accidentally in URL */
  useEffect(() => {
    const sensitive = ["phone", "email", "password", "confirmPassword", "fullName"];
    if (sensitive.some(k => searchParams.has(k)) && typeof window !== "undefined") {
      const clean = new URL(window.location.href);
      sensitive.forEach(k => clean.searchParams.delete(k));
      window.history.replaceState({}, "", clean.pathname + (clean.search || ""));
    }
  }, [searchParams]);

  const [errors,     setErrors]     = useState<FormErrors>({});
  const [touched,    setTouched]    = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [agreed,     setAgreed]     = useState(false);
  const [agreeError, setAgreeError] = useState<string | undefined>();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const refs = {
    fullName:        useRef<HTMLInputElement>(null),
    phone:           useRef<HTMLInputElement>(null),
    password:        useRef<HTMLInputElement>(null),
    confirmPassword: useRef<HTMLInputElement>(null),
  } as const;

  const strength = useMemo(() => getPasswordStrength(fields.password), [fields.password]);

  const VALIDATORS = useMemo(() => ({
    fullName:        validateFullName,
    phone:           validatePhone,
    password:        validatePassword,
    confirmPassword: (v: string) => validateConfirmPw(fields.password, v),
  }), [fields.password]);

  const handleChange = useCallback(
    (field: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setFields(prev => ({ ...prev, [field]: val }));
      if (touched[field]) setErrors(prev => ({ ...prev, [field]: VALIDATORS[field](val) }));
      if (field === "password" && touched.confirmPassword)
        setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPw(val, fields.confirmPassword) }));
    },
    [touched, fields.confirmPassword, VALIDATORS],
  );

  const handleBlur = useCallback((field: keyof FormFields) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: VALIDATORS[field](fields[field]) }));
  }, [fields, VALIDATORS]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, phone: true, password: true, confirmPassword: true });
    const vErrors = validateForm(fields);
    if (!agreed) setAgreeError("You must agree to the Terms and Privacy Policy.");
    else         setAgreeError(undefined);
    if (Object.keys(vErrors).length > 0 || !agreed) {
      setErrors(vErrors);
      const order: (keyof FormFields)[] = ["fullName", "phone", "password", "confirmPassword"];
      for (const f of order) { if (vErrors[f]) { refs[f].current?.focus(); break; } }
      return;
    }
    setErrors({});
    setSubmitState("loading");
    try {
      const res = await fetch("/api/auth/signup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          fullName: fields.fullName,
          phone:    fields.phone.replace(/[\s\-]/g, ""),
          password: fields.password,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Registration failed.");
      saveSession(data.token, data.user);
      setSubmitState("success");
    } catch (err: unknown) {
      setSubmitState("error");
      setErrors({ form: err instanceof Error ? err.message : "Something went wrong." });
    }
  }, [fields, agreed, refs]);

  const isLoading = submitState === "loading";
  const isSuccess = submitState === "success";

  return (
    <AuthLayout
      quote="I registered on Tuesday, deposited Rs. 200, secured at 4× and earned Rs. 800. Withdrew the same day."
      quoteAuthor="Ayesha Malik"
      quoteRole={`Player — ${BRAND.name}`}
      features={[
        "Register free in under 2 minutes",
        `Deposit Rs. ${GAME.MIN_DEPOSIT} minimum to start`,
        "Watch the eagle fly — multiplier climbs live",
        "Press SECURE at any moment to lock your win",
        "Instant balance updates after each hunt",
      ]}
    >
      {/* ── Success state ── */}
      {isSuccess ? (
        <div className="flex flex-col items-center gap-6 text-center py-8" role="status" aria-live="polite">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: "color-mix(in srgb,var(--color-success) 12%,transparent)" }}>
            <svg className="w-8 h-8 text-[var(--color-success)]" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">
              You&apos;re registered!
            </h1>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs">
              Account created for{" "}
              <strong className="text-[var(--text-primary)]">{fields.phone}</strong>.
              Sign in to deposit and start playing.
            </p>
          </div>
          <Button variant="gradient" size="md" href={ROUTES.signIn} pill>Sign in and play</Button>
        </div>
      ) : (
        /* ── Registration form ── */
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[var(--text-primary)] font-black text-[clamp(1.6rem,3vw,2rem)] tracking-tight leading-tight">
              Create your account
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Already registered?{" "}
              <Link href={ROUTES.signIn}
                className="font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] underline-offset-2 hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate aria-label={`Create ${BRAND.name} account`} className="flex flex-col gap-4">

            {/* Form-level error */}
            {errors.form && (
              <div role="alert" aria-live="assertive"
                className="flex items-start gap-3 p-3.5 rounded-[var(--radius-md)]"
                style={{
                  background: "color-mix(in srgb,var(--color-error) 10%,transparent)",
                  border: "1px solid color-mix(in srgb,var(--color-error) 25%,transparent)",
                }}>
                <svg className="w-4 h-4 text-[var(--color-error)] flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V5zm.75 6.5a.875.875 0 110-1.75.875.875 0 010 1.75z" clipRule="evenodd" />
                </svg>
                <p className="text-[var(--color-error)] text-sm font-medium">{errors.form}</p>
              </div>
            )}

            {/* Full name */}
            <FormInput ref={refs.fullName} label="Full name" name="fullName" type="text" size="lg"
              placeholder="e.g. Ahmed Khan" autoComplete="name" required
              value={fields.fullName} error={errors.fullName}
              onChange={handleChange("fullName")} onBlur={handleBlur("fullName")}
              iconLeft={<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>}
            />

            {/* Mobile number */}
            <FormInput ref={refs.phone} label="Mobile number" name="phone" type="tel" size="lg"
              placeholder="03001234567" autoComplete="tel" required
              value={fields.phone} error={errors.phone}
              onChange={handleChange("phone")} onBlur={handleBlur("phone")}
              helperText="Pakistani mobile number — used to sign in and recover your account."
              iconLeft={<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>}
            />

            {/* Password + strength */}
            <div className="flex flex-col gap-2">
              <FormInput ref={refs.password} label="Password" name="password" type="password" size="lg"
                placeholder="Create a strong password" autoComplete="new-password" required
                value={fields.password} error={errors.password}
                onChange={handleChange("password")} onBlur={handleBlur("password")}
                iconLeft={<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>}
              />
              {fields.password && <StrengthBar password={fields.password} />}
            </div>

            {/* Confirm password */}
            <FormInput ref={refs.confirmPassword} label="Confirm password" name="confirmPassword" type="password" size="lg"
              placeholder="Repeat your password" autoComplete="new-password" required
              value={fields.confirmPassword} error={errors.confirmPassword}
              onChange={handleChange("confirmPassword")} onBlur={handleBlur("confirmPassword")}
              iconLeft={<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
            />

            <TermsCheckbox
              checked={agreed}
              onChange={v => { setAgreed(v); if (v) setAgreeError(undefined); }}
              error={agreeError}
            />

            <Button type="submit" variant="gradient" size="lg" fullWidth loading={isLoading} pill glow className="mt-1">
              Create free account
            </Button>

            <p className="text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-1.5">
              <svg className="w-3 h-3 text-[var(--color-success)] flex-shrink-0" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M6 1a5 5 0 100 10A5 5 0 006 1zM4.5 6.5l1 1 2.5-2.5-.7-.7-1.8 1.8-.3-.3-.7.7z" clipRule="evenodd" />
              </svg>
              Free to register · Minimum deposit Rs. {GAME.MIN_DEPOSIT} · Withdraw anytime
            </p>
          </form>

          {/* strength is used for aria — avoid unused-var warning */}
          <span className="sr-only" aria-hidden="true">{strength.label}</span>
        </div>
      )}
    </AuthLayout>
  );
}
