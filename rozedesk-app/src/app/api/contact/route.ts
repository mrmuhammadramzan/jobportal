/**
 * POST /api/contact
 * Sends the contact form message to the admin email via SMTP.
 * Falls back gracefully if email is not configured.
 *
 * Body: { name, email, subject?, message }
 * Backend SOP Hard Rule 2: never swallow errors silently — log full error.
 * Backend SOP §7: email is non-fatal — returns 200 even if email fails,
 *   so the user gets confirmation even if admin doesn't get the email.
 */
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json() as {
      name?: string; email?: string; subject?: string; message?: string;
    };

    if (!name?.trim())    return NextResponse.json({ message: "Name is required."    }, { status: 400 });
    if (!email?.trim())   return NextResponse.json({ message: "Email is required."   }, { status: 400 });
    if (!message?.trim()) return NextResponse.json({ message: "Message is required." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Invalid email address." }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const adminEmail = process.env.SMTP_USER ?? "admin@rozedesk.com";
    const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    /** Escape HTML special characters to prevent HTML injection in email body */
    const esc = (s: string) =>
      s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
       .replace(/"/g,"&quot;").replace(/'/g,"&#39;");

    const safeName    = esc(name.trim());
    const safeEmail   = esc(email.trim());
    const safeSubject = esc(subject?.trim() ?? "");
    const safeMessage = esc(message.trim());

    if (host && user && pass) {
      const port        = parseInt(process.env.SMTP_PORT ?? "587", 10);
      const transporter = nodemailer.createTransport({
        host, port, secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 10_000,
      });

      const subjectLine = safeSubject
        ? `[RozeDesk Contact] ${safeSubject}`
        : `[RozeDesk Contact] Message from ${safeName}`;

      await transporter.sendMail({
        from:    process.env.SMTP_FROM ?? `RozeDesk <${user}>`,
        to:      adminEmail,
        replyTo: email,
        subject: subjectLine,
        html: `
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject || "—"}</p>
          <hr/>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${safeMessage}</p>
          <hr/>
          <p style="color:#9ca3af;font-size:12px">Sent via ${appUrl}/contact</p>
        `,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject ?? "—"}\n\nMessage:\n${message}`,
      }).catch(e => console.error("[POST /api/contact] Email send failed:", e));
    } else {
      console.log("[POST /api/contact] Message received (no SMTP configured):", {
        from: `${name} <${email}>`,
        subject: subject ?? "(no subject)",
        message,
      });
    }

    return NextResponse.json({ message: "Message received. We'll get back to you soon." });

  } catch (e) {
    console.error("[POST /api/contact]", e);
    return NextResponse.json({ message: "Failed to send message. Please try again." }, { status: 500 });
  }
}
