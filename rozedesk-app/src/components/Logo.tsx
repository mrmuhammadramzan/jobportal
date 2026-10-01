/**
 * Logo — single source of truth for the HUNT brand mark.
 * DRY Hard Rule 1: one component, used everywhere.
 * Assets served from /assets/branding/ — env-backed via BRAND constant.
 * Never hardcode asset paths here — always read from BRAND.
 */
"use client";
import React   from "react";
import Image   from "next/image";
import Link    from "next/link";
import { ROUTES } from "@/lib/routes";
import { BRAND  } from "@/lib/gameConstants";

type LogoSize    = "sm" | "md" | "lg";
type LogoVariant = "full" | "icon";
type LogoText    = "default" | "white";

interface LogoProps {
  size?:      LogoSize;
  variant?:   LogoVariant;
  textColor?: LogoText;
  href?:      string | null;
  priority?:  boolean;
  className?: string;
}

const SIZE_MAP: Record<LogoSize, { icon: number; font: string; sizes: string }> = {
  sm: { icon: 28, font: "text-[1rem]",   sizes: "28px" },
  md: { icon: 36, font: "text-[1.2rem]", sizes: "36px" },
  lg: { icon: 48, font: "text-[1.5rem]", sizes: "48px" },
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

  const inner = (
    <>
      {/* Brand mark — hunt-icon.png from /assets/branding/ */}
      <div
        className="relative flex-shrink-0 transition-transform duration-[var(--dur-default)] group-hover:scale-105"
        style={{ width: s.icon, height: s.icon }}
      >
        <Image
          src={BRAND.logoSrc}
          alt={BRAND.logoAlt}
          fill
          sizes={s.sizes}
          className="object-contain"
          priority={priority}
        />
      </div>

      {/* Wordmark */}
      {variant === "full" && (
        <span
          className={`font-black tracking-tight leading-none ${s.font}`}
          aria-hidden="true"
        >
          {textColor === "white" ? (
            <span className="text-white">{BRAND.name}</span>
          ) : (
            <span className="gradient-text">{BRAND.name}</span>
          )}
        </span>
      )}
    </>
  );

  const wrapBase = [
    "group flex items-center gap-2",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[var(--brand-500)] focus-visible:ring-offset-2",
    "rounded-[var(--radius-sm)]",
    className,
  ].filter(Boolean).join(" ");

  if (href === null)
    return <span className={wrapBase} aria-label={BRAND.name}>{inner}</span>;

  if (href.startsWith("http"))
    return (
      <a href={href} className={wrapBase} aria-label={`${BRAND.name} home`}
        target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );

  return (
    <Link href={href} className={wrapBase} aria-label={`${BRAND.name} home`}>
      {inner}
    </Link>
  );
}
