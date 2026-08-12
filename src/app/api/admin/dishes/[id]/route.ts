import { db } from "@/lib/db";
import { ok, fail, serverError, isNonEmpty } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/admin/dishes/:id */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid dish id", 400);
    const res = await db.execute({ sql: "SELECT * FROM Dish WHERE DishID = ?", args: [id] });
    if (res.rows.length === 0) return fail("Dish not found", 404);
    return ok(res.rows[0]);
  } catch (err) {
    return serverError("GET /api/admin/dishes/:id", err);
  }
}

/** PUT /api/admin/dishes/:id — update a dish. */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid dish id", 400);

    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { dishName, mainIngredients, sourceOfDish, isVegetarian, masalasUsed, imageURL, category, description, isActive } = body;
    if (!isNonEmpty(dishName, 2, 150)) return fail("Dish name is required.", 400);

    await db.execute({
      sql: `UPDATE Dish SET DishName = ?, MainIngredients = ?, SourceOfDish = ?, IsVegetarian = ?, MasalasUsed = ?, ImageURL = ?, Category = ?, Description = ?, IsActive = ?, UpdatedAt = datetime('now')
            WHERE DishID = ?`,
      args: [
        dishName.trim(),
        isNonEmpty(mainIngredients) ? mainIngredients.trim() : null,
        isNonEmpty(sourceOfDish) ? sourceOfDish.trim() : null,
        isVegetarian ? 1 : 0,
        isNonEmpty(masalasUsed) ? masalasUsed.trim() : null,
        isNonEmpty(imageURL) ? imageURL.trim() : null,
        isNonEmpty(category) ? category.trim() : null,
        isNonEmpty(description) ? description.trim() : null,
        isActive === false ? 0 : 1,
        id,
      ],
    });

    return ok({ dishId: id });
  } catch (err) {
    return serverError("PUT /api/admin/dishes/:id", err);
  }
}

/** DELETE /api/admin/dishes/:id — soft delete (deactivate). */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid dish id", 400);
    await db.execute({
      sql: "UPDATE Dish SET IsActive = 0, UpdatedAt = datetime('now') WHERE DishID = ?",
      args: [id],
    });
    return ok({ dishId: id, message: "Dish deactivated." });
  } catch (err) {
    return serverError("DELETE /api/admin/dishes/:id", err);
  }
}
