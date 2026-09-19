/**
 * FeatureCard — single source of truth for all feature/benefit cards.
 * DRY Rule: one component, driven by props.
 * FIX: added h-full so all cards in a CSS grid row stretch to the same height.
 *      The parent grid uses items-stretch (default) — cards now fill the row.
 */
import React from "react";

type CardVariant = "default" | "gradient" | "glass" | "bordered";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: CardVariant;
  accentColor?: string;
  badge?: string;
  className?: string;
  highlight?: boolean;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  default:
    "bg-[var(--bg-surface)] border border-[var(--border-default)] " +
    "hover:border-[var(--brand-400)] hover:shadow-[var(--shadow-2)] hover:-translate-y-1",

  gradient:
    "bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-500)] " +
    "text-white border-transparent " +
    "hover:shadow-[var(--shadow-brand)] hover:-translate-y-1",

  glass:
    "glass border-white/10 " +
    "hover:border-white/20 hover:shadow-[var(--shadow-2)] hover:-translate-y-1",

  bordered:
    "bg-[var(--bg-base)] border-2 border-[var(--brand-200)] " +
    "hover:border-[var(--brand-400)] hover:shadow-[var(--shadow-brand)] hover:-translate-y-1",
};

export default function FeatureCard({
  icon,
  title,
  description,
  variant = "default",
  accentColor = "var(--brand-100)",
  badge,
  className = "",
  highlight = false,
}: FeatureCardProps) {
  return (
    /* h-full ensures equal-height cards when parent is a grid */
    <div
      className={[
        "relative rounded-[var(--radius-xl)] p-6 flex flex-col gap-4 h-full",
        "transition-all duration-[var(--dur-deliberate)] cursor-default",
        VARIANT_CLASSES[variant],
        highlight ? "ring-2 ring-[var(--brand-500)] ring-offset-2 ring-offset-[var(--bg-base)]" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Icon pill */}
      <div
        className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center flex-shrink-0"
        style={{ background: accentColor }}
        aria-hidden="true"
      >
        <span className="w-6 h-6 text-[var(--brand-600)]">{icon}</span>
      </div>

      {/* Optional badge (e.g. "NEW") */}
      {badge && (
        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[var(--brand-500)] text-white">
          {badge}
        </span>
      )}

      {/* Text — flex-1 so description pushes to fill remaining space evenly */}
      <div className="flex flex-col gap-2 flex-1">
        <h3
          className={[
            "font-semibold text-[var(--text-lg)] leading-snug",
            variant === "gradient" ? "text-white" : "text-[var(--text-primary)]",
          ].join(" ")}
        >
          {title}
        </h3>
        <p
          className={[
            "text-[var(--text-sm)] leading-relaxed",
            variant === "gradient" ? "text-white/80" : "text-[var(--text-secondary)]",
          ].join(" ")}
        >
          {description}
        </p>
      </div>

      {/* Gradient accent line at bottom on hover */}
      <div
        className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-0
          bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-500)]
          group-hover:opacity-100 transition-opacity duration-[var(--dur-default)]"
        aria-hidden="true"
      />
    </div>
  );
}
