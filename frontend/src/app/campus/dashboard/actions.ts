'use server';

import { revalidateTag } from 'next/cache';
import { apiFetch } from '@/lib/api';

/**
 * Server Action: Subir un documento al legajo del alumno.
 */
export async function subirDocumentoAction(formData: FormData) {
  const res = await apiFetch('/alumno/subir-documento', {
    method: 'POST',
    body: formData,
    cache: 'no-store',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return {
      success: false,
      error: data.message || 'Error al subir el documento.',
    };
  }

  // Revalidar los datos del dashboard para reflejar el nuevo documento
  revalidateTag('dashboard-legajos', 'max');

  return { success: true };
}

/**
 * Server Action: Inscribirse a una materia.
 */
export async function inscribirseAction(materiaId: number, modalidad: string = 'regular') {
  const res = await apiFetch('/inscribirse', {
    method: 'POST',
    body: JSON.stringify({ materia_id: materiaId, modalidad }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return {
      success: false,
      error: data.error || data.message || 'Error al inscribirse.',
    };
  }

  revalidateTag('materias-disponibles', 'max');
  revalidateTag('inscripciones', 'max');

  return { success: true };
}

// ── Mesas de Examen (Alumno) ──

export async function fetchMesasDisponibles() {
  const res = await apiFetch('/mesas-disponibles', { cache: 'no-store' });
  return res.json();
}

export async function fetchMisInscripcionesMesa() {
  const res = await apiFetch('/mis-inscripciones-mesa', { cache: 'no-store' });
  return res.json();
}

export async function inscribirseMesaAction(mesaExamenId: number) {
  const res = await apiFetch('/inscribirse-mesa', {
    method: 'POST',
    body: JSON.stringify({ mesa_examen_id: mesaExamenId }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return {
      success: false,
      error: data.error || data.message || 'Error al inscribirse a la mesa.',
    };
  }

  revalidateTag('mesas-disponibles', 'max');
  revalidateTag('inscripciones-mesa', 'max');

  return { success: true };
}
