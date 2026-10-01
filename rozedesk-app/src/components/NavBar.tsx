"use client";
/**
 * NavBar — HUNT public navigation.
 * Theme: always dark, gold/amber palette from hunt-logo.
 * All colours via CSS token classes — no hardcoded hex.
 */
import React, { useState, useEffect, useCallback } from "react";
import Button     from "./Button";
import Logo       from "./Logo";
import { ROUTES } from "@/lib/routes";

const NAV_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Earnings",     href: "/#earnings"     },
  { label: "About",        href: ROUTES.about      },
] as const;

export default function NavBar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  const handleScroll = useCallback(() => setScrolled(window.scrollY > 16), []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className={[
      "fixed top-0 inset-x-0 z-50 transition-all duration-[var(--dur-deliberate)]",
      scrolled
        ? "bg-[var(--bg-base)]/96 backdrop-blur-xl shadow-[0_2px_24px_rgba(245,166,35,0.1)] border-b border-[var(--border-default)]"
        : "bg-transparent",
    ].join(" ")}>
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Logo priority href={ROUTES.home} />

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a href={link.href}
                className="px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium text-[var(--text-secondary)] hover:text-[var(--brand-400)] hover:bg-[var(--bg-elevated)] transition-all duration-[var(--dur-fast)]">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="md" href={ROUTES.signIn}>Sign In</Button>
          <Button variant="gradient" size="md" href={ROUTES.signUp} pill glow>
            Play Free
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-[var(--radius-md)] hover:bg-[var(--bg-elevated)] transition-colors"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`w-5 h-0.5 bg-[var(--text-primary)] rounded-full transition-all duration-[var(--dur-default)] ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-[var(--text-primary)] rounded-full transition-all duration-[var(--dur-default)] ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-[var(--text-primary)] rounded-full transition-all duration-[var(--dur-default)] ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={[
          "md:hidden overflow-hidden transition-all duration-[var(--dur-deliberate)]",
          "bg-[var(--bg-base)]/98 backdrop-blur-xl border-b border-[var(--border-default)]",
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col px-4 py-4 gap-1" role="list">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a href={link.href}
                className="block px-4 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium text-[var(--text-secondary)] hover:text-[var(--brand-400)] hover:bg-[var(--bg-elevated)] transition-colors"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-3 border-t border-[var(--border-default)] flex flex-col gap-2">
            <Button variant="outline" size="md" href={ROUTES.signIn} fullWidth>Sign In</Button>
            <Button variant="gradient" size="md" href={ROUTES.signUp} fullWidth pill>Play Free</Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
