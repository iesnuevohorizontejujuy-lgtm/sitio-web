import type { ExamPermitEditorialContent } from "@/types/exam-permit-content";

const API_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000/api";

export async function getExamPermitEditorialContent(): Promise<ExamPermitEditorialContent | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/permisos-examen/contenido`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok || response.status === 204) return null;

    const data = (await response.json()) as unknown;
    if (!data || typeof data !== "object") return null;

    const content = data as Record<string, unknown>;
    const title = String(content.titulo ?? "").trim();
    const introduction = String(content.introduccion ?? "").trim();
    if (!title || !introduction) return null;

    return {
      id: Number(content.id ?? 0),
      titulo: title,
      introduccion: introduction,
      indicaciones: Array.isArray(content.indicaciones)
        ? content.indicaciones.map(String).map((item) => item.trim()).filter(Boolean)
        : [],
      advertencia_titulo: content.advertencia_titulo ? String(content.advertencia_titulo) : null,
      advertencia: content.advertencia ? String(content.advertencia) : null,
    };
  } catch {
    return null;
  }
}
