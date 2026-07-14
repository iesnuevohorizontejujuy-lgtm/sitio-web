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

const normalizeCareer = (raw: ApiCareer, fallback: Career): Career => {
  const apiSubjects = normalizeSubjects(raw);

  return {
    ...fallback,
    id: raw.id ?? fallback.id,
    title: raw.title ?? raw.nombre ?? fallback.title,
    slug: raw.slug ?? fallback.slug,
    area: raw.area ?? raw.categoria ?? fallback.area,
    description: raw.description ?? raw.descripcion ?? fallback.description,
    content: raw.content ?? raw.contenido ?? fallback.content,
    duration: raw.duracion ?? fallback.duration,
    modality: raw.modalidad ?? fallback.modality,
    resolutionCode:
      raw.resolution_code ?? raw.resolucion_codigo ?? fallback.resolutionCode,
    image: raw.image ?? fallback.image,
    imageThumb: raw.image_thumb ?? fallback.imageThumb,
    planStudyUrl: raw.plan_estudio ?? fallback.planStudyUrl,
    resolutionUrl: raw.resolucion ?? fallback.resolutionUrl,
    subjects: apiSubjects.length > 0 ? apiSubjects : fallback.subjects,
    capabilities:
      raw.capabilities ?? raw.capacidades ?? fallback.capabilities,
    employment: raw.employment ?? raw.salida_laboral ?? fallback.employment,
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
      next: { revalidate: 3600, tags: ["careers"] },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return careerCatalog;

    const apiCareers = unwrapCollection(await response.json());
    return careerCatalog.map((fallback) => {
      const match = apiCareers.find(
        (career) =>
          career.slug === fallback.slug ||
          (career.title ?? career.nombre) === fallback.title,
      );
      return match ? normalizeCareer(match, fallback) : fallback;
    });
  } catch {
    return careerCatalog;
  }
}

export async function getCareer(slug: string): Promise<Career | null> {
  const fallback = findCatalogCareer(slug);
  if (!fallback) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/carreras/${slug}`, {
      next: { revalidate: 3600, tags: [`career-${slug}`] },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return fallback;
    const item = unwrapItem(await response.json());
    return item ? normalizeCareer(item, fallback) : fallback;
  } catch {
    return fallback;
  }
}
