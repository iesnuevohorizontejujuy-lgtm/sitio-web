'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SESSION_COOKIE_NAME,
  ROLE_COOKIE_NAME,
  USERNAME_COOKIE_NAME,
  apiFetch,
} from '@/lib/api';

// ── Opciones comunes para las cookies de sesión ──
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 días
};

const API_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:8000/api';

/**
 * Server Action: Autenticación de usuario.
 *
 * Siguiendo la documentación oficial de Next.js 16:
 * 1. Recibe credenciales via FormData
 * 2. Llama a la API de Laravel
 * 3. Setea cookies HttpOnly
 * 4. Llama redirect() directamente (no devuelve URL al cliente)
 *
 * Si hay error, retorna { error: string } para que useActionState lo muestre.
 * Si es exitoso, redirect() lanza una excepción de control de flujo
 * que Next.js maneja automáticamente.
 */
export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos.' };
  }

  let redirectTo = '/campus/dashboard';

  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        return { error: 'Email o contraseña incorrectos.' };
      }
      if (res.status === 403) {
        return {
          error: 'Tu usuario no tiene un perfil académico (Alumno/Docente) asignado.',
        };
      }
      return {
        error: data.message || 'Error al iniciar sesión.',
      };
    }

    // ── Setear cookies HttpOnly (patrón oficial Next.js 16) ──
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, data.access_token, COOKIE_OPTIONS);
    cookieStore.set(ROLE_COOKIE_NAME, data.role || '', COOKIE_OPTIONS);
    cookieStore.set(
      USERNAME_COOKIE_NAME,
      data.user?.name || '',
      COOKIE_OPTIONS,
    );

    // Determinar la ruta de redirección
    redirectTo =
      data.redirect ||
      (data.role === 'docente'
        ? '/campus/docente/dashboard'
        : '/campus/dashboard');
  } catch {
    return {
      error: 'Hubo un error de conexión. Intenta nuevamente.',
    };
  }

  // ── Redirección directa (patrón oficial Next.js 16) ──
  // redirect() lanza una excepción que Next.js maneja internamente.
  // DEBE estar fuera del try/catch para no ser atrapada.
  redirect(redirectTo);
}

/**
 * Server Action: Cierre de sesión.
 * Elimina las cookies y llama al endpoint de logout de Laravel.
 */
export async function logoutAction(): Promise<void> {
  try {
    await apiFetch('/logout', {
      method: 'POST',
      cache: 'no-store',
    });
  } catch {
    // Si falla el logout en Laravel, igual limpiamos las cookies locales para mas placer jajajaa clc
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(ROLE_COOKIE_NAME);
  cookieStore.delete(USERNAME_COOKIE_NAME);

  redirect('/campus');
}
