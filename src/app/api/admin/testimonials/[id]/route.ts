import { db } from "@/lib/db";
import { ok, fail, serverError, isNonEmpty, toInt } from "@/lib/api";
import { TESTIMONIAL_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

/** PUT /api/admin/testimonials/:id — approve/reject/edit a review. */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid testimonial id", 400);

    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { status, name, feedback, rating } = body;
    if (status && !TESTIMONIAL_STATUSES.includes(status)) return fail("Invalid status.", 400);
    const ratingNum = rating != null ? toInt(rating) : null;
    if (ratingNum != null && (ratingNum < 1 || ratingNum > 5)) return fail("Rating must be 1–5.", 400);

    await db.execute({
      sql: `UPDATE Testimonials SET
              Status = COALESCE(?, Status),
              Name = COALESCE(?, Name),
              Feedback = COALESCE(?, Feedback),
              Rating = COALESCE(?, Rating),
              UpdatedAt = datetime('now')
            WHERE TestimonialID = ?`,
      args: [
        status ?? null,
        isNonEmpty(name) ? name.trim() : null,
        isNonEmpty(feedback) ? feedback.trim() : null,
        ratingNum,
        id,
      ],
    });

    return ok({ testimonialId: id });
  } catch (err) {
    return serverError("PUT /api/admin/testimonials/:id", err);
  }
}

/** DELETE /api/admin/testimonials/:id — remove a review. */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid testimonial id", 400);
    await db.execute({ sql: "DELETE FROM Testimonials WHERE TestimonialID = ?", args: [id] });
    return ok({ testimonialId: id, message: "Review removed." });
  } catch (err) {
    return serverError("DELETE /api/admin/testimonials/:id", err);
  }
}
