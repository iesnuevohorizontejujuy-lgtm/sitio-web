import type {
  InstitutionalNewsCollection,
  InstitutionalNewsItem,
} from "@/types/institutional-news";

const API_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api";

const emptyCollection: InstitutionalNewsCollection = {
  fechas_importantes: [],
  generales: [],
};

export async function getInstitutionalNews(): Promise<InstitutionalNewsCollection> {
  try {
    const response = await fetch(`${API_BASE_URL}/noticias`, {
      next: { revalidate: 300, tags: ["institutional-news"] },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return emptyCollection;

    const data = (await response.json()) as Partial<InstitutionalNewsCollection>;
    return {
      fechas_importantes: Array.isArray(data.fechas_importantes)
        ? data.fechas_importantes
        : [],
      generales: Array.isArray(data.generales) ? data.generales : [],
    };
  } catch {
    return emptyCollection;
  }
}

export async function getInstitutionalNewsItem(
  slug: string,
): Promise<InstitutionalNewsItem | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/noticias/${slug}`, {
      next: { revalidate: 300, tags: [`institutional-news-${slug}`] },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;
    return (await response.json()) as InstitutionalNewsItem;
  } catch {
    return null;
  }
}

export function formatInstitutionalDate(value: string | null): string {
  if (!value) return "";

  const dateOnly = value.split("T")[0];
  const [year, month, day] = dateOnly.split("-").map(Number);
  const date = year && month && day
    ? new Date(year, month - 1, day)
    : new Date(value);

  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function stripInstitutionalHtml(html = ""): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
