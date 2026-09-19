"use client";
/**
 * /contact — Contact page.
 * Frontend SOP §7: visible labels, blur validation, all 3 async states.
 */
import React, { useState, useCallback } from "react";
import NavBar    from "@/components/NavBar";
import Footer    from "@/components/Footer";
import FormInput from "@/components/FormInput";
import Button    from "@/components/Button";

function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const CONTACT_INFO = [
  { icon:"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label:"Email", value:"hello@rozedesk.com" },
  { icon:"M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", label:"Phone", value:"+92 300 000 0000" },
  { icon:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", label:"Location", value:"Lahore, Pakistan" },
];

type SendState = "idle"|"sending"|"sent"|"error";

export default function ContactPage() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendState, setSendState] = useState<SendState>("idle");

  const [sendError, setSendError] = useState("");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSendState("sending"); setSendError("");
    try {
      const res  = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to send.");
      setSendState("sent");
    } catch (e: unknown) {
      setSendState("error");
      setSendError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }, [name, email, subject, message]);

  return (
    <>
      <NavBar />
      <main id="main-content" className="pt-16 min-h-screen bg-[var(--bg-base)]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-[var(--text-primary)] font-black text-4xl tracking-tight">Get In Touch</h1>
            <p className="text-[var(--text-secondary)] text-lg mt-2">We usually respond within a few hours.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact info */}
            <div className="flex flex-col gap-6">
              {CONTACT_INFO.map(c => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--brand-500)_12%,transparent)] flex items-center justify-center text-[var(--brand-500)] flex-shrink-0">
                    <Icon path={c.icon} className="w-5 h-5"/>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)] text-sm">{c.label}</p>
                    <p className="text-[var(--text-secondary)] text-sm">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              {sendState === "sent" ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
                  <div className="w-14 h-14 rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] flex items-center justify-center">
                    <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-8 h-8 text-[var(--color-success)]"/>
                  </div>
                  <p className="font-black text-[var(--text-primary)] text-xl">Message Sent!</p>
                  <p className="text-[var(--text-secondary)] text-sm">We'll get back to you within a few hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate
                  className="flex flex-col gap-5 p-6 rounded-[var(--radius-xl)] bg-[var(--bg-elevated)] border border-[var(--border-default)]">
                  {sendState === "error" && sendError && (
                    <div role="alert" className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-error)_20%,transparent)]">
                      <Icon path="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4 text-[var(--color-error)] flex-shrink-0 mt-0.5"/>
                      <p className="text-xs font-medium text-[var(--color-error)]">{sendError}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormInput label="Your Name" name="name" type="text" size="lg" required value={name} onChange={e=>setName(e.target.value)} placeholder="Ahmed Khan"/>
                    <FormInput label="Email Address" name="email" type="email" size="lg" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
                  </div>
                  <FormInput label="Subject" name="subject" type="text" size="lg" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="How can we help?"/>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-message" className="text-sm font-medium text-[var(--text-primary)]">
                      Message <span className="text-[var(--color-error)]" aria-hidden="true">*</span>
                    </label>
                    <textarea id="contact-message" rows={5} value={message} onChange={e=>setMessage(e.target.value)} required
                      placeholder="Tell us what's on your mind…"
                      className="w-full px-3 py-2.5 rounded-[var(--radius-md)] border bg-[var(--bg-base)] border-[var(--border-default)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--brand-500)] focus:ring-2 focus:ring-[var(--brand-500)]/20 transition-all resize-none"/>
                  </div>
                  <Button type="submit" variant="gradient" size="lg" pill fullWidth loading={sendState==="sending"}>
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
