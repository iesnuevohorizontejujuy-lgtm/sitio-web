import "server-only";

const productionCmsApiUrl = "https://sitio.cms.iesnuevohorizonte.com/api";

const cmsApiUrl = (
  process.env.BACKEND_URL ??
  process.env.CMS_API_URL ??
  (process.env.NODE_ENV === "production"
    ? productionCmsApiUrl
    : "http://127.0.0.1:8000/api")
).replace(/\/$/, "");

export async function cmsApiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${cmsApiUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
}
