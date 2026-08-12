import { db } from "@/lib/db";
import { ok, fail, serverError, isNonEmpty } from "@/lib/api";
import { CONTACT_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

/** PUT /api/admin/contact/:id — update status / internal notes. */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid enquiry id", 400);

    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { status, notes } = body;
    if (status && !CONTACT_STATUSES.includes(status)) return fail("Invalid status.", 400);

    await db.execute({
      sql: `UPDATE ContactUs SET Status = COALESCE(?, Status), Notes = COALESCE(?, Notes), UpdatedAt = datetime('now') WHERE ContactID = ?`,
      args: [status ?? null, isNonEmpty(notes) ? notes.trim() : null, id],
    });

    return ok({ contactId: id });
  } catch (err) {
    return serverError("PUT /api/admin/contact/:id", err);
  }
}

/** DELETE /api/admin/contact/:id — archive/remove an enquiry. */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid enquiry id", 400);
    await db.execute({ sql: "DELETE FROM ContactUs WHERE ContactID = ?", args: [id] });
    return ok({ contactId: id, message: "Enquiry removed." });
  } catch (err) {
    return serverError("DELETE /api/admin/contact/:id", err);
  }
}
