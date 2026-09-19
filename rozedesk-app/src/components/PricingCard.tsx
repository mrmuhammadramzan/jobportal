/**
 * PricingCard — single source of truth for all pricing tiers.
 * DRY Rule: one component, driven by props.
 */
import React from "react";
import Button from "./Button";
import Badge from "./Badge";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  ctaHref?: string;
  popular?: boolean;
  badge?: string;
  className?: string;
}

export default function PricingCard({
  name,
  price,
  period = "/month",
  description,
  features,
  cta,
  ctaHref = "#",
  popular = false,
  badge,
  className = "",
}: PricingCardProps) {
  return (
    <div
      className={[
        "relative flex flex-col gap-6 p-7 rounded-[var(--radius-2xl)]",
        "transition-all duration-[var(--dur-deliberate)]",
        popular
          ? "bg-gradient-to-b from-[var(--brand-500)] to-[var(--accent-500)] text-white " +
            "shadow-[var(--shadow-brand)] scale-[1.02] z-10"
          : "bg-[var(--bg-surface)] border border-[var(--border-default)] " +
            "hover:shadow-[var(--shadow-2)] hover:-translate-y-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge variant="gradient" glow>
            {badge || "Most Popular"}
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h3
          className={[
            "font-bold text-[var(--text-lg)]",
            popular ? "text-white" : "text-[var(--text-primary)]",
          ].join(" ")}
        >
          {name}
        </h3>
        <p
          className={[
            "text-[var(--text-sm)]",
            popular ? "text-white/70" : "text-[var(--text-secondary)]",
          ].join(" ")}
        >
          {description}
        </p>
      </div>

      {/* Price */}
      <div className="flex items-end gap-1">
        <span
          className={[
            "text-[clamp(2rem,4vw,3rem)] font-black leading-none tracking-tight",
            popular ? "text-white" : "gradient-text",
          ].join(" ")}
        >
          {price}
        </span>
        <span
          className={[
            "text-[var(--text-sm)] mb-1",
            popular ? "text-white/60" : "text-[var(--text-muted)]",
          ].join(" ")}
        >
          {period}
        </span>
      </div>

      {/* Divider */}
      <div
        className={["h-px w-full", popular ? "bg-white/20" : "bg-[var(--border-default)]"].join(
          " "
        )}
        aria-hidden="true"
      />

      {/* Features */}
      <ul className="flex flex-col gap-3" role="list">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className={[
                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                feature.included
                  ? popular
                    ? "bg-white/20 text-white"
                    : "bg-[var(--brand-100)] text-[var(--brand-600)]"
                  : popular
                    ? "bg-white/10 text-white/30"
                    : "bg-[var(--gray-100)] text-[var(--gray-300)]",
              ].join(" ")}
              aria-hidden="true"
            >
              {feature.included ? (
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </span>
            <span
              className={[
                "text-[var(--text-sm)] leading-snug",
                feature.included
                  ? popular
                    ? "text-white"
                    : "text-[var(--text-primary)]"
                  : popular
                    ? "text-white/40"
                    : "text-[var(--text-muted)] line-through",
              ].join(" ")}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-auto">
        <Button
          href={ctaHref}
          variant={popular ? "secondary" : "primary"}
          size="lg"
          fullWidth
          pill
          className={popular ? "!bg-white !text-[var(--brand-600)] hover:!bg-[var(--gray-50)]" : ""}
        >
          {cta}
        </Button>
      </div>
    </div>
  );
}
