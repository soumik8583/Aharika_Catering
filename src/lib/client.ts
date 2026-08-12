"use client";

export type ApiResult<T> = { success: true; data: T } | { success: false; error: string };

/** Client-side fetch wrapper that normalizes the API response envelope. */
export async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const json = await res.json().catch(() => null);
    if (!json) return { success: false, error: "Unexpected server response." };
    if (!res.ok || json.success === false) {
      return { success: false, error: json?.error || "Something went wrong. Please try again." };
    }
    return { success: true, data: json.data as T };
  } catch {
    return { success: false, error: "Network error. Please check your connection." };
  }
}
