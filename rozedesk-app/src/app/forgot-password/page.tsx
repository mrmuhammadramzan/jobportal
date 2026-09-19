"use client";
/**
 * /forgot-password — Request password reset.
 * Frontend SOP §7: visible label, blur validation, all 3 async states.
 * DRY: AuthLayout, FormInput, Button — never styled inline.
 */
import React, { useState, useCallback } from "react";
import Link  from "next/link";
import AuthLayout from "@/components/AuthLayout";
import FormInput  from "@/components/FormInput";
import Button     from "@/components/Button";
import { ROUTES } from "@/lib/routes";

type SendState = "idle"|"loading"|"sent"|"error";

function validateEmail(v: string): string|undefined {
  if (!v.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
}

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState("");
  const [emailErr,  setEmailErr]  = useState<string|undefined>();
  const [touched,   setTouched]   = useState(false);
  const [sendState, setSendState] = useState<SendState>("idle");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const err = validateEmail(email);
    if (err) { setEmailErr(err); return; }
    setEmailErr(undefined);
    setSendState("loading");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed.");
      setSendState("sent");
    } catch {
      setSendState("sent"); /* Always show "check inbox" — never leak user existence */
    }
  }, [email]);

  return (
    <AuthLayout
      quote="Simple, fast, and secure. RozeDesk makes job searching stress-free."
      quoteAuthor="Sara Ahmed"
      quoteRole="Finance Analyst — hired via RozeDesk"
      features={["Reset your password in minutes","Check your inbox for a reset link","Secure one-time link expires in 1 hour","Contact support if you need help"]}
    >
      {sendState === "sent" ? (
        <div className="flex flex-col items-center gap-5 text-center py-6">
          <div className="w-14 h-14 rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] flex items-center justify-center">
            <svg className="w-7 h-7 text-[var(--color-success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <h1 className="text-[var(--text-primary)] font-black text-2xl">Check Your Inbox</h1>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs">
            We've sent a password reset link to <strong className="text-[var(--text-primary)]">{email}</strong>.
            The link expires in 1 hour.
          </p>
          <Link href={ROUTES.signIn}
            className="text-sm font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] hover:underline underline-offset-2 transition-colors">
            ← Back to Sign In
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">Forgot Password?</h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormInput
              label="Email address"
              name="email"
              type="email"
              size="lg"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              error={touched ? emailErr : undefined}
              onChange={e => { setEmail(e.target.value); if (touched) setEmailErr(validateEmail(e.target.value)); }}
              onBlur={() => { setTouched(true); setEmailErr(validateEmail(email)); }}
              iconLeft={<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>}
            />
            <Button type="submit" variant="gradient" size="lg" fullWidth pill glow loading={sendState==="loading"}>
              Send Reset Link
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--text-muted)]">
            Remembered your password?{" "}
            <Link href={ROUTES.signIn} className="font-semibold text-[var(--brand-500)] hover:text-[var(--brand-600)] hover:underline underline-offset-2 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  );
}
