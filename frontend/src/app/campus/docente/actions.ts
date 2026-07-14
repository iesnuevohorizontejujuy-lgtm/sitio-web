'use server';

import { apiFetch } from '@/lib/api';

// ── Fetch helpers (se llaman desde Client Components via Server Actions) ──

export async function fetchDocentePerfil() {
  const res = await apiFetch('/docente/perfil', { cache: 'no-store' });
  return res.json();
}

export async function fetchDocenteMaterias() {
  const res = await apiFetch('/docente/mis-materias', { cache: 'no-store' });
  return res.json();
}

export async function fetchPlanillaAsistencia(id: string, search?: string) {
  const url = search ? `/docente/planilla-asistencia/${id}?search=${encodeURIComponent(search)}` : `/docente/planilla-asistencia/${id}`;
  const res = await apiFetch(url, { cache: 'no-store' });
  return res.json();
}

export async function fetchPlanillaNotas(id: string, search?: string) {
  const url = search ? `/docente/planilla-notas/${id}?search=${encodeURIComponent(search)}` : `/docente/planilla-notas/${id}`;
  const res = await apiFetch(url, { cache: 'no-store' });
  return res.json();
}

export async function fetchCursoDocente(claseId: string) {
  const res = await apiFetch(`/docente/curso/${claseId}`, { cache: 'no-store' });
  return res.json();
}

// ── Mutations ──

export async function guardarAsistenciaAction(data: {
  cursada_id: number;
  fecha: string;
  presente: boolean;
}) {
  const res = await apiFetch('/docente/asistencia', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al guardar asistencia');
  return res.json();
}

export async function guardarAsistenciaMasivaAction(data: {
  fecha: string;
  asistencias: Array<{ cursada_id: number; presente: boolean }>;
}) {
  const res = await apiFetch('/docente/asistencia-masiva', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al guardar asistencia');
  return res.json();
}

export async function guardarCriteriosAction(data: {
  clase_id: string;
  porcentaje_promocion: number;
  porcentaje_regular: number;
  nota_promocion: number;
  nota_regularidad: number;
}) {
  const res = await apiFetch('/docente/guardar-criterios', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al guardar criterios');
  return res.json();
}

export async function crearTpAction(data: { clase_id: string; nombre: string }) {
  const res = await apiFetch('/docente/crear-tp', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al crear TP');
  return res.json();
}

export async function fetchTpsAction(claseId: string, search?: string) {
  const url = search ? `/docente/tps/${claseId}?search=${encodeURIComponent(search)}` : `/docente/tps/${claseId}`;
  const res = await apiFetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al cargar TPs');
  return res.json();
}

export async function eliminarTpAction(tpId: number) {
  const res = await apiFetch(`/docente/tp/${tpId}`, {
    method: 'DELETE',
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? 'Error al eliminar TP');
  }
  return res.json();
}

export async function renombrarTpAction(tpId: number, nombre: string) {
  const res = await apiFetch(`/docente/tp/${tpId}`, {
    method: 'PATCH',
    body: JSON.stringify({ nombre }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al renombrar TP');
  return res.json();
}

export async function toggleTpAction(data: {
  cursada_id: number;
  trabajo_practico_id: number;
}) {
  const res = await apiFetch('/docente/toggle-tp', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al actualizar TP');
  return res.json();
}

export async function crearParcialAction(data: {
  clase_id: string;
  nombre: string;
  fecha: string;
}) {
  const res = await apiFetch('/docente/crear-parcial', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al crear parcial');
  return res.json();
}

export async function actualizarParcialAction(data: {
  parcial_id: number;
  fecha: string;
}) {
  const res = await apiFetch('/docente/actualizar-parcial', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al actualizar fecha del parcial');
  return res.json();
}

export async function guardarNotaParcialAction(data: {
  cursada_id: number;
  parcial_id: number;
  valor: string;
}) {
  const res = await apiFetch('/docente/guardar-nota-parcial', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al guardar nota');
  return res.json();
}

export async function cerrarNotasAction(data: { clase_id: string }) {
  const res = await apiFetch('/docente/cerrar-notas', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al cerrar notas');
  return res.json();
}

export async function guardarNotaFinalAction(data: {
  cursada_id: number;
  valor: string;
}) {
  const res = await apiFetch('/docente/guardar-nota-final', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al guardar nota final');
  return res.json();
}

// ── Legajo Docente ──

export async function fetchLegajosDocente() {
  const res = await apiFetch('/docente/legajos', { cache: 'no-store' });
  return res.json();
}

export async function fetchLegajoDocente(legajoId: string) {
  const res = await apiFetch(`/docente/legajo/${legajoId}`, { cache: 'no-store' });
  return res.json();
}

export async function subirDocumentoLegajoAction(formData: FormData) {
  const res = await apiFetch('/docente/subir-documento', {
    method: 'POST',
    body: formData,
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Error al subir documento');
  return res.json();
}

// ── Perfil Docente ──

export async function actualizarPerfilDocenteAction(formData: FormData) {
  const body = new FormData();

  // Laravel method spoofing: PHP no parsea FormData en PUT
  body.set('_method', 'PUT');
  body.set('nombre', formData.get('nombre') as string);
  body.set('apellido', formData.get('apellido') as string);
  body.set('userName', (formData.get('userName') as string) || '');
  body.set('telefono', (formData.get('telefono') as string) || '');
  body.set('domicilio', (formData.get('domicilio') as string) || '');
  body.set('fecha_nacimiento', (formData.get('fecha_nacimiento') as string) || '');
  body.set('titulo_academico', (formData.get('titulo_academico') as string) || '');

  const fotoPerfil = formData.get('foto_perfil');

  if (fotoPerfil instanceof File && fotoPerfil.size > 0) {
    body.set('foto_perfil', fotoPerfil);
  }

  const res = await apiFetch('/docente/perfil', {
    method: 'POST',
    body,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: data.message || 'Error al actualizar el perfil' };
  }

  const data = await res.json().catch(() => ({}));
  return { success: true, userName: data.userName || null, foto_perfil: data.foto_perfil || null };
}

// ── Mesas de Examen ──

export async function fetchMisMesas() {
  const res = await apiFetch('/docente/mis-mesas', { cache: 'no-store' });
  return res.json();
}

export async function fetchActaMesa(mesaId: string) {
  const res = await apiFetch(`/docente/acta-mesa/${mesaId}`, { cache: 'no-store' });
  return res.json();
}

export async function guardarNotaMesaAction(data: {
  inscripcion_mesa_id: number;
  nota: number;
  folio?: string;
  libro?: string;
}) {
  const res = await apiFetch('/docente/guardar-nota-mesa', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? 'Error al guardar nota de mesa');
  }
  return res.json();
}

export async function cerrarMesaAction(data: { mesa_id: number }) {
  const res = await apiFetch('/docente/cerrar-mesa', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? 'Error al cerrar mesa');
  }
  return res.json();
}
