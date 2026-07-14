import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'session_token';
const API_BASE_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:8000/api';

async function getAlumnoEstado(token: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/alumno/perfil`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    const estado = data?.estado ?? data?.alumno?.estado;

    if (typeof estado !== 'string') return null;
    return estado.trim().toLowerCase();
  } catch {
    return null;
  }
}


export default async function proxy(request: NextRequest) {
  // ── Ignorar Server Actions ──
  // Si interceptamos un Server Action, rompe la respuesta del framework.
  if (request.headers.get('next-action')) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Leer cookies (patrón oficial Next.js 16)
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const role = cookieStore.get('session_role')?.value;

  // ── Página de Login (/campus) ──
  // Si ya está autenticado, redirigir al dashboard correspondiente
  if (pathname === '/campus') {
    if (token) {
      const dashboardUrl =
        role === 'docente'
          ? '/campus/docente/dashboard'
          : '/campus/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
    return NextResponse.next();
  }

  // ── Rutas protegidas (/campus/*) ──
  // Si NO tiene token, redirigir al login
  if (!token) {
    return NextResponse.redirect(new URL('/campus', request.url));
  }

  // ── Guard de rol: restringir acceso cruzado ──
  // Docente no puede acceder a rutas de alumno y viceversa
  if (pathname.startsWith('/campus/docente') && role !== 'docente') {
    return NextResponse.redirect(new URL('/campus/dashboard', request.url));
  }
  if (!pathname.startsWith('/campus/docente') && role === 'docente') {
    return NextResponse.redirect(new URL('/campus/docente/dashboard', request.url));
  }

  // ── Guard de estado: egresado no puede entrar a secciones restringidas ──
  if (role === 'alumno') {
    const rutasBloqueadasParaEgresado = ['/campus/materias', '/campus/beneficios'];
    const rutaBloqueada = rutasBloqueadasParaEgresado.some(
      (ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`),
    );

    if (rutaBloqueada) {
      const estadoAlumno = token ? await getAlumnoEstado(token) : null;

      if (estadoAlumno === 'egresado') {
        return NextResponse.redirect(
          new URL('/campus/dashboard', request.url),
        );
      }
    }
  }

  return NextResponse.next();
}

/**
 * Solo aplicar el proxy a las rutas del campus.
 */
export const config = {
  matcher: ['/campus', '/campus/:path*'],
};
