/**
 * /terms — Terms of Service for HUNT gaming platform.
 * All references to job portal / RozeDesk removed — this is a PKR gaming app.
 * DRY: SECTIONS array drives all content — zero inline data in JSX.
 */
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { BRAND, GAME } from "@/lib/gameConstants";

interface Section { title: string; body: string }

const SECTIONS: Section[] = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using ${BRAND.name}, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree to these Terms, you must not use the platform. Continued use constitutes acceptance of any updates to these Terms.`,
  },
  {
    title: "2. Platform Description",
    body: `${BRAND.name} is an online skill-based game where registered hunters deposit PKR, place wagers, and attempt to secure a multiplier before the eagle escapes. Winnings are calculated as wager × multiplier at the moment the hunter presses SECURE. The platform operates via manual deposit verification — no automated payment gateway is used.`,
  },
  {
    title: "3. Eligibility",
    body: "You must be at least 18 years of age to register and play. By creating an account you confirm that you meet the age requirement and that participation in skill-based wagering is lawful in your jurisdiction. The platform reserves the right to request age or identity verification at any time.",
  },
  {
    title: "4. Account Registration",
    body: "You must register a free account using a valid Pakistani mobile number. You are responsible for keeping your credentials confidential. You may not share your account with or transfer it to any other person. You agree to provide accurate, current, and complete information during registration.",
  },
  {
    title: "5. Deposits",
    body: `Deposits are made via JazzCash or Easypaisa by sending funds to the configured platform account, then uploading a screenshot as proof. The minimum deposit is Rs. ${GAME.MIN_DEPOSIT}. Deposits are credited after manual admin verification, typically within one hour. ${BRAND.name} is not responsible for delays caused by incorrect payment details or missing screenshots.`,
  },
  {
    title: "6. Wagering and Game Rules",
    body: `The minimum wager per hunt is Rs. ${GAME.MIN_WAGER} and the maximum is Rs. ${GAME.MAX_WAGER}. Once a session is started the wager is deducted from your balance immediately. If you press SECURE before the eagle escapes, you win your wager multiplied by the live multiplier at that instant. If the eagle escapes before you act, the wager is forfeited. There are no refunds for lost rounds.`,
  },
  {
    title: "7. Withdrawals",
    body: `The minimum withdrawal is Rs. ${GAME.MIN_WITHDRAW}. Withdrawal requests are processed manually to JazzCash or Easypaisa. Processing time is typically within 24 hours. ${BRAND.name} reserves the right to request identity verification before processing any withdrawal.`,
  },
  {
    title: "8. Fair Play and Prohibited Conduct",
    body: `You may not use automated tools, scripts, bots, or any software to gain an unfair advantage. You may not attempt to manipulate game sessions, forge payment receipts, or exploit platform vulnerabilities. Any account found engaging in fraudulent activity will be permanently suspended and balances forfeited. ${BRAND.name} reserves the right to void sessions suspected of manipulation.`,
  },
  {
    title: "9. Account Suspension and Termination",
    body: `${BRAND.name} may suspend or terminate your account at any time for violation of these Terms, suspected fraud, or at our sole discretion. Upon termination, remaining balance may be withdrawn subject to identity verification and review.`,
  },
  {
    title: "10. Limitation of Liability",
    body: `${BRAND.name} provides the platform on an "as is" basis. We make no guarantees of continuous availability. To the maximum extent permitted by applicable law, ${BRAND.name} shall not be liable for any indirect, incidental, or consequential damages arising from use of the platform, including but not limited to lost wagers, server outages, or connectivity issues.`,
  },
  {
    title: "11. Intellectual Property",
    body: `All content, branding, game mechanics, and code on ${BRAND.name} are owned by or licensed to the platform operator. You may not reproduce, distribute, or create derivative works without express written permission.`,
  },
  {
    title: "12. Changes to Terms",
    body: "We may update these Terms at any time. We will notify registered users of material changes via the platform. Continued use after changes constitutes acceptance of the revised Terms.",
  },
  {
    title: "13. Contact",
    body: `For questions about these Terms, contact us at support@${BRAND.name.toLowerCase()}.com or via the Contact page.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="pt-16 min-h-screen bg-[var(--bg-base)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

          <div className="flex flex-col gap-3 mb-10">
            <h1 className="text-[var(--text-primary)] font-black text-4xl tracking-tight">
              Terms of Service
            </h1>
            <p className="text-[var(--text-muted)] text-sm">Last updated: October 2026</p>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed">
              Please read these Terms carefully before playing {BRAND.name}.
              By registering you agree to all terms below.
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
