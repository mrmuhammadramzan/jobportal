"use client";
/**
 * ScrollReveal — wraps children with scroll-triggered reveal animation.
 * DRY Rule: one component for all scroll animations. Never inline animate.
 *
 * Props:
 *  direction  — "up" | "left" | "right" | "scale" | "none"
 *  delay      — animation delay in ms
 *  threshold  — 0–1, fraction visible before trigger (default 0.15)
 *  once       — animate only once (default true)
 *  className  — passthrough classes
 */
import React, { useEffect, useRef, useState } from "react";

type RevealDirection = "up" | "left" | "right" | "scale" | "none";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const DIRECTION_CLASS: Record<RevealDirection, string> = {
  up:    "reveal reveal-up",
  left:  "reveal reveal-left",
  right: "reveal reveal-right",
  scale: "reveal reveal-scale",
  none:  "reveal",
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  threshold = 0.12,
  once = true,
  className = "",
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const Comp = Tag as React.ElementType;

  return (
    <Comp
      ref={ref}
      className={[DIRECTION_CLASS[direction], visible ? "visible" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Comp>
  );
}
