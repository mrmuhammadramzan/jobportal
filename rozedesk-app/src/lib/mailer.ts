/**
 * mailer.ts — RozeDesk transactional email service.
 *
 * Uses Nodemailer with SMTP (works with Gmail App Password, Outlook, or any SMTP).
 * All email templates are defined here — DRY, never inline in API routes.
 *
 * Backend SOP §7: every external call has a timeout and defined failure behavior.
 * Backend SOP Hard Rule 2: never swallow errors silently.
 * DRY: one mailer instance, all templates in one file.
 *
 * ENV VARS required in .env.local:
 *   SMTP_HOST      — e.g. smtp.gmail.com
 *   SMTP_PORT      — e.g. 587
 *   SMTP_USER      — your sending email
 *   SMTP_PASS      — app password (NOT your account password)
 *   SMTP_FROM      — display name + address, e.g. "RozeDesk <noreply@rozedesk.com>"
 */
import nodemailer from "nodemailer";

/* ── Transporter singleton ───────────────────────────────────────────────── */
let _transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

/* ── Transporter — created fresh each call in dev to pick up env changes ── */
function getTransporter(): ReturnType<typeof nodemailer.createTransport> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "465", 10);
  const user = process.env.SMTP_USER;
  /* Trim spaces — Gmail App Passwords are often pasted with spaces between groups */
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");

  if (!host || !user || !pass) {
    throw new Error(
      `Email not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in env.\n` +
      `Current: host=${host ?? "NOT SET"} port=${port} user=${user ?? "NOT SET"} pass=${pass ? "***set***" : "NOT SET"}`
    );
  }

  /* Singleton in production, fresh in dev */
  if (_transporter && process.env.NODE_ENV === "production") return _transporter;

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,        /* true = SSL/TLS, false = STARTTLS */
    auth: { user, pass },
    tls: {
      /* Allow self-signed certs in dev; in prod Railway's network is trusted */
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
    connectionTimeout: 15_000,
    greetingTimeout:   10_000,
    socketTimeout:     20_000,
  });

  return _transporter;
}

const FROM = process.env.SMTP_FROM ?? "RozeDesk <noreply@rozedesk.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/* ── Base HTML wrapper ───────────────────────────────────────────────────── */
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
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#2563eb,#0ea5e9);padding:28px 32px;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">RozeDesk</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Pakistan's Job Board</p>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:32px;">${body}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #e5e7eb;background:#f9fafb;">
            <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
              © ${new Date().getFullYear()} RozeDesk · 
              <a href="${APP_URL}" style="color:#2563eb;text-decoration:none;">rozedesk.com</a> · 
              Pakistan's trusted job board
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

/** Welcome email sent after successful registration */
export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const firstName = name.split(" ")[0];
  const html = htmlWrapper(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Welcome, ${firstName}! 🎉</h2>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
      Your RozeDesk account is ready. You can now browse thousands of jobs and apply with a single click.
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
    <p style="margin:0 0 8px;color:#374151;font-size:14px;font-weight:600;">What you can do:</p>
    <ul style="margin:0;padding-left:20px;color:#6b7280;font-size:14px;line-height:2;">
      <li>Browse and filter hundreds of job listings</li>
      <li>Upload your CV to your profile — pre-fills every application</li>
      <li>Set job alerts to get notified of new matches</li>
      <li>Track all your applications in one place</li>
    </ul>
    <p style="margin:20px 0 0;color:#9ca3af;font-size:12px;">
      Application fee: <strong style="color:#374151;">PKR ${process.env.APP_FEE_PKR ?? "150"}</strong> per job application (paid via JazzCash or Easypaisa).
    </p>
  `);

  await getTransporter().sendMail({
    from:    FROM,
    to,
    subject: "Welcome to RozeDesk — Your account is ready",
    html,
    text:    `Welcome ${name}! Your RozeDesk account is ready. Browse jobs at ${APP_URL}/jobs`,
  });
}

/** Password reset email */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetToken: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;
  const firstName = name.split(" ")[0];

  const html = htmlWrapper(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Reset your password</h2>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
      Hi ${firstName}, we received a request to reset your password. Click the button below — this link expires in <strong>1 hour</strong>.
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
    <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Or copy this link into your browser:</p>
    <p style="margin:0 0 16px;color:#2563eb;font-size:12px;word-break:break-all;">${resetUrl}</p>
    <p style="margin:16px 0 0;padding:12px 16px;background:#fef3c7;border-radius:8px;color:#92400e;font-size:13px;">
      ⚠️ If you didn't request this, ignore this email. Your password won't change.
    </p>
  `);

  await getTransporter().sendMail({
    from:    FROM,
    to,
    subject: "Reset your RozeDesk password",
    html,
    text:    `Reset your password: ${resetUrl} (expires in 1 hour)`,
  });
}

