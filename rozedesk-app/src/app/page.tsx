/**
 * RozeDesk — Job Board Landing Page
 * ─────────────────────────────────────────────────────────────
 * Platform: Simple job board.
 *   Employers post jobs.
 *   Job seekers register and apply.
 *   That's it.
 *
 * Sections:
 *   1.  NavBar
 *   2.  Hero — search + quick CTAs
 *   3.  Job Categories — browse by field
 *   4.  How It Works — 2 paths: seeker (3 steps) / employer (3 steps)
 *   5.  Stats — simple platform numbers
 *   6.  Features — what makes RozeDesk useful
 *   7.  Featured Job Cards — live sample listings
 *   8.  Testimonials
 *   9.  FAQ
 *   10. Final CTA — register or post
 *   11. Footer
 *
 * DRY: all data in typed arrays; components called with props.
 *      Zero inline button styles. Zero raw hex. All CSS var tokens.
 * ─────────────────────────────────────────────────────────────
 */

import React from "react";
import NavBar          from "@/components/NavBar";
import Footer          from "@/components/Footer";
import Button          from "@/components/Button";
import Badge           from "@/components/Badge";
import SectionHeader   from "@/components/SectionHeader";
import FeatureCard     from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";
import TypewriterText  from "@/components/TypewriterText";
import ScrollReveal    from "@/components/ScrollReveal";
import CountUp         from "@/components/CountUp";
import FAQItem         from "@/components/FAQItem";
import JobSearchBar    from "@/components/JobSearchBar";
import { ROUTES, jobUrl } from "@/lib/routes";

