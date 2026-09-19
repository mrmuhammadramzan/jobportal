"use client";
/**
 * error.tsx — Route-segment error boundary (Next.js App Router).
 * Catches runtime errors thrown within page.tsx or layout.tsx segments.
 * Must be a Client Component ("use client").
 *
 * UI/UX SOP §Hard Rule 1: error state is designed, not blank.
 * Frontend SOP §6.1: all 3 states — reset action available, not just an error dump.
 */
import React, { useEffect } from "react";
import Button from "@/components/Button";
import { ROUTES } from "@/lib/routes";

interface ErrorPageProps {
  error:  Error & { digest?: string };
  reset:  () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    /* Log to error reporting service in production (e.g. Sentry) */
    console.error("[RozeDesk Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] px-4">
      <div className="max-w-md w-full flex flex-col items-center gap-7 text-center py-16">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[var(--color-error)]"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[var(--text-primary)] font-black text-2xl tracking-tight">
            Something went wrong
          </h2>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            An unexpected error occurred. We've been notified and are looking into it.
          </p>
          {error.digest && (
            <p className="text-[var(--text-muted)] text-xs mt-1">
              Error ID: <code className="font-mono text-[var(--brand-500)]">{error.digest}</code>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="gradient"
            size="lg"
            onClick={reset}
            fullWidth
            pill
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            href={ROUTES.home}
            fullWidth
            pill
          >
            Go to Home
          </Button>
        </div>

      </div>
    </div>
  );
}
