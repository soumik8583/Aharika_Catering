import { db } from "@/lib/db";
import { ok, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/admin/orders — all bookings with menu name, optional status filter. */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let sql = `SELECT o.*, m.MenuName FROM Orders o LEFT JOIN Menu m ON m.MenuID = o.MenuID`;
    const args: (string | number)[] = [];
    if (status && status !== "All") {
      sql += " WHERE o.OrderStatus = ?";
      args.push(status);
    }
    sql += " ORDER BY o.CreatedAt DESC";

    const res = await db.execute({ sql, args });
    return ok(res.rows);
  } catch (err) {
    return serverError("GET /api/admin/orders", err);
  }
}