/* ── SVG icon helper — no library dep ── */
function Icon({ path, className = "w-6 h-6" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/* ══════════════════════════════════════
   DATA
   ══════════════════════════════════════ */

/* Job categories */
const CATEGORIES = [
  { label: "Technology",     icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2", count: "1,240+", color: "var(--brand-100)" },
  { label: "Design",         icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01", count: "420+",   color: "var(--accent-100)" },
  { label: "Marketing",      icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z", count: "380+",   color: "color-mix(in srgb,var(--color-warning) 12%,transparent)" },
  { label: "Finance",        icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", count: "560+",   color: "color-mix(in srgb,var(--color-success) 12%,transparent)" },
  { label: "Healthcare",     icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", count: "690+",   color: "color-mix(in srgb,var(--color-error) 10%,transparent)" },
  { label: "Education",      icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z", count: "290+",   color: "var(--brand-100)" },
] as const;

/* Platform stats */
const STATS = [
  { value: 4800, suffix: "+",  label: "Jobs Listed",          description: "Active listings right now",       decimals: 0 },
  { value: 32000,suffix: "+",  label: "Registered Seekers",   description: "Professionals on the platform",   decimals: 0 },
  { value: 6,    suffix: "+",  label: "New Jobs Per Week",     description: "Fresh listings added regularly",  decimals: 0 },
  { value: 91,   suffix: "%",  label: "Response Rate",        description: "Applications reviewed within 7 days", decimals: 0 },
];

/* Seeker steps */
const SEEKER_STEPS = [
  { num: "01", title: "Create a Free Account",  description: "Register in under 2 minutes. Fill in your name, email, and basic details. No CV upload required to start.",                                    icon: <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> },
  { num: "02", title: "Browse Open Jobs",        description: "Filter by job title, category, location, and job type (full-time, part-time, remote). Find roles that match what you're looking for.",      icon: <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> },
  { num: "03", title: "Apply with One Click",    description: "Click Apply on any listing. Your profile and details are sent directly to the employer. Track all your applications in your dashboard.",     icon: <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
];

/* Platform features */
const FEATURES = [
  {
    icon: <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    title: "Easy Job Search",
    description: "Filter jobs by title, category, location, and job type. Find what you're looking for in seconds.",
    accentColor: "var(--brand-100)",
  },
  {
    icon: <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
    title: "Instant Job Alerts",
    description: "Get email notifications when new jobs matching your keywords are posted. Never miss a relevant opening.",
    accentColor: "var(--accent-100)",
    badge: "FREE",
  },
  {
    icon: <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    title: "Simple Application",
    description: "No long forms. Apply directly from a job listing using your registered profile. Your details go straight to the employer.",
    accentColor: "color-mix(in srgb,var(--color-success) 12%,transparent)",
  },
  {
    icon: <Icon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    title: "Always Up-to-Date",
    description: "Our team regularly posts new openings. Every listing is reviewed before going live so you only see real, active opportunities.",
    accentColor: "color-mix(in srgb,var(--color-warning) 12%,transparent)",
  },
  {
    icon: <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    title: "Application Tracking",
    description: "Your personal dashboard shows every job you've applied to, the date, and the status. Never lose track of where you've applied.",
    accentColor: "var(--brand-100)",
  },
  {
    icon: <Icon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
    title: "Secure & Private",
    description: "Your contact details are only shared when you apply. Browse all listings anonymously — no one sees you until you choose to apply.",
    accentColor: "color-mix(in srgb,var(--color-error) 10%,transparent)",
  },
];

/* Sample job listings — representative display cards */
const SAMPLE_JOBS = [
  { id: "j1",  title: "React Developer",           company: "Systems Ltd",          location: "Lahore",   type: "Full-time", category: "Technology", posted: "2 hours ago"   },
  { id: "j2",  title: "UI/UX Designer",             company: "Arbisoft",             location: "Remote",   type: "Full-time", category: "Design",     posted: "5 hours ago"   },
  { id: "j3",  title: "Digital Marketing Executive",company: "Gaditek",              location: "Karachi",  type: "Full-time", category: "Marketing",  posted: "1 day ago"     },
  { id: "j4",  title: "Node.js Backend Engineer",   company: "10Pearls",             location: "Islamabad",type: "Full-time", category: "Technology", posted: "3 hours ago"   },
  { id: "j5",  title: "Product Manager",            company: "Netsol Technologies",  location: "Lahore",   type: "Full-time", category: "Technology", posted: "6 hours ago"   },
  { id: "j6",  title: "Graphic Designer",           company: "Folio3",               location: "Remote",   type: "Part-time", category: "Design",     posted: "Yesterday"     },
];

/* Testimonials */
const TESTIMONIALS = [
  { quote: "I applied to 6 jobs through RozeDesk and had 3 interviews in the first week. Got hired within 12 days of signing up. Simple and it works.", name: "Ayesha Malik",   role: "React Developer",    company: "Hired via RozeDesk",  avatar: "AM", avatarColor: "var(--brand-500)",     rating: 5, featured: false },
  { quote: "We posted a job listing for a senior developer on Monday morning. By Wednesday we had 40+ applicants and hired someone by end of the month.", name: "Tariq Mahmood",  role: "CTO",                company: "FinPak Technologies", avatar: "TM", avatarColor: "var(--accent-400)",    rating: 5, featured: true  },
  { quote: "No complicated resume builders or AI stuff — just post your profile and apply. That's all I needed. Found a remote design role in 2 weeks.", name: "Sara Ahmed",      role: "UI/UX Designer",     company: "Hired via RozeDesk",  avatar: "SA", avatarColor: "var(--cyan-500)",      rating: 5, featured: false },
  { quote: "As a fresh graduate I was nervous, but the one-click apply made it easy to put myself out there. Got my first job within a month.", name: "Bilal Hassan",    role: "Software Engineer",  company: "Hired via RozeDesk",  avatar: "BH", avatarColor: "var(--color-success)", rating: 5, featured: false },
  { quote: "Posting jobs is genuinely fast. 10 minutes to write the listing, live in minutes. Much simpler than platforms we used before.", name: "Nadia Qureshi",   role: "HR Manager",         company: "ScaleUp Pvt Ltd",     avatar: "NQ", avatarColor: "var(--color-warning)", rating: 5, featured: false },
];

/* FAQ */
const FAQS = [
  { q: "Is RozeDesk free to use?",                  a: "Yes — registering and applying to jobs is completely free for everyone. There are no hidden fees." },
  { q: "How do I apply for a job?",                 a: "Register a free account, browse to any job listing, and click Apply. Your registered details are sent directly. Track all your applications in your dashboard." },
  { q: "Do I need to upload a CV?",                 a: "No CV upload is required to register or apply. Your profile information is used when you apply. You can optionally attach a document from your device when submitting an application." },
  { q: "How will I know if my application was seen?",a: "You can track the status of all your applications in your dashboard. You'll also receive an email if the team responds to your application." },
  { q: "How long are job listings active?",          a: "Listings stay active until the position is filled or removed. Check the listing date — we recommend applying as soon as you see a role you like." },
  { q: "How do I get notified of new jobs?",         a: "After registering, you can set up job alerts so you're emailed when a new listing matching your preferences is posted." },
];

/* ══════════════════════════════════════
   PAGE
   ══════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      <NavBar />
      <main id="main-content">

        {/* ═══════════════════════════════════
            HERO
            ═══════════════════════════════════ */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16" aria-label="Find your next job">

          {/* Ambient bg blobs */}
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute top-[-15%] left-[5%] w-[500px] h-[500px] rounded-full opacity-20"
              style={{ background: "radial-gradient(circle,var(--brand-400) 0%,transparent 70%)", animation: "blob-morph 14s ease-in-out infinite,floatSlow 10s ease-in-out infinite" }} />
            <div className="absolute top-[20%] right-[2%] w-[350px] h-[350px] rounded-full opacity-15"
              style={{ background: "radial-gradient(circle,var(--accent-400) 0%,transparent 70%)", animation: "floatSlow 12s ease-in-out infinite 3s" }} />
            <div className="absolute inset-0 opacity-[0.025]"
              style={{ backgroundImage: "linear-gradient(var(--border-default) 1px,transparent 1px),linear-gradient(90deg,var(--border-default) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 90% 70% at 50% 0%,transparent 0%,var(--bg-base) 100%)" }} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center gap-8">

            {/* Live badge */}
            <ScrollReveal direction="scale">
              <Badge variant="gradient" dot glow>
                {STATS[0].value.toLocaleString()}+ jobs available right now
              </Badge>
            </ScrollReveal>

            {/* Headline + typewriter — text-[var(--text-primary)] adapts to theme */}
            <ScrollReveal direction="up" delay={80}>
              <h1 className="font-black leading-[1.05] tracking-tight text-[clamp(2.4rem,7vw,4.8rem)] text-[var(--text-primary)] max-w-3xl">
                Find your{" "}
                <span className="gradient-text">
                  <TypewriterText
                    words={["next job","dream role","remote position","full-time career","part-time work","fresh start"]}
                    speed={75} deleteSpeed={40} pauseTime={2200}
                  />
                </span>
                <br className="hidden sm:block" />
                <span className="text-[var(--text-primary)]"> in Pakistan</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={160}>
              <p className="text-[var(--text-secondary)] text-[clamp(1rem,2.5vw,1.2rem)] leading-relaxed max-w-lg">
                Browse thousands of job listings, register free, and apply in one click.
                No complicated profiles, no AI gimmicks — just real jobs.
              </p>
            </ScrollReveal>

            {/* Search bar */}
            <ScrollReveal direction="up" delay={240} className="w-full">
              <JobSearchBar />
            </ScrollReveal>

            {/* Popular searches — token-based */}
            <ScrollReveal direction="up" delay={320}>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-[var(--text-muted)] text-xs font-medium">Popular:</span>
                {["React Developer","UI Designer","Marketing Manager","Accountant","Teacher"].map(term => (
                  <a
                    key={term}
                    href={`${ROUTES.jobs}?q=${encodeURIComponent(term)}`}
                    className="px-3 py-1 rounded-full border border-[var(--border-default)] text-[var(--text-secondary)] text-xs font-medium hover:border-[var(--brand-400)] hover:text-[var(--text-primary)] transition-all duration-[var(--dur-fast)] hover:bg-[var(--bg-elevated)]"
                  >
                    {term}
                  </a>
                ))}
              </div>
            </ScrollReveal>

            {/* Contact nudge — token-based */}
            <ScrollReveal direction="up" delay={400}>
              <p className="text-[var(--text-muted)] text-sm">
                Have a question?{" "}
                <a
                  href={ROUTES.contact}
                  className="text-[var(--brand-500)] font-semibold hover:text-[var(--brand-600)] transition-colors underline-offset-2 hover:underline"
                >
                  Get in touch →
                </a>
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════════════════════
            JOB CATEGORIES
            ═══════════════════════════════════ */}
        <section className="py-16 lg:py-24 bg-[var(--bg-surface)]" aria-labelledby="categories-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <ScrollReveal direction="up">
              <SectionHeader
                id="categories-heading"
                badge="Browse by Category"
                badgeVariant="brand"
                heading="Explore jobs in your field"
                subheading="Thousands of listings across every industry. Updated daily."
                align="center"
              />
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map((cat, i) => (
                <ScrollReveal key={cat.label} direction="up" delay={i * 50} className="h-full">
                  <a
                    href={`${ROUTES.jobs}?category=${encodeURIComponent(cat.label)}`}
                    className="group flex items-center gap-4 p-5 rounded-[var(--radius-xl)] bg-[var(--bg-base)] border border-[var(--border-default)] hover:border-[var(--brand-400)] hover:shadow-[var(--shadow-2)] hover:-translate-y-1 transition-all duration-[var(--dur-deliberate)] h-full"
                  >
                    <div
                      className="w-11 h-11 rounded-[var(--radius-lg)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-[var(--dur-default)]"
                      style={{ background: cat.color }}
                      aria-hidden="true"
                    >
                      <Icon path={cat.icon} className="w-5 h-5 text-[var(--brand-600)]" />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-semibold text-[var(--text-base)] text-[var(--text-primary)] group-hover:text-[var(--brand-500)] transition-colors leading-snug">
                        {cat.label}
                      </span>
                      <span className="text-[var(--text-xs)] text-[var(--text-muted)]">
                        {cat.count} open roles
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--brand-500)] ml-auto flex-shrink-0 group-hover:translate-x-0.5 transition-all" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </ScrollReveal>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg" href={ROUTES.jobs} pill>
                View all job listings
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            HOW IT WORKS — dual paths
            ═══════════════════════════════════ */}
        <section id="how-it-works" className="py-16 lg:py-24" aria-labelledby="how-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-14">
            <ScrollReveal direction="up">
              <SectionHeader
                id="how-heading"
                badge="How It Works"
                badgeVariant="accent"
                heading="Three simple steps to your next job"
                subheading="Register free, browse our listings, and apply in one click. That's it."
                align="center"
                headingGradient
              />
            </ScrollReveal>

            {/* Single column — seekers only */}
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
              {SEEKER_STEPS.map((step, i) => (
                <ScrollReveal key={step.num} direction="up" delay={i * 80} className="h-full">
                  <div className="flex gap-4 p-5 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--brand-300)] hover:shadow-[var(--shadow-2)] hover:-translate-y-1 transition-all duration-[var(--dur-deliberate)]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-500)] to-[var(--brand-400)] flex items-center justify-center flex-shrink-0 shadow-[var(--shadow-brand)]">
                      <span className="text-white text-xs font-black">{step.num}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="font-bold text-[var(--text-base)] text-[var(--text-primary)]">{step.title}</p>
                      <p className="text-[var(--text-sm)] text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
                    </div>
                    <div className="w-9 h-9 text-[var(--brand-400)] flex-shrink-0 self-center hidden sm:block">{step.icon}</div>
                  </div>
                </ScrollReveal>
              ))}
              <ScrollReveal direction="up" delay={320}>
                <Button variant="gradient" size="lg" href={ROUTES.signUp} pill glow fullWidth className="mt-2">
                  Register Free — Start Applying
                </Button>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            STATS
            ═══════════════════════════════════ */}
        <section className="py-16 lg:py-24 bg-[var(--bg-surface)] relative overflow-hidden" aria-label="Platform numbers">
          <div className="absolute inset-0 -z-10 opacity-5" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%,var(--brand-400),transparent)" }} aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <ScrollReveal direction="up">
              <SectionHeader badge="By The Numbers" badgeVariant="gradient" heading="Growing every day" align="center" />
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {STATS.map((stat, i) => (
                <ScrollReveal key={stat.label} direction="scale" delay={i * 80} className="h-full">
                  <div className="flex flex-col gap-2 p-6 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-xl)] hover:shadow-[var(--shadow-2)] hover:-translate-y-1 transition-all duration-[var(--dur-deliberate)] text-center h-full">
                    <div className="text-[clamp(1.8rem,4vw,2.8rem)] font-black leading-none tracking-tight gradient-text">
                      <CountUp end={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                    </div>
                    <span className="font-semibold text-[var(--text-sm)] text-[var(--text-primary)]">{stat.label}</span>
                    <span className="text-[var(--text-xs)] text-[var(--text-muted)]">{stat.description}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            FEATURED JOB LISTINGS
            ═══════════════════════════════════ */}
        <section className="py-16 lg:py-24" aria-labelledby="jobs-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <ScrollReveal direction="up">
              <SectionHeader
                id="jobs-heading"
                badge="Latest Jobs"
                badgeVariant="brand"
                heading="Recently posted listings"
                subheading="Fresh opportunities added every hour. Register free to apply."
                align="center"
              />
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_JOBS.map((job, i) => (
                <ScrollReveal key={job.id} direction="up" delay={i * 50} className="h-full">
                  <a
                    href={jobUrl(job.id)}
                    className="group flex flex-col gap-4 p-5 rounded-[var(--radius-xl)] bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--brand-400)] hover:shadow-[var(--shadow-2)] hover:-translate-y-1 transition-all duration-[var(--dur-deliberate)] h-full"
                    aria-label={`${job.title} at ${job.company}`}
                  >
                    {/* Company initial avatar + meta */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--brand-500)] to-[var(--accent-400)] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                          {job.company[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--text-base)] text-[var(--text-primary)] group-hover:text-[var(--brand-500)] transition-colors leading-snug">
                            {job.title}
                          </p>
                          <p className="text-[var(--text-sm)] text-[var(--text-secondary)]">{job.company}</p>
                        </div>
                      </div>
                      {/* New badge for recently posted */}
                      {job.posted.includes("hour") && (
                        <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-[var(--color-success)] flex-shrink-0">
                          New
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                        {job.location}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--brand-100)] text-[var(--brand-700)]">
                        {job.type}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)]">
                        {job.category}
                      </span>
                    </div>

                    {/* Posted time */}
                    <p className="text-[var(--text-xs)] text-[var(--text-muted)]">{job.posted}</p>
                  </a>
                </ScrollReveal>
              ))}
            </div>

            <div className="text-center">
              <Button variant="gradient" size="lg" href={ROUTES.jobs} pill glow>
                Browse all jobs
              </Button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            FEATURES
            ═══════════════════════════════════ */}
        <section id="features" className="py-16 lg:py-24 bg-[var(--bg-surface)]" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
            <ScrollReveal direction="up">
              <SectionHeader
                id="features-heading"
                badge="Platform Features"
                badgeVariant="brand"
                heading="Everything you need — nothing you don't"
                subheading="Clean, fast, and easy. RozeDesk does one thing well: connect people with jobs."
                align="center"
              />
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feat, i) => (
                <ScrollReveal key={feat.title} direction="up" delay={i * 55} className="h-full">
                  <FeatureCard
                    icon={feat.icon}
                    title={feat.title}
                    description={feat.description}
                    accentColor={feat.accentColor}
                    badge={(feat as { badge?: string }).badge}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            TESTIMONIALS
            ═══════════════════════════════════ */}
        <section id="testimonials" className="py-16 lg:py-24" aria-labelledby="testimonials-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
            <ScrollReveal direction="up">
              <SectionHeader
                id="testimonials-heading"
                badge="Success Stories"
                badgeVariant="brand"
                heading="People who found their next role here"
                subheading="Real results from real people who registered, applied, and got hired."
                align="center"
              />
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TESTIMONIALS.slice(0, 3).map((t, i) => (
                <ScrollReveal key={t.name} direction="up" delay={i * 80} className="h-full">
                  <TestimonialCard {...t} />
                </ScrollReveal>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:px-[16.7%]">
              {TESTIMONIALS.slice(3, 5).map((t, i) => (
                <ScrollReveal key={t.name} direction="up" delay={i * 80} className="h-full">
                  <TestimonialCard {...t} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            FAQ
            ═══════════════════════════════════ */}
        <section id="faq" className="py-16 lg:py-24 bg-[var(--bg-surface)]" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <ScrollReveal direction="up">
              <SectionHeader
                id="faq-heading"
                badge="FAQ"
                badgeVariant="brand"
                heading="Common questions"
                subheading="Still have a question? Contact us and we'll reply within a few hours."
                align="center"
              />
            </ScrollReveal>
            <div className="flex flex-col gap-3">
              {FAQS.map((faq, i) => (
                <ScrollReveal key={faq.q} direction="up" delay={i * 45}>
                  <FAQItem question={faq.q} answer={faq.a} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════
            FINAL CTA
            ═══════════════════════════════════ */}
        <section className="py-24 lg:py-32 relative overflow-hidden" aria-label="Get started">
          <div
            className="absolute inset-0 -z-10"
            style={{ background: "linear-gradient(135deg,var(--brand-700) 0%,var(--brand-500) 45%,var(--accent-400) 100%)", backgroundSize: "300% 300%", animation: "gradient-shift 8s ease infinite" }}
            aria-hidden="true"
          />
          <div className="absolute top-8 left-[5%] w-40 h-40 rounded-full bg-white/10 animate-float-slow" aria-hidden="true" />
          <div className="absolute bottom-8 right-[8%] w-28 h-28 rounded-full bg-white/10 animate-float" aria-hidden="true" />

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-7">
            <ScrollReveal direction="scale">
              <Badge variant="gradient" className="!bg-white/20 !text-white !border-white/30">
                Free to join. Free to apply.
              </Badge>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <h2 className="text-white font-black text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-tight">
                Ready to find your<br />next opportunity?
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={160}>
              <p className="text-white/80 text-[clamp(1rem,2vw,1.15rem)] leading-relaxed max-w-md">
                Register in 2 minutes, browse thousands of jobs, and apply today.
                No CV required to get started.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={240}>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button
                  variant="secondary"
                  size="xl"
                  href={ROUTES.signUp}
                  pill
                  className="!bg-white !text-[var(--brand-600)] hover:!bg-[var(--gray-50)] hover:shadow-xl"
                  iconRight={
                    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Register Free
                </Button>
                <Button
                  variant="ghost"
                  size="xl"
                  href={ROUTES.contact}
                  pill
                  className="!text-white hover:!bg-white/15"
                >
                  Have a question?
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
