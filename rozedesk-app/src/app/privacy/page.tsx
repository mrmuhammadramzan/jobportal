/**
 * /privacy — Privacy Policy for HUNT gaming platform.
 * All references to job portal / RozeDesk removed — this is a PKR gaming app.
 * DRY: SECTIONS array drives all content — zero inline data in JSX.
 */
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { BRAND } from "@/lib/gameConstants";

interface Section { title: string; body: string }

const SECTIONS: Section[] = [
  {
    title: "1. Information We Collect",
    body: `When you register on ${BRAND.name} we collect your full name and Pakistani mobile number. When you make a deposit we collect payment screenshots and transaction references. We also collect gameplay data including session outcomes, wager amounts, and multipliers reached. We may collect device and browser information for security and fraud prevention purposes.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use your information to operate your account, process deposits and withdrawals, verify payments, detect fraudulent activity, and communicate important account updates. We do not use your data for advertising or sell it to any third parties.`,
  },
  {
    title: "3. Payment Information",
    body: "Payment screenshots are collected solely to verify that funds were sent to the platform's configured account. We do not store complete JazzCash or Easypaisa account numbers. Screenshots are retained for audit and dispute resolution purposes and are accessible only to platform administrators.",
  },
  {
    title: "4. Gameplay Data",
    body: "Session data (wager amounts, multipliers, wins, losses) is stored to calculate balances accurately, resolve disputes, and detect manipulation. This data is not shared with any third party.",
  },
  {
    title: "5. Data Sharing",
    body: `${BRAND.name} does not sell, trade, or rent your personal data. We may share information with law enforcement or regulatory authorities if required by applicable law or court order.`,
  },
  {
    title: "6. Data Security",
    body: "We implement reasonable technical and organisational security measures including encrypted connections (HTTPS), hashed passwords (bcrypt), and restricted admin access. No internet transmission is completely secure — you acknowledge this inherent risk when using the platform.",
  },
  {
    title: "7. Data Retention",
    body: `We retain your account data for as long as your account is active. If you request account deletion, we will remove your personal data within 30 days, except where retention is required for legal, audit, or fraud prevention obligations. To request deletion, contact privacy@${BRAND.name.toLowerCase()}.com.`,
  },
  {
    title: "8. Cookies",
    body: "We use essential cookies to maintain your authenticated session. We do not use advertising cookies, tracking pixels, or third-party analytics that share data outside the platform.",
  },
  {
    title: "9. Your Rights",
    body: `You have the right to access the personal data we hold about you, request corrections, or request deletion. You may also request a copy of your gameplay and transaction history. To exercise any of these rights, contact privacy@${BRAND.name.toLowerCase()}.com.`,
  },
  {
    title: "10. Changes to This Policy",
    body: "We may update this Privacy Policy as the platform evolves. Material changes will be communicated via the platform. Continued use after changes constitutes acceptance of the revised Policy.",
  },
  {
    title: "11. Contact",
    body: `For privacy questions or data requests, contact us at privacy@${BRAND.name.toLowerCase()}.com or via the Contact page on the platform.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="pt-16 min-h-screen bg-[var(--bg-base)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

          <div className="flex flex-col gap-3 mb-10">
            <h1 className="text-[var(--text-primary)] font-black text-4xl tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-[var(--text-muted)] text-sm">Last updated: October 2026</p>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed">
              This Privacy Policy explains how {BRAND.name} collects, uses, and protects
              your personal information when you use the platform.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {SECTIONS.map(s => (
              <div key={s.title} className="flex flex-col gap-2">
                <h2 className="font-bold text-[var(--text-primary)] text-lg">{s.title}</h2>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
