import type { Authority } from "@/types/authority";

const API_BASE_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000/api";

export async function getAuthorities(): Promise<Authority[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/autoridades`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as Authority[] | { data?: Authority[] };
    return Array.isArray(payload) ? payload : (payload.data ?? []);
  } catch {
    return [];
  }
}