/** Application confirmation email sent to seeker after applying */
export async function sendApplicationConfirmationEmail(
  to: string,
  name: string,
  jobTitle: string,
  company: string
): Promise<void> {
  const firstName = name.split(" ")[0];

  const html = htmlWrapper(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Application submitted ✓</h2>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
      Hi ${firstName}, your application for <strong style="color:#111827;">${jobTitle}</strong> at <strong style="color:#111827;">${company}</strong> has been received.
    </p>
    <div style="padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin:16px 0;">
      <p style="margin:0;color:#166534;font-size:14px;font-weight:600;">✓ Payment receipt submitted</p>
      <p style="margin:4px 0 0;color:#166534;font-size:13px;">Admin will verify your payment within a few hours.</p>
    </div>
    <p style="margin:0 0 8px;color:#374151;font-size:14px;font-weight:600;">What happens next:</p>
    <ol style="margin:0;padding-left:20px;color:#6b7280;font-size:14px;line-height:2.2;">
      <li><strong style="color:#374151;">Payment review</strong> — Admin verifies your JazzCash/Easypaisa receipt</li>
      <li><strong style="color:#374151;">CV review</strong> — Hiring team reviews your CV</li>
      <li><strong style="color:#374151;">Status update</strong> — You'll be notified of shortlisting or rejection</li>
    </ol>
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

  await getTransporter().sendMail({
    from:    FROM,
    to,
    subject: `Application received — ${jobTitle} at ${company}`,
    html,
    text:    `Your application for ${jobTitle} at ${company} has been received. Track it at ${APP_URL}/dashboard/applications`,
  });
}

/** Payment approved notification */
export async function sendPaymentApprovedEmail(
  to: string,
  name: string,
  jobTitle: string,
  company: string
): Promise<void> {
  const firstName = name.split(" ")[0];

  const html = htmlWrapper(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Payment approved ✓</h2>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
      Great news, ${firstName}! Your payment for <strong style="color:#111827;">${jobTitle}</strong> at <strong style="color:#111827;">${company}</strong> has been verified.
    </p>
    <div style="padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;margin:16px 0;">
      <p style="margin:0;color:#166534;font-size:14px;font-weight:600;">✓ Your CV is now under review</p>
      <p style="margin:4px 0 0;color:#166534;font-size:13px;">The hiring team will review your application soon.</p>
    </div>
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

  await getTransporter().sendMail({
    from:    FROM,
    to,
    subject: `Payment approved — ${jobTitle} at ${company}`,
    html,
    text:    `Your payment for ${jobTitle} at ${company} has been approved. Your CV is now under review.`,
  });
}

/** Payment rejected notification */
export async function sendPaymentRejectedEmail(
  to: string,
  name: string,
  jobTitle: string,
  reason: string
): Promise<void> {
  const firstName = name.split(" ")[0];

  const html = htmlWrapper(`
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;font-weight:700;">Payment not accepted</h2>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
      Hi ${firstName}, unfortunately your payment receipt for <strong style="color:#111827;">${jobTitle}</strong> was not accepted.
    </p>
    <div style="padding:16px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;margin:16px 0;">
      <p style="margin:0;color:#991b1b;font-size:14px;font-weight:600;">Reason:</p>
      <p style="margin:4px 0 0;color:#991b1b;font-size:13px;">${reason}</p>
    </div>
    <p style="margin:0 0 16px;color:#6b7280;font-size:14px;">Please resubmit your application with a valid receipt.</p>
    <table cellpadding="0" cellspacing="0" style="margin:8px 0;">
      <tr>
        <td style="background:linear-gradient(135deg,#2563eb,#0ea5e9);border-radius:8px;">
          <a href="${APP_URL}/jobs" style="display:inline-block;padding:12px 28px;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;">
            Browse Jobs Again →
          </a>
        </td>
      </tr>
    </table>
  `);

  await getTransporter().sendMail({
    from:    FROM,
    to,
    subject: `Payment not accepted — ${jobTitle}`,
    html,
    text:    `Your payment for ${jobTitle} was not accepted. Reason: ${reason}`,
  });
}
