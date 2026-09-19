/**
 * not-found.tsx — Global 404 page.
 * Next.js App Router renders this whenever notFound() is called
 * or a route does not match any page.tsx file.
 *
 * UI/UX SOP §Hard Rule 1: empty/not-found state is designed, not blank.
 * DRY: NavBar, Button, Footer — never styled inline.
 */
import React from "react";
import Link   from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { ROUTES } from "@/lib/routes";

export default function NotFoundPage() {
  return (
    <>
      <NavBar />
      <main
        id="main-content"
        className="pt-16 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[var(--bg-base)]"
      >
        <div className="max-w-lg mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-8 py-16">

          {/* Large 404 */}
          <div className="relative select-none" aria-hidden="true">
            <p className="text-[9rem] sm:text-[12rem] font-black leading-none tracking-tight gradient-text opacity-20">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-20 h-20 text-[var(--brand-500)] opacity-90"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-3">
            <h1 className="text-[var(--text-primary)] font-black text-3xl tracking-tight">
              Page Not Found
            </h1>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="gradient" size="lg" href={ROUTES.home} pill glow>
              Back to Home
            </Button>
            <Button variant="outline" size="lg" href={ROUTES.jobs} pill>
              Browse Jobs
            </Button>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--text-muted)]">
            <Link href={ROUTES.signIn}  className="hover:text-[var(--brand-500)] transition-colors">Sign In</Link>
            <span aria-hidden="true">·</span>
            <Link href={ROUTES.signUp}  className="hover:text-[var(--brand-500)] transition-colors">Register</Link>
            <span aria-hidden="true">·</span>
            <Link href={ROUTES.contact} className="hover:text-[var(--brand-500)] transition-colors">Contact Support</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
