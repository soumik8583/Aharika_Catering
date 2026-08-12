import { db } from "@/lib/db";
import { ok, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

/** GET /api/admin/stats — dashboard summary + recent activity. */
export async function GET() {
  try {
    const [
      menus,
      dishes,
      newEnquiries,
      totalOrders,
      pendingOrders,
      pendingTestimonials,
      recentEnquiries,
      recentOrders,
      recentReviews,
    ] = await Promise.all([
      db.execute("SELECT COUNT(*) AS c FROM Menu WHERE IsActive = 1"),
      db.execute("SELECT COUNT(*) AS c FROM Dish WHERE IsActive = 1"),
      db.execute("SELECT COUNT(*) AS c FROM ContactUs WHERE Status = 'New'"),
      db.execute("SELECT COUNT(*) AS c FROM Orders"),
      db.execute("SELECT COUNT(*) AS c FROM Orders WHERE OrderStatus IN ('New','Contacted','Confirmed','In Progress')"),
      db.execute("SELECT COUNT(*) AS c FROM Testimonials WHERE Status = 'Pending'"),
      db.execute("SELECT ContactID, FullName, Email, Message, Status, CreatedAt FROM ContactUs ORDER BY CreatedAt DESC LIMIT 5"),
      db.execute(`SELECT o.OrderID, o.Name, o.Email, o.OrderStatus, o.CreatedAt, m.MenuName
                  FROM Orders o LEFT JOIN Menu m ON m.MenuID = o.MenuID
                  ORDER BY o.CreatedAt DESC LIMIT 5`),
      db.execute("SELECT TestimonialID, Name, Rating, Feedback, Status, CreatedAt FROM Testimonials WHERE Status = 'Pending' ORDER BY CreatedAt DESC LIMIT 5"),
    ]);

    return ok({
      counts: {
        menus: Number(menus.rows[0].c),
        dishes: Number(dishes.rows[0].c),
        newEnquiries: Number(newEnquiries.rows[0].c),
        totalOrders: Number(totalOrders.rows[0].c),
        pendingOrders: Number(pendingOrders.rows[0].c),
        pendingTestimonials: Number(pendingTestimonials.rows[0].c),
      },
      recentEnquiries: recentEnquiries.rows,
      recentOrders: recentOrders.rows,
      recentReviews: recentReviews.rows,
    });
  } catch (err) {
    return serverError("GET /api/admin/stats", err);
  }
}
