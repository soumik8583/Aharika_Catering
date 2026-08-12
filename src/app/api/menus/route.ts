import { db } from "@/lib/db";
import { ok, serverError } from "@/lib/api";
import type { Dish } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/menus — list active menus with their dishes. */
export async function GET() {
  try {
    const menusRes = await db.execute(
      "SELECT * FROM Menu WHERE IsActive = 1 ORDER BY Price ASC"
    );
    const menus = menusRes.rows as unknown as Record<string, unknown>[];

    if (menus.length === 0) return ok([]);

    const menuIds = menus.map((m) => Number(m.MenuID));
    const placeholders = menuIds.map(() => "?").join(",");
    const linkRes = await db.execute({
      sql: `SELECT md.MenuID, d.*
            FROM MenuDish md
            JOIN Dish d ON d.DishID = md.DishID
            WHERE md.MenuID IN (${placeholders}) AND d.IsActive = 1
            ORDER BY md.DisplayOrder ASC`,
      args: menuIds,
    });

    const dishesByMenu = new Map<number, Dish[]>();
    for (const row of linkRes.rows as unknown as (Dish & { MenuID: number })[]) {
      const list = dishesByMenu.get(row.MenuID) ?? [];
      list.push(row);
      dishesByMenu.set(row.MenuID, list);
    }

    const result = menus.map((m) => ({
      ...m,
      dishes: dishesByMenu.get(Number(m.MenuID)) ?? [],
    }));

    return ok(result);
  } catch (err) {
    return serverError("GET /api/menus", err);
  }
}
