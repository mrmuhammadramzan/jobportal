/**
 * /terms — Terms of Service.
 */
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const SECTIONS = [
  { title:"1. Acceptance of Terms", body:"By accessing or using RozeDesk, you agree to be bound by these Terms of Service. If you do not agree to all the terms, you may not use the platform." },
  { title:"2. Service Description", body:`RozeDesk is a job board platform that allows job seekers to browse and apply for positions posted by the platform administrators. Job seekers pay a PKR ${process.env.NEXT_PUBLIC_APP_FEE ?? "150"} application fee per submission.` },
  { title:"3. User Accounts", body:"You must register a free account to apply for jobs. You are responsible for maintaining the confidentiality of your credentials. You agree to provide accurate, current, and complete information." },
  { title:"4. Application Fee", body:`Each job application requires a PKR ${process.env.NEXT_PUBLIC_APP_FEE ?? "150"} fee, payable via JazzCash or Easypaisa. Fees are non-refundable once an application has been approved and forwarded to the hiring team. Refunds may be issued at our discretion if a listing is removed before review.` },
  { title:"5. Prohibited Conduct", body:"You may not use RozeDesk for any unlawful purpose, to submit false information, to harass other users, or to attempt to access the platform's systems without authorisation." },
  { title:"6. Intellectual Property", body:"All content, design, and code on RozeDesk is owned by or licensed to RozeDesk. You may not reproduce, distribute, or create derivative works without express written permission." },
  { title:"7. Limitation of Liability", body:"RozeDesk provides the platform on an 'as is' basis. We make no guarantees regarding employment outcomes. To the maximum extent permitted by law, RozeDesk shall not be liable for any indirect, incidental, or consequential damages." },
  { title:"8. Changes to Terms", body:"We may update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new Terms." },
  { title:"9. Contact", body:"For questions about these Terms, contact us at legal@rozedesk.com." },
];

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="pt-16 min-h-screen bg-[var(--bg-base)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-col gap-3 mb-10">
            <h1 className="text-[var(--text-primary)] font-black text-4xl tracking-tight">Terms of Service</h1>
            <p className="text-[var(--text-muted)] text-sm">Last updated: September 13, 2026</p>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed">
              Please read these Terms of Service carefully before using RozeDesk.
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
