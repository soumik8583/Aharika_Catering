import { db } from "@/lib/db";
import { ok, fail, serverError, isNonEmpty } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/admin/dishes — all dishes (active + inactive). */
export async function GET() {
  try {
    const res = await db.execute("SELECT * FROM Dish ORDER BY CreatedAt DESC");
    return ok(res.rows);
  } catch (err) {
    return serverError("GET /api/admin/dishes", err);
  }
}

/** Generate the next unique human-friendly dish code (DISH-0001). */
async function nextDishCode(): Promise<string> {
  const res = await db.execute(
    "SELECT DishCode FROM Dish WHERE DishCode LIKE 'DISH-%' ORDER BY DishID DESC LIMIT 1"
  );
  let next = 1;
  if (res.rows.length > 0) {
    const last = String(res.rows[0].DishCode);
    const num = parseInt(last.replace("DISH-", ""), 10);
    if (Number.isFinite(num)) next = num + 1;
  }
  return `DISH-${String(next).padStart(4, "0")}`;
}

/** POST /api/admin/dishes — create a dish with an auto-generated code. */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { dishName, mainIngredients, sourceOfDish, isVegetarian, masalasUsed, imageURL, category, description, price, isActive } = body;
    if (!isNonEmpty(dishName, 2, 150)) return fail("Dish name is required.", 400);

    const code = await nextDishCode();
    const res = await db.execute({
      sql: `INSERT INTO Dish (DishCode, DishName, MainIngredients, SourceOfDish, IsVegetarian, MasalasUsed, ImageURL, Category, Description, Price, IsActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        code,
        dishName.trim(),
        isNonEmpty(mainIngredients) ? mainIngredients.trim() : null,
        isNonEmpty(sourceOfDish) ? sourceOfDish.trim() : null,
        isVegetarian ? 1 : 0,
        isNonEmpty(masalasUsed) ? masalasUsed.trim() : null,
        isNonEmpty(imageURL) ? imageURL.trim() : null,
        isNonEmpty(category) ? category.trim() : null,
        isNonEmpty(description) ? description.trim() : null,
        price != null && price !== "" ? Number(price) : null,
        isActive === false ? 0 : 1,
      ],
    });

    return ok({ dishId: Number(res.lastInsertRowid), dishCode: code }, 201);
  } catch (err) {
    return serverError("POST /api/admin/dishes", err);
  }
}
