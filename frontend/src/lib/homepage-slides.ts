import type { HomepageSlide } from "@/types/homepage-slide";

const API_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api";

export async function getHomepageSlides(): Promise<HomepageSlide[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/portada/diapositivas`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return [];

    const data = (await response.json()) as unknown;
    return Array.isArray(data) ? data.slice(0, 3) as HomepageSlide[] : [];
  } catch {
    return [];
  }
}
