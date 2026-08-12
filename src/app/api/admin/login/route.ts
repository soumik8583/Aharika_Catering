import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fail, serverError, isValidEmail, isNonEmpty } from "@/lib/api";
import { createToken, AUTH_COOKIE } from "@/lib/auth";

/** POST /api/admin/login — authenticate an admin and set the session cookie. */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return fail("Invalid request body", 400);

    const { email, password } = body;
    if (!isValidEmail(email) || !isNonEmpty(password, 1, 200)) {
      return fail("Invalid email or password.", 400);
    }

    const res = await db.execute({
      sql: "SELECT AdminID, Name, Email, PasswordHash FROM Admin WHERE Email = ?",
      args: [String(email).trim().toLowerCase()],
    });

    if (res.rows.length === 0) return fail("Invalid email or password.", 401);

    const admin = res.rows[0] as unknown as {
      AdminID: number;
      Name: string;
      Email: string;
      PasswordHash: string;
    };

    const match = await bcrypt.compare(String(password), admin.PasswordHash);
    if (!match) return fail("Invalid email or password.", 401);

    const token = await createToken({
      adminId: Number(admin.AdminID),
      email: admin.Email,
      name: admin.Name,
    });

    const response = NextResponse.json({
      success: true,
      data: { name: admin.Name, email: admin.Email },
    });
    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (err) {
    return serverError("POST /api/admin/login", err);
  }
}
