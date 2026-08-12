import { db } from "@/lib/db";
import { ok, fail, serverError, isNonEmpty, toInt } from "@/lib/api";
import { ORDER_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/admin/orders/:id — order details with custom dish items. */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid order id", 400);

    const orderRes = await db.execute({
      sql: `SELECT o.*, m.MenuName FROM Orders o LEFT JOIN Menu m ON m.MenuID = o.MenuID WHERE o.OrderID = ?`,
      args: [id],
    });
    if (orderRes.rows.length === 0) return fail("Order not found", 404);

    const itemsRes = await db.execute({
      sql: `SELECT d.DishID, d.DishName, d.Category FROM OrderItems oi JOIN Dish d ON d.DishID = oi.DishID WHERE oi.OrderID = ?`,
      args: [id],
    });

    return ok({ ...(orderRes.rows[0] as unknown as Record<string, unknown>), items: itemsRes.rows });
  } catch (err) {
    return serverError("GET /api/admin/orders/:id", err);
  }
}

/** PUT /api/admin/orders/:id — update status and editable fields. */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return fail("Invalid order id", 400);

    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { orderStatus, areaOfService, guestCount, additionalRequest } = body;
    if (orderStatus && !ORDER_STATUSES.includes(orderStatus)) {
      return fail("Invalid order status.", 400);
    }

    await db.execute({
      sql: `UPDATE Orders SET
              OrderStatus = COALESCE(?, OrderStatus),
              AreaOfService = COALESCE(?, AreaOfService),
              GuestCount = COALESCE(?, GuestCount),
              AdditionalRequest = COALESCE(?, AdditionalRequest),
              UpdatedAt = datetime('now')
            WHERE OrderID = ?`,
      args: [
        orderStatus ?? null,
        isNonEmpty(areaOfService) ? areaOfService.trim() : null,
        guestCount != null ? toInt(guestCount) : null,
        isNonEmpty(additionalRequest) ? additionalRequest.trim() : null,
        id,
      ],
    });

    return ok({ orderId: id });
  } catch (err) {
    return serverError("PUT /api/admin/orders/:id", err);
  }
}
