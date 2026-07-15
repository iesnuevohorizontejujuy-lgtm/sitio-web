import { careerCatalog, findCatalogCareer } from "@/data/career-catalog";
import type { ApiCareer, Career, CareerSubject } from "@/types/career";

const API_BASE_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000/api";

const normalizeSubjects = (raw: ApiCareer): CareerSubject[] =>
  (raw.subjects ?? raw.materias ?? [])
    .map((subject) => ({
      name: subject.name ?? subject.nombre ?? "",
      year: Number(subject.year ?? subject.anio ?? 0),
    }))
    .filter((subject) => subject.name.length > 0 && subject.year > 0);

const normalizeCareer = (raw: ApiCareer): Career | null => {
  const title = raw.title ?? raw.nombre;
  const slug = raw.slug;
  const area = raw.area ?? raw.categoria;

  if (!title || !slug || !area) return null;

  return {
    id: raw.id ?? null,
    title,
    shortTitle: raw.short_title ?? null,
    slug,
    area,
    description: raw.description ?? raw.descripcion ?? "",
    content: raw.content ?? raw.contenido ?? null,
    duration: raw.duracion ?? "Consultar",
    modality: raw.modalidad ?? "Consultar",
    resolutionCode: raw.resolution_code ?? raw.resolucion_codigo ?? null,
    awardedTitle: raw.titulo_otorgado ?? null,
    image: raw.image ?? null,
    imageThumb: raw.image_thumb ?? null,
    planStudyUrl: raw.plan_estudio ?? null,
    resolutionUrl: raw.resolucion ?? null,
    subjects: normalizeSubjects(raw),
    capabilities: raw.capabilities ?? raw.capacidades ?? [],
    employment: raw.employment ?? raw.salida_laboral ?? [],
    gallery: Array.isArray(raw.gallery) ? raw.gallery : [],
  };
};

const unwrapCollection = (payload: unknown): ApiCareer[] => {
  if (Array.isArray(payload)) return payload as ApiCareer[];
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data: unknown }).data)
  ) {
    return (payload as { data: ApiCareer[] }).data;
  }
  return [];
};

const unwrapItem = (payload: unknown): ApiCareer | null => {
  if (!payload || typeof payload !== "object") return null;
  if ("data" in payload && (payload as { data?: unknown }).data) {
    return (payload as { data: ApiCareer }).data;
  }
  return payload as ApiCareer;
};

export async function getCareers(): Promise<Career[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/carreras`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return careerCatalog;

    const apiCareers = unwrapCollection(await response.json());
    return apiCareers
      .map(normalizeCareer)
      .filter((career): career is Career => career !== null);
  } catch {
    return careerCatalog;
  }
}

export async function getCareer(slug: string): Promise<Career | null> {
  const fallback = findCatalogCareer(slug);

  try {
    const response = await fetch(`${API_BASE_URL}/carreras/${slug}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (response.status === 404) return null;
    if (!response.ok) return fallback ?? null;

    const item = unwrapItem(await response.json());
    return item ? normalizeCareer(item) : null;
  } catch {
    return fallback ?? null;
  }
}
