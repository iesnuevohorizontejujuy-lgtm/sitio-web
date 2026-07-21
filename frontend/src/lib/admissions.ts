import type { AdmissionCall } from "@/types/admissions";

const API_BASE_URL =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000/api";

export async function getAdmissionCall(): Promise<AdmissionCall | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/ingresantes`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as AdmissionCall | { data?: AdmissionCall };
    const wrappedPayload = payload as { data?: AdmissionCall };

    return wrappedPayload.data ?? (payload as AdmissionCall);
  } catch {
    return null;
  }
}

export function formatAdmissionDate(value: string): string {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
