/**
 * TestimonialCard — single source of truth for all testimonials.
 * DRY Rule: one component, driven by props.
 * FIX: added h-full so grid cards stretch to equal height in the same row.
 *      Quote section uses flex-1 to push author to the bottom consistently.
 */
import React from "react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  avatarColor?: string;
  rating?: number;
  featured?: boolean;
  className?: string;
}

export default function TestimonialCard({
  quote,
  name,
  role,
  company,
  avatar,
  avatarColor = "var(--brand-500)",
  rating = 5,
  featured = false,
  className = "",
}: TestimonialCardProps) {
  return (
    /* h-full: stretches card to grid row height → equal heights */
    <div
      className={[
        "flex flex-col gap-5 p-6 rounded-[var(--radius-xl)] h-full",
        "transition-all duration-[var(--dur-deliberate)]",
        featured
          ? "bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-500)] text-white shadow-[var(--shadow-brand)] scale-[1.02]"
          : "bg-[var(--bg-surface)] border border-[var(--border-default)] hover:shadow-[var(--shadow-2)] hover:-translate-y-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Stars */}
      <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={[
              "w-4 h-4",
              /* FIX: replaced raw text-yellow-300 with CSS var token */
              i < rating
                ? featured ? "text-[var(--color-warning)]" : "text-[var(--color-warning)]"
                : featured ? "text-white/20" : "text-[var(--gray-200)]",
            ].join(" ")}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote — flex-1 pushes author to the bottom for alignment across cards */}
      <blockquote
        className={[
          "text-[var(--text-sm)] leading-relaxed italic flex-1",
          featured ? "text-white" : "text-[var(--text-primary)]",
        ].join(" ")}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Author — always pinned to the bottom */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[var(--text-sm)] flex-shrink-0"
          style={{ background: featured ? "rgba(255,255,255,0.25)" : avatarColor }}
          aria-hidden="true"
        >
          {avatar}
        </div>
        <div>
          <p className={["font-semibold text-[var(--text-sm)]", featured ? "text-white" : "text-[var(--text-primary)]"].join(" ")}>
            {name}
          </p>
          <p className={["text-[var(--text-xs)]", featured ? "text-white/70" : "text-[var(--text-muted)]"].join(" ")}>
            {role} · {company}
          </p>
        </div>
      </div>
    </div>
  );
}
