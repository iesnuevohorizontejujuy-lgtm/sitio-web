import { cookies } from 'next/headers';
import {
  SESSION_COOKIE_NAME,
  ROLE_COOKIE_NAME,
  USERNAME_COOKIE_NAME,
} from './api';

export interface Session {
  token: string;
  role: string;
  userName: string;
}

/**
 * Lee la sesión completa desde las cookies HttpOnly.
 * Devuelve null si no hay token (usuario no autenticado).
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  return {
    token,
    role: cookieStore.get(ROLE_COOKIE_NAME)?.value ?? '',
    userName: cookieStore.get(USERNAME_COOKIE_NAME)?.value ?? '',
  };
}

/**
 * Comprueba rápidamente si hay una sesión activa.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return !!cookieStore.get(SESSION_COOKIE_NAME)?.value;
}
