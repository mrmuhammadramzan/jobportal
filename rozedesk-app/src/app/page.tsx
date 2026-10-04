/**
 * HUNT — Landing Page
 * ─────────────────────────────────────────
 * Sections: NavBar → Hero → How It Works → Milestones →
 *           Stats → Features → Testimonials → FAQ → CTA → Footer
 *
 * DRY: all data in typed const arrays; zero inline hex; CSS var tokens only.
 * OOP: typed interfaces per data shape.
 * Theme: gold/amber HUNT palette — extracted from hunt-logo.png.
 */
import React           from "react";
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
import { ROUTES }      from "@/lib/routes";
import { GAME }        from "@/lib/gameConstants";

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

interface Stat { value: number; suffix: string; label: string; description: string; decimals: number }
const STATS: Stat[] = [
  { value: 1240,   suffix: "+",   label: "Active Hunters",    description: "Registered and hunting today",        decimals: 0 },
  { value: 385000, suffix: "+",   label: "PKR Paid Out",      description: "Real winnings sent to players",       decimals: 0 },
  { value: 98,     suffix: "%",   label: "Payout Rate",       description: "Approved withdrawals processed",      decimals: 0 },
  { value: GAME.MIN_DEPOSIT, suffix: " Rs", label: "Min. Deposit", description: "Start hunting in minutes",        decimals: 0 },
];

