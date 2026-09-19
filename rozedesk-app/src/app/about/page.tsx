/**
 * /about — About RozeDesk page.
 */
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { ROUTES } from "@/lib/routes";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const VALUES = [
  { icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title:"Trust & Transparency", body:"We believe in honest communication. Every job listing is real, every fee is disclosed upfront, and every decision is transparent." },
  { icon:"M13 10V3L4 14h7v7l9-11h-7z", title:"Speed & Simplicity", body:"Register in 2 minutes. Apply in one click. We remove every unnecessary step between you and your next opportunity." },
  { icon:"M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title:"Community First", body:"We built RozeDesk for Pakistani professionals. Every feature, every decision, every listing is focused on creating real opportunity." },
];

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="pt-16 min-h-screen bg-[var(--bg-base)]">

        {/* Hero */}
        <section className="py-20 bg-gradient-to-br from-[var(--brand-700)] via-[var(--brand-500)] to-[var(--accent-400)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-white font-black text-4xl lg:text-5xl tracking-tight mb-4">
              About RozeDesk
            </h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
              We're building Pakistan's most straightforward job platform — where employers post
              real opportunities and job seekers apply in minutes, not hours.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-[var(--bg-base)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
            <h2 className="text-[var(--text-primary)] font-black text-3xl tracking-tight text-center">Our Mission</h2>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed text-center max-w-2xl mx-auto">
              To make quality employment accessible to every professional in Pakistan
              by removing the friction between talent and opportunity.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-[var(--bg-surface)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
            <h2 className="text-[var(--text-primary)] font-black text-3xl tracking-tight text-center">What We Stand For</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {VALUES.map(v => (
                <div key={v.title} className="flex flex-col gap-4 p-6 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
                  <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--brand-500)_12%,transparent)] flex items-center justify-center text-[var(--brand-500)]">
                    <Icon path={v.icon} />
                  </div>
                  <h3 className="font-bold text-[var(--text-primary)] text-lg">{v.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[var(--bg-base)]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center flex flex-col gap-6">
            <h2 className="text-[var(--text-primary)] font-black text-3xl tracking-tight">Join RozeDesk Today</h2>
            <p className="text-[var(--text-secondary)] text-base">Register free and start browsing hundreds of jobs in Pakistan.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="gradient" size="lg" href={ROUTES.signUp} pill glow>Register Free</Button>
              <Button variant="outline" size="lg" href={ROUTES.jobs} pill>Browse Jobs</Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
