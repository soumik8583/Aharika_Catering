import { db } from "@/lib/db";
import { ok, fail, serverError, isNonEmpty, toInt } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/admin/menus — all menus (active + inactive) with dish counts. */
export async function GET() {
  try {
    const res = await db.execute(`
      SELECT m.*, (SELECT COUNT(*) FROM MenuDish md WHERE md.MenuID = m.MenuID) AS DishCount
      FROM Menu m ORDER BY m.CreatedAt DESC
    `);
    return ok(res.rows);
  } catch (err) {
    return serverError("GET /api/admin/menus", err);
  }
}

/** POST /api/admin/menus — create a menu with optional dish links. */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { menuName, description, price, priceUnit, imageURL, category, isActive, dishIds } = body;
    if (!isNonEmpty(menuName, 2, 150)) return fail("Menu name is required.", 400);

    const res = await db.execute({
      sql: `INSERT INTO Menu (MenuName, Description, Price, PriceUnit, ImageURL, Category, IsActive)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        menuName.trim(),
        isNonEmpty(description) ? description.trim() : null,
        price != null ? Number(price) : null,
        isNonEmpty(priceUnit) ? priceUnit.trim() : "Per Guest",
        isNonEmpty(imageURL) ? imageURL.trim() : null,
        isNonEmpty(category) ? category.trim() : null,
        isActive === false ? 0 : 1,
      ],
    });
    const menuId = Number(res.lastInsertRowid);

    if (Array.isArray(dishIds)) {
      let order = 1;
      for (const d of dishIds) {
        const dishId = toInt(d);
        if (dishId > 0) {
          await db.execute({
            sql: "INSERT INTO MenuDish (MenuID, DishID, DisplayOrder) VALUES (?, ?, ?)",
            args: [menuId, dishId, order++],
          });
        }
      }
    }

    return ok({ menuId }, 201);
  } catch (err) {
    return serverError("POST /api/admin/menus", err);
  }
}
