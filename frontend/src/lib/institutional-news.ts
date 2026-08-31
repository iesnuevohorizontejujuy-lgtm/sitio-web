import { cache } from "react";
import type {
  InstitutionalNewsCategory,
  InstitutionalNewsCollection,
  InstitutionalNewsItem,
} from "@/types/institutional-news";

const API_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api";

const emptyCollection: InstitutionalNewsCollection = {
  destacadas: [],
  noticias: [],
  agenda: [],
  fechas_importantes: [],
  generales: [],
};

export const institutionalCategoryLabels: Record<InstitutionalNewsCategory, string> = {
  general: "Actualidad",
  actividad: "Actividad",
  jornada: "Jornada",
  practica: "Práctica profesional",
  convenio: "Convenio",
  fecha_importante: "Agenda",
};

export const getInstitutionalNews = cache(async (): Promise<InstitutionalNewsCollection> => {
  try {
    const response = await fetch(`${API_BASE_URL}/noticias`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return emptyCollection;

    const data = (await response.json()) as Partial<InstitutionalNewsCollection>;
    const generales = Array.isArray(data.generales) ? data.generales : [];
    const fechasImportantes = Array.isArray(data.fechas_importantes)
      ? data.fechas_importantes
      : [];

    return {
      destacadas: Array.isArray(data.destacadas)
        ? data.destacadas
        : generales.filter((item) => item.destacada),
      noticias: Array.isArray(data.noticias) ? data.noticias : generales,
      agenda: Array.isArray(data.agenda) ? data.agenda : fechasImportantes,
      fechas_importantes: Array.isArray(data.fechas_importantes)
        ? data.fechas_importantes
        : [],
      generales,
    };
  } catch {
    return emptyCollection;
  }
});

export const getInstitutionalNewsItem = cache(async (
  slug: string,
): Promise<InstitutionalNewsItem | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/noticias/${slug}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;
    return (await response.json()) as InstitutionalNewsItem;
  } catch {
    return null;
  }
});

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

export function getInstitutionalExcerpt(item: InstitutionalNewsItem, length = 190): string {
  const text = stripInstitutionalHtml(item.contenido);
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

export function getInstitutionalItemDate(item: InstitutionalNewsItem): string {
  return item.fecha_evento || item.publicada_at || item.created_at;
}

export function isInstitutionalEvent(item: InstitutionalNewsItem): boolean {
  return item.categoria === "fecha_importante" || Boolean(item.fecha_evento);
}

export function getInstitutionalDateParts(value: string): { day: string; month: string; year: string } {
  const dateOnly = value.split("T")[0];
  const [year, month, day] = dateOnly.split("-").map(Number);
  const date = year && month && day ? new Date(year, month - 1, day) : new Date(value);
  const formattedMonth = new Intl.DateTimeFormat("es-AR", { month: "short" }).format(date).replace(".", "");
  return {
    day: new Intl.NumberFormat("es-AR", { minimumIntegerDigits: 2 }).format(date.getDate()),
    month: formattedMonth.toUpperCase(),
    year: String(date.getFullYear()),
  };
}
