import { db } from "@/lib/db";
import { ok, fail, serverError } from "@/lib/api";
import type { Dish } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/menus/:id — single active menu with dishes. */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid menu id", 400);

    const menuRes = await db.execute({
      sql: "SELECT * FROM Menu WHERE MenuID = ? AND IsActive = 1",
      args: [id],
    });
    if (menuRes.rows.length === 0) return fail("Menu not found", 404);

    const dishesRes = await db.execute({
      sql: `SELECT d.* FROM MenuDish md
            JOIN Dish d ON d.DishID = md.DishID
            WHERE md.MenuID = ? AND d.IsActive = 1
            ORDER BY md.DisplayOrder ASC`,
      args: [id],
    });

    return ok({
      ...(menuRes.rows[0] as unknown as Record<string, unknown>),
      dishes: dishesRes.rows as unknown as Dish[],
    });
  } catch (err) {
    return serverError("GET /api/menus/:id", err);
  }
}
