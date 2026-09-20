/**
 * mailer.ts — RozeDesk transactional email service.
 *
 * Uses Resend (HTTPS API) in production — immune to Railway's SMTP port blocks.
 * Falls back to Nodemailer SMTP in development.
 *
 * ENV VARS:
 *   RESEND_API_KEY   — Resend API key (production, get from resend.com)
 *   RESEND_FROM      — From address verified in Resend (e.g. "RozeDesk <noreply@yourdomain.com>")
 *                      Falls back to SMTP_FROM if not set.
 *   SMTP_HOST        — SMTP host (dev only, e.g. smtp.gmail.com)
 *   SMTP_PORT        — SMTP port (dev only, e.g. 587)
 *   SMTP_USER        — SMTP user (dev only)
 *   SMTP_PASS        — SMTP app password (dev only)
 *   SMTP_FROM        — From address (dev only)
 *
 * DRY: one mailer module, all templates defined here.
 * Backend SOP §7: every external call has timeout and defined failure behaviour.
 */

import nodemailer from "nodemailer";

/* ── Dynamic Resend import (only used in production when RESEND_API_KEY is set) ── */
async function sendViaResend(to: string, subject: string, html: string, text: string): Promise<void> {
  /* Dynamic import so nodemailer-only builds don't require resend package */
  const { Resend } = await import("resend");
  const client = new Resend(process.env.RESEND_API_KEY!);
  const from   = process.env.RESEND_FROM ?? process.env.SMTP_FROM ?? "RozeDesk <onboarding@resend.dev>";

  const { error } = await client.emails.send({ from, to, subject, html, text });
  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
}

/* ── Nodemailer SMTP (dev fallback) ── */
async function sendViaSMTP(to: string, subject: string, html: string, text: string): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  const from = process.env.SMTP_FROM ?? "RozeDesk <noreply@rozedesk.com>";

  if (!host || !user || !pass) {
    throw new Error(
      `SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS.\n` +
      `host=${host ?? "NOT SET"} user=${user ?? "NOT SET"} pass=${pass ? "SET" : "NOT SET"}`
    );
  }

  const transporter = nodemailer.createTransport({
    host, port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 15_000,
    greetingTimeout:   10_000,
    socketTimeout:     20_000,
  });

  await transporter.sendMail({ from, to, subject, html, text });
}

/* ── Unified send function — Resend in prod, SMTP in dev ── */
async function send(to: string, subject: string, html: string, text: string): Promise<void> {
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(to, subject, html, text);
  }
  return sendViaSMTP(to, subject, html, text);
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/* ── Base HTML wrapper ─────────────────────────────────────────────────────── */
function htmlWrapper(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RozeDesk</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#2563eb,#0ea5e9);padding:28px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">RozeDesk</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Pakistan's Job Board</p>
          </td>
        </tr>
        <tr><td style="padding:32px;">${body}</td></tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #e5e7eb;background:#f9fafb;">
            <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
              © ${new Date().getFullYear()} RozeDesk · 
              <a href="${APP_URL}" style="color:#2563eb;text-decoration:none;">rozedesk.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ── Email templates ─────────────────────────────────────────────────────── */

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const firstName = name.split(" ")[0];
  const html = htmlWrapper(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Welcome, ${firstName}! 🎉</h2>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
      Your RozeDesk account is ready. Browse jobs and apply with a single click.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:linear-gradient(135deg,#2563eb,#0ea5e9);border-radius:8px;">
          <a href="${APP_URL}/jobs" style="display:inline-block;padding:12px 28px;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;">
            Browse Open Jobs →
          </a>
        </td>
      </tr>
    </table>
  `);
  await send(to, "Welcome to RozeDesk — Your account is ready", html,
    `Welcome ${name}! Your RozeDesk account is ready. Browse jobs at ${APP_URL}/jobs`);
}

export async function sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<void> {
  const resetUrl  = `${APP_URL}/reset-password?token=${resetToken}`;
  const firstName = name.split(" ")[0];
  const html = htmlWrapper(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Reset your password</h2>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
      Hi ${firstName}, click the button below to reset your password. This link expires in <strong>1 hour</strong>.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:linear-gradient(135deg,#2563eb,#0ea5e9);border-radius:8px;">
          <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;">
            Reset Password →
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Or copy this link:</p>
    <p style="margin:0 0 16px;color:#2563eb;font-size:12px;word-break:break-all;">${resetUrl}</p>
    <p style="margin:16px 0 0;padding:12px 16px;background:#fef3c7;border-radius:8px;color:#92400e;font-size:13px;">
      ⚠️ If you didn't request this, ignore this email.
    </p>
  `);
  await send(to, "Reset your RozeDesk password", html,
    `Reset your password: ${resetUrl} (expires in 1 hour)`);
}

export async function sendApplicationConfirmationEmail(
  to: string, name: string, jobTitle: string, company: string
): Promise<void> {
  const firstName = name.split(" ")[0];
  const html = htmlWrapper(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Application submitted ✓</h2>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
      Hi ${firstName}, your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been received.
    </p>
    <div style="padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin:16px 0;">
      <p style="margin:0;color:#166534;font-size:14px;font-weight:600;">✓ Payment receipt submitted — under review</p>
    </div>
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:#f3f4f6;border-radius:8px;">
          <a href="${APP_URL}/dashboard/applications" style="display:inline-block;padding:12px 28px;color:#374151;font-weight:700;font-size:14px;text-decoration:none;">
            Track Your Application →
          </a>
        </td>
      </tr>
    </table>
  `);
  await send(to, `Application received — ${jobTitle} at ${company}`, html,
    `Your application for ${jobTitle} at ${company} has been received.`);
}

export async function sendPaymentApprovedEmail(
  to: string, name: string, jobTitle: string, company: string
): Promise<void> {
  const firstName = name.split(" ")[0];
  const html = htmlWrapper(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Payment approved ✓</h2>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
      Great news, ${firstName}! Your payment for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been verified. Your CV is now under review.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:linear-gradient(135deg,#2563eb,#0ea5e9);border-radius:8px;">
          <a href="${APP_URL}/dashboard/applications" style="display:inline-block;padding:12px 28px;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;">
            View Application Status →
          </a>
        </td>
      </tr>
    </table>
  `);
  await send(to, `Payment approved — ${jobTitle} at ${company}`, html,
    `Your payment for ${jobTitle} at ${company} has been approved.`);
}

export async function sendPaymentRejectedEmail(
  to: string, name: string, jobTitle: string, reason: string
): Promise<void> {
  const firstName = name.split(" ")[0];
  const html = htmlWrapper(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Payment not accepted</h2>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
      Hi ${firstName}, your payment receipt for <strong>${jobTitle}</strong> was not accepted.
    </p>
    <div style="padding:16px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;margin:16px 0;">
      <p style="margin:0;color:#991b1b;font-size:14px;font-weight:600;">Reason: ${reason}</p>
    </div>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;">Please resubmit with a valid receipt.</p>
  `);
  await send(to, `Payment not accepted — ${jobTitle}`, html,
    `Your payment for ${jobTitle} was not accepted. Reason: ${reason}`);
}
