import { NextResponse } from "next/server";

/** Standard success response. */
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/** Standard error response — never leaks internal details. */
export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/** Logs the real error server-side and returns a generic message. */
export function serverError(context: string, err: unknown) {
  console.error(`[${context}]`, err);
  return NextResponse.json(
    { success: false, error: "Something went wrong. Please try again." },
    { status: 500 }
  );
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[+]?[\d\s-]{7,15}$/;

export function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && EMAIL_REGEX.test(email.trim());
}

export function isValidPhone(phone: unknown): phone is string {
  return typeof phone === "string" && PHONE_REGEX.test(phone.trim());
}

export function isNonEmpty(value: unknown, min = 1, max = 5000): value is string {
  return (
    typeof value === "string" &&
    value.trim().length >= min &&
    value.trim().length <= max
  );
}

/** Strong password: min 8 chars, upper, lower, number. */
export function isStrongPassword(pw: unknown): pw is string {
  return (
    typeof pw === "string" &&
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw)
  );
}

export function toInt(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}
