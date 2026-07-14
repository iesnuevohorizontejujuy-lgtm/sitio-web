/**
 * URL base de la API para uso en Client Components (público).
 * Usa la variable de entorno pública que se expone al navegador.
 */
export const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

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
