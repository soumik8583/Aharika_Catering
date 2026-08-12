import { db } from "@/lib/db";
import { ok, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/dishes — list active dishes, optionally filtered by category. */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let sql = "SELECT * FROM Dish WHERE IsActive = 1";
    const args: (string | number)[] = [];
    if (category && category !== "All") {
      sql += " AND Category = ?";
      args.push(category);
    }
    sql += " ORDER BY DishName ASC";

    const res = await db.execute({ sql, args });
    return ok(res.rows);
  } catch (err) {
    return serverError("GET /api/dishes", err);
  }
}
