import { db } from "@/lib/db";
import { ok, fail, serverError, isNonEmpty, toInt } from "@/lib/api";
import type { Dish } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/admin/menus/:id — menu with linked dishes. */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid menu id", 400);

    const menuRes = await db.execute({ sql: "SELECT * FROM Menu WHERE MenuID = ?", args: [id] });
    if (menuRes.rows.length === 0) return fail("Menu not found", 404);

    const dishesRes = await db.execute({
      sql: `SELECT d.* FROM MenuDish md JOIN Dish d ON d.DishID = md.DishID
            WHERE md.MenuID = ? ORDER BY md.DisplayOrder ASC`,
      args: [id],
    });

    return ok({ ...(menuRes.rows[0] as unknown as Record<string, unknown>), dishes: dishesRes.rows as unknown as Dish[] });
  } catch (err) {
    return serverError("GET /api/admin/menus/:id", err);
  }
}

/** PUT /api/admin/menus/:id — update menu fields and dish links. */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid menu id", 400);

    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { menuName, description, price, priceUnit, imageURL, category, isActive, dishIds } = body;
    if (!isNonEmpty(menuName, 2, 150)) return fail("Menu name is required.", 400);

    await db.execute({
      sql: `UPDATE Menu SET MenuName = ?, Description = ?, Price = ?, PriceUnit = ?, ImageURL = ?, Category = ?, IsActive = ?, UpdatedAt = datetime('now')
            WHERE MenuID = ?`,
      args: [
        menuName.trim(),
        isNonEmpty(description) ? description.trim() : null,
        price != null ? Number(price) : null,
        isNonEmpty(priceUnit) ? priceUnit.trim() : "Per Guest",
        isNonEmpty(imageURL) ? imageURL.trim() : null,
        isNonEmpty(category) ? category.trim() : null,
        isActive === false ? 0 : 1,
        id,
      ],
    });

    if (Array.isArray(dishIds)) {
      await db.execute({ sql: "DELETE FROM MenuDish WHERE MenuID = ?", args: [id] });
      let order = 1;
      for (const d of dishIds) {
        const dishId = toInt(d);
        if (dishId > 0) {
          await db.execute({
            sql: "INSERT INTO MenuDish (MenuID, DishID, DisplayOrder) VALUES (?, ?, ?)",
            args: [id, dishId, order++],
          });
        }
      }
    }

    return ok({ menuId: id });
  } catch (err) {
    return serverError("PUT /api/admin/menus/:id", err);
  }
}

/** DELETE /api/admin/menus/:id — soft delete (deactivate). */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid menu id", 400);
    await db.execute({
      sql: "UPDATE Menu SET IsActive = 0, UpdatedAt = datetime('now') WHERE MenuID = ?",
      args: [id],
    });
    return ok({ menuId: id, message: "Menu deactivated." });
  } catch (err) {
    return serverError("DELETE /api/admin/menus/:id", err);
  }
}
