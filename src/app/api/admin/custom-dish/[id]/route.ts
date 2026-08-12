import { db } from "@/lib/db";
import { ok, fail, serverError } from "@/lib/api";
import { CUSTOM_DISH_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

/** PUT /api/admin/custom-dish/:id — update status of a custom dish request. */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid request id", 400);

    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { status } = body;
    if (!status || !CUSTOM_DISH_STATUSES.includes(status)) return fail("Invalid status.", 400);

    await db.execute({
      sql: "UPDATE CustomDishRequests SET Status = ?, UpdatedAt = datetime('now') WHERE RequestID = ?",
      args: [status, id],
    });

    return ok({ requestId: id });
  } catch (err) {
    return serverError("PUT /api/admin/custom-dish/:id", err);
  }
}

/** DELETE /api/admin/custom-dish/:id */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid request id", 400);
    await db.execute({ sql: "DELETE FROM CustomDishRequests WHERE RequestID = ?", args: [id] });
    return ok({ requestId: id, message: "Request removed." });
  } catch (err) {
    return serverError("DELETE /api/admin/custom-dish/:id", err);
  }
}
