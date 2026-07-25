import "server-only";

const academicApiUrl = (
  process.env.ACADEMIC_API_URL ?? "http://127.0.0.1:8001/api"
).replace(/\/$/, "");
const academicApiKey = process.env.ACADEMIC_API_KEY?.trim();

export async function academicApiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (academicApiKey) {
    headers.set("X-Institutional-Site-Key", academicApiKey);
  }

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${academicApiUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
}
