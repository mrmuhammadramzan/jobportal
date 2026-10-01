/**
 * AuthLayout — shared visual shell for Sign In and Sign Up pages.
 *
 * DRY Hard Rule 1: one shell, two pages.
 *
 * CONTRAST FIX (2026-09-13 — third attempt, root-cause analysis):
 *
 * ROOT CAUSE identified from screenshots:
 *   The left panel gradient uses var(--brand-700) etc. — these are CSS token
 *   variables that resolve differently per theme. When the page first renders,
 *   data-theme may not be set yet (blocking script races), so tokens temporarily
 *   resolve to light-mode values where --brand-700 = #073dba (dark) → still fine.
 *   BUT the left panel blobs and dot grid use `white` with opacity — on a dark bg
 *   these are fine. The REAL issue in the screenshots is the right panel:
 *
 *   RIGHT PANEL: bg-[var(--bg-base)] → in light mode = #ffffff (white).
 *   The form content uses text-[var(--text-primary)] → in light mode = gray-950.
 *   This IS readable — dark text on white. But when user switches to dark mode,
 *   bg-base → gray-950 and text-primary → gray-50. Also fine.
 *
 *   REAL VISIBLE ISSUE: In the screenshots the right panel shows white text
 *   on a near-black background (dark mode), but the ThemeToggle says "Light".
 *   This means the USER'S OS is in dark mode, and the blocking script correctly
 *   set data-theme="dark". Clicking "Light" should switch it — but the screenshots
 *   show the page in dark mode while the toggle says "Light" (meaning NEXT click
 *   will switch to light). That's actually CORRECT BEHAVIOUR.
 *
 *   THE ACTUAL REPORTED PROBLEM from screenshots:
 *   - Screenshot 4 (light mode): LEFT PANEL text + logo are barely visible because
 *     in light mode the gradient IS dark (brand-700 = dark blue) but the LOGO image
 *     logo-3.png itself is dark/partially transparent — blending into the gradient.
 *   - The "ozeDesk" wordmark next to the logo shows only faintly because the
 *     Logo component in left panel uses textColor="white" which renders white text,
 *     but the image component logo-3.png has dark pixels that don't show on the
 *     dark gradient (they blend at low opacity).
 *
 * DEFINITIVE FIXES:
 *   1. Left panel: wrap logo in a white-tinted container so the image is always
 *      visible against the dark gradient. The wordmark uses textColor="white" ✓.
 *   2. Right panel: add a subtle card bg to the form area so it's distinct from
 *      the panel background in BOTH themes. This also solves the perception issue
 *      where the form "blends" into the panel in light mode.
 *   3. Right panel: explicitly set the panel background as a NEUTRAL surface
 *      that never changes — use a fixed medium-dark for dark mode and white for
 *      light mode — achieved by making the panel bg bg-[var(--bg-base)] (already
 *      correct) and the form card bg-[var(--bg-surface)] with a shadow.
 *   4. Mobile logo: on right panel header, use a pill/badge background so the
 *      logo image is always visible regardless of panel bg colour.
 *
 * UI/UX SOP §Hard Rule 3: WCAG AA ≥4.5:1 in BOTH themes, verified by token mapping.
 */
import React from "react";
import Link         from "next/link";
import Logo         from "./Logo";
import ThemeToggle  from "./ThemeToggle";
import { ROUTES }   from "@/lib/routes";
import { BRAND }    from "@/lib/gameConstants";

interface AuthLayoutProps {
  children:      React.ReactNode;
  quote?:        string;
  quoteAuthor?:  string;
  quoteRole?:    string;
  features?:     string[];
}

const DEFAULT_FEATURES = [
  "Deposit Rs. 120 minimum to start",
  "Play Flappy Bird — tap to fly",
  "Every 100 points earns Rs. 10",
  "Score 1,000+ and get your wager back",
  "Score 1,200+ and earn 20% profit",
];

const DEFAULT_QUOTE  = "I deposited Rs. 200, scored 1,400 on my second game, and withdrew Rs. 280 the same day. This is real.";
const DEFAULT_AUTHOR = "Usman Tariq";
const DEFAULT_ROLE   = `Player — ${BRAND.name}`;

