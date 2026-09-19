/**
 * Logo — single source of truth for the RozeDesk brand mark.
 *
 * DRY Hard Rule 1: one logo component, used everywhere.
 * Never inline the logo markup in NavBar, Footer, AuthLayout, or
 * any other component. Call <Logo /> with props.
 *
 * Props:
 *  size        — controls image + text scale
 *                "sm" (24px icon) | "md" (32px, default) | "lg" (40px)
 *  variant     — "full" (icon + wordmark, default) | "icon" (icon only)
 *  textColor   — "default" (gradient Roze + text-primary Desk, default)
 *                "white"   (both parts white — for dark/gradient backgrounds)
 *  href        — wraps the logo in a Link if provided; defaults to ROUTES.home
 *  priority    — Next.js Image priority prop (true for above-the-fold usage)
 *  className   — passthrough classes for the outer element
 *
 * Accessibility:
 *  - Always rendered as an <a> or <span> with aria-label="RozeDesk home"
 *  - Image has descriptive alt text
 *  - Keyboard focus ring via :focus-visible (inherited from globals.css)
 *
 * Contrast verified (UI/UX SOP §Hard Rule 3):
 *  textColor="default" — gradient-text (brand→teal) + text-primary:
 *    Dark mode:  gray-50 on gray-950 → 18.9:1 ✓
 *    Light mode: gray-950 on white   → 19:1   ✓
 *  textColor="white" — white on gradient/brand bg:
 *    brand-500 bg (#1565ff): white → 4.7:1 ✓
 *    brand-700 bg (#073dba): white → 7.9:1 ✓
 */

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

type LogoSize    = "sm" | "md" | "lg";
type LogoVariant = "full" | "icon";
type LogoText    = "default" | "white";

interface LogoProps {
  size?:      LogoSize;
  variant?:   LogoVariant;
  textColor?: LogoText;
  href?:      string | null;   /* null = non-interactive span, string = link */
  priority?:  boolean;
  className?: string;
}

/* ── Size map — single definition drives icon px + font size ── */
const SIZE_MAP: Record<LogoSize, { icon: number; font: string; sizes: string }> = {
  sm: { icon: 24, font: "text-[0.95rem]", sizes: "24px"  },
  md: { icon: 32, font: "text-[1.15rem]", sizes: "100px" },
  lg: { icon: 40, font: "text-[1.4rem]",  sizes: "40px"  },
};

export default function Logo({
  size      = "md",
  variant   = "full",
  textColor = "default",
  href      = ROUTES.home,
  priority  = false,
  className = "",
}: LogoProps) {
  const s = SIZE_MAP[size];

  /* ── Inner content — icon + optional wordmark ── */
  const inner = (
    <>
      {/* Icon image — hover scale applied on the wrapper */}
      <div
        className="relative flex-shrink-0 transition-transform duration-[var(--dur-default)] group-hover:scale-105"
        style={{ width: s.icon, height: s.icon }}
      >
        <Image
          src="/logo-3.png"
          alt="RozeDesk logo"
          fill
          sizes={s.sizes}
          className="object-contain"
          priority={priority}
        />
      </div>

      {/* Wordmark — hidden in icon-only variant */}
      {variant === "full" && (
        <span
          className={`font-black tracking-tight leading-none ${s.font}`}
          /* aria-hidden so screen readers don't read "oze Desk" as two words */
          aria-hidden="true"
        >
          {textColor === "white" ? (
            /* Pure white both parts — for use on coloured backgrounds */
            <span className="text-white">ozeDesk</span>
          ) : (
            /* Default: gradient "oze" + text-primary "Desk" */
            <>
              <span className="gradient-text">oze</span>
              <span className="text-[var(--text-primary)]">Desk</span>
            </>
          )}
        </span>
      )}
    </>
  );

  /* ── Shared classes for the wrapper ── */
  const wrapBase = [
    "group flex items-center gap-0",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2",
    "rounded-[var(--radius-sm)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  /* ── null href → non-interactive, no link ── */
  if (href === null) {
    return (
      <span className={wrapBase} aria-label="RozeDesk">
        {inner}
      </span>
    );
  }

  /* ── External href → plain <a> ── */
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        className={wrapBase}
        aria-label="RozeDesk home"
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }

  /* ── Internal href → Next.js <Link> ── */
  return (
    <Link href={href} className={wrapBase} aria-label="RozeDesk home">
      {inner}
    </Link>
  );
}
