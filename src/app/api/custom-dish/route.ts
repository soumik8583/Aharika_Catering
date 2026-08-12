import { db } from "@/lib/db";
import { ok, fail, serverError, isValidEmail, isValidPhone, isNonEmpty } from "@/lib/api";

/** POST /api/custom-dish — store a custom dish request. */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { name, contactNumber, email, dishDetails } = body;

    if (!isNonEmpty(name, 2, 120)) return fail("Please enter a valid name.", 400);
    if (!isValidPhone(contactNumber)) return fail("Please enter a valid contact number.", 400);
    if (!isValidEmail(email)) return fail("Please enter a valid email address.", 400);
    if (!isNonEmpty(dishDetails, 10, 2000)) return fail("Please describe the dish (10–2000 characters).", 400);

    const res = await db.execute({
      sql: `INSERT INTO CustomDishRequests (Name, ContactNumber, Email, DishDetails, Status)
            VALUES (?, ?, ?, ?, 'New')`,
      args: [name.trim(), contactNumber.trim(), email.trim(), dishDetails.trim()],
    });

    return ok(
      { requestId: Number(res.lastInsertRowid), message: "Your custom dish request has been received! Our team will contact you." },
      201
    );
  } catch (err) {
    return serverError("POST /api/custom-dish", err);
  }
}