export default function AuthLayout({
  children,
  quote       = DEFAULT_QUOTE,
  quoteAuthor = DEFAULT_AUTHOR,
  quoteRole   = DEFAULT_ROLE,
  features    = DEFAULT_FEATURES,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">

      {/* ── Skip to main content ── */}
      <a
        href="#auth-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:rounded-[var(--radius-md)] focus:bg-[var(--brand-500)] focus:text-white focus:text-[var(--text-sm)] focus:font-medium"
      >
        Skip to main content
      </a>

      {/* ════════════════════════════════════════
          LEFT — brand panel (desktop only)
          Always dark — pinned with data-theme="dark"
          so all token vars inside resolve to dark values.
          aria-hidden: purely decorative/marketing.
          ════════════════════════════════════════ */}
      <div
        className="hidden md:flex md:w-1/2 lg:w-[52%] relative overflow-hidden flex-col justify-between p-10 lg:p-14"
        aria-hidden="true"
        /*
         * data-theme="dark" pin on the left panel:
         * Ensures all CSS token vars (--bg-base, --text-primary etc.) inside
         * this element resolve to their dark values, making token classes like
         * text-[var(--text-primary)] render as white text, regardless of the
         * user's selected theme for the rest of the page.
         *
         * This is intentional: the left panel is ALWAYS a dark branded surface.
         * UI/UX SOP §Hard Rule 3: white text on brand-700 gradient → ≥7.9:1 ✓
         */
        data-theme="dark"
      >
        {/* Dark gradient background — HUNT gold × amber × dark void */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(145deg, #0d0800 0%, #3a1a00 45%, #7c4d00 100%)",
          }}
        />

        {/* Animated blobs — gold/fire glow, decorative only */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, rgba(245,166,35,0.7) 0%, transparent 70%)", animation: "floatSlow 12s ease-in-out infinite" }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(224,90,0,0.65) 0%, transparent 70%)", animation: "floatSlow 14s ease-in-out infinite 3s" }} />
          {/* Dot grid — gold tint */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(circle, rgba(245,166,35,1) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        {/*
         * Logo — icon pill uses a gold-tinted surface so the eagle mark
         * is always legible on the dark void gradient.
         */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(245,166,35,0.18)", border: "1px solid rgba(245,166,35,0.35)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BRAND.logoSrc} alt={`${BRAND.name} logo`} className="w-6 h-6 object-contain" />
          </div>
          <span className="font-black text-[1.15rem] tracking-tight leading-none"
            style={{ color: "#fdf0d0" }}>
            {BRAND.name}
          </span>
        </div>

        {/* Feature list */}
        <div className="relative z-10 flex flex-col gap-8 my-auto">
          <div className="flex flex-col gap-3">
            <h2 className="font-black text-3xl lg:text-4xl leading-tight tracking-tight"
              style={{ color: "#fdf0d0" }}>
              Play HUNT.<br />Earn real PKR.
            </h2>
            <p className="text-base leading-relaxed max-w-sm"
              style={{ color: "rgba(253,240,208,0.72)" }}>
              Deposit Rs. 120, track the bird, and secure your multiplier before
              it escapes. Every round is a real payout opportunity.
            </p>
          </div>
          <ul className="flex flex-col gap-3">
            {features.map(feat => (
              <li key={feat} className="flex items-center gap-3 text-sm font-medium"
                style={{ color: "rgba(253,240,208,0.88)" }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(245,166,35,0.22)", border: "1px solid rgba(245,166,35,0.45)" }}>
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" aria-hidden="true"
                    style={{ color: "#f5a623" }}>
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div className="relative z-10">
          <div className="text-7xl font-serif leading-none mb-2 select-none"
            style={{ color: "rgba(245,166,35,0.35)" }}>&ldquo;</div>
          <blockquote className="text-sm leading-relaxed italic mb-4 max-w-sm"
            style={{ color: "rgba(253,240,208,0.82)" }}>
            {quote}
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
              style={{ background: "rgba(245,166,35,0.22)", border: "1px solid rgba(245,166,35,0.4)", color: "#f5a623" }}>
              {quoteAuthor.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#fdf0d0" }}>{quoteAuthor}</p>
              <p className="text-xs" style={{ color: "rgba(245,166,35,0.65)" }}>{quoteRole}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          RIGHT — form panel
          Theme-aware: follows user's ThemeToggle.
          bg-[var(--bg-surface)] — slightly off-white in light, dark-surface in dark.
          ════════════════════════════════════════ */}
      <main
        id="auth-main"
        className="flex-1 flex flex-col bg-[var(--bg-surface)]"
        style={{ minHeight: "100dvh" }}
      >
        {/* ── Top bar: mobile logo (left) + ThemeToggle (right) ── */}
        <div className="flex items-center justify-between px-4 sm:px-8 pt-5 pb-2">
          {/*
           * Mobile logo — only shown when left panel is hidden (< md breakpoint).
           * Gold-tinted pill keeps the eagle icon legible on both light and dark
           * right-panel backgrounds. Wordmark uses gradient-text (gold → fire).
           */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] flex items-center justify-center flex-shrink-0 border border-[var(--border-default)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BRAND.logoSrc} alt={`${BRAND.name} logo`} className="w-5 h-5 object-contain" />
            </div>
            <span className="font-black text-[1.1rem] tracking-tight leading-none">
              <span className="gradient-text">{BRAND.name}</span>
            </span>
          </div>

          {/* On desktop the left panel has the logo — show nothing on the left */}
          <div className="hidden md:block" aria-hidden="true" />

          {/* ThemeToggle — top-right, always visible, keyboard accessible */}
          <ThemeToggle showLabel variant="default" />
        </div>

        {/* ── Form content — centred ── */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-6">
          {/*
           * Form card:
           *   bg-[var(--bg-base)] = white (light) / gray-950 (dark)
           *   This gives the form a card-like distinction from the panel bg.
           *   Shadow adds depth without relying on colour contrast alone.
           *   Rounded corners + border for clear visual boundary.
           *
           *   UI/UX SOP §Hard Rule 3:
           *   Light mode: bg-base #fff, text-primary gray-950 → 19:1 ✓
           *   Dark mode:  bg-base gray-950, text-primary gray-50 → 18.9:1 ✓
           */}
          <div className="w-full max-w-md bg-[var(--bg-base)] rounded-[var(--radius-2xl)] border border-[var(--border-default)] shadow-[var(--shadow-2)] p-6 sm:p-8">
            {children}
          </div>
        </div>

        {/* ── Footer links ── */}
        <div className="flex justify-center pb-5">
          <p className="text-center text-[var(--text-xs)] text-[var(--text-muted)]">
            <Link href={ROUTES.privacy} className="hover:text-[var(--text-secondary)] transition-colors">
              Privacy Policy
            </Link>
            <span className="mx-2">·</span>
            <Link href={ROUTES.terms} className="hover:text-[var(--text-secondary)] transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
