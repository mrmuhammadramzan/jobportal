"use client";
/**
 * NavBar — RozeDesk public navigation.
 *
 * THEME STRATEGY:
 *   The public NavBar sits on transparent → var(--bg-base) background.
 *   ALL text, icon, border colours use CSS token classes so they adapt
 *   automatically when the user switches between dark and light mode.
 *
 *   Previous violations (fixed here):
 *   - text-[var(--gray-300)] / hover:text-white → text-[var(--text-secondary)] / hover:text-[var(--text-primary)]
 *   - bg-white/N hover states → bg-[var(--bg-elevated)]
 *   - bg-white hamburger bars → bg-[var(--text-primary)]
 *   - Mobile menu bg-[var(--gray-950)] → bg-[var(--bg-base)]
 *   - Mobile links text-white/60 → text-[var(--text-secondary)]
 *   - Mobile Sign In override !text-white → !text-[var(--text-primary)]
 */
import React, { useState, useEffect, useCallback } from "react";
import Button      from "./Button";
import Logo        from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { ROUTES }  from "@/lib/routes";

const NAV_LINKS = [
  { label: "Browse Jobs", href: ROUTES.jobs    },
  { label: "About",       href: ROUTES.about   },
  { label: "Contact",     href: ROUTES.contact },
] as const;

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-[var(--dur-deliberate)]",
        scrolled
          ? "bg-[var(--bg-base)]/95 backdrop-blur-xl shadow-[var(--shadow-2)] border-b border-[var(--border-default)]"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo — token-based default textColor */}
        <Logo priority href={ROUTES.home} />

        {/* Desktop nav links — token-based colours */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-3 py-1.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all duration-[var(--dur-fast)]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle variant="default" />
          {/* Separator — token-based */}
          <div className="w-px h-5 bg-[var(--border-default)] mx-1" aria-hidden="true" />
          {/* Sign In — token-based ghost */}
          <Button variant="ghost" size="md" href={ROUTES.signIn}>
            Sign In
          </Button>
          <Button variant="gradient" size="md" href={ROUTES.signUp} pill glow>
            Register Free
          </Button>
        </div>

        {/* Mobile hamburger — token-based bars */}
        <button
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-[var(--radius-md)] hover:bg-[var(--bg-elevated)] transition-colors"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {/* Bars use --text-primary: dark in light mode, light in dark mode */}
          <span className={`w-5 h-0.5 bg-[var(--text-primary)] rounded-full transition-all duration-[var(--dur-default)] ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-5 h-0.5 bg-[var(--text-primary)] rounded-full transition-all duration-[var(--dur-default)] ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-0.5 bg-[var(--text-primary)] rounded-full transition-all duration-[var(--dur-default)] ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu — token-based background and text */}
      <div
        id="mobile-menu"
        className={[
          "md:hidden overflow-hidden transition-all duration-[var(--dur-deliberate)]",
          /* Token-based background — adapts to theme, not always dark */
          "bg-[var(--bg-base)]/98 backdrop-blur-xl border-b border-[var(--border-default)]",
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col px-4 py-4 gap-1" role="list">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block px-4 py-2.5 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-3 border-t border-[var(--border-default)] flex flex-col gap-2">
            {/* Token-based outline Sign In — no white overrides */}
            <Button variant="outline" size="md" href={ROUTES.signIn} fullWidth>
              Sign In
            </Button>
            <Button variant="gradient" size="md" href={ROUTES.signUp} fullWidth pill>
              Register Free
            </Button>
            <div className="flex justify-center pt-1">
              <ThemeToggle showLabel variant="default" />
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
}
