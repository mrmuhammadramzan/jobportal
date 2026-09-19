/**
 * SectionHeader — single source of truth for all section headings.
 * DRY Rule: one component, driven by props.
 */
import React from "react";
import Badge from "./Badge";

interface SectionHeaderProps {
  id?: string;
  badge?: string;
  badgeVariant?: "brand" | "accent" | "success" | "gradient";
  heading: React.ReactNode;
  subheading?: string;
  align?: "left" | "center" | "right";
  headingGradient?: boolean;
  className?: string;
}

const ALIGN_CLASSES = {
  left:   "items-start text-left",
  center: "items-center text-center",
  right:  "items-end text-right",
};

export default function SectionHeader({
  id,
  badge,
  badgeVariant = "brand",
  heading,
  subheading,
  align = "center",
  headingGradient = false,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 ${ALIGN_CLASSES[align]} ${className}`}>
      {badge && (
        <Badge variant={badgeVariant} dot glow>
          {badge}
        </Badge>
      )}
      <h2
        id={id}
        className={[
          "font-bold tracking-tight leading-[1.15]",
          "text-[clamp(2rem,4vw,3.5rem)]",
          headingGradient ? "gradient-text" : "text-[var(--text-primary)]",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {heading}
      </h2>
      {subheading && (
        <p className="text-[var(--text-secondary)] text-[var(--text-md)] leading-relaxed max-w-2xl">
          {subheading}
        </p>
      )}
    </div>
  );
}
