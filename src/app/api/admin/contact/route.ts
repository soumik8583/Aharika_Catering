import { db } from "@/lib/db";
import { ok, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/admin/contact — all enquiries, optional status filter. */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let sql = "SELECT * FROM ContactUs";
    const args: (string | number)[] = [];
    if (status && status !== "All") {
      sql += " WHERE Status = ?";
      args.push(status);
    }
    sql += " ORDER BY CreatedAt DESC";

    const res = await db.execute({ sql, args });
    return ok(res.rows);
  } catch (err) {
    return serverError("GET /api/admin/contact", err);
  }
}
