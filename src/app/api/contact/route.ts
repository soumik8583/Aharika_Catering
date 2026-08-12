import { db } from "@/lib/db";
import { ok, fail, serverError, isValidEmail, isValidPhone, isNonEmpty } from "@/lib/api";
import { sendContactEmails } from "@/lib/email";

/** POST /api/contact — store a contact enquiry and send notification emails. */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { fullName, contactNumber, email, message } = body;

    if (!isNonEmpty(fullName, 2, 120)) return fail("Please enter a valid name.", 400);
    if (!isValidPhone(contactNumber)) return fail("Please enter a valid contact number.", 400);
    if (!isValidEmail(email)) return fail("Please enter a valid email address.", 400);
    if (!isNonEmpty(message, 5, 2000)) return fail("Message must be between 5 and 2000 characters.", 400);

    const res = await db.execute({
      sql: `INSERT INTO ContactUs (FullName, ContactNumber, Email, Message, Status)
            VALUES (?, ?, ?, ?, 'New')`,
      args: [fullName.trim(), contactNumber.trim(), email.trim(), message.trim()],
    });

    const createdAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    await sendContactEmails({
      fullName: fullName.trim(),
      contactNumber: contactNumber.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt,
    });

    return ok(
      { contactId: Number(res.lastInsertRowid), message: "Thank you for reaching out! We'll get back to you shortly." },
      201
    );
  } catch (err) {
    return serverError("POST /api/contact", err);
  }
}
