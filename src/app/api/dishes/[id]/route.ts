import { db } from "@/lib/db";
import { ok, fail, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/dishes/:id — single dish. */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid dish id", 400);

    const res = await db.execute({
      sql: "SELECT * FROM Dish WHERE DishID = ? AND IsActive = 1",
      args: [id],
    });
    if (res.rows.length === 0) return fail("Dish not found", 404);
    return ok(res.rows[0]);
  } catch (err) {
    return serverError("GET /api/dishes/:id", err);
  }
}
