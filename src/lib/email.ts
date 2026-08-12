import nodemailer from "nodemailer";

/**
 * Server-side email service using nodemailer + Gmail SMTP.
 * Credentials are read from environment variables only.
 * If email is not configured, sending is skipped gracefully (no crash).
 */
function getTransport() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

const BRAND = "Aaharika – Flavours Made for Memories";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
};

async function send({ to, subject, html }: SendArgs): Promise<boolean> {
  const transport = getTransport();
  if (!transport) {
    console.warn("[email] EMAIL_USER/EMAIL_PASSWORD not set — skipping send.");
    return false;
  }
  try {
    await transport.sendMail({
      from: `"${BRAND}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

function wrap(inner: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
    <div style="background:#8B1E3F;color:#fff;padding:24px;text-align:center">
      <h1 style="margin:0;font-size:24px">Aaharika</h1>
      <p style="margin:4px 0 0;color:#E4C878">Flavours Made for Memories</p>
    </div>
    <div style="padding:24px;color:#2A2320;line-height:1.6">${inner}</div>
    <div style="background:#FBF7F0;padding:16px;text-align:center;color:#888;font-size:12px">
      copyright@soumikmondal723
    </div>
  </div>`;
}

export type ContactEmailData = {
  fullName: string;
  contactNumber: string;
  email: string;
  message: string;
  createdAt: string;
};

export async function sendContactEmails(data: ContactEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || "soumikmondal723@gmail.com";

  const adminHtml = wrap(`
    <h2 style="color:#8B1E3F">New Contact Enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
    <p><strong>Contact Number:</strong> ${escapeHtml(data.contactNumber)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Message:</strong><br/>${escapeHtml(data.message)}</p>
    <p><strong>Submitted:</strong> ${escapeHtml(data.createdAt)}</p>
  `);

  const userHtml = wrap(`
    <h2 style="color:#8B1E3F">Thank you for contacting us!</h2>
    <p>Dear ${escapeHtml(data.fullName)},</p>
    <p>Thank you for contacting Aaharika – Flavours Made for Memories.
    We have received your enquiry and our team will get back to you shortly.</p>
    <p style="margin-top:16px">Warm regards,<br/>Team Aaharika</p>
  `);

  // Fire both; do not fail the request if email fails.
  await Promise.allSettled([
    send({ to: adminEmail, subject: "New Contact Enquiry — Aaharika", html: adminHtml }),
    send({ to: data.email, subject: "We received your enquiry — Aaharika", html: userHtml }),
  ]);
}

export type OrderEmailData = {
  name: string;
  email: string;
  contactNumber: string;
  menuName: string;
  guestCount?: number | null;
  areaOfService?: string | null;
};

export async function sendOrderEmails(data: OrderEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL || "soumikmondal723@gmail.com";

  const adminHtml = wrap(`
    <h2 style="color:#8B1E3F">New Booking Request</h2>
    <p><strong>Customer:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Contact:</strong> ${escapeHtml(data.contactNumber)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Menu:</strong> ${escapeHtml(data.menuName)}</p>
    <p><strong>Guests:</strong> ${data.guestCount ?? "—"}</p>
    <p><strong>Area:</strong> ${escapeHtml(data.areaOfService || "—")}</p>
  `);

  const userHtml = wrap(`
    <h2 style="color:#8B1E3F">Your booking request is received!</h2>
    <p>Dear ${escapeHtml(data.name)},</p>
    <p>Thank you! Your booking request for <strong>${escapeHtml(
      data.menuName
    )}</strong> has been received. Our team will contact you shortly.</p>
    <p style="margin-top:16px">Warm regards,<br/>Team Aaharika</p>
  `);

  await Promise.allSettled([
    send({ to: adminEmail, subject: "New Booking Request — Aaharika", html: adminHtml }),
    send({ to: data.email, subject: "Booking request received — Aaharika", html: userHtml }),
  ]);
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
