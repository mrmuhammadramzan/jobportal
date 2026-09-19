/**
 * Badge — single source of truth for all badge/chip/tag UI.
 * DRY Rule: one component, driven by props.
 *
 * FIX (theme alignment):
 *  - "accent" variant: replaced raw Tailwind purple-* classes with
 *    var(--accent-*) tokens. Purple → teal, matching logo palette.
 *  - "success/warning/error" variants: replaced raw Tailwind color words
 *    with var(--color-*) semantic tokens so they follow the token system.
 *  - gradient variant: from brand-500 → accent-400 (blue → teal).
 *  - glow: now uses var(--shadow-accent) for accent variant (teal glow).
 */
import React from "react";

type BadgeVariant = "brand" | "accent" | "success" | "warning" | "error" | "neutral" | "gradient";
type BadgeSize    = "sm" | "md";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
  className?: string;
  pill?: boolean;
  glow?: boolean;
}

/* All colours from CSS vars — zero raw hex or Tailwind colour words */
const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  brand:
    "bg-[var(--brand-100)] text-[var(--brand-700)] border-[var(--brand-200)]",
  accent:
    /* teal — matches logo accent colour */
    "bg-[var(--accent-100)] text-[var(--accent-700)] border-[var(--accent-200)]",
  success:
    "bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] " +
    "text-[var(--color-success)] border-[color-mix(in_srgb,var(--color-success)_25%,transparent)]",
  warning:
    "bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] " +
    "text-[var(--color-warning)] border-[color-mix(in_srgb,var(--color-warning)_25%,transparent)]",
  error:
    "bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] " +
    "text-[var(--color-error)] border-[color-mix(in_srgb,var(--color-error)_25%,transparent)]",
  neutral:
    "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-default)]",
  gradient:
    /* logo gradient: brand-blue → teal */
    "bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-400)] text-white border-transparent",
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  brand:    "bg-[var(--brand-500)]",
  accent:   "bg-[var(--accent-400)]",    /* teal dot */
  success:  "bg-[var(--color-success)]",
  warning:  "bg-[var(--color-warning)]",
  error:    "bg-[var(--color-error)]",
  neutral:  "bg-[var(--gray-400)]",
  gradient: "bg-white",
};

/* Glow class per variant — each uses the matching shadow token */
const GLOW_CLASSES: Record<BadgeVariant, string> = {
  brand:    "shadow-[var(--shadow-brand)]",
  accent:   "shadow-[var(--shadow-accent)]",
  success:  "shadow-[0_2px_12px_rgba(34,197,94,0.35)]",
  warning:  "shadow-[0_2px_12px_rgba(245,158,11,0.35)]",
  error:    "shadow-[0_2px_12px_rgba(239,68,68,0.35)]",
  neutral:  "shadow-[var(--shadow-1)]",
  gradient: "shadow-[var(--shadow-brand)]",
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: "text-[10px] px-2   py-0.5 gap-1",
  md: "text-[11px] px-2.5 py-1   gap-1.5",
};

export default function Badge({
  children,
  variant = "brand",
  size = "md",
  dot = false,
  icon,
  className = "",
  pill = true,
  glow = false,
}: BadgeProps) {
  const radius   = pill ? "rounded-full" : "rounded-[var(--radius-sm)]";
  const glowCls  = glow ? GLOW_CLASSES[variant] : "";

  return (
    <span
      className={[
        "inline-flex items-center font-semibold border tracking-wide uppercase",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        radius,
        glowCls,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT_CLASSES[variant]}`}
          aria-hidden="true"
        />
      )}
      {icon && (
        <span className="w-3 h-3 flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
