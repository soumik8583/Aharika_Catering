import { db } from "@/lib/db";
import { ok, fail, serverError, isValidEmail, isValidPhone, isNonEmpty, toInt } from "@/lib/api";
import { sendOrderEmails } from "@/lib/email";

/**
 * POST /api/orders — create a booking request.
 * Supports predefined menu bookings (menuId) and custom menu bookings (dishIds[]).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { name, contactNumber, email, areaOfService, guestCount, additionalRequest, menuId, dishIds } = body;

    if (!isNonEmpty(name, 2, 120)) return fail("Please enter a valid name.", 400);
    if (!isValidPhone(contactNumber)) return fail("Please enter a valid contact number.", 400);
    if (!isValidEmail(email)) return fail("Please enter a valid email address.", 400);

    const isCustom = Array.isArray(dishIds) && dishIds.length > 0;
    let menuName = "Custom Menu";
    let resolvedMenuId: number | null = null;

    if (!isCustom) {
      const mid = toInt(menuId, 0);
      if (!mid) return fail("A menu must be selected for this booking.", 400);
      const menuRes = await db.execute({
        sql: "SELECT MenuID, MenuName FROM Menu WHERE MenuID = ? AND IsActive = 1",
        args: [mid],
      });
      if (menuRes.rows.length === 0) return fail("Selected menu is not available.", 400);
      resolvedMenuId = mid;
      menuName = String(menuRes.rows[0].MenuName);
    }

    const orderRes = await db.execute({
      sql: `INSERT INTO Orders (MenuID, Name, ContactNumber, Email, AreaOfService, GuestCount, AdditionalRequest, IsCustom, OrderStatus)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New')`,
      args: [
        resolvedMenuId,
        name.trim(),
        contactNumber.trim(),
        email.trim(),
        isNonEmpty(areaOfService) ? areaOfService.trim() : null,
        guestCount ? toInt(guestCount) : null,
        isNonEmpty(additionalRequest) ? additionalRequest.trim() : null,
        isCustom ? 1 : 0,
      ],
    });

    const orderId = Number(orderRes.lastInsertRowid);

    if (isCustom) {
      const validIds = (dishIds as unknown[]).map((d) => toInt(d)).filter((n) => n > 0);
      for (const dishId of validIds) {
        await db.execute({
          sql: "INSERT INTO OrderItems (OrderID, DishID) VALUES (?, ?)",
          args: [orderId, dishId],
        });
      }
    }

    // Fire emails (non-blocking failure).
    await sendOrderEmails({
      name: name.trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      menuName,
      guestCount: guestCount ? toInt(guestCount) : null,
      areaOfService: isNonEmpty(areaOfService) ? areaOfService.trim() : null,
    });

    return ok({ orderId, message: "Thank you! Your booking request has been received. Our team will contact you shortly." }, 201);
  } catch (err) {
    return serverError("POST /api/orders", err);
  }
}
