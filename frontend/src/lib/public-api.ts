/**
 * Las llamadas públicas del navegador pasan por Next.js. De esta forma el
 * frontend no expone direcciones internas, evita CORS y puede cambiar el CMS
 * sin tener que recompilar el JavaScript que recibe el visitante.
 */
export const PUBLIC_API_URL = "/api/cms";

/**
 * Helper de fetch para endpoints públicos de la API (sin autenticación).
 * Para usar en Client Components que consumen la API pública.
 *
 * @param endpoint - Ruta relativa de la API (ej: '/noticias')
 * @param options  - RequestInit estándar de fetch
 * @returns Response
 */
export async function publicFetch(
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${PUBLIC_API_URL}${endpoint}`;

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  // Solo agregar Content-Type si no es FormData
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
