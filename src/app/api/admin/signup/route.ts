import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ok, fail, serverError, isValidEmail, isValidPhone, isNonEmpty, isStrongPassword } from "@/lib/api";

/** POST /api/admin/signup — register a new admin. Does NOT auto-login. */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { name, email, contactNumber, password, confirmPassword } = body;

    if (!isNonEmpty(name, 2, 120)) return fail("Please enter a valid name.", 400);
    if (!isValidEmail(email)) return fail("Please enter a valid email address.", 400);
    if (contactNumber && !isValidPhone(contactNumber)) return fail("Please enter a valid contact number.", 400);
    if (!isStrongPassword(password)) {
      return fail("Password must be at least 8 characters and include uppercase, lowercase and a number.", 400);
    }
    if (password !== confirmPassword) return fail("Passwords do not match.", 400);

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await db.execute({
      sql: "SELECT AdminID FROM Admin WHERE Email = ?",
      args: [normalizedEmail],
    });
    if (existing.rows.length > 0) return fail("An admin with this email already exists.", 409);

    const passwordHash = await bcrypt.hash(String(password), 12);
    await db.execute({
      sql: "INSERT INTO Admin (Name, Email, ContactNumber, PasswordHash) VALUES (?, ?, ?, ?)",
      args: [name.trim(), normalizedEmail, contactNumber ? String(contactNumber).trim() : null, passwordHash],
    });

    return ok({ message: "Account created successfully. Please log in." }, 201);
  } catch (err) {
    return serverError("POST /api/admin/signup", err);
  }
}