interface Step { num: string; title: string; description: string; iconPath: string }
const STEPS: Step[] = [
  {
    num: "01",
    title: "Register Free",
    description: "Create your hunter account in under 2 minutes. No credit card, no hidden fees.",
    iconPath: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    num: "02",
    title: "Deposit & Hunt",
    description: `Deposit min Rs. ${GAME.MIN_DEPOSIT} via JazzCash or Easypaisa. Pick your wager and start the hunt.`,
    iconPath: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
  {
    num: "03",
    title: "Secure & Earn",
    description: "Watch the eagle fly as your multiplier climbs. Press SECURE before it escapes — your wager × multiplier is yours.",
    iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

interface Milestone { mult: string; earn: string; note: string; highlight: boolean }
const MILESTONES: Milestone[] = [
  { mult: "1.5×",  earn: "+50% of wager",  note: "Early secure",   highlight: false },
  { mult: "2×",    earn: "+100% of wager", note: "Double up",      highlight: false },
  { mult: "3×",    earn: "+200% of wager", note: "Triple threat",  highlight: false },
  { mult: "5×",    earn: "+400% of wager", note: "High risk",      highlight: true  },
  { mult: "10×",   earn: "+900% of wager", note: "Eagle's peak",   highlight: true  },
];

interface Feature { iconPath: string; title: string; description: string; accentColor: string; badge?: string }
const FEATURES: Feature[] = [
  {
    iconPath: "M5 3l14 9-14 9V3z",
    title: "Track the Eagle",
    description: "Watch the eagle fly as your multiplier climbs. Secure at the right moment — hesitate and it escapes.",
    accentColor: "color-mix(in srgb,var(--brand-500) 12%,transparent)",
    badge: "HUNT GAME",
  },
  {
    iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8",
    title: "Real PKR Earnings",
    description: "Score milestones pay real money — credited instantly to your wallet. Withdraw anytime.",
    accentColor: "color-mix(in srgb,var(--color-success) 12%,transparent)",
    badge: "REAL MONEY",
  },
  {
    iconPath: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    title: "JazzCash & Easypaisa",
    description: "Deposit and withdraw via Pakistan's most trusted mobile wallets. Fast, secure, instant.",
    accentColor: "color-mix(in srgb,var(--accent-500) 12%,transparent)",
  },
  {
    iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Instant Balance Updates",
    description: "Secure the hunt and see your balance update live. No waiting, no delays, no fine print.",
    accentColor: "color-mix(in srgb,var(--color-warning) 12%,transparent)",
  },
  {
    iconPath: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    title: "Admin-Verified Deposits",
    description: "Upload your payment screenshot and our team credits your balance — usually within the hour.",
    accentColor: "color-mix(in srgb,var(--brand-500) 12%,transparent)",
  },
  {
    iconPath: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    title: "Hunter Dashboard",
    description: "Track your balance, hunt history, best multipliers, and total earnings all in one place.",
    accentColor: "color-mix(in srgb,var(--fire-500) 10%,transparent)",
  },
];

interface Testimonial {
  quote: string; name: string; role: string; company: string;
  avatar: string; avatarColor: string; rating: number; featured: boolean;
}
const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Hit 7× on my second game and withdrew Rs. 840 the same evening. The eagle flew and I secured it at the perfect moment.",
    name: "Bilal Hassan", role: "Hunter", company: "HUNT",
    avatar: "BH", avatarColor: "var(--brand-500)", rating: 5, featured: true,
  },
  {
    quote: "Deposited Rs. 200, secured at 4× — earned Rs. 800 back. Already my favourite way to earn online.",
    name: "Ayesha Malik", role: "Hunter", company: "HUNT",
    avatar: "AM", avatarColor: "var(--accent-400)", rating: 5, featured: false,
  },
  {
    quote: "JazzCash deposit was instant. Balance credited in 30 minutes. Fair, transparent, and actually thrilling.",
    name: "Usman Tariq", role: "Hunter", company: "HUNT",
    avatar: "UT", avatarColor: "var(--fire-400)", rating: 5, featured: false,
  },
];

interface FAQ { q: string; a: string }
const FAQS: FAQ[] = [
  { q: "Is HUNT free to join?",            a: "Yes — registration is completely free. You only spend when you deposit and wager on a hunt." },
  { q: "What is the minimum deposit?",     a: `Minimum deposit is Rs. ${GAME.MIN_DEPOSIT}. Minimum wager per hunt is Rs. ${GAME.MIN_WAGER}. No maximum limit.` },
  { q: "How do I deposit?",                a: "Send payment via JazzCash or Easypaisa, screenshot the transaction, upload it in your wallet. Admin verifies — usually within an hour." },
  { q: "How do I earn money?",             a: "Watch the eagle fly as the multiplier climbs. Press SECURE at any moment — your winnings are wager × multiplier at that instant. The higher the multiplier when you secure, the more you earn." },
  { q: "What happens if I don't secure?",  a: "If the eagle escapes before you press SECURE, the hunt is lost and your wager is forfeited. Timing is everything." },
  { q: "How do I withdraw?",               a: "Winnings go to your in-app wallet. Contact support to withdraw to JazzCash or Easypaisa." },
];

/* ══════════════════════════════════════
   PAGE
   ══════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      <NavBar />
      <main id="main-content">

        {/* ═══════════════════
            HERO
            ═══════════════════ */}
        <section
          className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-16"
          aria-label="HUNT — hunt the eagle, earn real PKR"
        >
          {/* Ambient bg — gold/amber radials */}
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div className="absolute top-[-8%] left-[10%] w-[500px] h-[500px] rounded-full opacity-15"
              style={{ background: "radial-gradient(circle,var(--brand-500) 0%,transparent 70%)", animation: "blob-morph 14s ease-in-out infinite,floatSlow 10s ease-in-out infinite" }} />
            <div className="absolute top-[30%] right-[5%] w-[300px] h-[300px] rounded-full opacity-10"
              style={{ background: "radial-gradient(circle,var(--fire-400) 0%,transparent 70%)", animation: "floatSlow 12s ease-in-out infinite 3s" }} />
            <div className="absolute bottom-[8%] left-[35%] w-[240px] h-[240px] rounded-full opacity-08"
              style={{ background: "radial-gradient(circle,var(--gold-bright) 0%,transparent 70%)", animation: "floatSlow 16s ease-in-out infinite 6s" }} />
            {/* Subtle dot grid */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: "radial-gradient(circle,var(--brand-400) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
            <div className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse 90% 70% at 50% 0%,transparent 0%,var(--bg-base) 100%)" }} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center gap-8">

            {/* Hunt logo hero */}
            <ScrollReveal direction="scale">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/branding/hunt-logo.png"
                alt="HUNT"
                className="w-[clamp(180px,30vw,280px)] object-contain drop-shadow-[0_0_40px_rgba(245,166,35,0.5)] animate-float-slow"
              />
            </ScrollReveal>

            <ScrollReveal direction="scale" delay={40}>
              <Badge variant="gradient" dot glow>
                1,200+ active hunters earning today
              </Badge>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal direction="up" delay={80}>
              <h1 className="font-black leading-[1.05] tracking-tight text-[clamp(2.2rem,6.5vw,4.5rem)] text-[var(--text-primary)] max-w-3xl">
                Hunt the Eagle.{" "}
                <span className="gradient-text">
                  <TypewriterText
                    words={["Secure the multiplier","Earn wager × multiplier","Withdraw real PKR","Press SECURE to win"]}
                    speed={60} deleteSpeed={35} pauseTime={2400}
                  />
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={160}>
              <p className="text-[var(--text-secondary)] text-[clamp(1rem,2.5vw,1.2rem)] leading-relaxed max-w-lg">
                Deposit Rs. {GAME.MIN_DEPOSIT}, watch the eagle fly, and press SECURE at the perfect multiplier.
                The higher you wait, the more you earn. Every hunt pays instantly.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={240}>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button variant="gradient" size="xl" href={ROUTES.signUp} pill glow
                  icon={<Icon path="M5 3l14 9-14 9V3z" className="w-5 h-5"/>}>
                  Start Hunting — Register Free
                </Button>
                <Button variant="outline" size="xl" href="#how-it-works" pill>
                  How It Works
                </Button>
              </div>
            </ScrollReveal>

            {/* Prize chips */}
            <ScrollReveal direction="up" delay={320}>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-[var(--text-muted)] font-medium">Prize guide:</span>
                {[
                  { label: `Min wager: Rs. ${GAME.MIN_WAGER}`, color: "var(--brand-500)"      },
                  { label: "2× = double",                       color: "var(--fire-400)"       },
                  { label: "5× = 5× your wager",               color: "var(--color-success)"  },
                  { label: "Withdraw anytime",                  color: "var(--color-warning)"  },
                ].map(chip => (
                  <span key={chip.label}
                    className="px-3 py-1 rounded-full border font-semibold text-[var(--text-secondary)] hover:text-[var(--brand-400)] transition-colors cursor-default"
                    style={{ borderColor: `color-mix(in srgb,${chip.color} 35%,var(--border-default))`, background: `color-mix(in srgb,${chip.color} 6%,transparent)` }}>
                    {chip.label}
                  </span>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <p className="text-[var(--text-muted)] text-sm flex items-center gap-2">
                <Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  className="w-4 h-4 text-[var(--color-success)] flex-shrink-0"/>
                Free to register · Min deposit Rs. {GAME.MIN_DEPOSIT} · Withdraw anytime
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════
            HOW IT WORKS
            ═══════════════════ */}
        <section id="how-it-works" className="py-16 lg:py-24 bg-[var(--bg-surface)]" aria-labelledby="how-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-14">
            <ScrollReveal direction="up">
              <SectionHeader id="how-heading" badge="How It Works" badgeVariant="accent"
                heading="Deposit. Hunt. Earn. Repeat." headingGradient
                subheading="Three steps from registration to real PKR in your wallet."
                align="center" />
            </ScrollReveal>
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <ScrollReveal key={step.num} direction="up" delay={i * 80}>
                  <div className="flex gap-4 p-5 rounded-[var(--radius-xl)] bg-[var(--bg-base)] border border-[var(--border-default)] hover:border-[var(--brand-500)] hover:shadow-[var(--shadow-brand)] hover:-translate-y-1 transition-all duration-[var(--dur-deliberate)]">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,var(--brand-600),var(--brand-500))", boxShadow: "var(--shadow-brand)" }}>
                      <span className="text-[var(--text-inverse)] text-xs font-black">{step.num}</span>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <p className="font-bold text-[var(--text-base)] text-[var(--text-primary)]">{step.title}</p>
                      <p className="text-[var(--text-sm)] text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
                    </div>
                    <div className="w-9 h-9 text-[var(--brand-400)] flex-shrink-0 self-center hidden sm:flex items-center justify-center">
                      <Icon path={step.iconPath} className="w-6 h-6"/>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
              <ScrollReveal direction="up" delay={320}>
                <Button variant="gradient" size="lg" href={ROUTES.signUp} pill glow fullWidth className="mt-2">
                  Start Hunting — Register Free
                </Button>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════
            MILESTONES TABLE
            ═══════════════════ */}
        <section id="earnings" className="py-16 lg:py-24" aria-labelledby="earnings-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <ScrollReveal direction="up">
              <SectionHeader id="earnings-heading" badge="Earn PKR" badgeVariant="brand"
                heading="The higher you secure, the more you earn"
                subheading="Wager any amount. Press SECURE at any multiplier. Your reward = wager × multiplier."
                align="center" />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={80}>
              <div className="rounded-[var(--radius-2xl)] overflow-hidden border border-[var(--border-default)] bg-[var(--bg-elevated)]">
                <div className="grid grid-cols-3 px-5 py-3 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Multiplier</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-center">Earn</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Note</span>
                </div>
                {MILESTONES.map((m, i) => (
                  <div key={m.mult}
                    className={[
                      "grid grid-cols-3 px-5 py-4 transition-colors",
                      i < MILESTONES.length - 1 ? "border-b border-[var(--border-default)]" : "",
                      m.highlight ? "bg-[color-mix(in_srgb,var(--brand-500)_7%,transparent)]" : "hover:bg-[var(--bg-surface)]",
                    ].join(" ")}>
                    <span className={`font-black tabular-nums text-base ${m.highlight ? "gradient-text" : "text-[var(--text-primary)]"}`}>
                      {m.mult}
                    </span>
                    <span className="font-bold text-[var(--color-success)] text-center text-base">{m.earn}</span>
                    <span className="text-[var(--text-muted)] text-sm text-right self-center">
                      {m.note}
                      {m.highlight && (
                        <span className="ml-1.5 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--brand-500)_18%,transparent)] text-[var(--brand-400)]">
                          Key
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={160}>
              <p className="text-center text-[var(--text-muted)] text-xs leading-relaxed">
                Example: Wager Rs. {GAME.MIN_WAGER}, secure at 3× → earn Rs. {GAME.MIN_WAGER * 3} (Rs. {GAME.MIN_WAGER * 3 - GAME.MIN_WAGER} profit). Secure at 5× → earn Rs. {GAME.MIN_WAGER * 5}.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════════════════
            STATS
            ═══════════════════ */}
        <section className="py-16 lg:py-24 bg-[var(--bg-surface)] relative overflow-hidden" aria-label="Platform numbers">
          <div className="absolute inset-0 -z-10 opacity-[0.06]"
            style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%,var(--brand-400),transparent)" }} aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <ScrollReveal direction="up">
              <SectionHeader badge="By The Numbers" badgeVariant="gradient" heading="Hunters are already winning" align="center" />
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {STATS.map((stat, i) => (
                <ScrollReveal key={stat.label} direction="scale" delay={i * 80} className="h-full">
                  <div className="flex flex-col gap-2 p-6 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-[var(--radius-xl)] hover:border-[var(--brand-500)] hover:shadow-[var(--shadow-brand)] hover:-translate-y-1 transition-all duration-[var(--dur-deliberate)] text-center h-full">
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

        {/* ═══════════════════
            FEATURES
            ═══════════════════ */}
        <section className="py-16 lg:py-24" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
            <ScrollReveal direction="up">
              <SectionHeader id="features-heading" badge="Platform Features" badgeVariant="brand"
                heading="Built for hunters. Built for fairness."
                subheading="Thrilling gameplay, instant payouts, transparent rules. Nothing hidden."
                align="center" />
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feat, i) => (
                <ScrollReveal key={feat.title} direction="up" delay={i * 55} className="h-full">
                  <FeatureCard icon={<Icon path={feat.iconPath} />} title={feat.title}
                    description={feat.description} accentColor={feat.accentColor} badge={feat.badge} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════
            TESTIMONIALS
            ═══════════════════ */}
        <section className="py-16 lg:py-24 bg-[var(--bg-surface)]" aria-labelledby="testimonials-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
            <ScrollReveal direction="up">
              <SectionHeader id="testimonials-heading" badge="Hunter Stories" badgeVariant="brand"
                heading="Hunters already earning"
                subheading="Real people. Real deposits. Real PKR in their wallets."
                align="center" />
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t, i) => (
                <ScrollReveal key={t.name} direction="up" delay={i * 80} className="h-full">
                  <TestimonialCard {...t} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════
            FAQ
            ═══════════════════ */}
        <section className="py-16 lg:py-24" aria-labelledby="faq-heading">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
            <ScrollReveal direction="up">
              <SectionHeader id="faq-heading" badge="FAQ" badgeVariant="brand" heading="Common questions" align="center" />
            </ScrollReveal>
            <div className="flex flex-col gap-3">
              {FAQS.map((faq, i) => (
                <ScrollReveal key={faq.q} direction="up" delay={i * 50}>
                  <FAQItem question={faq.q} answer={faq.a} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════
            CTA BANNER
            ═══════════════════ */}
        <section className="py-20 lg:py-28 relative overflow-hidden" aria-labelledby="cta-heading">
          <div className="absolute inset-0 -z-10" aria-hidden="true"
            style={{ background: "linear-gradient(135deg,var(--brand-800) 0%,var(--brand-600) 45%,var(--fire-500) 100%)" }} />
          <div className="absolute inset-0 -z-10 opacity-[0.06]" aria-hidden="true"
            style={{ backgroundImage: "radial-gradient(circle,var(--gold-bright) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
          {/* Gold glow orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full -z-10 opacity-20 blur-3xl"
            style={{ background: "radial-gradient(ellipse,var(--gold-bright),transparent)" }} aria-hidden="true" />

          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 text-center">
            <ScrollReveal direction="scale">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-bright)] animate-pulse" aria-hidden="true"/>
                Free to join
              </span>
            </ScrollReveal>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <ScrollReveal direction="scale" delay={40}>
              <img src="/assets/branding/hunt-logo.png" alt="HUNT" className="w-32 object-contain drop-shadow-[0_0_24px_rgba(255,215,0,0.5)]" />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={80}>
              <h2 id="cta-heading" className="font-black text-white text-[clamp(1.8rem,5vw,3rem)] leading-tight tracking-tight">
                Ready to hunt and earn?
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={160}>
              <p className="text-white/80 text-base leading-relaxed max-w-md">
                Register free, deposit Rs. {GAME.MIN_DEPOSIT}, and secure the eagle for real PKR rewards.
                Every hunt pays. Every multiplier counts.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={240}>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button variant="secondary" size="xl" href={ROUTES.signUp} pill glow
                  icon={<Icon path="M5 3l14 9-14 9V3z" className="w-5 h-5"/>}>
                  Register Free &amp; Hunt
                </Button>
                <Button variant="ghost" size="xl" href={ROUTES.signIn} pill
                  className="text-white border-white/30 hover:bg-white/10">
                  Already have an account
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={320}>
              <p className="text-white/55 text-xs">
                No credit card · Minimum deposit Rs. {GAME.MIN_DEPOSIT} · Withdraw via JazzCash or Easypaisa
              </p>
            </ScrollReveal>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
