import { cookies } from 'next/headers';

// ── URL base de la API de Laravel ──
// En Server Components/Actions se usa la var interna (server-to-server).
// NEXT_PUBLIC_ queda disponible para referencia en el cliente si fuera necesario.
const API_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:8000/api';

// ── Nombre de la cookie donde se almacena el token ──
export const SESSION_COOKIE_NAME = 'session_token';
export const ROLE_COOKIE_NAME = 'session_role';
export const USERNAME_COOKIE_NAME = 'session_username';

/**
 * Lee el token de la cookie HttpOnly del servidor de Next.js.
 * Solo puede usarse en Server Components / Server Actions / Route Handlers.
 */
export async function getApiToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

/**
 * Wrapper de fetch que inyecta automáticamente el Bearer token
 * desde la cookie HttpOnly del servidor de Next.js.
 *
 * @param endpoint - Ruta relativa de la API (ej: '/alumno/perfil')
 * @param options  - RequestInit estándar de fetch + opciones de Next.js (next.revalidate, next.tags)
 * @returns Response
 *
 * @example
 * // En un Server Component:
 * const res = await apiFetch('/alumno/perfil', { next: { revalidate: 60 } });
 * const data = await res.json();
 *
 * @example
 * // POST en un Server Action:
 * const res = await apiFetch('/inscribirse', {
 *   method: 'POST',
 *   body: JSON.stringify({ materia_id: 5 }),
 * });
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {},
): Promise<Response> {
  const token = await getApiToken();

  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  // Solo agregar Content-Type: application/json si NO es FormData
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
