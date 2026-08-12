import { db } from "@/lib/db";
import { ok, fail, serverError, isValidEmail, isNonEmpty, toInt } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/testimonials — public: approved testimonials only. */
export async function GET() {
  try {
    const res = await db.execute(
      "SELECT TestimonialID, Name, Rating, Feedback, CreatedAt FROM Testimonials WHERE Status = 'Approved' ORDER BY CreatedAt DESC LIMIT 50"
    );
    return ok(res.rows);
  } catch (err) {
    return serverError("GET /api/testimonials", err);
  }
}

/** POST /api/testimonials — public: submit a review (goes to Pending). */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { name, email, rating, feedback } = body;
    const ratingNum = toInt(rating, 0);

    if (!isNonEmpty(name, 2, 120)) return fail("Please enter a valid name.", 400);
    if (email && !isValidEmail(email)) return fail("Please enter a valid email address.", 400);
    if (ratingNum < 1 || ratingNum > 5) return fail("Rating must be between 1 and 5.", 400);
    if (!isNonEmpty(feedback, 5, 1000)) return fail("Feedback must be between 5 and 1000 characters.", 400);

    await db.execute({
      sql: "INSERT INTO Testimonials (Name, Email, Rating, Feedback, Status) VALUES (?, ?, ?, ?, 'Pending')",
      args: [name.trim(), email ? String(email).trim() : null, ratingNum, feedback.trim()],
    });

    return ok(
      { message: "Thank you for your review! It will appear once approved by our team." },
      201
    );
  } catch (err) {
    return serverError("POST /api/testimonials", err);
  }
}
