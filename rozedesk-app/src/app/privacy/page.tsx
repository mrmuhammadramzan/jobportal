/**
 * /privacy — Privacy Policy.
 */
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const SECTIONS = [
  { title:"1. Information We Collect", body:"We collect information you provide directly: name, email address, phone number, CV files, and payment receipts. We also collect usage data such as pages visited and search queries." },
  { title:"2. How We Use Your Information", body:"We use your information to process job applications, verify payments, communicate with you about your applications, and improve the platform. We do not sell your personal data to third parties." },
  { title:"3. Payment Information", body:"Payment receipts and transaction references are collected to verify application fees. We do not store full payment account numbers. Payment processing is handled by JazzCash and Easypaisa." },
  { title:"4. Data Sharing", body:"Your application details (name, email, phone, CV) are shared with the hiring team only after your payment receipt has been approved. We do not share your data with advertisers." },
  { title:"5. Data Security", body:"We implement reasonable security measures to protect your personal information. However, no method of internet transmission is 100% secure." },
  { title:"6. Data Retention", body:"We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your account by contacting privacy@rozedesk.com." },
  { title:"7. Cookies", body:"We use essential cookies to maintain your session. We do not use advertising cookies or sell data to ad networks." },
  { title:"8. Your Rights", body:"You have the right to access, correct, or delete your personal data. Contact privacy@rozedesk.com to exercise these rights." },
  { title:"9. Contact", body:"For privacy questions or data requests, contact us at privacy@rozedesk.com." },
];

export default function PrivacyPage() {
  return (
    <>
      <NavBar />
      <main id="main-content" className="pt-16 min-h-screen bg-[var(--bg-base)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-col gap-3 mb-10">
            <h1 className="text-[var(--text-primary)] font-black text-4xl tracking-tight">Privacy Policy</h1>
            <p className="text-[var(--text-muted)] text-sm">Last updated: September 13, 2026</p>
            <p className="text-[var(--text-secondary)] text-base leading-relaxed">
              This Privacy Policy explains how RozeDesk collects, uses, and protects your information.
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
